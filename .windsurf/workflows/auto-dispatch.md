---
description: Auto-dispatch pipeline — automated intent→agent selection 
auto_execution_mode: 3
---

# Auto-Dispatch Workflow

## Mục tiêu
- Tự động phân loại intent → tra cứu danh sách subagents từ `AGENTS.md` và các file `rules/agents-*.md` (dựa trên triggers/tags) → sinh Delegation Plan (format Orchestrator) → thực thi tuần tự.
- Tuân thủ: Rule 15 (Tool Budget ≤2), Rule 16a (Sequential-only, early-stop), Rule 14a (Context Coordination), Workflow “Answer with Citation”.

## Pre-flight Gate (Sub-Agents Confirmation)
- CHẠY workflow `workflows/sub-agents-confirmation.md` trước khi dispatch.
- Điều kiện PASS để cho phép điều phối:
  - Tất cả subagents trong `AGENTS.md` và các file `rules/agents-*.md` đã được liệt kê đầy đủ.
  - Agent chính đã đọc và hiểu phạm vi/triggers/tags của từng subagent.
- Nếu FAIL → dừng pipeline, yêu cầu hoàn tất xác nhận.

## Pipeline
1. Classify
   - Detect: single-task vs multi-step, domain/framework, risk level.
2. Lookup
   - Dựa trên mô tả trong `AGENTS.md` và từng file `rules/agents-*.md` để match `triggers` & `tags`.
3. Plan
   - Generate Delegation Plan theo format orchestrator/planner như mô tả trong Auto Dispatcher.
4. Validate
   - Guards: discovery ≤2 tool calls; orchestrator max 2 parallel sub-agents.
5. Execute
   - Invoke selected specialists theo Execution Order.
6. Synthesize
   - Hợp nhất kết quả; chuẩn hoá output.
7. Citations
   - Áp dụng workflow `/answer-with-citation` (Local-first → MCP nếu Gate mở).

## Selection heuristics & fallback
- Điểm lựa chọn agent = 3×match `triggers` + 1×match `tags` (theo rule Auto Dispatcher).
- Thiết lập `min_score = 2`. Nếu `top_score < 2` → không auto chọn agent; trả về "no suitable agent" và/hoặc đề xuất người dùng chọn subagent thủ công hoặc gọi một subagent planner/orchestrator thuộc nhóm **Planning & Strategy** (theo `AGENTS.md §7.1`) để refine yêu cầu.
- Nếu chênh lệch `Δscore` giữa top 1 và top 2 < 1:
  - Không cố gắng đoán.
  - Ưu tiên:
    - Escalate sang một subagent planner/orchestrator thuộc nhóm **Planning & Strategy** (theo `AGENTS.md §7.1`) ở chế độ plan-first (NEVER implements, max 2 parallel), hoặc
    - Hỏi lại người dùng để làm rõ intent/miền.
- Luôn tôn trọng guardrails: discovery ≤2 tool calls; orchestrator tối đa 2 sub-agents chạy song song như ở phần **Guardrails** bên dưới.

## Delegation Plan (Response Contract)
```
### Task Analysis
- [Summary 2-3 bullets]
- [Detected stack/domain]

### SubAgent Assignments
Task 1: [desc] → AGENT: @agent-[exact-agent-name]
Task 2: [desc] → AGENT: @agent-[exact-agent-name]

### Execution Order
1) [Agent/Task A]
2) [Agent/Task B]

### Tool Budget & Guards
- Discovery: ≤2 tool calls
- Orchestrator: max 2 parallel

### Citations
- [local-file-path:line]

## Guardrails
- Sequential-only: một hành động/step.
- Fail-fast khi vượt ngân sách/parallelism.
- Không rò rỉ secrets/PII; NO `cd` (dùng Cwd) theo Tool Proficiency.

## Inputs/Outputs
- Inputs: user intent, danh sách subagents từ `AGENTS.md` + `rules/agents-*.md`.
- Outputs: Delegation Plan + synthesized result + citations.

## Smoke Tests
- Stack scan → dự kiến chọn subagent thuộc nhóm "Code Analysis, Refactoring & Debugging" trong `AGENTS.md §7.1` (≤2 tool calls, cite file:line).
- Feature breakdown → dự kiến escalate subagent thuộc nhóm "Planning & Strategy" (NEVER implements, max 2 parallel).
- PR review → dự kiến chọn subagent thuộc nhóm "Quality, Testing, Performance & Security" (report + citations).

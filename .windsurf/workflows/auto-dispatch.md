---
description: Auto-dispatch pipeline — automated intent→agent selection 
auto_execution_mode: 3
---

# Auto-Dispatch Workflow

## Mục tiêu
- Tự động phân loại intent → tra cứu `.windsurf/agent-registry.json` → sinh Delegation Plan (format Orchestrator) → thực thi tuần tự.
- Tuân thủ: Rule 15 (Tool Budget ≤2), Rule 16a (Sequential-only, early-stop), Rule 14a (Context Coordination), Workflow “Answer with Citation”.

## Pre-flight Gate (Sub-Agents Confirmation)
- CHẠY workflow `workflows/sub-agents-confirmation.md` trước khi dispatch.
- Điều kiện PASS để cho phép điều phối:
  - Tồn tại `.windsurf/memories/sub-agents-ack.md`.
  - Tất cả `agents[].read_understood == true` và không thiếu agent mới.
- Nếu FAIL → dừng pipeline, yêu cầu hoàn tất xác nhận.

## Pipeline
1. Classify
   - Detect: single-task vs multi-step, domain/framework, risk level.
2. Lookup
   - Query `agent-registry.json` → match `triggers` & `tags`.
3. Plan
   - Generate Delegation Plan theo format `tech-lead-orchestrator`.
4. Validate
   - Guards: discovery ≤2 tool calls; orchestrator max 2 parallel sub-agents.
5. Execute
   - Invoke selected specialists theo Execution Order.
6. Synthesize
   - Hợp nhất kết quả; chuẩn hoá output.
7. Citations
   - Áp dụng workflow `/answer-with-citation` (Local-first → MCP nếu Gate mở).

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
- Inputs: user intent, `.windsurf/agent-registry.json`.
- Outputs: Delegation Plan + synthesized result + citations.

## Smoke Tests
- Stack scan → `project-analyst` (≤2 tool calls, cite file:line)
- Feature breakdown → `tech-lead-orchestrator` (NEVER implements, max 2 parallel)
- PR review → `code-reviewer` (report + citations)

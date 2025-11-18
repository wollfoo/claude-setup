---
description: Auto-Dispatch Force — hands-off wrapper to always run auto-dispatch first
auto_execution_mode: 3
---

# Auto-Dispatch Force (Hands-off Wrapper)

## Mục tiêu
- Tự động chạy pipeline auto-dispatch ngay khi nhận task (không cần chỉ rõ agent/từ khóa).
- Bảo đảm đi qua Sub-Agents Confirmation Gate trước khi điều phối.

## Preconditions (Bắt buộc)
- Gate `workflows/sub-agents-confirmation.md` đã được chạy để đảm bảo toàn bộ subagents trong `AGENTS.md` + `rules/agents-*.md` đã được liệt kê và hiểu rõ.

## Guardrails
- Sequential-only (một hành động/step); Discovery ≤ 2 tool calls.
- Orchestrator tối đa 2 sub-agents chạy song song.
- Không rò rỉ secrets/PII; NO `cd` (dùng Cwd) theo Tool Proficiency.

## Quy trình
1) Sub-Agents Confirmation Gate
   - Mục tiêu: xác nhận đầy đủ danh sách sub-agents trước điều phối.
   - Tham chiếu: `workflows/sub-agents-confirmation.md`.

// turbo
2) Auto-Dispatch Pipeline (Mode)
   - Mặc định: Chạy `workflows/auto-dispatch.md` để:
     - Classify → Lookup (dựa trên mô tả subagent trong `AGENTS.md` + các file `rules/agents-*.md`) → Plan (sinh Delegation Plan theo format orchestrator/planner như mô tả trong Auto Dispatcher) → Validate → Execute → Synthesize → Citations.
     - Mơ hồ (Δscore < 1) → auto-escalate sang một subagent thuộc nhóm **Planning & Strategy** được định nghĩa trong `AGENTS.md §7.1` ở chế độ plan-first (NEVER implements, max 2 parallel).
     - Nếu không có agent nào đạt `min_score` (không có strong match) → không auto chọn; hỏi lại người dùng hoặc gọi một subagent planner/orchestrator thuộc nhóm Planning & Strategy (theo `AGENTS.md §7.1`) để refine intent.
   - Force mode (plan-first): Nếu `FORCE_PLAN_FIRST=true` → Gọi trực tiếp một subagent planner/orchestrator thuộc nhóm Planning & Strategy (theo `AGENTS.md §7.1`) ở bước đầu (bỏ scoring intent) để sinh Delegation Plan, sau đó thực thi theo plan (max 2 parallel).

3) Kết quả & Báo cáo
   - Trả về Delegation Plan + kết quả hợp nhất + citations (local-first → MCP nếu Gate mở).
   - Ghi instrument banner (agent selected / route / score) khi bật `AUTODISPATCH_INSTRUMENTATION`.

## Tùy chọn cấu hình (khuyến nghị)
- `AUTODISPATCH_INSTRUMENTATION=brief|verbose` (mặc định: brief).
- `AUTODISPATCH_SAMPLING=0.25..1.0` (tỷ lệ log).
- Duy trì `aliases/tags/triggers` nhất quán trong registry subagents (AGENTS + định nghĩa trong `rules/agents-*.md` hoặc `sub-agents/**.md`) để tăng độ chính xác khi lookup.

## Smoke Tests
- Stack scan → dự kiến chọn `project-analyst` (≤2 tool calls, cite file:line).
- Feature breakdown → escalates một subagent nhóm Planning & Strategy (ví dụ `planner-researcher` hoặc `planning-strategist`, NEVER implements, max 2 parallel).
- PR review → `code-reviewer` (report + citations).

---
description: Auto-Dispatch Force — hands-off wrapper to always run auto-dispatch first
auto_execution_mode: 3
---

# Auto-Dispatch Force (Hands-off Wrapper)

## Mục tiêu
- Tự động chạy pipeline auto-dispatch ngay khi nhận task (không cần chỉ rõ agent/từ khóa).
- Bảo đảm đi qua Sub-Agents Confirmation Gate trước khi điều phối.

## Preconditions (Bắt buộc)
- Tồn tại và hợp lệ: `.windsurf/memories/sub-agents-ack.md`.
- Nếu thiếu/không hợp lệ: chạy `workflows/sub-agents-confirmation.md` trước.

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
     - Classify → Lookup (`.windsurf/agent-registry.json` + `sub-agents/**.md`) → Plan (format `tech-lead-orchestrator`) → Validate → Execute → Synthesize → Citations.
     - Mơ hồ (Δscore < 1) → auto-escalate `tech-lead-orchestrator` (plan-first, max 2 parallel).
   - Force mode (plan-first): Nếu `FORCE_PLAN_FIRST=true` → Gọi thẳng `tech-lead-orchestrator` ở bước đầu (bỏ scoring intent) để sinh Delegation Plan, sau đó thực thi theo plan (max 2 parallel).

3) Kết quả & Báo cáo
   - Trả về Delegation Plan + kết quả hợp nhất + citations (local-first → MCP nếu Gate mở).
   - Ghi instrument banner (agent selected / route / score) khi bật `AUTODISPATCH_INSTRUMENTATION`.

## Tùy chọn cấu hình (khuyến nghị)
- `AUTODISPATCH_INSTRUMENTATION=brief|verbose` (mặc định: brief).
- `AUTODISPATCH_SAMPLING=0.25..1.0` (tỷ lệ log).
- Duy trì `aliases/tags/triggers` trong `.windsurf/agent-registry.json` để tăng độ chính xác.

## Smoke Tests
- Stack scan → dự kiến chọn `project-analyst` (≤2 tool calls, cite file:line).
- Feature breakdown → escalates `tech-lead-orchestrator` (NEVER implements, max 2 parallel).
- PR review → `code-reviewer` (report + citations).

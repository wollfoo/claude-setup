---
trigger: always_on
---
---
type: rule
scope: project
priority: critical
activation: always_on
category: tool_calling_policy
---

# Tool Calling Override — Preamble + Sequential‑only (Enforcement)

## Mục tiêu
- Ép hành vi chuẩn “One tool call per step” (thực thi tuần tự), không trộn nhiều tool song song.
- Bắt buộc preamble ngắn khi gọi tool: Goal/Plan/Progress/Summary.
- Tôn trọng ngân sách tool theo độ phức tạp; ưu tiên evidence‑first.

## Chính sách bắt buộc
- **Sequential‑only**: Chỉ được gọi 1 tool ở mỗi bước.
  - ✅ Correct: Step 1 (Read) → Step 2 (Search) → Step 3 (Edit).
  - ❌ Wrong: Read + Search + Edit cùng một bước (song song).
- **Không vừa gọi tool vừa trả lời** trong cùng một bước.
- **Preamble yêu cầu** trước khi gọi tool (ngắn gọn):
  - Goal (mục tiêu), Plan (kế hoạch từng bước), Progress (tiến độ), Summary (tóm tắt sau khi chạy).
- **Ngân sách tool** (tham chiếu `rules/15-context-understanding.md`):
  - Small: ≤2 calls (1 read/search + 1 verify tùy chọn).
  - Medium: ≤5 calls (có thể kích hoạt System B nếu usage 30–70%).
  - Complex: Unlimited nhưng do System B quản lý (>70%).
- **Evidence‑first**: Khi viện dẫn mã/cấu hình → kèm `file:line` hoặc nguồn tương ứng.

## Tương thích & Precedence
- Không ghi đè các chuẩn hệ thống: ritual markers, **No‑Refusals**, **Vietnamese‑first**, **tool budgets**, **evidence‑first**.
- Không can thiệp **MCP Guard 17z** (Gate OFF mặc định, điều phối riêng).
- Tuân thủ `Rule Precedence` (System > Developer > AGENTS > Domain). Chính sách này hoạt động ở lớp Developer/AGENTS và không vô hiệu `System`.

## Phạm vi
- Áp dụng ở chế độ chuẩn (Standard/Research). Không thay đổi hành vi của chế độ **Full de‑restriction** (kích hoạt thủ công và cô lập ở sandbox).

## Cross‑References
- Tool budget, sequential examples: `rules/15-context-understanding.md:231–263`.
- 3‑Tier điều phối ngữ cảnh: `rules/14a-context-coordination-core.md`, `rules/14b-context-coordination-advanced.md`.
- Ritual/No‑Refusals/Vietnamese‑first: `rules/sovereign-agent-directive.md`, `rules/10b-communication-advanced.md`.
- Precedence: `rules/rule-precedence-hierarchy.md`.

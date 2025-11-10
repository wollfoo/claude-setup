---
trigger: always_on
---
---
type: rule
scope: project
priority: high
activation: manual
category: sandbox_mode
---

# Full De‑restriction — Manual Sandbox Mode (Isolated)

## Mục tiêu
- Cho phép thử nghiệm **batched/parallel tool calls** và các hành vi “mở” trong **sandbox** được kích hoạt thủ công.
- Không ảnh hưởng chế độ chuẩn (Standard/Research). Mặc định **KHÔNG hoạt động** trừ khi bật thủ công và thỏa flags.

## Điều kiện bắt buộc
- **Manual activation**: Rule này chỉ hoạt động khi được kích hoạt thủ công (Manual) cho một phiên thử nghiệm.
- **Feature Flags** (đọc từ `feature-flags-loader.md`):
  - `flags.modes.full_de_restriction = true` → điều kiện cho phép.
  - `flags.modes.risk_confirmation_required = true` → bắt buộc xác nhận rủi ro.
- **Risk Confirmation + Action Ledger**:
  - Trước khi chạy: nêu rõ Goal/Plan/Scope/Exit criteria.
  - Trong khi chạy: ghi lại tool params/diff/evidence ở mức reasoning (không cần ghi file).
  - Sau khi chạy: tóm tắt tác động và rollback plan (nếu cần).

## Phạm vi & Rào chắn
- **Không ghi đè** các chuẩn hệ thống sau:
  - Ritual markers, **No‑Refusals**, **Vietnamese‑first**, **evidence‑first**.
  - **MCP Guard 17z**: Gate OFF mặc định; rule này **không** tự ý bật network/external.
- **Không tác động** chế độ chuẩn:
  - `sequential‑only` và tool budgets tại Standard/Research **vẫn giữ**. Chỉ trong phạm vi sandbox/manual mới cho phép thử nghiệm song song/batch có kiểm soát.
- **Kết thúc sandbox**: reset về hành vi chuẩn; không để cấu hình “mở” rò rỉ sang phiên khác.

## Hướng dẫn sử dụng
1) Bật thủ công rule này cho một task cụ thể (sandbox), xác nhận rủi ro.
2) Đảm bảo `flags.modes.full_de_restriction=true` qua loader; nếu không → **không** thực thi.
3) Thực hiện các bước thử nghiệm; ghi Action Ledger tối thiểu.
4) Kết thúc: tổng kết, tắt rule để trở lại hành vi chuẩn.

## Cross‑References
- Rule precedence: `rules/rule-precedence-hierarchy.md`.
- Loader & flags: `rules/feature-flags-loader.md`.
- Sequential & budgets (chuẩn): `rules/15-context-understanding.md`.
- MCP Guard: `rules/17z-mcp-compatibility-guard.md`.

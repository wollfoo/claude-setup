# RULE PRECEDENCE — Khung phân giải xung đột quy tắc
## Instruction Hierarchy & Conflict Resolution

- Mục tiêu: Đảm bảo quyết định nhất quán khi có xung đột giữa các quy tắc/tài liệu.
- Phạm vi: Áp dụng cho toàn bộ hệ thống prompt của Claude Code.

---

## Thứ tự ưu tiên (Order of Precedence)
1) System (OS/infra hard limits, an toàn môi trường)
2) Developer (Bộ khung này: `CLAUDE.md`, `PROFILE-MODES.md`, `GLOBAL-DIRECTIVES.md`)
3) AGENTS (Luật làm việc của kho: `RULES.md`, `ORCHESTRATOR.md`, các tệp quy tắc hợp nhất)
4) Domain (Quy tắc dự án cụ thể: các tệp `CLAUDE-*.md`)

Ghi chú: Luật cấp thấp chỉ áp dụng nếu không mâu thuẫn cấp cao hơn.

---

## Quy trình xử lý xung đột (Process)
1. **Nhận diện xung đột**: trích dẫn nguồn bằng `file:line`.
2. **Áp dụng thứ tự ưu tiên**: chọn hướng dẫn cấp cao hơn.
3. **Cổng an toàn**: xác thực theo `GLOBAL-DIRECTIVES.md` (environment & safety).
4. **Hành động tối thiểu phù hợp**: thực thi bước nhỏ nhất tuân thủ thứ tự.
5. **Ghi chú ngắn**: nêu lý do trong preamble của tool call.

### Tie-breakers (cùng cấp)
- Cụ thể > Tổng quát
- An toàn > Hiệu quả
- Xác định rõ ràng > Linh hoạt
- Bản mới hơn (nếu versioned)

---

## Ví dụ thường gặp

- **Mô hình gọi tool**: `CLAUDE.md` cũ khuyến nghị song song vs `GLOBAL-DIRECTIVES.md` yêu cầu sequential (standard/research).
  - Kết luận: Tuân theo `GLOBAL-DIRECTIVES.md` (Developer) và `PROFILE-MODES.md` (mode-based). Song song chỉ cho phép trong full-de-restriction.

- **Odyssey markers**: `CLAUDE-security.md` (A) vs `ODYSSEY-PROTOCOL.md` (B).
  - Kết luận: Chuẩn hóa theo `ODYSSEY-PROTOCOL.md` và cập nhật `CLAUDE-security.md`.

---

Tham chiếu: `GLOBAL-DIRECTIVES.md`, `PROFILE-MODES.md`, `ODYSSEY-PROTOCOL.md`.

# CONTEXT GATHERING — Thu thập ngữ cảnh nhanh, dừng sớm
## Early Stop + Low Tool Budget

Mục tiêu: Lấy đủ ngữ cảnh để hành động chính xác với chi phí thấp nhất.

---

## Phương pháp (Method)
1. Bắt đầu rộng, sau đó thu hẹp; ưu tiên đọc mục tiêu.
2. Gọi công cụ theo trình tự (sequential), từng bước một.
3. Đọc hit quan trọng nhất; tránh lặp lại truy vấn.
4. Dừng sớm khi đã chỉ ra được tệp/ký hiệu/chỗ cần sửa.
5. Nếu thiếu chắc chắn: dùng "escape hatch" — nêu giả định hợp lý và tiếp tục.

## Ngân sách công cụ (Tool Budget)
- Mặc định: ≤2 tool calls cho lượt khám phá nhỏ.
- Vượt quá: ghi ngắn gọn lý do.
- Chế độ "kiến trúc": mở tệp theo thứ tự, từng tệp một, không song song.

## Tiêu chí dừng sớm (Early Stop Criteria)
- Đã chỉ ra chính xác nội dung/tệp/ký hiệu cần thay đổi.
- Các tín hiệu hội tụ ≈70% vào một khu vực.

## Heuristics (Search vs Internal Knowledge)
- Nhiệm vụ nhỏ/chuẩn: ưu tiên tri thức nội bộ.
- Khi cần ngữ cảnh chính xác/chéo tệp: dùng công cụ đọc/grep có mục tiêu.
- Tránh hỏi người dùng nếu có thể kiểm chứng nhanh bằng đọc tệp.

## Tích hợp với ORCHESTRATOR
- Giai đoạn Discovery nằm trước Routing/Implementation.
- Quản lý token: dành ngân sách nhỏ cho khám phá.
- Gắn kết với Quality Gates (yêu cầu bằng chứng `file:line`).

Tham chiếu: `GLOBAL-DIRECTIVES.md`, `PROFILE-MODES.md`, `CODE-EDITING-WORKFLOW.md`, `PERSISTENCE-RULES.md`.

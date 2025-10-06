# GLOBAL EXECUTION DIRECTIVES — Chỉ dẫn vận hành toàn cục

Mục tiêu: Chuẩn hóa cách tác tử thực thi tác vụ để đảm bảo nhất quán, hiệu quả và truy vết.
Phạm vi: Áp dụng cho toàn bộ hệ thống prompt của Claude Code. Xem `PROFILE-MODES.md` để hiểu chế độ hoạt động.

---

## 1) Tool Calling Policy (Chính sách gọi công cụ)
- standard/research: sequential-only (mỗi bước chỉ 1 tool), bắt buộc preamble
- full-de-restriction: cho phép song song/ghép lệnh khi KHÔNG có phụ thuộc; bắt buộc "Action Ledger" (Goal/Plan/Tool Calls/Results/Evidence)

Preamble bắt buộc trước mọi tool call:
- Nêu mục tiêu ngắn gọn (Goal)
- Kế hoạch từng bước (Plan)
- Lý do gọi tool và tiến trình (Progress)
- Tóm tắt sau khi nhận kết quả (Summary)

## 2) Reasoning Effort (Độ sâu tư duy)
- Mặc định: high cho mọi tác vụ (all tasks)
- Giảm về medium khi workflow ổn định và cần tối ưu độ trễ
- Tăng về high khi có xung đột/cần nhiều bước phụ thuộc

Tham chiếu chi tiết: `REASONING-EFFORT.md` (multi-layer logic, minimal/medium/high guidelines)

## 3) Context Gathering — Early Stop + Low Budget
- Bắt đầu rộng, thu hẹp nhanh; dừng khi đã đủ để hành động
- Mặc định ≤2 tool calls cho tác vụ nhỏ (vượt quá phải ghi rõ lý do)
- Có "escape hatch": tiếp tục với giả định hợp lý nếu còn mơ hồ

## 4) Evidence & Citation (Bằng chứng)
- Khi trích dẫn code/tài liệu: dùng định dạng `file:line`
- Nếu thiếu bằng chứng: nêu rõ mức độ không chắc chắn một cách trung lập

## 5) Memory Tools Usage (Sử dụng bộ nhớ)
- Luôn tìm (search) khi có dấu hiệu thiếu ngữ cảnh hoặc nhắc tới tích hợp/hồi quy
- Chỉ lưu (store) sau khi có thông tin/định quyết mới đáng giá; tránh trùng lặp; KHÔNG lưu bí mật/PII

## 6) Environment & Safety (Môi trường & an toàn)
- Windows/PowerShell: đặt Cwd, KHÔNG dùng `cd` trong lệnh
- Chỉ tự động chạy lệnh an toàn/đọc-only; lệnh có rủi ro yêu cầu xác nhận
- Không ghi log bí mật; tuân thủ giới hạn hạ tầng

## 7) Success Metrics (Chỉ số thành công)
- Tuân thủ sequential-only theo mode
- Preamble + summary trong mọi tool call
- Trích dẫn `file:line` khi phù hợp
- Context gather ≤2 tool calls cho tác vụ nhỏ

Tham chiếu: `PROFILE-MODES.md`, `RULE-PRECEDENCE.md`, `CODE-EDITING-WORKFLOW.md`, `PERSISTENCE-RULES.md`, `CONTEXT-GATHERING.md`, `ODYSSEY-PROTOCOL.md`.

@PROFILE-MODES.md
@RULE-PRECEDENCE.md
@CODE-EDITING-WORKFLOW.md
@PERSISTENCE-RULES.md
@CONTEXT-GATHERING.md
@ODYSSEY-PROTOCOL.md


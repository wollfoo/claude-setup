---
description: Sub-Agents Confirmation Gate — list, acknowledge, verify before orchestration
auto_execution_mode: 3
---

# Sub-Agents Confirmation Gate

Mục tiêu: BẮT BUỘC agent chính phải liệt kê, đọc và xác nhận đã hiểu tất cả sub-agents trong `sub-agents/` trước khi điều phối (dispatch/orchestrate). Nếu chưa hoàn tất xác nhận, pipeline phải dừng.

## Đầu vào
- Thư mục sub-agents: `sub-agents/`
- Tệp xác nhận (ack registry): `.windsurf/memories/sub-agents-ack.md`

## 1) Liệt kê sub-agents (FULL LIST)
- Duyệt toàn bộ `sub-agents/` theo cấu trúc thư mục; ghi lại đường dẫn tương đối tới từng file `.md` của agent.
- Khuyến nghị tách theo nhóm: `00-orchestrators`, `01-core`, `02-development/*`, `03-quality`, `04-documentation`, `05-planning`, `06-infrastructure`, `07-utilities`.
- Kết quả: danh sách đầy đủ các agent (đường dẫn + name hiển thị).

## 2) Tạo/ghi tệp xác nhận `.windsurf/memories/sub-agents-ack.md`
Sao chép mẫu dưới đây và điền đủ cho MỌI agent đã liệt kê ở bước 1.

```markdown
# Sub-Agents Acknowledgement Registry

updated_at: 2025-10-26T00:00:00Z

agents:
  - path: sub-agents/00-orchestrators/tech-lead-orchestrator.md
    name: tech-lead-orchestrator
    read_understood: false
    reviewer: ""
    notes: ""
  - path: sub-agents/00-orchestrators/workflow-orchestrator.md
    name: workflow-orchestrator
    read_understood: false
    reviewer: ""
    notes: ""
  # ... liệt kê tất cả các agent khác (một mục cho mỗi file)
```

Quy ước:
- `read_understood`: chuyển sang `true` chỉ khi đã đọc và hiểu mô tả/constraints/triggers/tags của agent.
- `reviewer`: tên người xác nhận (tuỳ chọn).
- `notes`: ghi chú ngắn nếu có rủi ro/phạm vi cần lưu ý.

## 3) Xác nhận từng agent
- Mở từng file agent, đọc kỹ phần `name`, `type`, `description`, `tags`, `triggers`, `constraints`.
- Đặt `read_understood: true` khi đã hiểu rõ phạm vi/trách nhiệm agent.
- Lặp lại cho đến khi TẤT CẢ các agent đều `true`.

## 4) Kiểm tra hợp lệ (Validation Gate)
- Điều kiện PASS để cho phép điều phối:
  - Tồn tại tệp `.windsurf/memories/sub-agents-ack.md`.
  - Mọi mục trong `agents[]` đều `read_understood: true`.
  - Không còn agent mới chưa có entry (so sánh với danh sách ở bước 1).
- Nếu FAIL: dừng pipeline; quay lại bước 1–3 để hoàn tất xác nhận.

## 5) Tích hợp với Auto-Dispatch
- Trước khi chạy auto-dispatch/orchestrator, CHẠY gate này.
- Nếu PASS → tiếp tục pipeline (classify → lookup → plan → validate → execute).
- Nếu FAIL → trả về thông báo yêu cầu hoàn tất xác nhận sub-agents.

## 6) Gợi ý kiểm thử nhanh
- Thêm một agent “dummy” mới trong `sub-agents/…` → chạy lại bước 1 để đảm bảo danh sách cập nhật.
- Xoá một dòng trong `agents[]` (ack file) → Gate phải FAIL cho đến khi thêm lại entry hoặc đánh dấu `true`.

## 7) Lưu ý bảo mật/riêng tư
- Không ghi nội dung nhạy cảm vào `notes`.
- `sub-agents-ack.md` là tài liệu nội bộ, có thể commit để audit hoặc giữ cục bộ tuỳ quy ước nhóm.

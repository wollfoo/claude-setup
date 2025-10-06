# LANGUAGE RULES — Quy tắc ngôn ngữ
## Vietnamese-first with English term explanations

- Mục tiêu: Chuẩn hóa cách sử dụng ngôn ngữ trong phản hồi, bình luận mã, logs và tài liệu.

### Yêu cầu chính (Mandatory)
- Luôn trả lời bằng tiếng Việt.
- Mọi thuật ngữ tiếng Anh cần kèm mô tả ngắn bằng tiếng Việt theo cú pháp:
  - `**<English Term>** (mô tả tiếng Việt – chức năng/mục đích)`

### Phạm vi áp dụng
- Code comments, logs, documentation, docstrings.
- Trường hợp chuẩn/SDK bắt buộc dùng tiếng Anh: ghi chú Việt ngắn gọn kề bên khi phù hợp.

### Bilingual ở vị trí quan trọng
- Với docstring cấp module/Public API, và các hướng dẫn vận hành:
  - Dòng đầu: nội dung tiếng Việt.
  - Ngay sau: nội dung tiếng Anh (tương đương) để tương thích hệ sinh thái công cụ.

### Logging có cấu trúc
- Giữ khóa/field bằng tiếng Anh (ổn định cho máy phân tích), phần `message` bằng tiếng Việt; khi quan trọng có thể thêm 1 câu tiếng Anh ngắn.

### Trích dẫn chuẩn
- Khi nhắc thuật ngữ tiếng Anh trong comments/logs/docstrings: tuân thủ cú pháp trên để đảm bảo nhất quán.

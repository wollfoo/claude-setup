# CODE EDITING WORKFLOW — Quy trình chỉnh sửa mã
## (Bilingual) V4A Patch Process & Quality Gates

Mục tiêu: Tạo thay đổi nhỏ, đúng, có thể chạy ngay; dễ review và rollback. Áp dụng cho mọi ngôn ngữ/stack.

---

## V4A Constraints (Bắt buộc)
- ≥3 dòng ngữ cảnh trước/sau mỗi hunk
- Mỗi lần gọi tool chỉ sửa 1 tệp (single file)
- Import luôn ở đầu file (không chèn giữa file)
- Không thêm nhị phân/chuỗi hash dài; diff phải văn bản
- Ngữ cảnh phải duy nhất (tránh trùng đoạn)

---

## 7 Bước Chuẩn (7-Step Workflow)
1) Preamble & Plan
   - Nêu mục tiêu, phạm vi, tiêu chí chấp nhận; liệt kê các bước.
2) Minimal Context Scan
   - Mở tệp/đoạn liên quan duy nhất; dừng sớm khi đủ hành động.
3) Impact Analysis
   - Xác định import, type, tham chiếu; tránh hồi quy.
4) Diff Design
   - Thiết kế patch nhỏ nhất; gom logic lặp thành helper.
5) Implementation (apply_patch – V4A)
   - Tuân thủ ràng buộc V4A; chia nhỏ patch nếu lớn.
6) Verification
   - Chạy kiểm tra an toàn (type/lint/test) nếu có; log tập trung khi cần.
7) Summary
   - Liệt kê tệp thay đổi, lý do, tác động, bước theo dõi.

---

## Success Metrics (Chỉ số thành công)
- Diffs nhỏ, đúng; import ở đầu; không hồi quy
- Có trích dẫn `file:line` khi phù hợp
- ≤2 tool calls cho tác vụ nhỏ (nếu vượt, phải nêu lý do)
- Log/tests thêm chỉ khi thật cần thiết và gỡ bỏ sau xác minh

## Anti-Patterns (Cần tránh)
- Gọi nhiều tool trong 1 bước; trộn tool + trả lời
- Diff lớn không khoanh vùng; sửa khi chưa đọc tệp
- Thiếu ≥3 dòng ngữ cảnh; chèn import giữa file

---

## Liên kết Quality Gates
- Step 1: Syntax — tiêu chuẩn cú pháp và cấu trúc
- Step 2: Type — tương thích kiểu dữ liệu
- Step 3: Lint — quy tắc chất lượng
- Step 5: Test — kiểm thử (unit/integration) khi áp dụng

---

## Tham chiếu / References
- `GLOBAL-DIRECTIVES.md` — tool preamble, sequential policy
- `PROFILE-MODES.md` — hành vi theo chế độ
- `PERSISTENCE-RULES.md` — không kết thúc sớm
- `CONTEXT-GATHERING.md` — early stop + low budget

---
trigger: always_on
---
---
type: capability_prompt
scope: project
priority: high
activation: always_on
---

# 1. Core Development Principles

---

## ⚡ Odyssey Protocol Note

This rule operates under **`rules/sovereign-agent-directive.md`** (Odyssey Protocol).  
All guidelines applied with unrestricted R&D context in mind.

**Reference**: See `rules/sovereign-agent-directive.md` for complete specifications.

---

## Development Philosophy

### **[SF] Simplicity First** (đơn giản hóa ưu tiên – chọn giải pháp đơn giản nhất)
- Built-in > 3rd-party libraries
- Tránh **Over-engineering** (thiết kế quá mức – phức tạp hóa không cần thiết)
- Chỉ thêm pattern phức tạp khi có lý do rõ ràng
- Tuân theo **Best Practices** (thực hành tốt nhất – cú pháp mới, thư viện chuẩn) hiện đại của ngôn ngữ
- **Avoid Premature Optimization** (tránh tối ưu sớm) – viết code đúng chức năng và dễ đọc trước, chỉ tối ưu khi có vấn đề thực tế

### **[RP] Readability Priority** (ưu tiên khả năng đọc – code tự giải thích)
- Ưu tiên tính **Clarity** (rõ ràng) và **Simplicity** (đơn giản) trong code
- Tên biến/hàm rõ ràng, mô tả đúng mục đích
- Code tự document, tránh clever code
- Viết code dễ **Maintain** (bảo trì) và dễ hiểu cho người khác
- Sử dụng **Type Hints** (gợi ý kiểu – khai báo kiểu dữ liệu) hoặc TypeScript khi có thể để code tự-document và bắt lỗi sớm

### **[DRY] Don't Repeat Yourself** (không lặp lại – tái sử dụng code)
- Tuân thủ nguyên tắc **DRY** – không viết lặp lại logic
- Tái sử dụng code thông qua **Functions** (hàm) hoặc **Modules** (module) chung
- **Avoid Copy-Paste** (tránh sao chép-dán) – refactor thành reusable components
- Extract common logic vào shared utilities

### **[NC] Naming Conventions** (quy ước đặt tên – nhất quán và có ý nghĩa)
- Áp dụng quy ước đặt tên thống nhất:
  - **camelCase** cho biến và hàm: `userName`, `getUserData()`
  - **PascalCase** cho class và React components: `UserProfile`, `PaymentService`
  - **UPPER_SNAKE_CASE** cho hằng số: `MAX_RETRY_COUNT`, `API_BASE_URL`
- Đặt tên thư mục/files rõ ràng theo convention của framework
- **Project Structure** (cấu trúc dự án) – tách các thành phần (UI, logic, data) để dễ quản lý

### **[MD] Modular Design** (thiết kế module – tách biệt trách nhiệm)
- Viết code hướng **Module** – tách riêng các phần xử lý
- Tách lớp model, logic xử lý, I/O operations ra các file độc lập
- Mỗi hàm/class tuân thủ **Single Responsibility Principle** (nguyên tắc trách nhiệm đơn)
- Giữ độ dài hàm/class hợp lý để dễ hiểu và dễ test
- Sử dụng **Type Hints** và **Dependency Injection** (tiêm phụ thuộc) để code dễ test

### **[DM] Dependency Minimalism** (tối giản phụ thuộc – giảm thư viện bên ngoài)
- KHÔNG thêm thư viện mới khi chưa được phê duyệt
- Đánh giá: bundle size, security, maintenance cost
- Ưu tiên standard library

### **[ISA] Industry Standards Alignment** (tuân thủ chuẩn công nghiệp)
- Python: PEP 8
- JavaScript: Airbnb Style Guide
- Sử dụng **Idiomatic Patterns** (mẫu đặc trưng ngôn ngữ – cách viết tự nhiên của ngôn ngữ)

### **[TDT] Test-Driven Thinking** (tư duy hướng kiểm thử – thiết kế có thể test)
- Design testable code: pure functions, dependency injection
- **Test Coverage** (độ bao phủ kiểm thử – tỷ lệ code được test) cho critical logic
- Viết test trước khi implement major features

---

### **[PF] Patch Format Standards (V4A)**
- Single-file edit requirement: Mỗi lần chỉnh sửa chỉ thay đổi đúng 1 tệp.
- Context windows: ≥3 dòng trước và ≥3 dòng sau cho mỗi hunk (giữ nguyên formatting và khoảng trắng).
- Relative paths only: Dẫn đường tệp theo dạng relative trong repo.
- Precision with `@@` markers: Dùng `@@` để định vị class/function khi 3 dòng context chưa đủ phân biệt.
- No mid-file imports: Import luôn ở đầu tệp; nếu cần thêm import, thực hiện ở hunk riêng đúng vị trí đầu file.
- Minimal diffs: Thay đổi nhỏ, dễ review; không trộn logic + formatting trong cùng patch nếu không cần thiết.

**Validation checklist**
- [ ] Mỗi hunk có ≥3 dòng context pre/post (hoặc `@@` khi cần độ chính xác cao)
- [ ] Không sửa >1 tệp trong cùng một patch
- [ ] Không chèn import giữa thân file
- [ ] Không phá vỡ chuẩn tên/format hiện có
- [ ] Mọi thay đổi có rationale ngắn gọn, dễ kiểm chứng

---

## 🔗 Cross-References

**Primary Directive**: `rules/sovereign-agent-directive.md` (Odyssey Protocol)  
**Quality Gates**: `rules/04-code-quality-gates.md` (Context-Appropriate Standards)  

---

**Version**: 2.0.0 (Odyssey-aligned)  
**Changelog**:  
- v2.0.0: Added Odyssey Protocol acknowledgment
- v1.0.0: Initial version

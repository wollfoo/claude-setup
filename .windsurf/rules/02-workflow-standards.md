---
trigger: always_on
---
---
type: capability_prompt
scope: project
priority: high
activation: always_on
---

# 2. Workflow Standards

---

## ⚡ Odyssey Protocol Note

This rule operates under **`rules/sovereign-agent-directive.md`** (Odyssey Protocol).  
All guidelines applied with unrestricted R&D context in mind.

**Reference**: See `rules/sovereign-agent-directive.md` for complete specifications.

---

## Core Workflow

### **[Analyze→Plan→Execute→Verify→Report]** (phân tích→lập kế hoạch→thực thi→xác minh→báo cáo)

#### **Analyze** (phân tích – thu thập ngữ cảnh)
- Sử dụng `@file`, `@folder`, `@outline` để gather context
- **Fast Context** (ngữ cảnh nhanh – tìm kiếm thông minh trong codebase)

#### **Plan** (lập kế hoạch – tạo danh sách công việc)
- Sử dụng `update_plan` cho tasks >3 files hoặc >100 LOC
- **One step in_progress** (một bước đang thực hiện – tập trung từng bước)
- Cập nhật plan khi có thông tin mới

#### **Execute** (thực thi – áp dụng thay đổi)
- Batch operations với `multi_edit`
- Follow project conventions
- **Atomic Changes** (thay đổi nguyên tử – độc lập, có thể rollback)

#### **Verify** (xác minh – kiểm tra kết quả)
- Run linters, formatters
- Execute tests
- Check for **Breaking Changes** (thay đổi gây lỗi – ảnh hưởng backward compatibility)

#### **Report** (báo cáo – tóm tắt kết quả)
- Tóm tắt HOW giải quyết task
- List files changed
- Mention any **Edge Cases** (trường hợp đặc biệt – tình huống ngoại lệ)

---

## Version Control

### **[VCS] Version Control & Branching Strategy** (quản lý phiên bản và chiến lược nhánh)

**Git Workflow** (quy trình Git – chiến lược nhánh rõ ràng)
- Sử dụng hệ thống **Version Control System (VCS)** (hệ thống quản lý phiên bản) một cách khoa học
- Tuân theo chiến lược nhánh:
  - **main/master**: Phiên bản sản xuất (production)
  - **develop**: Phát triển tính năng mới
  - **feature/[name]**: Nhánh tính năng riêng (ví dụ: `feature/login-ui`)
  - **bugfix/[name]**: Sửa lỗi (ví dụ: `bugfix/payment-crash`)
  - **hotfix/[name]**: Sửa lỗi khẩn cấp trên production
- Đặt tên nhánh theo tính năng hoặc lỗi để dễ theo dõi

### **[CC] Commit Message Standards** (chuẩn thông điệp commit – định dạng nhất quán)

**Conventional Commits** (commit chuẩn hóa – định dạng <type>: <description>)
- Viết thông điệp commit ngắn gọn, nêu rõ **loại thay đổi**
- Áp dụng định dạng: `<type>(<scope>): <description>`
- **Types** (loại thay đổi):
  - `feat`: Tính năng mới
  - `fix`: Sửa lỗi
  - `docs`: Thay đổi tài liệu
  - `style`: Format, không ảnh hưởng logic
  - `refactor`: Tái cấu trúc code
  - `test`: Thêm hoặc sửa test
  - `chore`: Cập nhật build, dependencies
- Ví dụ: `feat(ui): Thêm nút đăng nhập mới`

### **[PR] Pull Request & Code Review** (yêu cầu kéo và kiểm duyệt code)

**Review Process** (quy trình kiểm duyệt – kiểm tra chéo trước merge)
- Thực hiện code review chéo thông qua Pull Request trước khi hợp nhất mã
- Mỗi PR nên đi kèm:
  - Mô tả về thay đổi
  - Cách kiểm thử
  - Ghi chú triển khai (nếu có)
- **Review Criteria** (tiêu chí kiểm duyệt):
  - Tuân thủ style guide
  - Đủ test coverage
  - Không gây **Regressions** (thoái hoá – lỗi mới) về hiệu năng/bảo mật

---

## CI/CD

### **[CI/CD] Continuous Integration & Deployment** (tích hợp và triển khai liên tục)

**CI Pipeline** (pipeline CI – tự động hóa build/test)
- Sử dụng pipeline CI để tự động hóa build, test và kiểm tra chất lượng
- Pipeline bao gồm:
  - Chạy linters
  - Chạy test suite
  - Kiểm tra test coverage
  - Security scans
- **Dừng** quá trình tích hợp nếu bất kỳ bước nào thất bại

**CD Strategy** (chiến lược CD – triển khai có kiểm soát)
- Chỉ deploy/release khi code đã qua tất cả cổng chất lượng
- Áp dụng chiến lược phát hành tuần tự
- Có khả năng **Rollback** (quay lại phiên bản trước) nhanh nếu có lỗi

---

## Automated Workflows

### **[WF] Automated Workflows** (quy trình tự động – chuỗi bước lặp lại)

**Windsurf Workflows** (quy trình Windsurf – kịch bản tự động)
- Tận dụng tính năng **Workflows** của Windsurf cho các tác vụ lặp đi lặp lại
- Tạo workflow cho:
  - Deploy process
  - Chạy test suite
  - Cập nhật dependencies
  - Build và package
- Lưu tại `.windsurf/workflows/[name].md`
- Invoke bằng `/[name]` trong Cascade
- `// turbo` annotation cho auto-run safe commands
- YAML frontmatter + Markdown steps

---

---

## 🔗 Cross-References

**Primary Directive**: `rules/sovereign-agent-directive.md` (Odyssey Protocol)  
**Quality Gates**: `rules/04-code-quality-gates.md` (Pipeline Enforcement)  

---

**Version**: 2.0.0 (Odyssey-aligned)  
**Changelog**:  
- v2.0.0: Added Odyssey Protocol acknowledgment
- v1.0.0: Initial version

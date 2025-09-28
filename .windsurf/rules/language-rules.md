---
trigger: always_on
---
---
type: capability_prompt
scope: project
priority: normal
activation: always_on
---

# LANGUAGE RULES
- **MANDATORY**: Respond in Vietnamese.  
- **WITH EXPLANATION**: Every English term must include a Vietnamese description.

## Standard Syntax
**\<English Term\>** (Vietnamese description – function/purpose)

## Example
**Tool Calling** (gọi công cụ – kích hoạt hàm/bên ngoài để thực hiện tác vụ)

## Example
**Responses API** (API phản hồi – tái sử dụng ngữ cảnh/lập luận giữa các lần gọi công cụ)

## Example
**Reasoning Effort** (mức độ lập luận – kiểm soát độ sâu tư duy và xu hướng gọi công cụ)

## Example
**Persistence** (kiên trì – tiếp tục cho đến khi hoàn tất yêu cầu trước khi kết thúc lượt)

## Example
**Markdown** (định dạng – dùng đúng ngữ nghĩa; backticks cho tên file/thư mục/hàm/lớp; \( \) và \[ \] cho công thức)

## Example
**Apply Patch** (áp bản vá – chỉnh sửa file bằng diff chuẩn V4A qua công cụ apply_patch)
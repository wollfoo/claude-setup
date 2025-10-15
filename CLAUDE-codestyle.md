# CLAUDE-codestyle.md

**Code Style Standards** (tiêu chuẩn phong cách code – quy định coding conventions và best practices)

## General Code Style Principles

### **Core Principles** (Nguyên tắc cốt lõi)

1. **Readability First** (Ưu tiên khả năng đọc – code dễ hiểu và maintain)
2. **Consistency** (Tính nhất quán – patterns đồng nhất across codebase)
3. **Simplicity** (Tính đơn giản – tránh over-engineering)
4. **Documentation** (Tài liệu hóa – bilingual docs cho functions và modules)
5. **Error Handling** (Xử lý lỗi – comprehensive error handling patterns)

### **Naming Conventions** (Quy ước đặt tên)

#### Variables và Functions
```typescript
// ✅ Good - Clear và descriptive
const userTokenExpiry = 3600; // **Token Expiry** (hết hạn token – seconds)
const calculateUserPermissions = () => {}; // **Permission Calculator** (tính quyền – xác định access)

// ❌ Bad - Unclear abbreviations
const ute = 3600;
const calc = () => {};
```

#### Constants và Enums
```typescript
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_ATTEMPTS = 3;

enum UserRole {
  ADMIN = 'admin',   // **Administrator** (quản trị viên – full access)
  USER = 'user',     // **Regular User** (người dùng – limited access)
  GUEST = 'guest'    // **Guest** (khách – read-only)
}
```

## Language-Specific Standards

### **Rust Standards** (Tiêu chuẩn Rust)

**Function Documentation Pattern**:
```rust
/// **[Function Purpose]** ([mô tả Việt] – [chức năng])
///
/// # Arguments
/// * `param` - **[Param Name]** ([mô tả param] – [vai trò])
///
/// # Returns
/// * `Result<T, E>` - **[Return Type]** ([kết quả] – [ý nghĩa])
///
/// # Examples
/// ```rust
/// let result = function_name(args);
/// ```
pub fn function_name(param: &str) -> Result<Type, Error> {
    // **Implementation** (triển khai – business logic)
}
```

**Error Handling Pattern**:
```rust
#[derive(Debug, thiserror::Error)]
pub enum CustomError {
    #[error("Description")]
    ErrorVariant, // **[Error Type]** ([loại lỗi] – [nguyên nhân])
}
```

### **Python Standards** (Tiêu chuẩn Python)

**Class Documentation Pattern**:
```python
class ClassName:
    """**[Class Purpose]** ([mục đích class] – [trách nhiệm chính]).

    Attributes:
        attr_name: **[Attribute]** ([thuộc tính] – [vai trò])
    """

    def method_name(self, param: Type) -> ReturnType:
        """**[Method Purpose]** ([mục đích method] – [chức năng]).

        Args:
            param: **[Parameter]** ([tham số] – [ý nghĩa])

        Returns:
            **[Return Value]** ([giá trị trả về] – [kết quả])

        Raises:
            ErrorType: **[Error Condition]** ([điều kiện lỗi] – [khi nào])
        """
        # **Implementation** (triển khai – logic thực thi)
```

### **JavaScript/TypeScript Standards** (Tiêu chuẩn JS/TS)

**Interface Pattern**:
```typescript
/**
 * **[Interface Name]** ([tên interface] – [mục đích type definition])
 */
interface InterfaceName {
  /** **[Property]** ([thuộc tính] – [vai trò trong system]) */
  propertyName: Type;
}
```

**Function Pattern**:
```typescript
/**
 * **[Function Purpose]** ([mục đích hàm] – [chức năng])
 *
 * @param paramName **[Param]** ([tham số] – [vai trò])
 * @returns **[Return]** ([kết quả] – [ý nghĩa])
 *
 * @example
 * ```typescript
 * const result = functionName(arg);
 * ```
 */
async function functionName(param: Type): Promise<ReturnType> {
  try {
    // **Implementation** (triển khai – business logic)
  } catch (error) {
    // **Error Handling** (xử lý lỗi – recovery logic)
  }
}
```

### **C/C++ Standards** (Tiêu chuẩn C/C++)

**Header Documentation Pattern**:
```c
/**
 * @file filename.h
 * @brief **[Module Purpose]** ([mục đích module] – [chức năng chính])
 */

/**
 * @brief **[Function Purpose]** ([mục đích hàm] – [operation])
 *
 * @param param **[Parameter]** ([tham số] – [vai trò])
 * @return **[Return Value]** ([giá trị trả về] – [ý nghĩa])
 *
 * @retval 0 **Success** (thành công – operation completed)
 * @retval -1 **Error** (lỗi – operation failed)
 */
int function_name(const char* param);
```

### **JSON Standards** (Tiêu chuẩn JSON)

**Configuration Pattern**:
```json
{
  "_comment": "Section Description - Mô tả section bằng Việt",
  "section_name": {
    "property": "value"
  }
}
```

## File Organization Patterns

### **Directory Structure** (Cấu trúc thư mục)
```
project-root/
├── src/              # **Source Code** (mã nguồn – main application)
│   ├── components/   # **UI Components** (thành phần UI – reusable elements)
│   ├── services/     # **Business Logic** (logic nghiệp vụ – core operations)
│   ├── utils/        # **Utilities** (tiện ích – helper functions)
│   ├── types/        # **Type Definitions** (định nghĩa kiểu – interfaces)
│   └── config/       # **Configuration** (cấu hình – app settings)
├── tests/            # **Test Files** (file test – unit và integration)
├── docs/             # **Documentation** (tài liệu – technical docs)
└── CLAUDE-*.md      # **Context Files** (file ngữ cảnh – memory bank)
```

### **Import Organization** (Tổ chức import)
```typescript
// **External Libraries** (thư viện ngoài – third-party dependencies)
import React from 'react';

// **Internal Modules** (module nội bộ – project imports)
import { Service } from '../services/Service';

// **Type Imports** (import kiểu – interfaces và types)
import type { User } from '../types/User';

// **Relative Imports** (import tương đối – local files)
import './Component.css';
```

## Documentation Standards

### **Function Documentation Template**
```typescript
/**
 * **[Function Purpose]** ([mô tả Việt] – [chức năng cụ thể])
 *
 * @param {Type} paramName **[Param Purpose]** ([mô tả param] – [vai trò])
 * @returns {Type} **[Return Purpose]** ([kết quả] – [ý nghĩa])
 * @throws {ErrorType} **[Error Condition]** ([điều kiện lỗi] – [khi nào])
 *
 * @example
 * ```typescript
 * const result = functionName(args);
 * ```
 */
```

### **Class Documentation Template**
```typescript
/**
 * **[Class Name]** ([tên class Việt] – [mục đích])
 *
 * @class
 * @implements {Interface} **[Interface]** ([interface] – [contract])
 * @extends {Parent} **[Parent Class]** ([class cha] – [inheritance])
 */
```

## Error Handling Patterns

### **Structured Error Types** (Kiểu lỗi có cấu trúc)
```typescript
abstract class BaseError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;

  constructor(
    message: string,
    public readonly context?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      context: this.context
    };
  }
}

// **Specific Error Types** (các loại lỗi cụ thể)
class ValidationError extends BaseError {
  readonly code = 'VALIDATION_ERROR';
  readonly statusCode = 400;
}

class AuthenticationError extends BaseError {
  readonly code = 'AUTH_ERROR';
  readonly statusCode = 401;
}

class DatabaseError extends BaseError {
  readonly code = 'DATABASE_ERROR';
  readonly statusCode = 500;
}
```

### **Error Handler Pattern** (Mẫu xử lý lỗi)
```typescript
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // **Error Logging** (ghi log lỗi – record details)
  logger.error('Error occurred', {
    error: error.message,
    stack: error.stack,
    url: req.url
  });

  // **Custom Error Handling** (xử lý lỗi tùy chỉnh)
  if (error instanceof BaseError) {
    res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message
      }
    });
    return;
  }

  // **Fallback** (dự phòng – unknown errors)
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Unexpected error occurred'
    }
  });
}
```

## Input Validation

### **Validation Pattern** (Mẫu kiểm tra)
```typescript
class InputValidator {
  /**
   * **Email Validation** (kiểm tra email – format và domain)
   */
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  /**
   * **Password Validation** (kiểm tra mật khẩu – strength requirements)
   */
  static validatePassword(password: string): boolean {
    // **Length Check** (kiểm tra độ dài – minimum 8 chars)
    // **Complexity Check** (kiểm tra độ phức tạp – letters + numbers)
    return password.length >= 8 && /[A-Za-z]/.test(password) && /[0-9]/.test(password);
  }
}
```

## Framework Integration Commands

### **Code Review Checklist** (Danh sách kiểm tra)

Use `/check-best-practices` to verify:

1. **Documentation Standards** (tiêu chuẩn tài liệu – bilingual comments)
2. **Error Handling** (xử lý lỗi – proper error types)
3. **Naming Conventions** (quy ước đặt tên – consistency)
4. **Code Organization** (tổ chức code – proper structure)

### **Apply Thinking Pattern** (Áp dụng mẫu tư duy)

Use `/apply-thinking-to` for:

- **Code Refactoring** (tái cấu trúc – improve structure)
- **Performance Optimization** (tối ưu hiệu suất – identify bottlenecks)
- **Documentation Updates** (cập nhật tài liệu – ensure accuracy)

## Enforcement Strategies

### **Automated Tools** (Công cụ tự động)

1. **Linting Rules** (quy tắc linting – automated style checking)
   - ESLint for TypeScript/JavaScript
   - Rustfmt for Rust formatting
   - Clang-format for C/C++

2. **Pre-commit Hooks** (hook pre-commit – prevent bad code)
   - Format checking và auto-fixing
   - Documentation validation
   - Security scanning

3. **CI/CD Pipeline** (pipeline CI/CD – quality gates)
   - Code coverage requirements
   - Security vulnerability scanning
   - Documentation completeness

### **Code Review Guidelines** (Hướng dẫn review)

**Mandatory Review Points** (điểm bắt buộc):

1. ✅ **Bilingual Documentation** (tài liệu song ngữ – standard syntax)
2. ✅ **Error Handling** (xử lý lỗi – proper types)
3. ✅ **Testing Coverage** (phạm vi test – adequate tests)

**Review Checklist** (danh sách kiểm tra):

- [ ] **Function Documentation** (tài liệu hàm – bilingual docs)
- [ ] **Variable Naming** (đặt tên biến – clear naming)
- [ ] **Error Boundaries** (ranh giới lỗi – proper scopes)
- [ ] **Resource Cleanup** (dọn dẹp tài nguyên – proper management)
- [ ] **Test Coverage** (phạm vi test – critical paths covered)

---

**Note**: **Code Style Guide** (hướng dẫn phong cách – comprehensive standards) should be referenced for development work và updated as patterns emerge.

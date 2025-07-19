# CLAUDE-codestyle.md

This file defines **Code Style Standards** (tiêu chuẩn phong cách code – quy định coding conventions và best practices) for the Claude Code framework.

## General Code Style Principles

### **Core Principles** (Nguyên tắc cốt lõi)

1. **Readability First** (Ưu tiên khả năng đọc – code phải dễ hiểu và maintain)
2. **Consistency** (Tính nhất quán – áp dụng patterns đồng nhất across codebase)
3. **Simplicity** (Tính đơn giản – tránh over-engineering và complexity không cần thiết)
4. **Documentation** (Tài liệu hóa – mọi function và module phải có docs rõ ràng)
5. **Error Handling** (Xử lý lỗi – implement comprehensive error handling patterns)

### **Naming Conventions** (Quy ước đặt tên)

#### **Variables và Functions** (Biến và hàm)
```typescript
// **Good Examples** (Ví dụ tốt – naming conventions đúng chuẩn)
const userTokenExpiry = 3600; // **Token Expiry** (thời gian hết hạn token – giá trị seconds)
const calculateUserPermissions = () => {}; // **Permission Calculator** (bộ tính quyền – xác định user access)

// **Bad Examples** (Ví dụ sai – naming conventions không chuẩn)  
const ute = 3600; // Unclear abbreviation
const calc = () => {}; // Too generic
```

#### **Constants và Enums** (Hằng số và enums)
```typescript
// **Constants** (Hằng số – giá trị không đổi trong runtime)
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_ATTEMPTS = 3;

// **Enums** (Liệt kê – tập hợp các giá trị named constants)
enum UserRole {
  ADMIN = 'admin',     // **Administrator** (quản trị viên – full system access)
  USER = 'user',       // **Regular User** (người dùng thường – limited access)
  GUEST = 'guest'      // **Guest User** (khách – read-only access)
}
```

## Language-Specific Standards

### **Rust Standards** (Tiêu chuẩn Rust)

#### **Function Documentation** (Tài liệu hàm)
```rust
/// **User Authentication** (xác thực người dùng – validate credentials và generate session)
/// 
/// # Arguments
/// * `username` - **Username** (tên đăng nhập – unique identifier cho user)
/// * `password` - **Password** (mật khẩu – raw password string cần hash)
/// 
/// # Returns
/// * `Result<AuthToken, AuthError>` - **Auth Result** (kết quả xác thực – token hoặc error)
/// 
/// # Examples
/// ```rust
/// let result = authenticate_user("john_doe", "secure_password");
/// match result {
///     Ok(token) => println!("Authentication successful"),
///     Err(e) => eprintln!("Auth failed: {}", e),
/// }
/// ```
pub fn authenticate_user(username: &str, password: &str) -> Result<AuthToken, AuthError> {
    // **Input Validation** (kiểm tra đầu vào – ensure username và password format)
    if username.is_empty() || password.len() < 8 {
        return Err(AuthError::InvalidCredentials);
    }
    
    // **Password Hashing** (mã hóa mật khẩu – secure hash generation)
    let hashed = hash_password(password)?;
    
    // **Database Lookup** (tìm kiếm database – verify user exists)
    let user = find_user_by_username(username)?;
    
    Ok(AuthToken::new(user.id))
}
```

#### **Error Handling** (Xử lý lỗi)
```rust
#[derive(Debug, thiserror::Error)]
pub enum AuthError {
    #[error("Invalid credentials provided")]
    InvalidCredentials, // **Invalid Creds** (thông tin không hợp lệ – username/password sai)
    
    #[error("Database connection failed: {0}")]
    DatabaseError(#[from] sqlx::Error), // **DB Error** (lỗi database – connection hoặc query issues)
    
    #[error("Token generation failed")]
    TokenGenerationFailed, // **Token Error** (lỗi tạo token – cryptographic operation failed)
}
```

### **Python Standards** (Tiêu chuẩn Python)

#### **Class Documentation** (Tài liệu class)
```python
class UserManager:
    """**User Management System** (hệ thống quản lý người dùng – CRUD operations cho users).
    
    This class handles **User Operations** (các thao tác người dùng – create, read, update, delete users)
    and provides **Authentication Services** (dịch vụ xác thực – login/logout functionality).
    
    Attributes:
        db_connection: **Database Connection** (kết nối cơ sở dữ liệu – SQLAlchemy session)
        cache_manager: **Cache Manager** (quản lý cache – Redis client for performance)
    
    Example:
        >>> manager = UserManager(db_session, redis_client)
        >>> user = manager.create_user("john@example.com", "secure_password")
    """
    
    def __init__(self, db_connection, cache_manager):
        """Initialize **User Manager** (khởi tạo quản lý user – setup dependencies).
        
        Args:
            db_connection: **DB Connection** (kết nối DB – active database session)
            cache_manager: **Cache Manager** (quản lý cache – Redis/Memcached client)
        """
        self.db = db_connection
        self.cache = cache_manager
        # **Initialization Log** (log khởi tạo – record manager startup)
        logger.info("UserManager initialized successfully")
    
    def create_user(self, email: str, password: str) -> User:
        """Create **New User** (tạo người dùng mới – register new account).
        
        Args:
            email: **Email Address** (địa chỉ email – unique identifier và contact)
            password: **Raw Password** (mật khẩu thô – will be hashed before storage)
            
        Returns:
            User: **User Object** (đối tượng người dùng – newly created user instance)
            
        Raises:
            ValidationError: **Validation Error** (lỗi kiểm tra – invalid email/password format)
            DuplicateUserError: **Duplicate Error** (lỗi trùng lặp – email already exists)
        """
        # **Email Validation** (kiểm tra email – format và domain validation)
        if not self._validate_email(email):
            raise ValidationError("Invalid email format")
        
        # **Duplicate Check** (kiểm tra trùng lặp – ensure email uniqueness)
        if self._user_exists(email):
            raise DuplicateUserError(f"User with email {email} already exists")
        
        # **Password Hashing** (mã hóa mật khẩu – secure hash generation)
        hashed_password = self._hash_password(password)
        
        # **Database Insert** (chèn database – create new user record)
        user = User(email=email, password_hash=hashed_password)
        self.db.add(user)
        self.db.commit()
        
        # **Cache Update** (cập nhật cache – store user data for quick access)
        self.cache.set(f"user:{user.id}", user.to_dict(), expire=3600)
        
        return user
```

### **JavaScript/TypeScript Standards** (Tiêu chuẩn JavaScript/TypeScript)

#### **Interface Definition** (Định nghĩa interface)
```typescript
/**
 * **User Profile Interface** (giao diện hồ sơ người dùng – type definition cho user data)
 */
interface UserProfile {
  /** **User ID** (ID người dùng – unique identifier trong system) */
  id: string;
  
  /** **Email Address** (địa chỉ email – contact và login credential) */
  email: string;
  
  /** **Display Name** (tên hiển thị – human-readable name cho UI) */
  displayName: string;
  
  /** **User Roles** (vai trò người dùng – permission levels array) */
  roles: UserRole[];
  
  /** **Profile Settings** (cài đặt hồ sơ – user preferences và configuration) */
  settings: {
    /** **Theme Preference** (tùy chọn giao diện – light/dark theme) */
    theme: 'light' | 'dark';
    
    /** **Language Code** (mã ngôn ngữ – i18n locale identifier) */
    language: string;
    
    /** **Notification Settings** (cài đặt thông báo – enable/disable various alerts) */
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  };
}

/**
 * **Authentication Service** (dịch vụ xác thực – handle login/logout operations)
 */
class AuthService {
  private tokenStorage: TokenStorage;
  private apiClient: ApiClient;
  
  constructor(tokenStorage: TokenStorage, apiClient: ApiClient) {
    // **Dependency Injection** (tiêm phụ thuộc – inject required services)
    this.tokenStorage = tokenStorage;
    this.apiClient = apiClient;
  }
  
  /**
   * **User Login** (đăng nhập người dùng – authenticate và generate session)
   * 
   * @param credentials **Login Credentials** (thông tin đăng nhập – email/password pair)
   * @returns Promise<AuthResult> **Auth Result** (kết quả xác thực – success/failure với token)
   * 
   * @example
   * ```typescript
   * const result = await authService.login({
   *   email: 'user@example.com',
   *   password: 'securePassword123'
   * });
   * 
   * if (result.success) {
   *   console.log('Login successful:', result.user);
   * }
   * ```
   */
  async login(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      // **Input Validation** (kiểm tra đầu vào – validate email format và password strength)
      this.validateCredentials(credentials);
      
      // **API Authentication** (xác thực API – send credentials to server)
      const response = await this.apiClient.post('/auth/login', credentials);
      
      // **Token Storage** (lưu trữ token – persist auth token for future requests)
      await this.tokenStorage.save(response.data.token);
      
      // **Success Result** (kết quả thành công – return user data và token)
      return {
        success: true,
        user: response.data.user,
        token: response.data.token
      };
      
    } catch (error) {
      // **Error Handling** (xử lý lỗi – log error và return failure result)
      console.error('Login failed:', error);
      
      return {
        success: false,
        error: error instanceof AuthError ? error : new AuthError('Login failed')
      };
    }
  }
  
  /**
   * **Credentials Validation** (kiểm tra thông tin đăng nhập – validate format requirements)
   */
  private validateCredentials(credentials: LoginCredentials): void {
    // **Email Format Check** (kiểm tra định dạng email – regex validation)
    if (!this.isValidEmail(credentials.email)) {
      throw new ValidationError('Invalid email format');
    }
    
    // **Password Requirements** (yêu cầu mật khẩu – minimum length và complexity)
    if (credentials.password.length < 8) {
      throw new ValidationError('Password must be at least 8 characters');
    }
  }
}
```

### **C/C++ Standards** (Tiêu chuẩn C/C++)

#### **Header Documentation** (Tài liệu header)
```c
/**
 * @file user_auth.h
 * @brief **User Authentication Module** (module xác thực người dùng – handle login/logout operations)
 * 
 * This header defines **Authentication Functions** (các hàm xác thực – user credential validation)
 * and **Data Structures** (cấu trúc dữ liệu – user session management).
 * 
 * @author Development Team
 * @date 2024-01-15
 * @version 1.0.0
 */

#ifndef USER_AUTH_H
#define USER_AUTH_H

#include <stdbool.h>
#include <stdint.h>

/**
 * @struct UserSession
 * @brief **User Session Data** (dữ liệu phiên người dùng – active session information)
 */
typedef struct {
    uint32_t user_id;           /**< **User ID** (ID người dùng – unique identifier) */
    char session_token[256];    /**< **Session Token** (token phiên – authentication key) */
    time_t expires_at;          /**< **Expiry Time** (thời gian hết hạn – session timeout) */
    bool is_active;             /**< **Active Status** (trạng thái hoạt động – session validity) */
} UserSession;

/**
 * @brief **Authenticate User** (xác thực người dùng – validate credentials và create session)
 * 
 * This function validates **User Credentials** (thông tin đăng nhập – username/password pair)
 * and creates a new **User Session** (phiên người dùng – authenticated session).
 * 
 * @param username **Username** (tên đăng nhập – user identifier string)
 * @param password **Password** (mật khẩu – authentication credential)
 * @param session **Session Output** (đầu ra phiên – pointer to session struct)
 * 
 * @return int **Result Code** (mã kết quả – 0 success, negative error codes)
 * 
 * @retval 0 **Success** (thành công – authentication passed)
 * @retval -1 **Invalid Credentials** (thông tin không hợp lệ – wrong username/password)
 * @retval -2 **Database Error** (lỗi cơ sở dữ liệu – connection failed)
 * @retval -3 **Session Creation Failed** (tạo phiên thất bại – memory allocation error)
 * 
 * @code
 * UserSession session;
 * int result = authenticate_user("john_doe", "password123", &session);
 * if (result == 0) {
 *     printf("Authentication successful\n");
 *     // Use session for subsequent operations
 * } else {
 *     printf("Authentication failed with code: %d\n", result);
 * }
 * @endcode
 */
int authenticate_user(const char* username, const char* password, UserSession* session);

/**
 * @brief **Validate Session** (kiểm tra phiên – verify session validity và expiry)
 * 
 * @param session **Session Data** (dữ liệu phiên – pointer to session struct)
 * @return bool **Validity Status** (trạng thái hợp lệ – true if valid, false otherwise)
 */
bool validate_session(const UserSession* session);

/**
 * @brief **Destroy Session** (hủy phiên – cleanup session data và invalidate)
 * 
 * @param session **Session Data** (dữ liệu phiên – pointer to session struct)
 */
void destroy_session(UserSession* session);

#endif /* USER_AUTH_H */
```

#### **Implementation File** (File implementation)
```c
/**
 * @file user_auth.c
 * @brief **Authentication Implementation** (triển khai xác thực – function implementations)
 */

#include "user_auth.h"
#include <string.h>
#include <stdlib.h>
#include <time.h>

/**
 * **Static Helper Functions** (hàm trợ giúp tĩnh – internal utility functions)
 */

/**
 * @brief **Hash Password** (mã hóa mật khẩu – generate secure password hash)
 */
static char* hash_password(const char* password) {
    // **Password Hashing Logic** (logic mã hóa mật khẩu – SHA-256 implementation)
    // Implementation details...
    return NULL; // Placeholder
}

/**
 * @brief **Generate Session Token** (tạo token phiên – random secure token generation)
 */
static void generate_session_token(char* token_buffer, size_t buffer_size) {
    // **Token Generation** (tạo token – cryptographically secure random string)
    // Implementation details...
}

/**
 * **Public Function Implementations** (triển khai hàm công khai – API implementations)
 */

int authenticate_user(const char* username, const char* password, UserSession* session) {
    // **Input Validation** (kiểm tra đầu vào – null pointer và empty string checks)
    if (!username || !password || !session) {
        return -1; // Invalid parameters
    }
    
    if (strlen(username) == 0 || strlen(password) == 0) {
        return -1; // Empty credentials
    }
    
    // **Database Lookup** (tìm kiếm database – verify user exists)
    // This would typically involve database queries
    // For demo purposes, using simple string comparison
    
    // **Password Verification** (xác minh mật khẩu – compare hashed passwords)
    char* hashed = hash_password(password);
    if (!hashed) {
        return -3; // Hash generation failed
    }
    
    // **Session Creation** (tạo phiên – initialize session structure)
    session->user_id = 12345; // Would be actual user ID from database
    generate_session_token(session->session_token, sizeof(session->session_token));
    session->expires_at = time(NULL) + 3600; // **1 Hour Expiry** (hết hạn 1 giờ – session timeout)
    session->is_active = true;
    
    free(hashed);
    return 0; // **Success** (thành công – authentication completed)
}

bool validate_session(const UserSession* session) {
    // **Null Check** (kiểm tra null – validate pointer)
    if (!session) {
        return false;
    }
    
    // **Expiry Check** (kiểm tra hết hạn – compare current time with expiry)
    time_t current_time = time(NULL);
    if (current_time > session->expires_at) {
        return false; // **Session Expired** (phiên hết hạn – timeout reached)
    }
    
    // **Active Status Check** (kiểm tra trạng thái hoạt động – session validity)
    return session->is_active;
}

void destroy_session(UserSession* session) {
    if (session) {
        // **Clear Sensitive Data** (xóa dữ liệu nhạy cảm – security cleanup)
        memset(session->session_token, 0, sizeof(session->session_token));
        session->is_active = false;
        session->user_id = 0;
        session->expires_at = 0;
    }
}
```

### **JSON Standards** (Tiêu chuẩn JSON)

#### **Configuration Files** (File cấu hình)
```json
{
  "_schema_version": "1.0.0",
  "_description": "Application Configuration - Cấu hình ứng dụng cho production environment",
  
  "database": {
    "_comment": "Database Settings - Cài đặt cơ sở dữ liệu cho primary storage",
    "host": "localhost",
    "port": 5432,
    "name": "production_db",
    "pool_size": 20,
    "timeout_ms": 30000
  },
  
  "auth": {
    "_comment": "Authentication Config - Cấu hình xác thực cho user sessions",
    "jwt_secret": "${JWT_SECRET}",
    "token_expiry_hours": 24,
    "refresh_token_expiry_days": 30,
    "max_login_attempts": 5,
    "lockout_duration_minutes": 15
  },
  
  "cache": {
    "_comment": "Cache Configuration - Cấu hình cache cho performance optimization",
    "redis": {
      "host": "redis.example.com",
      "port": 6379,
      "db": 0,
      "key_prefix": "app:",
      "default_ttl_seconds": 3600
    }
  },
  
  "logging": {
    "_comment": "Logging Settings - Cài đặt logging cho monitoring và debugging",
    "level": "info",
    "format": "json",
    "output": {
      "console": true,
      "file": {
        "enabled": true,
        "path": "/var/log/app/application.log",
        "max_size_mb": 100,
        "max_files": 5
      }
    }
  },
  
  "features": {
    "_comment": "Feature Flags - Cờ tính năng để enable/disable functionality",
    "user_registration": true,
    "email_verification": true,
    "two_factor_auth": false,
    "maintenance_mode": false
  }
}
```

## File Organization Patterns

### **Directory Structure** (Cấu trúc thư mục)
```
project-root/
├── src/                     # **Source Code** (mã nguồn – main application code)
│   ├── components/          # **UI Components** (thành phần giao diện – reusable UI elements)
│   ├── services/           # **Business Logic** (logic nghiệp vụ – core business operations)
│   ├── utils/              # **Utilities** (tiện ích – helper functions và tools)
│   ├── types/              # **Type Definitions** (định nghĩa kiểu – interfaces và types)
│   └── config/             # **Configuration** (cấu hình – app settings và constants)
├── tests/                  # **Test Files** (file kiểm thử – unit và integration tests)
├── docs/                   # **Documentation** (tài liệu – technical và user documentation)
├── scripts/                # **Build Scripts** (script xây dựng – automation và deployment)
└── CLAUDE-*.md            # **Context Files** (file ngữ cảnh – framework memory bank)
```

### **Import Organization** (Tổ chức import)
```typescript
// **External Libraries** (thư viện bên ngoài – third-party dependencies)
import React from 'react';
import { Router } from 'express';
import axios from 'axios';

// **Internal Modules** (module nội bộ – project-specific imports)
import { UserService } from '../services/UserService';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { DatabaseConnection } from '../config/database';

// **Type Imports** (import kiểu – interfaces và type definitions)
import type { User } from '../types/User';
import type { ApiResponse } from '../types/ApiResponse';

// **Relative Imports** (import tương đối – local file imports)
import './UserComponent.css';
```

## Documentation Standards

### **Function Documentation Template** (Template tài liệu hàm)
```typescript
/**
 * **[Function Purpose]** ([mô tả tiếng Việt] – [chức năng cụ thể])
 * 
 * [Detailed description in English]
 * [Mô tả chi tiết bằng tiếng Việt]
 * 
 * @param {Type} paramName **[Param Purpose]** ([mô tả parameter] – [vai trò trong function])
 * @returns {Type} **[Return Purpose]** ([mô tả return value] – [ý nghĩa kết quả])
 * 
 * @throws {ErrorType} **[Error Condition]** ([điều kiện lỗi] – [khi nào throw error])
 * 
 * @example
 * ```typescript
 * const result = functionName(param1, param2);
 * // Expected output and usage
 * ```
 * 
 * @since 1.0.0
 * @version 1.2.0
 */
```

### **Class Documentation Template** (Template tài liệu class)
```typescript
/**
 * **[Class Name]** ([tên class tiếng Việt] – [mục đích chính của class])
 * 
 * [Class description and responsibilities]
 * [Mô tả class và trách nhiệm chính]
 * 
 * @class
 * @implements {InterfaceName} **[Interface Purpose]** ([mục đích interface] – [contract định nghĩa])
 * @extends {ParentClass} **[Parent Class]** ([class cha] – [inheritance relationship])
 * 
 * @example
 * ```typescript
 * const instance = new ClassName(param1, param2);
 * instance.method();
 * ```
 */
```

## Error Handling Patterns

### **Structured Error Types** (Kiểu lỗi có cấu trúc)
```typescript
/**
 * **Base Error Class** (class lỗi cơ sở – foundation cho all custom errors)
 */
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
  
  /**
   * **Error Serialization** (tuần tự hóa lỗi – convert error to JSON format)
   */
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

/**
 * **Validation Error** (lỗi kiểm tra – input validation failures)
 */
class ValidationError extends BaseError {
  readonly code = 'VALIDATION_ERROR';
  readonly statusCode = 400;
  
  constructor(message: string, public readonly field?: string) {
    super(message, { field });
  }
}

/**
 * **Authentication Error** (lỗi xác thực – auth failures và permission issues)
 */
class AuthenticationError extends BaseError {
  readonly code = 'AUTH_ERROR';
  readonly statusCode = 401;
}

/**
 * **Database Error** (lỗi cơ sở dữ liệu – database operation failures)
 */
class DatabaseError extends BaseError {
  readonly code = 'DATABASE_ERROR';
  readonly statusCode = 500;
  
  constructor(message: string, public readonly query?: string) {
    super(message, { query });
  }
}
```

### **Error Handling Middleware** (Middleware xử lý lỗi)
```typescript
/**
 * **Global Error Handler** (bộ xử lý lỗi toàn cục – centralized error processing)
 */
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // **Error Logging** (ghi log lỗi – record error details for debugging)
  logger.error('Unhandled error occurred', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    userId: req.user?.id
  });
  
  // **Custom Error Handling** (xử lý lỗi tùy chỉnh – handle known error types)
  if (error instanceof BaseError) {
    res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        ...(process.env.NODE_ENV === 'development' && { context: error.context })
      }
    });
    return;
  }
  
  // **Unknown Error Handling** (xử lý lỗi không xác định – fallback for unexpected errors)
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred'
    }
  });
}
```

## Input Validation

### **Input Sanitization** (làm sạch đầu vào – prevent injection attacks)
```typescript
/**
 * **Input Sanitization** (làm sạch đầu vào – prevent injection attacks)
 */
class InputValidator {
  /**
   * **Email Validation** (kiểm tra email – format và domain validation)
   */
  static validateEmail(email: string): boolean {
    // **Format Check** (kiểm tra định dạng – regex pattern matching)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return false;
    }
    
    // **Length Check** (kiểm tra độ dài – prevent buffer overflow)
    if (email.length > 254) {
      return false;
    }
    
    return true;
  }
}
```

## Framework Integration Commands

### **Code Review Checklist** (Danh sách kiểm tra code)

Use `/check-best-practices` command to verify:

1. **Documentation Standards** (tiêu chuẩn tài liệu – all functions have bilingual comments)
2. **Error Handling** (xử lý lỗi – proper error types và handling patterns)
3. **Naming Conventions** (quy ước đặt tên – consistent naming across codebase)
4. **Code Organization** (tổ chức code – proper file structure và imports)

### **Apply Thinking Pattern** (Áp dụng mẫu tư duy)

Use `/apply-thinking-to` command for:

- **Code Refactoring** (tái cấu trúc code – improve structure và readability)
- **Performance Optimization** (tối ưu hiệu suất – identify bottlenecks và improvements)
- **Documentation Updates** (cập nhật tài liệu – ensure docs match current implementation)

## Enforcement Strategies

### **Automated Tools Integration** (Tích hợp công cụ tự động)

1. **Linting Rules** (quy tắc linting – automated code style checking)
   - ESLint configurations for TypeScript/JavaScript
   - Rustfmt for Rust code formatting
   - Clang-format for C/C++ code formatting

2. **Pre-commit Hooks** (hook pre-commit – prevent bad code from being committed)
   - Format checking và auto-fixing
   - Documentation validation
   - Security scanning

3. **CI/CD Pipeline Checks** (kiểm tra CI/CD pipeline – automated quality gates)
   - Code coverage requirements
   - Security vulnerability scanning
   - Documentation completeness checks

### **Code Review Guidelines** (Hướng dẫn review code)

**Mandatory Review Points** (điểm review bắt buộc):

1. ✅ **Bilingual Documentation** (tài liệu song ngữ – all comments follow standard syntax)
2. ✅ **Error Handling** (xử lý lỗi – proper error types và propagation)
3. ✅ **Testing Coverage** (phạm vi kiểm thử – adequate unit và integration tests)

**Review Checklist** (danh sách kiểm tra review):

- [ ] **Function Documentation** (tài liệu hàm – complete bilingual docs)
- [ ] **Variable Naming** (đặt tên biến – clear và consistent naming)
- [ ] **Error Boundaries** (ranh giới lỗi – proper error handling scopes)
- [ ] **Resource Cleanup** (dọn dẹp tài nguyên – proper memory và connection management)
- [ ] **Test Coverage** (phạm vi test – critical paths covered by tests)

---

**Note**: This **Code Style Guide** (hướng dẫn phong cách code – comprehensive coding standards document) should be referenced for all development work and updated as new patterns và requirements emerge.

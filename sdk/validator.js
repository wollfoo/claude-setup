#!/usr/bin/env node
/**
 * Input Validation Module – Xác thực và làm sạch đầu vào người dùng
 * Module xác thực đầu vào – validates and sanitizes user input
 *
 * Chức năng (Functions):
 * - Kiểm tra độ dài input (length validation)
 * - Phát hiện SQL injection patterns
 * - Phát hiện command injection patterns
 * - Phát hiện path traversal attacks
 * - Làm sạch input (sanitization)
 *
 * Version: 1.0.0
 * Last Updated: 2025-01-15
 */

// ============================================================================
// INJECTION DETECTION PATTERNS (Mẫu phát hiện tấn công tiêm nhiễm)
// ============================================================================

/**
 * SQL Injection Patterns – Các mẫu tấn công SQL injection
 * Phát hiện các cú pháp SQL nguy hiểm trong input
 */
const SQL_INJECTION_PATTERNS = [
  /(\bUNION\b.*\bSELECT\b)/i,    // UNION SELECT attacks
  /(\bDROP\b.*\bTABLE\b)/i,      // DROP TABLE attacks
  /(\bINSERT\b.*\bINTO\b)/i,     // INSERT INTO attacks
  /(\bDELETE\b.*\bFROM\b)/i,     // DELETE FROM attacks
  /(\bUPDATE\b.*\bSET\b)/i,      // UPDATE SET attacks
  /--/,                           // SQL comments
  /\/\*/,                         // SQL block comments
  /xp_cmdshell/i,                 // SQL Server command execution
  /;\s*(?:DROP|DELETE|UPDATE|INSERT)/i, // Command chaining
];

/**
 * Command Injection Patterns – Các mẫu tấn công command injection
 * Phát hiện shell metacharacters và command substitution
 */
const COMMAND_INJECTION_PATTERNS = [
  /[;&|`$]/,                      // Shell metacharacters: ; & | ` $
  /\$\([^)]*\)/,                  // Command substitution: $(command)
  /`[^`]*`/,                      // Backtick command execution
  /\|\s*\w+/,                     // Pipe to command
  /&&\s*\w+/,                     // AND command chaining
  /\|\|\s*\w+/,                   // OR command chaining
];

/**
 * Path Traversal Patterns – Các mẫu tấn công path traversal
 * Phát hiện các cố gắng truy cập file/thư mục bất hợp pháp
 */
const PATH_TRAVERSAL_PATTERNS = [
  /\.\.\//,                       // Parent directory: ../
  /\.\.\\/,                       // Parent directory Windows: ..\
  /\0/,                           // Null byte injection
  /%2e%2e\//i,                    // URL encoded ../
  /%2e%2e%2f/i,                   // URL encoded ../
  /\.\.%2f/i,                     // Mixed encoding
];

/**
 * XSS (Cross-Site Scripting) Patterns – Các mẫu tấn công XSS
 * Phát hiện các thẻ HTML/JavaScript nguy hiểm
 */
const XSS_PATTERNS = [
  /<script[^>]*>.*?<\/script>/gi, // Script tags
  /on\w+\s*=\s*["'][^"']*["']/gi, // Event handlers: onclick=, onload=
  /javascript:/gi,                // JavaScript protocol
  /<iframe[^>]*>/gi,              // Iframe tags
  /<object[^>]*>/gi,              // Object tags
  /<embed[^>]*>/gi,               // Embed tags
];

// ============================================================================
// CONFIGURATION (Cấu hình)
// ============================================================================

const VALIDATION_CONFIG = {
  MAX_LENGTH: 100000,             // Độ dài tối đa 100KB
  MIN_LENGTH: 1,                  // Độ dài tối thiểu 1 ký tự
  ENABLE_SQL_CHECK: true,         // Bật kiểm tra SQL injection
  ENABLE_COMMAND_CHECK: true,     // Bật kiểm tra command injection
  ENABLE_PATH_CHECK: true,        // Bật kiểm tra path traversal
  ENABLE_XSS_CHECK: false,        // Tắt kiểm tra XSS (không cần cho prompts)
  STRICT_MODE: true,              // Chế độ nghiêm ngặt (reject on first match)
};

// ============================================================================
// VALIDATION FUNCTIONS (Các hàm xác thực)
// ============================================================================

/**
 * Validate Input Length – Kiểm tra độ dài input
 * @param {string} input - User input to validate
 * @returns {object} { valid: boolean, error?: string }
 */
function validateLength(input) {
  if (typeof input !== 'string') {
    return {
      valid: false,
      error: 'Input must be a string',
    };
  }

  if (input.length > VALIDATION_CONFIG.MAX_LENGTH) {
    return {
      valid: false,
      error: `Input too long (max ${VALIDATION_CONFIG.MAX_LENGTH} characters, got ${input.length})`,
    };
  }

  if (input.length < VALIDATION_CONFIG.MIN_LENGTH) {
    return {
      valid: false,
      error: `Input too short (min ${VALIDATION_CONFIG.MIN_LENGTH} character)`,
    };
  }

  return { valid: true };
}

/**
 * Check SQL Injection Patterns – Kiểm tra các mẫu SQL injection
 * @param {string} input - User input to check
 * @returns {object} { detected: boolean, pattern?: string }
 */
function checkSQLInjection(input) {
  if (!VALIDATION_CONFIG.ENABLE_SQL_CHECK) {
    return { detected: false };
  }

  for (const pattern of SQL_INJECTION_PATTERNS) {
    if (pattern.test(input)) {
      return {
        detected: true,
        pattern: pattern.toString(),
        type: 'sql_injection',
        severity: 'high',
      };
    }
  }

  return { detected: false };
}

/**
 * Check Command Injection Patterns – Kiểm tra các mẫu command injection
 * @param {string} input - User input to check
 * @returns {object} { detected: boolean, pattern?: string }
 */
function checkCommandInjection(input) {
  if (!VALIDATION_CONFIG.ENABLE_COMMAND_CHECK) {
    return { detected: false };
  }

  for (const pattern of COMMAND_INJECTION_PATTERNS) {
    if (pattern.test(input)) {
      return {
        detected: true,
        pattern: pattern.toString(),
        type: 'command_injection',
        severity: 'critical',
      };
    }
  }

  return { detected: false };
}

/**
 * Check Path Traversal Patterns – Kiểm tra các mẫu path traversal
 * @param {string} input - User input to check
 * @returns {object} { detected: boolean, pattern?: string }
 */
function checkPathTraversal(input) {
  if (!VALIDATION_CONFIG.ENABLE_PATH_CHECK) {
    return { detected: false };
  }

  for (const pattern of PATH_TRAVERSAL_PATTERNS) {
    if (pattern.test(input)) {
      return {
        detected: true,
        pattern: pattern.toString(),
        type: 'path_traversal',
        severity: 'high',
      };
    }
  }

  return { detected: false };
}

/**
 * Check XSS Patterns – Kiểm tra các mẫu XSS
 * @param {string} input - User input to check
 * @returns {object} { detected: boolean, pattern?: string }
 */
function checkXSS(input) {
  if (!VALIDATION_CONFIG.ENABLE_XSS_CHECK) {
    return { detected: false };
  }

  for (const pattern of XSS_PATTERNS) {
    if (pattern.test(input)) {
      return {
        detected: true,
        pattern: pattern.toString(),
        type: 'xss',
        severity: 'medium',
      };
    }
  }

  return { detected: false };
}

/**
 * Comprehensive Input Validation – Xác thực toàn diện input
 * Kiểm tra tất cả các loại tấn công injection
 *
 * @param {string} input - User input to validate
 * @returns {object} { valid: boolean, error?: string, threats?: array }
 */
function validateInput(input) {
  // 1. Validate length (Kiểm tra độ dài)
  const lengthCheck = validateLength(input);
  if (!lengthCheck.valid) {
    return lengthCheck;
  }

  // 2. Collect all threats (Thu thập tất cả các mối đe dọa)
  const threats = [];

  // Check SQL injection
  const sqlCheck = checkSQLInjection(input);
  if (sqlCheck.detected) {
    threats.push(sqlCheck);
  }

  // Check command injection
  const commandCheck = checkCommandInjection(input);
  if (commandCheck.detected) {
    threats.push(commandCheck);
  }

  // Check path traversal
  const pathCheck = checkPathTraversal(input);
  if (pathCheck.detected) {
    threats.push(pathCheck);
  }

  // Check XSS
  const xssCheck = checkXSS(input);
  if (xssCheck.detected) {
    threats.push(xssCheck);
  }

  // 3. Return result (Trả về kết quả)
  if (threats.length > 0) {
    const threatReport = threats.map(t =>
      `  - ${t.type}: ${t.pattern} [${t.severity}]`
    ).join('\n');

    return {
      valid: false,
      error: `Security threats detected:\n${threatReport}`,
      threats: threats,
    };
  }

  return { valid: true };
}

// ============================================================================
// SANITIZATION FUNCTIONS (Các hàm làm sạch)
// ============================================================================

/**
 * Remove Null Bytes – Loại bỏ null bytes
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
function removeNullBytes(input) {
  return input.replace(/\0/g, '');
}

/**
 * Normalize Whitespace – Chuẩn hóa khoảng trắng
 * Thay thế nhiều khoảng trắng liên tiếp bằng một khoảng trắng
 *
 * @param {string} input - Input to normalize
 * @returns {string} Normalized input
 */
function normalizeWhitespace(input) {
  return input.replace(/\s+/g, ' ').trim();
}

/**
 * Remove Control Characters – Loại bỏ ký tự điều khiển
 * Loại bỏ các ký tự không in được (ngoại trừ newline và tab)
 *
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
function removeControlCharacters(input) {
  // Keep \n (newline) and \t (tab), remove other control chars
  return input.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');
}

/**
 * Escape HTML Special Characters – Escape các ký tự đặc biệt HTML
 * @param {string} input - Input to escape
 * @returns {string} Escaped input
 */
function escapeHTML(input) {
  const htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return input.replace(/[&<>"'\/]/g, char => htmlEscapes[char]);
}

/**
 * Comprehensive Input Sanitization – Làm sạch toàn diện input
 * Áp dụng tất cả các bước sanitization
 *
 * @param {string} input - Input to sanitize
 * @param {object} options - Sanitization options
 * @returns {string} Sanitized input
 */
function sanitizeInput(input, options = {}) {
  const {
    removeNulls = true,
    normalizeSpaces = true,
    removeControls = true,
    escapeHtml = false, // Không escape HTML cho prompts
  } = options;

  let sanitized = input;

  // 1. Remove null bytes (Loại bỏ null bytes)
  if (removeNulls) {
    sanitized = removeNullBytes(sanitized);
  }

  // 2. Remove control characters (Loại bỏ ký tự điều khiển)
  if (removeControls) {
    sanitized = removeControlCharacters(sanitized);
  }

  // 3. Normalize whitespace (Chuẩn hóa khoảng trắng)
  if (normalizeSpaces) {
    sanitized = normalizeWhitespace(sanitized);
  }

  // 4. Escape HTML (optional) (Escape HTML - tùy chọn)
  if (escapeHtml) {
    sanitized = escapeHTML(sanitized);
  }

  return sanitized;
}

// ============================================================================
// UTILITY FUNCTIONS (Các hàm tiện ích)
// ============================================================================

/**
 * Is Safe String – Kiểm tra chuỗi an toàn
 * Kiểm tra nhanh xem chuỗi có chứa ký tự nguy hiểm không
 *
 * @param {string} input - String to check
 * @returns {boolean} True if safe
 */
function isSafeString(input) {
  const result = validateInput(input);
  return result.valid;
}

/**
 * Get Validation Config – Lấy cấu hình validation hiện tại
 * @returns {object} Current validation configuration
 */
function getConfig() {
  return { ...VALIDATION_CONFIG };
}

/**
 * Update Validation Config – Cập nhật cấu hình validation
 * @param {object} updates - Config updates to apply
 */
function updateConfig(updates) {
  Object.assign(VALIDATION_CONFIG, updates);
}

// ============================================================================
// EXPORTS (Xuất module)
// ============================================================================

module.exports = {
  // Constants (Hằng số)
  SQL_INJECTION_PATTERNS,
  COMMAND_INJECTION_PATTERNS,
  PATH_TRAVERSAL_PATTERNS,
  XSS_PATTERNS,

  // Validation functions (Các hàm xác thực)
  validateLength,
  checkSQLInjection,
  checkCommandInjection,
  checkPathTraversal,
  checkXSS,
  validateInput,

  // Sanitization functions (Các hàm làm sạch)
  removeNullBytes,
  normalizeWhitespace,
  removeControlCharacters,
  escapeHTML,
  sanitizeInput,

  // Utility functions (Các hàm tiện ích)
  isSafeString,
  getConfig,
  updateConfig,
};

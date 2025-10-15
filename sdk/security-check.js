#!/usr/bin/env node
/**
 * Security Check Module – Phát hiện và xác thực bảo mật
 * Module kiểm tra bảo mật – detects secrets and validates security
 *
 * Chức năng (Functions):
 * - Phát hiện API keys (OpenAI, Anthropic, GitHub, AWS, Stripe)
 * - Phát hiện credentials (passwords, tokens, secrets)
 * - Phát hiện specific patterns (JWT, private keys, connection strings)
 * - Logging security events
 * - Secret masking for logs
 *
 * Version: 1.0.0
 * Last Updated: 2025-01-15
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// SECRET PATTERNS (Các mẫu bí mật)
// ============================================================================

/**
 * API Key Patterns – Các mẫu API keys
 * Phát hiện các loại API key phổ biến
 */
const API_KEY_PATTERNS = {
  openai: {
    pattern: /sk-[a-zA-Z0-9]{32,}/g,
    description: 'OpenAI API Key',
    severity: 'critical',
    example: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  },
  anthropic: {
    pattern: /sk-ant-[a-zA-Z0-9-]{95}/g,
    description: 'Anthropic API Key',
    severity: 'critical',
    example: 'sk-ant-xxx...xxx',
  },
  github: {
    pattern: /ghp_[a-zA-Z0-9]{36}/g,
    description: 'GitHub Personal Access Token',
    severity: 'critical',
    example: 'ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  },
  github_oauth: {
    pattern: /gho_[a-zA-Z0-9]{36}/g,
    description: 'GitHub OAuth Token',
    severity: 'critical',
    example: 'gho_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  },
  aws: {
    pattern: /AKIA[0-9A-Z]{16}/g,
    description: 'AWS Access Key ID',
    severity: 'critical',
    example: 'AKIAIOSFODNN7EXAMPLE',
  },
  aws_secret: {
    pattern: /aws_secret_access_key\s*=\s*[a-zA-Z0-9+\/]{40}/gi,
    description: 'AWS Secret Access Key',
    severity: 'critical',
    example: 'aws_secret_access_key = wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
  },
  stripe: {
    pattern: /sk_(live|test)_[a-zA-Z0-9]{24,}/g,
    description: 'Stripe API Key',
    severity: 'critical',
    example: 'sk_live_xxxxxxxxxxxxxxxxxxxx',
  },
  google_api: {
    pattern: /AIza[0-9A-Za-z_-]{35}/g,
    description: 'Google API Key',
    severity: 'critical',
    example: 'AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  },
  slack: {
    pattern: /xox[baprs]-[0-9a-zA-Z]{10,48}/g,
    description: 'Slack Token',
    severity: 'high',
    example: 'xoxb-xxxxxxxxxxxx-xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxx',
  },
};

/**
 * Credential Patterns – Các mẫu thông tin xác thực
 * Phát hiện passwords, tokens, secrets trong text
 */
const CREDENTIAL_PATTERNS = {
  password: {
    pattern: /password[\s:=]+["']?[^\s"']{8,}["']?/gi,
    description: 'Password in plain text',
    severity: 'high',
    example: 'password: mypassword123',
  },
  token: {
    pattern: /token[\s:=]+["']?[^\s"']{20,}["']?/gi,
    description: 'Authentication token',
    severity: 'high',
    example: 'token: abc123xyz789...',
  },
  secret: {
    pattern: /secret[\s:=]+["']?[^\s"']{20,}["']?/gi,
    description: 'Secret key or value',
    severity: 'high',
    example: 'secret: mysecretvalue123',
  },
  api_key: {
    pattern: /api[_-]?key[\s:=]+["']?[^\s"']{20,}["']?/gi,
    description: 'Generic API key',
    severity: 'high',
    example: 'api_key: xxxxxxxxxxxxxxxx',
  },
  bearer_token: {
    pattern: /bearer\s+[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/gi,
    description: 'Bearer token (JWT)',
    severity: 'high',
    example: 'Bearer eyJhbGciOi...',
  },
};

/**
 * Specific Secret Patterns – Các mẫu bí mật cụ thể
 * Phát hiện JWT, private keys, connection strings
 */
const SPECIFIC_SECRET_PATTERNS = {
  jwt: {
    pattern: /eyJ[a-zA-Z0-9_-]+\.eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g,
    description: 'JSON Web Token (JWT)',
    severity: 'high',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOi...',
  },
  private_key_rsa: {
    pattern: /-----BEGIN RSA PRIVATE KEY-----/g,
    description: 'RSA Private Key',
    severity: 'critical',
    example: '-----BEGIN RSA PRIVATE KEY-----',
  },
  private_key_ec: {
    pattern: /-----BEGIN EC PRIVATE KEY-----/g,
    description: 'EC Private Key',
    severity: 'critical',
    example: '-----BEGIN EC PRIVATE KEY-----',
  },
  private_key_generic: {
    pattern: /-----BEGIN PRIVATE KEY-----/g,
    description: 'Private Key (Generic)',
    severity: 'critical',
    example: '-----BEGIN PRIVATE KEY-----',
  },
  mongodb: {
    pattern: /mongodb(\+srv)?:\/\/[^\s]+/gi,
    description: 'MongoDB Connection String',
    severity: 'critical',
    example: 'mongodb://username:password@host:port/database',
  },
  mysql: {
    pattern: /mysql:\/\/[^\s]+/gi,
    description: 'MySQL Connection String',
    severity: 'critical',
    example: 'mysql://user:pass@localhost:3306/dbname',
  },
  postgres: {
    pattern: /postgres(ql)?:\/\/[^\s]+/gi,
    description: 'PostgreSQL Connection String',
    severity: 'critical',
    example: 'postgresql://user:pass@localhost:5432/dbname',
  },
  redis: {
    pattern: /redis:\/\/[^\s]+/gi,
    description: 'Redis Connection String',
    severity: 'high',
    example: 'redis://user:pass@localhost:6379',
  },
};

// ============================================================================
// CONFIGURATION (Cấu hình)
// ============================================================================

const SECURITY_CONFIG = {
  ENABLE_API_KEY_CHECK: true,
  ENABLE_CREDENTIAL_CHECK: true,
  ENABLE_SPECIFIC_CHECK: true,
  LOG_TO_FILE: true,
  LOG_FILE: '.security-check.log',
  MASK_SECRETS_IN_LOG: true,
  ALERT_ON_CRITICAL: true,
};

// ============================================================================
// DETECTION FUNCTIONS (Các hàm phát hiện)
// ============================================================================

/**
 * Check API Keys – Kiểm tra API keys
 * @param {string} text - Text to check
 * @returns {array} Array of detected secrets
 */
function checkAPIKeys(text) {
  if (!SECURITY_CONFIG.ENABLE_API_KEY_CHECK) {
    return [];
  }

  const findings = [];

  for (const [name, config] of Object.entries(API_KEY_PATTERNS)) {
    const matches = text.match(config.pattern);
    if (matches) {
      findings.push({
        type: 'api_key',
        name: name,
        description: config.description,
        severity: config.severity,
        count: matches.length,
        matches: matches,
        pattern: config.pattern.toString(),
      });
    }
  }

  return findings;
}

/**
 * Check Credentials – Kiểm tra credentials
 * @param {string} text - Text to check
 * @returns {array} Array of detected secrets
 */
function checkCredentials(text) {
  if (!SECURITY_CONFIG.ENABLE_CREDENTIAL_CHECK) {
    return [];
  }

  const findings = [];

  for (const [name, config] of Object.entries(CREDENTIAL_PATTERNS)) {
    const matches = text.match(config.pattern);
    if (matches) {
      findings.push({
        type: 'credential',
        name: name,
        description: config.description,
        severity: config.severity,
        count: matches.length,
        matches: matches,
        pattern: config.pattern.toString(),
      });
    }
  }

  return findings;
}

/**
 * Check Specific Secrets – Kiểm tra các bí mật cụ thể
 * @param {string} text - Text to check
 * @returns {array} Array of detected secrets
 */
function checkSpecificSecrets(text) {
  if (!SECURITY_CONFIG.ENABLE_SPECIFIC_CHECK) {
    return [];
  }

  const findings = [];

  for (const [name, config] of Object.entries(SPECIFIC_SECRET_PATTERNS)) {
    const matches = text.match(config.pattern);
    if (matches) {
      findings.push({
        type: 'specific_secret',
        name: name,
        description: config.description,
        severity: config.severity,
        count: matches.length,
        matches: matches,
        pattern: config.pattern.toString(),
      });
    }
  }

  return findings;
}

/**
 * Detect All Secrets – Phát hiện tất cả bí mật
 * Comprehensive secret detection
 *
 * @param {string} text - Text to scan
 * @returns {object} { detected: boolean, findings: array, summary: object }
 */
function detectSecrets(text) {
  const findings = [];

  // 1. Check API keys
  const apiKeyFindings = checkAPIKeys(text);
  findings.push(...apiKeyFindings);

  // 2. Check credentials
  const credentialFindings = checkCredentials(text);
  findings.push(...credentialFindings);

  // 3. Check specific secrets
  const specificFindings = checkSpecificSecrets(text);
  findings.push(...specificFindings);

  // 4. Generate summary
  const summary = {
    total_findings: findings.length,
    critical_count: findings.filter(f => f.severity === 'critical').length,
    high_count: findings.filter(f => f.severity === 'high').length,
    medium_count: findings.filter(f => f.severity === 'medium').length,
    types: [...new Set(findings.map(f => f.type))],
  };

  return {
    detected: findings.length > 0,
    findings: findings,
    summary: summary,
  };
}

/**
 * Validate Security – Xác thực bảo mật
 * Main security validation function
 *
 * @param {string} text - Text to validate
 * @returns {object} { valid: boolean, error?: string, report?: object }
 */
function validateSecurity(text) {
  const result = detectSecrets(text);

  if (result.detected) {
    // Log security event
    logSecurityEvent('Secret detected', result);

    // Generate report
    const report = generateReport(result);

    return {
      valid: false,
      error: `⚠️ SECURITY VIOLATION\n\n${report}`,
      details: result,
    };
  }

  return { valid: true };
}

// ============================================================================
// UTILITY FUNCTIONS (Các hàm tiện ích)
// ============================================================================

/**
 * Mask Secret – Che giấu bí mật
 * Replace secret with masked version for safe logging
 *
 * @param {string} secret - Secret to mask
 * @returns {string} Masked version
 */
function maskSecret(secret) {
  if (!secret || secret.length < 8) {
    return '***';
  }

  const visibleChars = 4;
  const prefix = secret.substring(0, visibleChars);
  const suffix = secret.substring(secret.length - visibleChars);
  const maskedMiddle = '*'.repeat(Math.min(secret.length - visibleChars * 2, 20));

  return `${prefix}${maskedMiddle}${suffix}`;
}

/**
 * Generate Report – Tạo báo cáo
 * Generate human-readable security report
 *
 * @param {object} result - Detection result
 * @returns {string} Formatted report
 */
function generateReport(result) {
  const lines = ['Detected sensitive data:'];

  if (result.summary.critical_count > 0) {
    lines.push(`\n🔴 CRITICAL: ${result.summary.critical_count} finding(s)`);
  }

  if (result.summary.high_count > 0) {
    lines.push(`🟡 HIGH: ${result.summary.high_count} finding(s)`);
  }

  if (result.summary.medium_count > 0) {
    lines.push(`🟢 MEDIUM: ${result.summary.medium_count} finding(s)`);
  }

  lines.push('\nDetails:');

  for (const finding of result.findings) {
    const maskedSamples = SECURITY_CONFIG.MASK_SECRETS_IN_LOG
      ? finding.matches.slice(0, 2).map(maskSecret)
      : ['[masked]'];

    lines.push(
      `  - ${finding.description} (${finding.name})`,
      `    Count: ${finding.count}`,
      `    Severity: ${finding.severity}`,
      `    Sample: ${maskedSamples.join(', ')}`
    );
  }

  lines.push('\nPlease remove all secrets and try again.');

  return lines.join('\n');
}

/**
 * Log Security Event – Ghi log sự kiện bảo mật
 * @param {string} message - Log message
 * @param {object} details - Event details
 */
function logSecurityEvent(message, details) {
  if (!SECURITY_CONFIG.LOG_TO_FILE) {
    return;
  }

  try {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp: timestamp,
      message: message,
      summary: details.summary || {},
      findings_count: details.findings?.length || 0,
    };

    const logLine = `[${timestamp}] ${message}: ${JSON.stringify(logEntry)}\n`;

    fs.appendFileSync(SECURITY_CONFIG.LOG_FILE, logLine);
  } catch (err) {
    // Fail silently - không chặn execution
    console.error('[security-check] Failed to write log:', err.message);
  }
}

/**
 * Is Safe Text – Kiểm tra text an toàn
 * Quick check if text contains secrets
 *
 * @param {string} text - Text to check
 * @returns {boolean} True if safe (no secrets)
 */
function isSafeText(text) {
  const result = detectSecrets(text);
  return !result.detected;
}

/**
 * Get Security Config – Lấy cấu hình bảo mật
 * @returns {object} Current security configuration
 */
function getConfig() {
  return { ...SECURITY_CONFIG };
}

/**
 * Update Security Config – Cập nhật cấu hình bảo mật
 * @param {object} updates - Config updates
 */
function updateConfig(updates) {
  Object.assign(SECURITY_CONFIG, updates);
}

/**
 * Get All Patterns – Lấy tất cả patterns
 * @returns {object} All detection patterns
 */
function getAllPatterns() {
  return {
    api_keys: API_KEY_PATTERNS,
    credentials: CREDENTIAL_PATTERNS,
    specific_secrets: SPECIFIC_SECRET_PATTERNS,
  };
}

// ============================================================================
// EXPORTS (Xuất module)
// ============================================================================

module.exports = {
  // Pattern constants (Các hằng số pattern)
  API_KEY_PATTERNS,
  CREDENTIAL_PATTERNS,
  SPECIFIC_SECRET_PATTERNS,

  // Detection functions (Các hàm phát hiện)
  checkAPIKeys,
  checkCredentials,
  checkSpecificSecrets,
  detectSecrets,
  validateSecurity,

  // Utility functions (Các hàm tiện ích)
  maskSecret,
  generateReport,
  logSecurityEvent,
  isSafeText,
  getConfig,
  updateConfig,
  getAllPatterns,
};

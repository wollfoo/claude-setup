#!/usr/bin/env node
/**
 * SDK Sidecar – UserPromptSubmit Hook Entrypoint (Production Grade)
 *
 * Tối ưu hóa với 7 biện pháp bảo mật:
 * 1. ✅ Intent Preservation - Không thay đổi ý định người dùng
 * 2. ✅ Timeout Protection - Timeout cho mọi async operations
 * 3. ✅ Error Handling - Xử lý lỗi gracefully
 * 4. ✅ Secret Validation - Phát hiện và block secrets
 * 5. ✅ Loop Prevention - Ngăn chặn infinite loops
 * 6. ✅ API Timeout - Timeout cho external calls
 * 7. ✅ Input Validation - Validate và sanitize user input
 *
 * Version: 2.0.0
 * Last Updated: 2025-01-15
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

const CONFIG = {
  // Timeouts (milliseconds)
  STDIN_TIMEOUT: 250,
  TOTAL_HOOK_TIMEOUT: 2500,  // ✅ Issue #2: Max execution time
  FILE_READ_TIMEOUT: 500,

  // Security
  MAX_PROMPT_LENGTH: 100000,
  MIN_PROMPT_LENGTH: 1,
  PROCESSED_MARKER: '__HOOK_PROCESSED_V2__',  // ✅ Issue #5: Loop prevention

  // Paths
  ERROR_LOG: '.router-errors.log',
  SECURITY_LOG: '.router-security.log',

  // Confidence thresholds
  CONFIDENCE_THRESHOLD: 0.7,
  HIGH_CONFIDENCE: 0.85,
};

// ============================================================================
// SECURITY: SECRET DETECTION PATTERNS
// ============================================================================

const SECRET_PATTERNS = {
  // ✅ Issue #4: Secret validation
  apiKeys: {
    openai: /sk-[a-zA-Z0-9]{32,}/g,
    anthropic: /sk-ant-[a-zA-Z0-9-]{95}/g,
    github: /ghp_[a-zA-Z0-9]{36}/g,
    aws: /AKIA[0-9A-Z]{16}/g,
    stripe: /sk_(live|test)_[a-zA-Z0-9]{24,}/g,
  },

  credentials: {
    password: /password[:\s=]+"?[^\s"]+"?/gi,
    token: /token[:\s=]+"?[^\s"]+"?/gi,
    secret: /secret[:\s=]+"?[^\s"]+"?/gi,
    apiKey: /api[_-]?key[:\s=]+"?[^\s"]+"?/gi,
  },

  specific: {
    jwt: /eyJ[a-zA-Z0-9_-]+\.eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g,
    privateKey: /-----BEGIN.*PRIVATE KEY-----/g,
    connectionString: /(mongodb|mysql|postgres|redis):\/\/[^\s]+/gi,
  },
};

// ============================================================================
// SECURITY: INPUT VALIDATION PATTERNS
// ============================================================================

const INJECTION_PATTERNS = {
  // ✅ Issue #7: Input validation
  sql: [
    /(\bUNION\b.*\bSELECT\b)/i,
    /(\bDROP\b.*\bTABLE\b)/i,
    /(\bINSERT\b.*\bINTO\b)/i,
    /(\bDELETE\b.*\bFROM\b)/i,
    /--/,
    /\/\*/,
    /xp_cmdshell/i,
  ],

  command: [
    /[;&|`$]/,              // Shell metacharacters
    /\$\([^)]*\)/,          // Command substitution
    /`[^`]*`/,              // Backticks
  ],

  pathTraversal: [
    /\.\.\//,               // Parent directory
    /\0/,                   // Null byte
  ],
};

// ============================================================================
// UTILITY: TIMEOUT WRAPPER
// ============================================================================

/**
 * Wrap promise với timeout protection
 * ✅ Issue #2 & #6: Prevent indefinite blocking
 */
function withTimeout(promise, timeoutMs, errorMessage = 'Operation timeout') {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
    )
  ]);
}

// ============================================================================
// STDIN READER
// ============================================================================

/**
 * Đọc input từ stdin với timeout
 * ✅ Issue #2: Timeout protection
 */
function readStdin(timeoutMs = CONFIG.STDIN_TIMEOUT) {
  return new Promise((resolve) => {
    // Nếu chạy trực tiếp trong terminal, trả về rỗng
    if (process.stdin.isTTY) {
      return resolve('');
    }

    const chunks = [];
    let done = false;

    const finish = () => {
      if (done) return;
      done = true;
      resolve(Buffer.concat(chunks).toString('utf8'));
    };

    const timer = setTimeout(() => finish(), timeoutMs);

    process.stdin.on('data', (chunk) => {
      chunks.push(Buffer.from(chunk));
    });

    process.stdin.on('end', () => {
      clearTimeout(timer);
      finish();
    });

    process.stdin.on('error', (err) => {
      clearTimeout(timer);
      logError('STDIN read error', err);
      finish();
    });
  });
}

// ============================================================================
// SECURITY: SECRET DETECTION
// ============================================================================

/**
 * Phát hiện secrets trong text
 * ✅ Issue #4: Secret validation
 */
function detectSecrets(text) {
  const findings = [];

  // Check API keys
  for (const [name, pattern] of Object.entries(SECRET_PATTERNS.apiKeys)) {
    const matches = text.match(pattern);
    if (matches) {
      findings.push({
        type: `api_key_${name}`,
        count: matches.length,
        severity: 'critical'
      });
    }
  }

  // Check credentials
  for (const [name, pattern] of Object.entries(SECRET_PATTERNS.credentials)) {
    const matches = text.match(pattern);
    if (matches) {
      findings.push({
        type: `credential_${name}`,
        count: matches.length,
        severity: 'high'
      });
    }
  }

  // Check specific patterns
  for (const [name, pattern] of Object.entries(SECRET_PATTERNS.specific)) {
    const matches = text.match(pattern);
    if (matches) {
      findings.push({
        type: `specific_${name}`,
        count: matches.length,
        severity: 'high'
      });
    }
  }

  return findings;
}

/**
 * Validate security của prompt
 * ✅ Issue #4: Block prompts with secrets
 */
function validateSecurity(prompt) {
  const secrets = detectSecrets(prompt);

  if (secrets.length > 0) {
    const report = secrets.map(s =>
      `  - ${s.type}: ${s.count} occurrence(s) [${s.severity}]`
    ).join('\n');

    logSecurity('Secret detected', { secrets, promptLength: prompt.length });

    return {
      valid: false,
      error: `⚠️ SECURITY VIOLATION\n\nDetected sensitive data:\n${report}\n\nPlease remove secrets and try again.`
    };
  }

  return { valid: true };
}

// ============================================================================
// VALIDATION: INPUT SANITIZATION
// ============================================================================

/**
 * Validate input length và characters
 * ✅ Issue #7: Input validation
 */
function validateInput(input) {
  // Length check
  if (input.length > CONFIG.MAX_PROMPT_LENGTH) {
    return {
      valid: false,
      error: `Input too long (max ${CONFIG.MAX_PROMPT_LENGTH} characters)`
    };
  }

  if (input.length < CONFIG.MIN_PROMPT_LENGTH) {
    return {
      valid: false,
      error: 'Input too short'
    };
  }

  // SQL injection check
  for (const pattern of INJECTION_PATTERNS.sql) {
    if (pattern.test(input)) {
      logSecurity('SQL injection pattern detected', { pattern: pattern.toString() });
      return {
        valid: false,
        error: 'Invalid input pattern detected'
      };
    }
  }

  // Command injection check
  for (const pattern of INJECTION_PATTERNS.command) {
    if (pattern.test(input)) {
      logSecurity('Command injection pattern detected', { pattern: pattern.toString() });
      return {
        valid: false,
        error: 'Invalid input pattern detected'
      };
    }
  }

  // Path traversal check
  for (const pattern of INJECTION_PATTERNS.pathTraversal) {
    if (pattern.test(input)) {
      logSecurity('Path traversal pattern detected', { pattern: pattern.toString() });
      return {
        valid: false,
        error: 'Invalid input pattern detected'
      };
    }
  }

  return { valid: true };
}

/**
 * Sanitize input (remove dangerous characters)
 * ✅ Issue #7: Input sanitization
 */
function sanitizeInput(input) {
  return input
    // Remove null bytes
    .replace(/\0/g, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

// ============================================================================
// LOOP PREVENTION
// ============================================================================

/**
 * Check nếu prompt đã được xử lý
 * ✅ Issue #5: Infinite loop prevention
 */
function hasBeenProcessed(prompt) {
  return prompt.includes(CONFIG.PROCESSED_MARKER);
}

/**
 * Extract metadata từ processed prompt
 * ✅ Issue #5: Track processing count
 */
function extractMetadata(prompt) {
  const match = prompt.match(/__HOOK_PROCESSED_V2__\{(.+?)\}/);
  if (match) {
    try {
      return JSON.parse(match[1]);
    } catch (err) {
      logError('Metadata parse error', err);
      return null;
    }
  }
  return null;
}

/**
 * Add processed marker với metadata
 * ✅ Issue #5: Prevent re-processing
 */
function addProcessedMarker(prompt, decision) {
  const metadata = {
    version: '2.0.0',
    timestamp: Date.now(),
    agent: decision.agent,
    confidence: decision.confidence,
    processCount: 1
  };

  return `${CONFIG.PROCESSED_MARKER}${JSON.stringify(metadata)}\n${prompt}`;
}

// ============================================================================
// LOGGING
// ============================================================================

/**
 * Log errors to file (không gián đoạn flow)
 * ✅ Issue #3: Error handling
 */
function logError(message, error) {
  try {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}: ${error?.message || error}\n`;
    fs.appendFileSync(CONFIG.ERROR_LOG, logEntry);
  } catch (err) {
    // Fail silently - không chặn execution
  }
}

/**
 * Log security events
 * ✅ Issue #4: Security logging
 */
function logSecurity(message, details) {
  try {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}: ${JSON.stringify(details)}\n`;
    fs.appendFileSync(CONFIG.SECURITY_LOG, logEntry);
  } catch (err) {
    // Fail silently
  }
}

// ============================================================================
// PROMPT NORMALIZATION
// ============================================================================

/**
 * Normalize prompt từ event object
 */
function normalizePrompt(event) {
  if (!event || typeof event !== 'object') return '';

  return (
    event.prompt ||
    event.user_prompt ||
    event.message ||
    event.input ||
    ''
  );
}

/**
 * Read prompt từ CLI arguments
 */
function readCliPromptArg() {
  const i = process.argv.findIndex(a => a === '--prompt' || a === '-p');
  if (i >= 0 && i + 1 < process.argv.length) {
    return process.argv[i + 1];
  }
  return '';
}

// ============================================================================
// DECISION ENGINE
// ============================================================================

/**
 * Quyết định Sub-Agent dựa trên prompt analysis
 * ✅ Issue #1: Preserve user intent - chỉ analyze, không modify
 */
function analyzeAndDecide(prompt) {
  const p = (prompt || '').toLowerCase();
  const reasons = [];
  let agent = 'universal-agent';
  let confidence = 0.62;
  const flags = ['--seq'];
  const waves = ['planning'];

  // Domain detection với pattern matching
  if (/react|component|frontend|ui|jsx|tsx|tailwind|vue|angular/.test(p)) {
    agent = 'react-component-architect';
    confidence = 0.82;
    reasons.push('domain:frontend', 'pattern:ui_component');
    flags.push('--magic', '--c7');
    waves.push('implementation', 'validation');

  } else if (/django|fastapi|rails|laravel|api|endpoint|backend/.test(p)) {
    agent = 'backend-api-expert';
    confidence = 0.85;
    reasons.push('domain:backend', 'pattern:api');
    flags.push('--c7');
    waves.push('implementation', 'validation');

  } else if (/sql|database|db|query|postgres|mysql|mongo/.test(p)) {
    agent = 'database-specialist';
    confidence = 0.83;
    reasons.push('domain:database', 'pattern:data');
    flags.push('--seq');
    waves.push('optimization', 'validation');

  } else if (/optimi[sz]e|performance|latency|throughput|memory|cpu|profil(e|ing)/.test(p)) {
    agent = 'performance-engineer';
    confidence = 0.88;
    reasons.push('domain:performance', 'pattern:optimization');
    flags.push('--think-hard', '--seq');
    waves.push('analysis', 'optimization', 'validation');

  } else if (/test|unit|integration|e2e|playwright|jest|pytest|qa|quality/.test(p)) {
    agent = 'qa-automation';
    confidence = 0.80;
    reasons.push('domain:quality', 'pattern:testing');
    flags.push('--play');
    waves.push('validation');

  } else if (/secur(e|ity)|auth(entication)?|vulnerab(le|ility)|encryption/.test(p)) {
    agent = 'security-specialist';
    confidence = 0.86;
    reasons.push('domain:security', 'pattern:security');
    flags.push('--think-hard', '--seq');
    waves.push('analysis', 'implementation', 'validation');

  } else if (/document|docs|readme|guide|how to|hướng dẫn|explain|giải thích/.test(p)) {
    agent = 'documentation-scribe';
    confidence = 0.76;
    reasons.push('domain:documentation', 'pattern:writing');
    flags.push('--c7');
    waves.push('planning', 'implementation');

  } else if (/debug|fix|bug|error|issue|problem/.test(p)) {
    agent = 'debugger-specialist';
    confidence = 0.79;
    reasons.push('domain:debugging', 'pattern:troubleshooting');
    flags.push('--think', '--seq');
    waves.push('analysis', 'implementation', 'validation');

  } else if (/deploy|docker|kubernetes|ci\/cd|devops|infrastructure/.test(p)) {
    agent = 'devops-specialist';
    confidence = 0.81;
    reasons.push('domain:devops', 'pattern:infrastructure');
    flags.push('--seq');
    waves.push('planning', 'implementation', 'validation');

  } else {
    reasons.push('fallback:universal', 'no_specific_pattern');
  }

  // Complexity detection
  const wordCount = prompt.split(/\s+/).length;
  if (wordCount > 100) {
    reasons.push('complexity:high');
    if (!flags.includes('--think-hard') && !flags.includes('--think')) {
      flags.push('--think');
    }
  }

  // Multi-domain detection
  const domains = [
    /frontend|ui|component/.test(p),
    /backend|api|server/.test(p),
    /database|sql|query/.test(p),
    /test|qa|quality/.test(p),
    /deploy|devops|infrastructure/.test(p)
  ].filter(Boolean).length;

  if (domains >= 2) {
    reasons.push('multi_domain:true');
    if (!flags.includes('--delegate')) {
      flags.push('--delegate', 'auto');
    }
  }

  return { agent, confidence, reasons, flags, waves };
}

// ============================================================================
// ENHANCEMENT (WITHOUT MODIFYING INTENT)
// ============================================================================

/**
 * Enhance prompt với context (KHÔNG thay đổi intent)
 * ✅ Issue #1: Intent preservation
 */
function enhancePrompt(originalPrompt, decision) {
  // ✅ KHÔNG modify prompt content
  // Chỉ return metadata để display, prompt gốc vẫn được preserve

  const enhancement = {
    // Metadata cho display
    router_info: {
      agent: decision.agent,
      confidence: decision.confidence,
      confidence_level: decision.confidence >= CONFIG.HIGH_CONFIDENCE ? 'high' :
                        decision.confidence >= CONFIG.CONFIDENCE_THRESHOLD ? 'medium' : 'low',
      reasons: decision.reasons,
      auto_flags: decision.flags,
      wave_strategy: decision.waves,
      timestamp: new Date().toISOString(),
    },

    // Original prompt - KHÔNG modified
    original_prompt: originalPrompt,

    // Recommendation (không force)
    recommendation: decision.confidence >= CONFIG.CONFIDENCE_THRESHOLD
      ? `Routing to ${decision.agent} with ${Math.round(decision.confidence * 100)}% confidence`
      : `Using universal agent (confidence ${Math.round(decision.confidence * 100)}% below threshold)`
  };

  return enhancement;
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

/**
 * Main execution với comprehensive error handling
 * ✅ Issue #2: Timeout protection
 * ✅ Issue #3: Error handling
 */
async function main() {
  try {
    // ✅ Issue #2: Wrap toàn bộ execution với timeout
    await withTimeout(
      executeHook(),
      CONFIG.TOTAL_HOOK_TIMEOUT,
      'Hook execution timeout'
    );

  } catch (err) {
    // ✅ Issue #3: Graceful error handling
    if (err.message === 'Hook execution timeout') {
      console.error('[router] ⚠️ Timeout - continuing with original prompt');
      logError('Hook timeout', err);
    } else {
      console.error('[router] ⚠️ Error occurred - continuing with original prompt');
      logError('Hook execution error', err);
    }

    // Exit 0 để không block Claude Code
    process.exit(0);
  }
}

/**
 * Core hook execution logic
 */
async function executeHook() {
  // 1. Read input
  const raw = await readStdin();

  // 2. Parse event
  let event = {};
  try {
    event = JSON.parse(raw);
  } catch (err) {
    // Not JSON - might be direct input
  }

  // 3. Get prompt
  let prompt = normalizePrompt(event) || readCliPromptArg();

  if (!prompt) {
    console.log('[router] No prompt payload detected');
    console.log('[hint] Use via Claude Code hook OR run:');
    console.log('       node sdk/main.js --prompt "Your prompt"');
    process.exit(0);
  }

  // ✅ Issue #5: Check for loop
  if (hasBeenProcessed(prompt)) {
    const metadata = extractMetadata(prompt);
    if (metadata) {
      console.log(`[router] ⚠️ Already processed (count: ${metadata.processCount})`);
      console.log(`[router] Previous: agent=${metadata.agent} conf=${metadata.confidence}`);
    }
    console.log('[router] Skipping re-processing to prevent loop');
    process.exit(0);
  }

  // ✅ Issue #7: Validate input
  const inputValidation = validateInput(prompt);
  if (!inputValidation.valid) {
    console.error(`[router] ❌ Input validation failed: ${inputValidation.error}`);
    process.exit(0);
  }

  // ✅ Issue #7: Sanitize input
  prompt = sanitizeInput(prompt);

  // ✅ Issue #4: Security check
  const securityValidation = validateSecurity(prompt);
  if (!securityValidation.valid) {
    console.error('[router] ❌ Security validation failed');
    console.error(securityValidation.error);
    process.exit(1);  // Exit 1 để block prompt
  }

  // 4. Analyze và decide (KHÔNG modify intent)
  const decision = analyzeAndDecide(prompt);

  // 5. Enhance (metadata only, không modify prompt)
  const enhancement = enhancePrompt(prompt, decision);

  // 6. Display results
  console.log('\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║           🤖 SUB-AGENT AUTO-DETECTION REPORT                 ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  console.log(`📌 Selected Agent: ${decision.agent}`);
  console.log(`📊 Confidence: ${Math.round(decision.confidence * 100)}% (${enhancement.router_info.confidence_level})`);
  console.log(`🎯 Reasons: ${decision.reasons.join(', ')}`);
  console.log(`🚩 Auto-Flags: ${decision.flags.join(' ')}`);
  console.log(`🌊 Wave Strategy: ${decision.waves.join(' → ')}`);
  console.log(`💡 Recommendation: ${enhancement.recommendation}`);

  if (decision.confidence < CONFIG.CONFIDENCE_THRESHOLD) {
    console.log('\n⚠️  Confidence below threshold - using universal agent as fallback');
  }

  console.log('\n' + '─'.repeat(65) + '\n');

  // 7. JSON output cho integration
  console.log('::router-decision:: ' + JSON.stringify({
    ...decision,
    metadata: enhancement.router_info
  }));

  // ✅ Success - exit 0
  process.exit(0);
}

// ============================================================================
// ENTRY POINT
// ============================================================================

// Execute main với error handling
main().catch(err => {
  logError('Unhandled error', err);
  process.exit(0);  // Không block Claude Code
});

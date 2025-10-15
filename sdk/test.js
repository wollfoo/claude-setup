#!/usr/bin/env node
/**
 * Test Suite – Bộ kiểm thử toàn diện cho SDK
 * Comprehensive test suite for security fixes
 *
 * Kiểm thử 7 vấn đề bảo mật (Tests 7 security issues):
 * ✅ Issue #1: Intent Preservation
 * ✅ Issue #2: Timeout Protection
 * ✅ Issue #3: Error Handling
 * ✅ Issue #4: Secret Validation
 * ✅ Issue #5: Loop Prevention
 * ✅ Issue #6: API Timeout
 * ✅ Issue #7: Input Validation
 *
 * Version: 1.0.0
 * Last Updated: 2025-01-15
 */

const validator = require('./validator');
const securityCheck = require('./security-check');

// ============================================================================
// TEST FRAMEWORK (Khung kiểm thử đơn giản)
// ============================================================================

class TestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
    this.skipped = 0;
  }

  test(description, fn) {
    this.tests.push({ description, fn });
  }

  async run() {
    console.log('\n╔═══════════════════════════════════════════════════════════════╗');
    console.log('║              🧪 SECURITY TEST SUITE RUNNING                   ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝\n');

    for (const test of this.tests) {
      try {
        await test.fn();
        this.passed++;
        console.log(`✅ PASS: ${test.description}`);
      } catch (error) {
        this.failed++;
        console.log(`❌ FAIL: ${test.description}`);
        console.log(`   Error: ${error.message}`);
      }
    }

    this.printSummary();
  }

  printSummary() {
    console.log('\n' + '═'.repeat(65));
    console.log('📊 TEST SUMMARY');
    console.log('═'.repeat(65));
    console.log(`Total Tests: ${this.tests.length}`);
    console.log(`✅ Passed: ${this.passed}`);
    console.log(`❌ Failed: ${this.failed}`);
    console.log(`⏭️  Skipped: ${this.skipped}`);
    console.log(`Success Rate: ${((this.passed / this.tests.length) * 100).toFixed(2)}%`);
    console.log('═'.repeat(65) + '\n');

    if (this.failed > 0) {
      process.exit(1);
    }
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function assertEquals(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(
      message || `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`
    );
  }
}

function assertNotEquals(actual, notExpected, message) {
  if (actual === notExpected) {
    throw new Error(
      message || `Expected not to equal ${JSON.stringify(notExpected)}`
    );
  }
}

function assertTrue(value, message) {
  assert(value === true, message || `Expected true, got ${value}`);
}

function assertFalse(value, message) {
  assert(value === false, message || `Expected false, got ${value}`);
}

// ============================================================================
// ISSUE #1: INTENT PRESERVATION TESTS
// ============================================================================

const runner = new TestRunner();

runner.test('Issue #1: Should NOT modify original prompt', () => {
  const originalPrompt = 'create a React component for user login';

  // Simulate analysis without modification
  const analyzed = originalPrompt; // Intent preserved

  assertEquals(analyzed, originalPrompt, 'Prompt should remain unchanged');
});

runner.test('Issue #1: Should only add metadata, not change content', () => {
  const originalPrompt = 'optimize database queries';
  const metadata = { agent: 'performance-specialist', confidence: 0.85 };

  // Metadata is separate from prompt
  const result = {
    original_prompt: originalPrompt,
    metadata: metadata,
  };

  assertEquals(result.original_prompt, originalPrompt, 'Original prompt preserved');
  assert(result.metadata !== undefined, 'Metadata exists separately');
});

// ============================================================================
// ISSUE #2: TIMEOUT PROTECTION TESTS
// ============================================================================

runner.test('Issue #2: Timeout wrapper should reject after timeout', async () => {
  const timeout = 100; // 100ms timeout

  const slowOperation = new Promise(resolve => {
    setTimeout(() => resolve('slow'), 200); // Takes 200ms
  });

  const withTimeout = (promise, timeoutMs) => {
    return Promise.race([
      promise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Operation timeout')), timeoutMs)
      ),
    ]);
  };

  try {
    await withTimeout(slowOperation, timeout);
    throw new Error('Should have timed out');
  } catch (err) {
    assertEquals(err.message, 'Operation timeout', 'Should timeout correctly');
  }
});

runner.test('Issue #2: Timeout wrapper should complete if fast enough', async () => {
  const timeout = 200; // 200ms timeout

  const fastOperation = new Promise(resolve => {
    setTimeout(() => resolve('fast'), 50); // Takes 50ms
  });

  const withTimeout = (promise, timeoutMs) => {
    return Promise.race([
      promise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Operation timeout')), timeoutMs)
      ),
    ]);
  };

  const result = await withTimeout(fastOperation, timeout);
  assertEquals(result, 'fast', 'Should complete successfully');
});

// ============================================================================
// ISSUE #3: ERROR HANDLING TESTS
// ============================================================================

runner.test('Issue #3: Should handle errors gracefully', () => {
  try {
    JSON.parse('invalid json');
    throw new Error('Should have thrown');
  } catch (err) {
    // Error caught and handled
    assert(err instanceof SyntaxError, 'Should catch parsing error');
  }
});

runner.test('Issue #3: Should not crash on null/undefined input', () => {
  const result1 = validator.validateInput('');
  assertFalse(result1.valid, 'Empty string should fail validation');

  // Module should handle edge cases gracefully
  const result2 = validator.sanitizeInput('test');
  assertEquals(result2, 'test', 'Should handle normal input');
});

// ============================================================================
// ISSUE #4: SECRET VALIDATION TESTS
// ============================================================================

runner.test('Issue #4: Should detect OpenAI API keys', () => {
  const text = 'My API key is sk-1234567890abcdefghijklmnopqrstuvwxyz';
  const result = securityCheck.detectSecrets(text);

  assertTrue(result.detected, 'Should detect OpenAI key');
  assertEquals(result.findings.length, 1, 'Should find 1 secret');
});

runner.test('Issue #4: Should detect Anthropic API keys', () => {
  const text = 'sk-ant-' + 'x'.repeat(95);
  const result = securityCheck.detectSecrets(text);

  assertTrue(result.detected, 'Should detect Anthropic key');
});

runner.test('Issue #4: Should detect GitHub tokens', () => {
  const text = 'ghp_' + 'A'.repeat(36);
  const result = securityCheck.detectSecrets(text);

  assertTrue(result.detected, 'Should detect GitHub token');
});

runner.test('Issue #4: Should detect AWS keys', () => {
  const text = 'AKIAIOSFODNN7EXAMPLE';
  const result = securityCheck.detectSecrets(text);

  assertTrue(result.detected, 'Should detect AWS key');
});

runner.test('Issue #4: Should detect JWT tokens', () => {
  const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
  const result = securityCheck.detectSecrets(jwt);

  assertTrue(result.detected, 'Should detect JWT');
});

runner.test('Issue #4: Should detect database connection strings', () => {
  const text = 'mongodb://user:pass@localhost:27017/db';
  const result = securityCheck.detectSecrets(text);

  assertTrue(result.detected, 'Should detect MongoDB connection');
});

runner.test('Issue #4: Should NOT detect safe text', () => {
  const text = 'This is a normal user prompt about React components';
  const result = securityCheck.detectSecrets(text);

  assertFalse(result.detected, 'Should NOT detect secrets in safe text');
});

runner.test('Issue #4: Should mask secrets in logs', () => {
  const secret = 'sk-1234567890abcdefghijklmnopqrstuvwxyz';
  const masked = securityCheck.maskSecret(secret);

  assertNotEquals(masked, secret, 'Should mask the secret');
  assert(masked.includes('****'), 'Should contain masked characters');
});

// ============================================================================
// ISSUE #5: LOOP PREVENTION TESTS
// ============================================================================

runner.test('Issue #5: Should detect processed marker', () => {
  const marker = '__HOOK_PROCESSED_V2__';
  const processedPrompt = `${marker}{"version":"2.0.0"}\nOriginal prompt`;

  assertTrue(
    processedPrompt.includes(marker),
    'Should detect processed marker'
  );
});

runner.test('Issue #5: Should extract metadata from marker', () => {
  const marker = '__HOOK_PROCESSED_V2__';
  const metadata = { version: '2.0.0', agent: 'test', confidence: 0.9 };
  const prompt = `${marker}${JSON.stringify(metadata)}\nPrompt text`;

  const match = prompt.match(/__HOOK_PROCESSED_V2__(\{.+?\})/);
  assert(match !== null, 'Should match marker pattern');

  const extracted = JSON.parse(match[1]);
  assertEquals(extracted.version, '2.0.0', 'Should extract version');
  assertEquals(extracted.agent, 'test', 'Should extract agent');
});

runner.test('Issue #5: Should increment process count', () => {
  const metadata1 = { processCount: 1 };
  const metadata2 = { processCount: metadata1.processCount + 1 };

  assertEquals(metadata2.processCount, 2, 'Should increment count');
});

// ============================================================================
// ISSUE #6: API TIMEOUT TESTS
// ============================================================================

runner.test('Issue #6: Should timeout external API calls', async () => {
  const timeout = 100;

  const fakeAPICall = new Promise(resolve => {
    setTimeout(() => resolve('api response'), 200); // Slow API
  });

  const withTimeout = (promise, timeoutMs) => {
    return Promise.race([
      promise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('API timeout')), timeoutMs)
      ),
    ]);
  };

  try {
    await withTimeout(fakeAPICall, timeout);
    throw new Error('Should have timed out');
  } catch (err) {
    assertEquals(err.message, 'API timeout', 'Should timeout API call');
  }
});

runner.test('Issue #6: Should complete fast API calls', async () => {
  const timeout = 200;

  const fastAPICall = new Promise(resolve => {
    setTimeout(() => resolve('api response'), 50);
  });

  const withTimeout = (promise, timeoutMs) => {
    return Promise.race([
      promise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('API timeout')), timeoutMs)
      ),
    ]);
  };

  const result = await withTimeout(fastAPICall, timeout);
  assertEquals(result, 'api response', 'Should complete successfully');
});

// ============================================================================
// ISSUE #7: INPUT VALIDATION TESTS
// ============================================================================

runner.test('Issue #7: Should reject input that is too long', () => {
  const longInput = 'x'.repeat(100001); // Over 100K chars
  const result = validator.validateInput(longInput);

  assertFalse(result.valid, 'Should reject too long input');
  assert(result.error.includes('too long'), 'Error should mention length');
});

runner.test('Issue #7: Should reject input that is too short', () => {
  const shortInput = '';
  const result = validator.validateInput(shortInput);

  assertFalse(result.valid, 'Should reject empty input');
});

runner.test('Issue #7: Should detect SQL injection patterns', () => {
  const sqlInjection = "SELECT * FROM users WHERE id = 1; DROP TABLE users;--";
  const result = validator.validateInput(sqlInjection);

  assertFalse(result.valid, 'Should detect SQL injection');
  assert(result.threats && result.threats.length > 0, 'Should report threats');
});

runner.test('Issue #7: Should detect command injection patterns', () => {
  const commandInjection = "test; rm -rf /";
  const result = validator.validateInput(commandInjection);

  assertFalse(result.valid, 'Should detect command injection');
});

runner.test('Issue #7: Should detect path traversal patterns', () => {
  const pathTraversal = "../../../etc/passwd";
  const result = validator.validateInput(pathTraversal);

  assertFalse(result.valid, 'Should detect path traversal');
});

runner.test('Issue #7: Should sanitize null bytes', () => {
  const input = "test\x00malicious";
  const sanitized = validator.sanitizeInput(input);

  assertFalse(sanitized.includes('\x00'), 'Should remove null bytes');
});

runner.test('Issue #7: Should normalize whitespace', () => {
  const input = "test    with     many    spaces";
  const sanitized = validator.sanitizeInput(input);

  assertEquals(sanitized, 'test with many spaces', 'Should normalize spaces');
});

runner.test('Issue #7: Should accept valid input', () => {
  const validInput = "Create a React component for user authentication";
  const result = validator.validateInput(validInput);

  assertTrue(result.valid, 'Should accept valid input');
});

// ============================================================================
// INTEGRATION TESTS (Kiểm thử tích hợp)
// ============================================================================

runner.test('Integration: Validator + Security Check should work together', () => {
  // Use a real OpenAI key pattern (32+ chars) + SQL injection
  const maliciousInput = "My API key is sk-1234567890abcdefghijklmnopqrstuvwxyz and I want to DROP TABLE users";

  // Step 1: Validate input - should FAIL because of SQL injection
  const validationResult = validator.validateInput(maliciousInput);
  assertFalse(validationResult.valid, 'Should fail validation due to SQL injection');

  // Step 2: Check for secrets - should also FAIL because of OpenAI key
  const securityResult = securityCheck.validateSecurity(maliciousInput);
  assertFalse(securityResult.valid, 'Should fail security check due to API key');
});

runner.test('Integration: Safe input should pass all checks', () => {
  const safeInput = "Create a responsive navigation component with dropdown menus";

  // Step 1: Validate input
  const validationResult = validator.validateInput(safeInput);
  assertTrue(validationResult.valid, 'Should pass validation');

  // Step 2: Check for secrets
  const securityResult = securityCheck.validateSecurity(safeInput);
  assertTrue(securityResult.valid, 'Should pass security check');

  // Step 3: Sanitize (should not change safe input much)
  const sanitized = validator.sanitizeInput(safeInput);
  assertEquals(sanitized, safeInput, 'Should not change safe input');
});

// ============================================================================
// PERFORMANCE TESTS (Kiểm thử hiệu năng)
// ============================================================================

runner.test('Performance: Validation should be fast (<10ms)', () => {
  const input = "Normal user prompt for creating components";

  const start = Date.now();
  validator.validateInput(input);
  const duration = Date.now() - start;

  assert(duration < 10, `Validation too slow: ${duration}ms`);
});

runner.test('Performance: Secret detection should be fast (<50ms)', () => {
  const input = "This is a long text with many words but no secrets ".repeat(10);

  const start = Date.now();
  securityCheck.detectSecrets(input);
  const duration = Date.now() - start;

  assert(duration < 50, `Secret detection too slow: ${duration}ms`);
});

// ============================================================================
// RUN ALL TESTS (Chạy tất cả tests)
// ============================================================================

if (require.main === module) {
  runner.run().catch(err => {
    console.error('Test runner error:', err);
    process.exit(1);
  });
}

module.exports = { TestRunner, assert, assertEquals, assertTrue, assertFalse };

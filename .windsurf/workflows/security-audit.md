---
description: Comprehensive security audit for codebase
auto_execution_mode: 3
---

# Security Audit Workflow

## Step 1: Scope Definition
- [ ] Web application
- [ ] API endpoints
- [ ] Database layer
- [ ] Infrastructure/config
- [ ] Dependencies

## Step 2: Authentication Audit
- [ ] Password policy (min length, complexity)
- [ ] Password hashing (bcrypt ≥12 rounds?)
- [ ] JWT implementation (expiry, refresh, revoke)
- [ ] Session management
- [ ] MFA support
- [ ] OAuth/OIDC implementation

## Step 3: Authorization Audit
- [ ] RBAC/ABAC implementation
- [ ] Permission checks on all endpoints
- [ ] Privilege escalation vectors
- [ ] Resource ownership validation

## Step 4: Input Validation
- [ ] SQL injection (parameterized queries?)
- [ ] NoSQL injection
- [ ] XSS (input sanitization, output encoding)
- [ ] CSRF protection
- [ ] Command injection
- [ ] Path traversal

## Step 5: Data Security
- [ ] Encryption at rest
- [ ] Encryption in transit (HTTPS only)
- [ ] PII handling
- [ ] Secrets in code (API keys, passwords)
- [ ] .env files gitignored?
- [ ] Logging sensitive data?

## Step 6: API Security
- [ ] Rate limiting
- [ ] CORS configuration
- [ ] Security headers (HSTS, CSP, X-Frame-Options)
- [ ] API versioning
- [ ] Error messages (no stack traces in prod)

## Step 7: Dependency Audit
```bash
# Run these commands
npm audit
pip-audit
snyk test
```

## Step 8: Generate Report

```markdown
# Security Audit Report
Date: [date]
Auditor: Cascade AI

## Executive Summary
[1-2 paragraph overview]

## Findings

### 🔴 Critical (Fix Immediately)
| ID | Issue | Location | CVSS | Remediation |
|----|-------|----------|------|-------------|
| C01 | [issue] | [file:line] | 9.0 | [fix] |

### 🟠 High (Fix This Sprint)
| ID | Issue | Location | CVSS | Remediation |
|----|-------|----------|------|-------------|

### 🟡 Medium (Plan to Fix)
| ID | Issue | Location | CVSS | Remediation |
|----|-------|----------|------|-------------|

### 🟢 Low (Nice to Have)
| ID | Issue | Location | CVSS | Remediation |
|----|-------|----------|------|-------------|

## Recommendations
1. [Priority 1]
2. [Priority 2]

## Next Steps
- [ ] Fix critical issues
- [ ] Schedule follow-up audit
```

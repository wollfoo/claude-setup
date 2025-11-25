---
description: Review code with focus on security, performance, quality
auto_execution_mode: 3
---

# Code Review Workflow

## Step 1: Define Scope
- File/folder to review
- Focus area: Security | Performance | Quality | All

## Step 2: Read and Analyze Code
- Read entire file or diff
- Note patterns, anti-patterns
- Identify dependencies and side effects

## Step 3: Security Check
- [ ] Input validation
- [ ] SQL/NoSQL injection risks
- [ ] XSS vulnerabilities
- [ ] Authentication/Authorization
- [ ] Secrets exposure
- [ ] CORS configuration

## Step 4: Performance Check
- [ ] N+1 queries
- [ ] Memory leaks potential
- [ ] Unnecessary re-renders
- [ ] Missing indexes (DB)
- [ ] Caching opportunities

## Step 5: Quality Check
- [ ] SOLID principles
- [ ] DRY violations
- [ ] Code complexity
- [ ] Error handling
- [ ] Type safety
- [ ] Documentation

## Step 6: Report Results
```markdown
# Code Review Report

## Summary
[One-line assessment]

## Findings
### 🔴 Critical
- [issue with file:line]

### 🟠 High
- [issue with file:line]

### 🟡 Medium
- [issue with file:line]

### 🟢 Suggestions
- [improvements]

## Recommendations
[Prioritized action items]
```

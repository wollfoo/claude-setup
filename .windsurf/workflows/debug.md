---
description: Debug errors systematically - from symptoms to root cause
auto_execution_mode: 3
---

# Debug Workflow

## Step 1: Gather Information
- [ ] Complete error message
- [ ] Stack trace
- [ ] Steps to reproduce
- [ ] Recent changes (git diff)
- [ ] Environment (dev/staging/prod)

## Step 2: Analyze Error
- Parse error message to understand error type
- Identify file and line number from stack trace
- Check git history for recent changes

## Step 3: Reproduce Error
- Create minimal reproduction case
- Confirm error is reproducible
- If intermittent → check race conditions

## Step 4: Backward Trace (Backward Pass)
1. Start from error point
2. Trace back data flow
3. Find where data starts being wrong
4. Identify root cause

## Step 5: Common Patterns Check
- [ ] Null/undefined references
- [ ] Type mismatches
- [ ] Scope issues (this, closure)
- [ ] Race conditions
- [ ] Off-by-one errors
- [ ] Missing await/async
- [ ] Import/export errors

## Step 6: Implement Fix
```
Root Cause: [explanation]
Fix: [code changes]
Prevention: [how to prevent in future]
```

## Step 7: Verify
- [ ] Test case passes
- [ ] No regression
- [ ] Edge cases handled
- [ ] Add test to prevent recurrence

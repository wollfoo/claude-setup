---
description: Safely refactor code - reorganize, extract, optimize
auto_execution_mode: 3
---

# Refactor Workflow

## Step 1: Analyze Current State
- Read code to refactor
- Map dependencies (who imports this file?)
- Identify current test coverage

## Step 2: Define Objectives
- [ ] Extract component/function
- [ ] Move file/folder
- [ ] Rename (variable, function, class)
- [ ] Split large file
- [ ] Consolidate duplicates
- [ ] Change architecture pattern

## Step 3: Create Plan
Current Structure:
[list current files/structure]

Target Structure:
[list new files/structure]

Migration Steps:
1. [step]
2. [step]
...
```

## Step 4: Pre-flight Checks
- [ ] Document ALL files that import this
- [ ] Backup/commit current state
- [ ] Ensure tests pass before changes

## Step 5: Execute (Atomic Changes)
⚠️ **CRITICAL RULES**:
- NEVER move file without updating ALL imports
- NEVER leave broken imports
- Update imports IMMEDIATELY after each move
- One logical change per commit

## Step 6: Verify
- [ ] All imports resolved
- [ ] No TypeScript/linting errors
- [ ] Tests pass
- [ ] Application runs correctly

## Step 7: Cleanup
- [ ] Remove dead code
- [ ] Update documentation
- [ ] Commit with clear message

```
refactor(<scope>): <description>

- [change 1]
- [change 2]
```

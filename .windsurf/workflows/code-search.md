---
description: Search code in codebase - patterns, functions, classes, dependencies
auto_execution_mode: 3
---

# Code Search Workflow

## Step 1: Clarify Objective
- Ask user: "What are you looking for? (function, class, pattern, dependency, file)"
- Define scope: entire codebase or specific directory

## Step 2: Plan Search Strategy
- Identify main keywords
- Predict most likely locations
- Select tools: `glob` → `grep` → `read`

## Step 3: Execute Search
1. **Glob**: Find files by pattern (*.ts, *auth*, src/**/*)
2. **Grep**: Search content within files
3. **Read**: Read relevant files in detail

## Step 4: Synthesize Results
Respond with format:
```
**Search Results:**
1. **Primary Location**: [file:line]
2. **Code snippet**: [relevant code]
3. **Dependencies**: [related files]
4. **Next Steps**: [actions]
```

## Notes
- Always include exact file path and line number
- Minimize files read, maximize insight
- Stop early when found (confidence ≥70%)

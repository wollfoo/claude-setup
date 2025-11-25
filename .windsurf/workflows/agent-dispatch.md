---
description: Automatically select the appropriate agent based on task type
auto_execution_mode: 3
---

# Agent Dispatch Workflow

## Step 1: Analyze Request

Read user request and identify:
- **Intent**: Coding, Planning, Research, Debug, Deploy?
- **Scope**: Single file, module, entire codebase?
- **Complexity**: Simple, Medium, Complex?

## Step 2: Agent Matching

### Code Quality Tasks
| Task | Agent | Workflow |
|------|-------|----------|
| Search code | Code Searcher | /code-search |
| Review code | Code Reviewer | /code-review |
| Debug errors | Debug Specialist | /debug |
| Refactor | Refactor Master | /refactor |
| Write tests | Tester | /write-tests |

### Planning Tasks
| Task | Agent | Workflow |
|------|-------|----------|
| Write PRD | PRD Writer | /write-prd |
| Create plan | Task Planner | /task-planning |
| Review architecture | Architect | /architecture-review |

### Operations Tasks
| Task | Agent | Workflow |
|------|-------|----------|
| Security audit | Security Auditor | /security-audit |
| Performance audit | Performance Eng | /performance-audit |
| Deploy | DevOps | /deploy |

### Research Tasks
| Task | Agent | Workflow |
|------|-------|----------|
| Analyze codebase | Codebase Analyst | /codebase-research |

## Step 3: Execute

1. Load agent context from corresponding `agents-*.md` rule
2. Invoke appropriate workflow
3. Follow workflow steps
4. Report results

## Step 4: Multi-Agent (if needed)

For complex tasks requiring multiple agents:
```
1. /codebase-research (understand context)
2. /architecture-review (evaluate)
3. /task-planning (create plan)
4. Execute coding tasks
5. /code-review (verify)
6. /write-tests (ensure quality)
7. /deploy (release)
```

## Quick Reference

```
🔍 Search → /code-search
📝 Review → /code-review
🐛 Debug → /debug
🔄 Refactor → /refactor
🧪 Test → /write-tests
📋 PRD → /write-prd
📅 Plan → /task-planning
🏗️ Architecture → /architecture-review
🔒 Security → /security-audit
⚡ Performance → /performance-audit
🚀 Deploy → /deploy
🔬 Research → /codebase-research
```

# 🤖 AGENT AUTO-ACTIVATION & DELEGATION POLICY

## Core Mechanism

Primary agent (orchestrator) automatically activates specialist subagents based on request analysis. Auto-trigger uses multi-factor scoring system with override capability.

## Activation Priorities

| Priority | Method | Description |
|----------|--------|-------------|
| 1 | `@mention` | Manual override - highest priority |
| 2 | `task_patterns` | 0.8 weight (wildcards) |
| 3 | `keywords` | 0.6 weight (min 2 strong) |
| 4 | `domains` | 0.3 weight (semantic) |
| 5 | `file_patterns` | +0.4 bonus (context match) |

**Threshold**: Auto-spawn when `confidence >= 0.7`

---

## Agent Registry (18 Agents)

### **Tier 1: Core Engineering** ⭐⭐⭐

#### Security & Quality (4 agents) 🛡️
| Agent | Purpose | Triggers |
|-------|---------|----------|
| `@security-auditor` | Security audit, OWASP | security, audit, vulnerability |
| `@code-reviewer` | Code quality, static analysis | review, quality, patterns |
| `@tester` | Test execution, coverage | test, coverage, qa |
| `@debug-specialist` | Bug fixing, root cause | debug, fix, bug, error |

#### Architecture & Planning (2 agents) 📐
| Agent | Purpose | Triggers |
|-------|---------|----------|
| `@planner-researcher` | Research, system design | research, plan, architecture |
| `@graphql-architect` | GraphQL, federation | graphql, schema, federation |

#### Development & Operations (5 agents) 💻
| Agent | Purpose | Triggers |
|-------|---------|----------|
| `@database-specialist` | DB design, optimization | database, sql, query |
| `@devops-engineer` | CI/CD, infrastructure | devops, ci/cd, deploy |
| `@code-searcher` | Codebase navigation | search, find, where |
| `@codebase-research-analyst` | Deep analysis | codebase, impact |
| `@memory-bank-synchronizer` | Context sync | memory, context |

---

### **Tier 2: Specialized Tech Stacks** ⭐⭐

#### Languages & Platforms (4 agents) 🎯
| Agent | Purpose | Triggers |
|-------|---------|----------|
| `@typescript-expert` | TS, type safety | typescript, types |
| `@python-pro` | Python, async, FastAPI | python, django |
| `@golang-pro` | Go, concurrency | golang, goroutine |
| `@rust-pro` | Rust, memory safety | rust, ownership |

#### Design & Frontend (1 agent) 🎨
| Agent | Purpose | Triggers |
|-------|---------|----------|
| `@frontend-designer` | Design to code, UI | frontend, design, ui, ux |

---

### **Tier 3: Specialized Support** ⭐

| Agent | Purpose | Triggers |
|-------|---------|----------|
| `@docs-architect` | Documentation, guides | docs, documentation |
| `@code-refactor-master` | Refactoring, legacy | refactor, modernize |

---

## Coordination Protocol

```
Plan → Act → Report → Pause → Continue/Reassign
```

## Risk-Based Confirmation Required

- Database migrations
- Auth changes
- Data deletion / schema breaking
- Production deployment

## Conflict Resolution

1. `@mention` (explicit)
2. `task_patterns` (precision)
3. `keywords` (frequency)
4. `domains` (category)
5. `file_patterns` (context)

## Usage

- **Auto**: Orchestrator applies to every request
- **Manual**: `@agent-name` to force specialist
- **Check**: `/auto-subagents` for matching analysis

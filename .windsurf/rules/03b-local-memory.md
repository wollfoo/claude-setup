---
trigger: always_on
---
---
type: capability_prompt
scope: project
priority: critical
activation: always_on
---

# Local Memory System

## 1. Core Architecture

### Philosophy
**"Local-first, Privacy-first, Performance-first"** - Store memories as Markdown in `.windsurf/memories/`.

### Directory Layout
```
.windsurf/memories/
├── _index.md                 # Master index
├── projects/                 # Project-level overview
├── sessions/                 # Compressed session logs
├── decisions/                # Architecture Decision Records (ADR)
├── entities/                 # Code entities (Classes/Funcs)
└── checkpoints/              # Context snapshots
```

### File Naming
Format: `[category]-[identifier]-[date].md`
- `session-auth-impl-2025-01-22.md`
- `decision-001-jwt-auth.md`

---

## 2. Markdown Template

```markdown
# [Memory Title]

---
type: [session|decision|entity|checkpoint]
created: YYYY-MM-DD HH:MM
tags: [tag1, tag2]
related: [file1.md]
status: [active|archived]
---

## Summary
Brief description.

## Context
Detailed context and rationale.

## Implementation
Code snippets, configs, patterns used.

## References
- Related files: [list]
- External docs: [links]
```

---

## 3. Memory Categories

| Type | Purpose | Lifespan |
|------|---------|----------|
| **Project** | Tech stack, conventions, structure | Permanent |
| **Session** | Work done, challenges, decisions | 2 weeks (then archive) |
| **Decision** | Architectural choices (ADR) | Permanent (until deprecated) |
| **Entity** | Key component documentation | While code exists |
| **Checkpoint** | Context snapshots for recovery | Last 10 |

---

## 4. Core Operations

### CREATE
- **When**: Task complete, major decision, debug success
- **Process**: Determine category → Create file → Update `_index.md`

### READ
- **Methods**:
  1. **Direct**: `cat .windsurf/memories/decisions/001.md`
  2. **Tag Search**: `grep "tags:.*auth" .windsurf/memories/`
  3. **Content**: `rg "JWT token" .windsurf/memories/`
  4. **Semantic**: Use Context Manager agent

### UPDATE
- **Trigger**: Outdated info, new insights
- **Action**: Update content + `updated` timestamp + `_index.md`

### ARCHIVE
- **Policy**: Move to `memories/archive/`
- **Criteria**: Sessions >30 days, deprecated decisions, old checkpoints

---

## 5. Advanced Features

### Semantic Indexing (`_index.md`)
Maintain a master file linking memories by:
- **Topic**: Auth, DB, UI
- **File**: `src/auth/jwt.ts` → `entity-jwt.md`
- **Date**: Recent sessions

### Cross-referencing
- Bidirectional links between Decision ↔ Entity
- Dependency tracking (Requires → Impacts)

### Memory Hygiene
- **Daily**: Check duplicates
- **Weekly**: Archive old sessions
- **Monthly**: Full audit

---

## 6. Integration

- **Context Engineering**: Uses memories to compress/restore context.
- **Context Coordination**: System B manages memory creation/retrieval.
- **Drift Prevention**: Uses memories to ground AI in project rules.

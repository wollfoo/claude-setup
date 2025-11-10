---
trigger: always_on
---
---
type: capability_prompt
scope: project
priority: critical
activation: always_on
companion: rules/13b-local-memory-advanced.md
---

# 13a. Local Memory System — Core Architecture

## 📋 Overview

**Local Memory System** (hệ thống bộ nhớ cục bộ) là kiến trúc lưu trữ memories dưới dạng **Markdown files** trên filesystem local, thay thế 3rd-party Memory MCPs. Dựa trên insights từ Anthropic Claude Code local-first memory.

**Triết lý chính**: **"Local-first, Privacy-first, Performance-first"**

**Companion File**: See `rules/13b-local-memory-advanced.md` for integration, best practices, security, and performance details.

---

## Core Architecture

### **[LMS1] File-based Storage Structure** (cấu trúc lưu trữ dạng file)

**Directory Layout** (bố cục thư mục):
```
.windsurf/
└── memories/
    ├── _index.md                 # Master index của tất cả memories
    ├── projects/                 # Project-level memories
    │   ├── project-overview.md
    │   ├── architecture.md
    │   └── tech-stack.md
    ├── sessions/                 # Session-based memories
    │   ├── 2025-01-22-auth-implementation.md
    │   ├── 2025-01-23-bug-fixes.md
    │   └── ...
    ├── decisions/                # Architectural decisions
    │   ├── 001-use-jwt-auth.md
    │   ├── 002-postgres-over-mongo.md
    │   └── ...
    ├── entities/                 # Code entities (functions, classes)
    │   ├── auth/
    │   │   ├── jwt-utils.md
    │   │   └── middleware.md
    │   └── database/
    │       └── connection.md
    └── checkpoints/              # Context checkpoints
        ├── checkpoint-001.md
        ├── checkpoint-002.md
        └── ...
```

**File Naming Convention** (quy ước đặt tên file):
```
Format: [category]-[identifier]-[date].md

Examples:
- session-auth-implementation-2025-01-22.md
- decision-001-jwt-authentication.md
- entity-auth-jwt-utils.md
- checkpoint-milestone-v1.0.md
```

---

### **[LMS2] Markdown Format Specification** (đặc tả định dạng Markdown)

**Standard Template** (mẫu chuẩn):
```markdown
# [Memory Title]

---
type: [session|decision|entity|checkpoint|project]
created: YYYY-MM-DD HH:MM
updated: YYYY-MM-DD HH:MM
tags: [tag1, tag2, tag3]
related: [file1.md, file2.md]
status: [active|archived|deprecated]
---

## Summary
Brief one-line description of this memory.

## Context
Detailed context about this memory entry.

## Key Information
- **Decision**: [if applicable]
- **Rationale**: [if applicable]
- **Files Affected**: [list]
- **Dependencies**: [list]

## Implementation Details
[Code snippets, configurations, etc.]

## Notes
Additional observations, todos, known issues.

## References
- Related files: [list]
- External docs: [links]
- Related memories: [cross-references]

---
**Version**: X.Y
**Last Updated**: YYYY-MM-DD
```

**Metadata Fields** (trường metadata):
- `type`: Classify memory category
- `created`: Timestamp khi tạo
- `updated`: Timestamp update cuối
- `tags`: Keywords cho semantic search
- `related`: Cross-references to other memories
- `status`: Lifecycle state

---

### **[LMS3] Memory Categories** (phân loại bộ nhớ)

**1. Project Memories** (bộ nhớ dự án)
```markdown
Purpose: High-level project information
Lifespan: Entire project duration
Examples:
- Project structure và organization
- Tech stack decisions
- Team conventions
- Build/deployment configs
```

**2. Session Memories** (bộ nhớ phiên làm việc)
```markdown
Purpose: Capture work done in a specific session
Lifespan: Until archived (typically 1-2 weeks)
Examples:
- "2025-01-22: Implemented user authentication"
- Files modified, decisions made, issues encountered
- Compressed context from that session
```

**3. Decision Memories** (bộ nhớ quyết định)
```markdown
Purpose: Record architectural/technical decisions
Lifespan: Long-term (until deprecated)
Format: ADR-style (Architecture Decision Record)
Examples:
- "001: Use JWT for authentication"
- "002: PostgreSQL over MongoDB"
- Includes rationale, alternatives considered, trade-offs
```

**4. Entity Memories** (bộ nhớ thực thể)
```markdown
Purpose: Document specific code entities
Lifespan: As long as entity exists
Examples:
- Function documentation
- Class structure
- Module responsibilities
- API contracts
```

**5. Checkpoint Memories** (bộ nhớ điểm kiểm tra)
```markdown
Purpose: Snapshot of context at specific moments
Lifespan: Keep recent (last 10), archive old
Source: Auto-generated from Context Engineering
Examples:
- Checkpoint after completing major feature
- Checkpoint before major refactor
- Recovery points for long sessions
```

---

## Core Operations

### **[LMSO1] Create Memory** (tạo bộ nhớ)

**When to Create** (khi nào tạo):
- After completing a task/feature
- When making architectural decisions
- After debugging significant issues
- At end of work session
- When discovering important patterns/insights

**Creation Process** (quy trình tạo):
```markdown
1. Determine memory category (project/session/decision/entity)
2. Generate filename following naming convention
3. Fill template với relevant information
4. Add metadata (tags, related files, status)
5. Create cross-references to related memories
6. Update _index.md với new entry
```

**Automation Hooks** (móc tự động):
```
# Auto-create session memory on context reset
On: Context Reset
Action: Compress current session → Save to sessions/[date].md

# Auto-create checkpoint memory
On: Major Milestone Completed
Action: Create checkpoint/[milestone].md

# Auto-create entity memory
On: New function/class documented
Action: Create entity/[path]/[name].md
```

---

### **[LMSO2] Read/Query Memory** (đọc/truy vấn bộ nhớ)

**Query Methods** (phương pháp truy vấn):

**1. By Filename** (theo tên file):
```bash
# Direct file read
cat .windsurf/memories/decisions/001-use-jwt-auth.md
```

**2. By Tags** (theo thẻ):
```bash
# Search files containing specific tags
grep -r "tags:.*authentication" .windsurf/memories/
```

**3. By Content** (theo nội dung):
```bash
# Full-text search
rg "JWT token expiration" .windsurf/memories/
```

**4. By Date Range** (theo khoảng thời gian):
```bash
# Find memories created in date range
find .windsurf/memories/sessions/ -name "*2025-01-*"
```

**5. Semantic Search** (tìm kiếm ngữ nghĩa):
```markdown
# AI-powered semantic search
Query: "How did we implement rate limiting?"
Process:
1. Search tags: [rate-limiting, API, security]
2. Search content: fuzzy match on "rate limiting"
3. Rank results by relevance
4. Return top 3-5 most relevant memories
```

**Integration with AI** (tích hợp với AI):
```
User Request → AI detects memory need → Query local memories → Inject into context → Process request
```

---

### **[LMSO3] Update Memory** (cập nhật bộ nhớ)

**Update Triggers** (điều kiện cập nhật):
- Information becomes outdated
- New insights discovered
- Implementation changed
- Status transition (active → archived)

**Update Process** (quy trình cập nhật):
```markdown
1. Locate target memory file
2. Update relevant sections (preserve history via comments)
3. Update `updated` timestamp in metadata
4. Increment version number if major change
5. Add update note in "Notes" section
6. Update _index.md if category/tags changed
```

**Version Control** (kiểm soát phiên bản):
```markdown
# Track changes with inline comments
## Implementation Details
<!-- Updated 2025-01-22: Changed from bcrypt to argon2 -->
- Password hashing: argon2 (previously bcrypt)
- Rounds: 12 (unchanged)
```

---

### **[LMSO4] Archive/Delete Memory** (lưu trữ/xóa bộ nhớ)

**Archive Policy** (chính sách lưu trữ):
```
Archive (move to archive/ subdir):
- Session memories > 30 days old
- Checkpoints > 10 most recent
- Deprecated decisions (keep for reference)

Delete (permanent removal):
- Duplicate entries
- Incorrect/invalid information
- Outdated và no longer relevant
```

**Archive Process** (quy trình lưu trữ):
```bash
# Move to archive with date suffix
mv .windsurf/memories/sessions/2024-12-01-session.md \
   .windsurf/memories/archive/sessions/2024-12-01-session-archived.md
```

---

## Advanced Features

### **[LMSAF1] Semantic Indexing** (lập chỉ mục ngữ nghĩa)

**Index Structure** (cấu trúc chỉ mục):
```markdown
# File: _index.md

## By Topic
### Authentication
- [decision-001-jwt-auth.md](decisions/001-jwt-auth.md)
- [entity-auth-middleware.md](entities/auth/middleware.md)
- [session-2025-01-22-auth-impl.md](sessions/2025-01-22-auth-implementation.md)

### Database
- [decision-002-postgres.md](decisions/002-postgres-over-mongo.md)
- [entity-db-connection.md](entities/database/connection.md)

## By File
### src/auth/
- jwt.ts → [entity-auth-jwt-utils.md](entities/auth/jwt-utils.md)
- middleware.ts → [entity-auth-middleware.md](entities/auth/middleware.md)

## By Date (Recent)
- 2025-01-23: [session-bug-fixes.md](sessions/2025-01-23-bug-fixes.md)
- 2025-01-22: [session-auth-impl.md](sessions/2025-01-22-auth-implementation.md)

## By Status
### Active (10)
- [List of active memories]

### Archived (25)
- [Link to archive index]
```

**Index Maintenance** (bảo trì chỉ mục):
```
Auto-update triggers:
- On memory create/update/delete → Rebuild affected index sections
- Daily: Full index rebuild (nếu có changes)
- Weekly: Cleanup orphaned references
```

---

### **[LMSAF2] Cross-referencing** (tham chiếu chéo)

**Bidirectional Links** (liên kết hai chiều):
```markdown
# In decision-001-jwt-auth.md
## Related
- Implementation: [entity-auth-jwt-utils.md](entities/auth/jwt-utils.md)
- Session: [session-2025-01-22-auth-impl.md](sessions/2025-01-22-auth-implementation.md)

# In entity-auth-jwt-utils.md
## References
- Decision: [decision-001-jwt-auth.md](decisions/001-jwt-auth.md) ← Backlink
```

**Dependency Tracking** (theo dõi phụ thuộc):
```markdown
# In decision-002-postgres.md
## Dependencies
- Requires: [decision-003-docker-setup.md] (Docker for dev)
- Impacts: [entity-db-connection.md], [entity-db-migrations.md]

## Dependents
- Referenced by: [session-2025-01-25-db-migration.md]
```

---

### **[LMSAF3] Search Optimization** (tối ưu tìm kiếm)

**Fast Retrieval Strategies** (chiến lược truy xuất nhanh):

**1. Tag-based Filtering** (lọc theo thẻ):
```bash
# Find all auth-related memories
rg "^tags:.*auth" .windsurf/memories/ --files-with-matches
```

**2. Filename Pattern Matching** (khớp mẫu tên file):
```bash
# Find all decision memories
ls .windsurf/memories/decisions/*.md
```

**3. Content Search with Context** (tìm kiếm nội dung với ngữ cảnh):
```bash
# Find memories mentioning JWT với context
rg "JWT" .windsurf/memories/ -A 3 -B 3
```

**4. Combined Query** (truy vấn kết hợp):
```bash
# Find session memories về auth từ tháng 1
find .windsurf/memories/sessions/ -name "*2025-01*" -exec grep -l "auth" {} \;
```

---

### **[LMSAF4] Memory Hygiene** (vệ sinh bộ nhớ)

**Daily Tasks** (tác vụ hàng ngày):
```markdown
- Check for duplicate entries
- Validate cross-references (ensure links valid)
- Update _index.md if new memories added
```

**Weekly Tasks** (tác vụ hàng tuần):
```markdown
- Archive old session memories (>30 days)
- Review active memories for outdated info
- Consolidate related memories if appropriate
- Clean up orphaned files
```

**Monthly Tasks** (tác vụ hàng tháng):
```markdown
- Full audit of all memories
- Remove deprecated/invalid entries
- Optimize index structure
- Backup entire memories/ directory
```

---

## 🔗 Related Rules

**Core Integration**:
- `rules/12-context-engineering.md` — Context Window Optimization
- `rules/14a-context-coordination-core.md` — Context Coordination (5 Pillars)
- `rules/14b-context-coordination-advanced.md` — Auto-transitions & Validation

**Advanced Topics**:
- `rules/13b-local-memory-advanced.md` — Integration, Best Practices, Security, Performance

**Support**:
- `rules/09-ai-drift-prevention.md` — Memory Hygiene
- `rules/03-tool-proficiency.md` — Memory Tools Usage
- `rules/05-security-privacy.md` — Data Protection

---
**Status**: Production-Ready ✅  
**Next**: See `rules/13b-local-memory-advanced.md` for implementation details

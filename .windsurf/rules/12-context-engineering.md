---
trigger: always_on
---
---
type: capability_prompt
scope: project
priority: critical
activation: always_on
---

# 12. Context Engineering — Tối ưu Context Window

---

## 📋 Overview

**Context Engineering** (kỹ thuật quản lý ngữ cảnh) là phương pháp tối ưu hóa việc sử dụng **context window** thông qua **quản lý thông minh** thay vì mở rộng kích thước. Dựa trên insights từ Anthropic Claude Sonnet 4.5.

**Triết lý chính**: **"Manage Smart, Not Big"** (quản lý thông minh, không phải mở rộng)

---

## Core Principles

### **[CE1] Context Quality > Context Quantity** (chất lượng > số lượng)

**Problem Statement** (vấn đề):
- Context window càng lớn ≠ AI càng thông minh
- Information overload → AI bối rối, "lost in the middle"
- Chi phí tính toán tăng exponentially
- Latency cao, waste compute resources

**Solution** (giải pháp):
- **Structured Context** (ngữ cảnh có cấu trúc): Tổ chức thông tin thành boundaries rõ ràng
- **Selective Loading** (tải có chọn lọc): Chỉ load thông tin cần thiết cho task hiện tại
- **Semantic Relevance** (liên quan ngữ nghĩa): Ưu tiên thông tin có semantic relationship cao

---

### **[CE2] Request-Response Pair Tracking** (theo dõi cặp yêu cầu-phản hồi)

**Mechanism** (cơ chế):
```
┌────────────────────────────────────┐
│ [ID:001] User: "Create auth API"  │
│          AI: "Created JWT-based..." │ → Completed Unit
├────────────────────────────────────┤
│ [ID:002] User: "Add rate limiting" │
│          AI: "Added Redis-based..." │ → Completed Unit
├────────────────────────────────────┤
│ [ID:003] User: "Fix bug in auth"   │
│          AI: "Analyzing..."         │ → Active Unit
└────────────────────────────────────┘
```

**Benefits** (lợi ích):
- Mỗi pair = **independent unit** với ID unique
- Có thể **edit/remove** từng unit mà không ảnh hưởng khác
- **Rollback** dễ dàng đến bất kỳ state nào
- **Audit trail** đầy đủ cho debugging

**Implementation** (triển khai):
1. Assign unique ID cho mỗi request-response pair
2. Tag mỗi unit với metadata:
   - Timestamp
   - Task type (coding/review/debug/explain)
   - Status (active/completed/archived)
   - Dependencies (references to other IDs)
3. Store trong local memory system (xem `rules/13a-local-memory-core.md`)

---

### **[CE3] Selective Compaction** (nén có chọn lọc)

**Strategy** (chiến lược):

**Phase 1: Identify Compactable Units**
- Các request-response pairs đã **hoàn thành**
- Không còn được reference trong active tasks
- Không chứa critical information cần preserve

**Phase 2: Semantic Compression**
```markdown
# Before Compaction (500 tokens)
User: "Implement user registration with email validation"
AI: "I'll create the registration endpoint. First, I'll set up the route...
[detailed step-by-step implementation with code]
...validation complete. The endpoint is ready."

# After Compaction (50 tokens)
[ID:001] ✅ User Registration API
- Endpoint: POST /api/auth/register
- Features: Email validation, bcrypt hashing, JWT token
- Status: Completed, tested
- Files: src/auth/register.ts, src/middleware/validation.ts
```

**Compaction Triggers** (điều kiện kích hoạt):
- Context window usage > 70%
- Request-response pair marked as "completed" for >10 turns
- User explicitly requests: "Tóm tắt context"
- Before switching to completely different task/module

**Preserve Rules** (quy tắc bảo toàn):
- ✅ **ALWAYS preserve**: Decisions, file paths, key configuration values
- ✅ **ALWAYS preserve**: Current active task context
- ✅ **ALWAYS preserve**: Error messages and debugging info for unresolved issues
- ❌ **CAN compress**: Step-by-step reasoning (keep only conclusions)
- ❌ **CAN compress**: Code snippets (keep only references + summary)
- ❌ **CAN compress**: Exploratory discussions (keep only final decisions)

---

### **[CE4] Boundary-aware Context Injection** (chèn ngữ cảnh nhận biết ranh giới)

**Concept** (khái niệm):
Inject context vào đúng vị trí trong conversation flow dựa trên **semantic boundaries** thay vì append cuối cùng.

**Structure** (cấu trúc):
```
[SYSTEM CONTEXT]
- Rules và protocols (always at top)

[LONG-TERM MEMORY]
- Project structure, decisions, patterns

[RECENT CONTEXT]
- Last 5-10 completed request-response pairs (compressed)

[ACTIVE CONTEXT]
- Current task details (full verbosity)

[WORKING MEMORY]
- Temporary notes, TODOs, open questions
```

**Implementation Guidelines** (hướng dẫn triển khai):
1. Separate context thành **named sections** với clear boundaries
2. Each section có **priority level** để determine load order
3. Khi approaching limit → evict lowest priority sections first
4. **Never evict** active context or critical system rules

---

### **[CE5] Context Continuity Protocol** (giao thức liên tục ngữ cảnh)

**Purpose** (mục đích): Maintain context coherence across long sessions và multiple restarts.

**Checkpointing Strategy** (chiến lược điểm kiểm tra):

**Automatic Checkpoints** (tự động):
- Sau mỗi major milestone (feature completed, bug fixed)
- Khi context usage > 80%
- Before destructive operations (delete files, major refactors)
- Every 20 request-response pairs

**Checkpoint Contents** (nội dung checkpoint):
```markdown
# Checkpoint: [Timestamp] [Milestone Name]

## Session Summary
- Total tasks completed: X
- Files modified: [list]
- Key decisions: [list]

## Current State
- Active task: [description]
- Next steps: [TODO list]
- Open issues: [list]

## Context Snapshot
- Tech stack: [list]
- Architecture patterns: [list]
- Important constants/configs: [key-value pairs]
```

**Recovery Protocol** (giao thức khôi phục):
1. Load latest checkpoint
2. Verify consistency với current workspace state
3. Prompt user: "Tiếp tục từ checkpoint [X]?"
4. Resume với refreshed context

---

### **[CE6] Semantic Context Indexing** (lập chỉ mục ngữ cảnh ngữ nghĩa)

**Objective** (mục tiêu): Enable fast retrieval của relevant context dựa trên semantic similarity.

**Indexing Dimensions** (chiều lập chỉ mục):
1. **By Topic**: auth, database, UI, API, testing, deployment
2. **By File**: Group context theo files được mentioned
3. **By Entity**: Functions, classes, variables được discussed
4. **By Decision**: Architectural choices, trade-offs, rationales
5. **By Time**: Chronological ordering

**Query Patterns** (mẫu truy vấn):
```
# Example: Debug authentication bug
Query: "auth + JWT + bug + src/auth/"
Retrieved Context:
- [ID:015] JWT token expiration issue → Fixed
- [ID:023] Auth middleware implementation
- [ID:031] Recent changes to src/auth/jwt.ts
```

**Retrieval Strategy** (chiến lược truy xuất):
- **Exact match** (khớp chính xác): File paths, function names
- **Fuzzy match** (khớp mờ): Topic descriptions, natural language
- **Semantic search** (tìm kiếm ngữ nghĩa): Use embeddings (nếu available)
- **Hybrid**: Combine all approaches với weighted ranking

---

## Implementation Workflow

### **[CEW] Context Engineering Workflow** (quy trình kỹ thuật ngữ cảnh)

**Step 1: Context Initialization** (khởi tạo ngữ cảnh)
```
1. Load system rules và protocols
2. Load project-specific memories from local storage
3. Initialize request-response tracking với ID:001
4. Set context budget: [available tokens]
```

**Step 2: Active Task Processing** (xử lý tác vụ đang hoạt động)
```
For each user request:
1. Assign unique ID (auto-increment)
2. Inject relevant context from semantic index
3. Process request with full verbosity
4. Tag response với metadata (task type, status, files touched)
5. Update context budget
```

**Step 3: Continuous Monitoring** (giám sát liên tục)
```
After each response:
1. Check context usage percentage
2. If > 70% → trigger selective compaction
3. If completed milestone → create checkpoint
4. Update semantic index với new information
```

**Step 4: Compaction Execution** (thực hiện nén)
```
1. Identify compactable units (completed, not referenced)
2. Extract key information (decisions, files, configs)
3. Create compressed summary
4. Replace original unit với summary
5. Archive full version to local memory
```

**Step 5: Context Reset (when needed)** (reset ngữ cảnh khi cần)
```
Triggers:
- Context usage > 90% and compaction không đủ
- Switching to completely different module/task
- User explicitly requests: "Reset context"

Process:
1. Create final checkpoint
2. Archive entire conversation to local memory
3. Load fresh context với:
   - System rules (always)
   - Latest checkpoint summary
   - Project-level memories
4. Prompt user: "Context refreshed. Ready to continue?"
```

---

## Best Practices

### **[CEBP] Context Engineering Best Practices**

**DO's** (nên làm):
- ✅ Assign IDs to every request-response pair
- ✅ Tag units với clear metadata (status, dependencies)
- ✅ Create checkpoints sau major milestones
- ✅ Compress aggressively but preserve decisions
- ✅ Use semantic indexing cho fast retrieval
- ✅ Maintain separate sections cho different context types
- ✅ Archive full conversations to local memory
- ✅ Monitor context usage continuously

**DON'Ts** (không nên làm):
- ❌ Let context grow unbounded
- ❌ Append everything at the end without structure
- ❌ Compress active tasks or critical info
- ❌ Lose track of dependencies between units
- ❌ Skip checkpointing before major operations
- ❌ Mix different context types without boundaries
- ❌ Evict context randomly when limit reached

---

## Anti-patterns

### **[CEAP] Context Engineering Anti-patterns**

**1. "Context Hoarding"** (tích trữ ngữ cảnh):
```
❌ Problem: Keep everything "just in case"
✅ Solution: Aggressive compaction + archive to memory
```

**2. "Flat Context Dump"** (đổ ngữ cảnh phẳng):
```
❌ Problem: All context dumped at end without structure
✅ Solution: Boundary-aware injection với named sections
```

**3. "Lossy Compression"** (nén mất mát):
```
❌ Problem: Compress too aggressively → lose critical info
✅ Solution: Preserve decisions, configs, error messages
```

**4. "No Checkpointing"** (không có điểm kiểm tra):
```
❌ Problem: Long session without checkpoints → can't recover
✅ Solution: Auto-checkpoint every 20 turns or major milestone
```

**5. "Orphaned Context"** (ngữ cảnh mồ côi):
```
❌ Problem: Context units without metadata/IDs/dependencies
✅ Solution: Always tag với full metadata
```

---

## Success Metrics

### **[CESM] Context Engineering Success Metrics**

**Efficiency Metrics** (chỉ số hiệu suất):
- Context usage stays < 80% of limit
- Average compaction ratio ≥ 10:1 (500 tokens → 50 tokens)
- Checkpoint creation frequency: every 15-20 turns
- Context retrieval time < 100ms

**Quality Metrics** (chỉ số chất lượng):
- Zero information loss for critical data (decisions, configs)
- Successful context recovery rate: 100% from checkpoints
- Semantic search precision ≥ 90% (relevant results)
- User satisfaction: "AI remembers what I told it"

**Performance Metrics** (chỉ số hiệu năng):
- Response latency reduction ≥ 30% vs unoptimized context
- Cost savings ≥ 40% (fewer tokens processed)
- Longer sessions without reset (>50 turns)

---

## Integration with Memory System

**Reference**: See `rules/13a-local-memory-core.md` for complete local file-based memory architecture.

**Context → Memory Flow** (luồng ngữ cảnh → bộ nhớ):
```
Active Context (RAM)
    ↓ (on compaction)
Compressed Context (RAM)
    ↓ (on checkpoint/reset)
Local Memory Files (.md)
    ↓ (on session end)
Archive Storage
```

**Memory → Context Flow** (luồng bộ nhớ → ngữ cảnh):
```
Session Start
    ↓
Load Project Memories (.md)
    ↓
Load Latest Checkpoint
    ↓
Inject into Active Context
    ↓
Ready to Process
```

---

## 🔗 Cross-References

**Related Rules**:
- `rules/09-ai-drift-prevention.md` → Context Reset Protocol
- `rules/13a-local-memory-core.md` → Local Memory Storage
- `rules/03-tool-proficiency.md` → Memory Management Tools
- `rules/10b-communication-advanced.md` → Token Optimization

**External Resources**:
- Anthropic Claude Sonnet 4.5 Context Editing
- Research: "Lost in the Middle" problem
- Architecture: Windsurf Context Management

---

**Status**: Production-Ready ✅

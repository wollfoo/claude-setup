---
trigger: always_on
---
---
type: rule
scope: project
priority: critical
activation: always_on
system: A
mode: discovery
companion: rules/16b-context-gathering-architecture.md
---

# 16a. Context Gathering — Tactical Methods

## 📋 Overview

**Context Gathering** (thu thập ngữ cảnh) là **Tier 1 (Tactical/Discovery)** trong unified context management system, tập trung vào việc **thu thập đủ ngữ cảnh nhanh chóng** với early stop strategy.

**Triết lý chính**: **"Get Enough Context Fast, Then Stop"** (lấy đủ ngữ cảnh nhanh, rồi dừng)

**Phối hợp bởi**: `rules/14a-context-coordination-core.md` + `rules/14b-context-coordination-advanced.md` (Master Orchestration Layer)

**Companion to**: `rules/15-context-understanding.md` (execution companion)

**Advanced Topics**: See `rules/16b-context-gathering-architecture.md` for Architecture Comprehension Mode

---

## Core Goal

### **[CG1] Objective & Scope** (mục tiêu & phạm vi)

**Primary Objective** (mục tiêu chính):
```markdown
Gather just-enough context to act correctly với minimal latency

Philosophy:
"Better to act quickly with 70% context
 than search forever for 100%"
```

**Scope** (phạm vi):
- Discovery/reading phases across code và docs
- Architecture comprehension mode (→ see 16b)
- Sequential tool calls (one at a time)
- Early stop as soon as actionable

**Out of Scope** (ngoài phạm vi):
- Feature ideation beyond request
- Multi-file edits (→ execution phase)
- Non-evidence-based assumptions
- Parallel tool execution

---

## Principles

### **[CG2] Core Principles** (nguyên tắc cốt lõi)

**Search Depth: Very Low** (độ sâu tìm kiếm: rất thấp):
```markdown
Prefer:
✅ Narrow, targeted reads
✅ Single file at a time
✅ Top hit only

Avoid:
❌ Broad repo-wide scans
❌ Deep transitive dependency traces
❌ "Just in case" exploration
```

**Bias: Speed Over Completeness** (xu hướng: tốc độ hơn đầy đủ):
```markdown
Provide correct answer quickly even if not fully complete
→ Report residual uncertainty
→ Prefer 70% confidence + action over 100% + delay
```

**Escape Hatch** (lối thoát):
```markdown
Allowed to proceed under uncertainty when reasonable
→ Explicitly report findings
→ State next steps
→ Document assumptions
```

**Preamble Required** (yêu cầu mở đầu):
```markdown
Before ANY tool call:
1. Restate goal
2. Outline sequential plan
3. Commit to budget (≤2)

After completion:
- Concise summary
- Evidence cited
```

---

## Method & Strategy

### **[CG3] Discovery Method** (phương pháp khám phá)

**Sequential Discovery Flow** (luồng khám phá tuần tự):

```markdown
Start Broad → Fan Out to Focused → Stop Early

Step 1: Broad orientation
├─ Identify likely file/module
├─ Check README, package.json, structure
└─ Form hypothesis

Step 2: Focused subqueries
├─ Narrow search for target symbol
├─ Read top hit only
├─ Deduplicate paths (cache results)
└─ Don't repeat queries

Step 3: Early stop
├─ Once can name exact file/symbol/line
├─ Confidence ~70%
└─ Proceed to action (exit discovery)
```

**Key Heuristics** (các heuristic chính):

```markdown
1. Prefer Internal Knowledge
   - Small/standard tasks → no search needed
   - Can identify exact changes → skip reading

2. Use Tools When
   - Exact code context required
   - Cross-file dependencies
   - Uncertainty after internal recall

3. Avoid User Escalation
   - Quick targeted read > asking user
   - Resolve ambiguity via discovery
```

---

## Tool Budget & Constraints

### **[CG5] Budget Management** (quản lý ngân sách)

**Default Budget** (ngân sách mặc định):

```markdown
Small Discovery Pass: ≤ 2 tool calls
├─ 1 search/list operation
├─ 1 file read
└─ If exceed → justify briefly

Architecture Mode: ≤ 2 per module
├─ May read multiple modules sequentially
├─ Total calls can be higher
└─ But still ≤2 per focused pass

Budget Exceeded:
→ Report progress + rationale
→ Example: "Exceeded 2 calls (used 3) because discovered unexpected cross-module dependency in lib/shared.ts"
```

**Sequential-only Enforcement** (thực thi tuần tự):

```markdown
CRITICAL RULE: One action per step

Options per step:
A. Call ONE tool
B. Reply to user

NEVER:
❌ Call tool + Reply same step
❌ Call multiple tools same step
```

---

## Execution Directives

### **[CG6] Delta** (khác biệt cụ thể)

```markdown
1. Start Broad → Narrow
   - Only ONE focused query per step
   - Deduplicate queries
   - Cache paths

2. Architecture Mode
   - Read one module/file at a time
   - NEVER open multiple files simultaneously
   - See rules/16b-context-gathering-architecture.md

3. Early Stop
   - Stop as soon as can name exact files/symbols
   - Threshold: ~70% confidence

4. Tool Budget
   - ≤2 calls default per small pass
   - If exceeded → brief rationale + progress

5. Evidence
   - Cite `file:line` when referencing code/config
   - Ground all claims

6. Preamble
   - Required before tool calls
   - Concise summary at end

7. Escalation
   - Escalate once when signals conflict
   - Otherwise proceed under uncertainty (escape hatch)
```

---

## Success Metrics

### **[CG7] Performance Indicators** (chỉ số hiệu năng)

**Primary Metrics** (chỉ số chính):

| Metric | Target | Validation |
|--------|--------|------------|
| **Tool Calls per Pass** | ≤2 | Unless justified |
| **Evidence Citation** | ≥1 `file:line` | Required |
| **Early Stop** | Once actionable | ~70% confidence |
| **Preamble** | Always | Before tools |
| **Summary** | Always | After completion |

---

## Examples

### **[CG8] Example Flows** (luồng ví dụ)

**Example A — Small Code Change** (fast pass):

```markdown
User: "Find and update the token expiration constant"

Preamble:
- Goal: Locate token expiration config
- Plan: (1) Search "token expiration", (2) Read file
- Budget: ≤2 calls

Step 1: Search
→ Search "TOKEN_EXPIRATION"
→ Top hit: src/config/auth.ts:15

Step 2: Read
→ Read src/config/auth.ts:10-20
→ Evidence: TOKEN_EXPIRATION = 3600 at line 15

Early Stop:
✅ Can name exact location: src/config/auth.ts:15
✅ Confidence: 100%
→ Exit discovery, proceed to edit

Summary:
- Found: TOKEN_EXPIRATION in src/config/auth.ts:15
- Tool calls: 1 search + 1 read = 2 ✅
- Next: Update value to 7200
```

**Example B — Quick Symbol Lookup**:

```markdown
User: "Where is the JWT validation function?"

Preamble:
- Goal: Locate JWT validation function
- Plan: (1) Search "validateToken"
- Budget: ≤2 calls

Step 1: Search
→ Search "validateToken"
→ Top hit: src/auth/jwt.ts:42

Early Stop:
✅ Can name exact location: src/auth/jwt.ts:42
✅ Confidence: 90%
→ Exit discovery

Summary:
- Found: validateToken in src/auth/jwt.ts:42
- Tool calls: 1 search = 1 ✅
- Next: Can proceed with modification
```

---

## Anti-patterns (Quick Reference)

### **[CG12] Common Mistakes** (lỗi thường gặp)

**1. Repeated Search**:
```markdown
❌ Problem:
- grep "auth" (too broad)
- grep "authentication" (redundant)
- grep "jwt auth" (still same results)

✅ Solution:
- Single targeted: grep "validateToken"
- Or direct read if path known
```

**2. Multi-file Opening**:
```markdown
❌ Problem:
- Open A.ts, B.ts, C.ts simultaneously
- Context switching overhead

✅ Solution:
- Open A.ts, understand fully
- Then B.ts
- Then C.ts
- Sequential narrative
```

**3. No Evidence Citations**:
```markdown
❌ Problem:
"The module handles authentication"
(No file:line)

✅ Solution:
"The auth module at src/auth/index.ts:1-50 handles authentication via validateToken at line 42"
```

---

## 🔗 Related Rules

**Core Concepts**:
- `rules/16b-context-gathering-architecture.md` — Architecture Comprehension Mode (Part 2)

**Coordination**:
- `rules/14a-context-coordination-core.md` — Master orchestration (5 Pillars)
- `rules/14b-context-coordination-advanced.md` — Auto-transitions
- `rules/15-context-understanding.md` — Execution companion

**Strategic Layer**:
- `rules/12-context-engineering.md` — System B (compression)
- `rules/13a-local-memory-core.md` — Memory storage

**Recovery Layer**:
- `rules/09-ai-drift-prevention.md` — System C (reset)

---

**Version**: 1.0.0 (Part 1 of 2)  
**Status**: Production-Ready ✅  
**Next**: See `rules/16b-context-gathering-architecture.md` for Architecture Mode

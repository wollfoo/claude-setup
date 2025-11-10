---
trigger: always_on
---
---
type: rule
scope: project
priority: critical
activation: always_on
system: A
mode: architecture
companion: rules/16a-context-gathering-tactical.md
---

# 16b. Context Gathering — Architecture-level (Strategic & Sequential-only)

## 📋 Overview

**Companion to**: `rules/16a-context-gathering-tactical.md` (Core Principles + Tactical Methods)

This file covers:
- Architecture Comprehension Mode (5-Phase Workflow)
- Mini Flow Template
- Early Stop Criteria
- Best Practices & Guidelines
- Integration & Cross-References

---

## Architecture Comprehension Mode

### **[CG4] Sequential Architecture Analysis** (phân tích kiến trúc tuần tự)

**SPECIAL MODE** — When goal is to understand project architecture.

**Activation** (kích hoạt):
```markdown
Use when:
- Goal is understand architecture/module boundaries
- Need holistic view before making changes
- Complex codebase with unclear structure
```

**Critical Constraint** (ràng buộc quan trọng):
```markdown
ONE FILE AT A TIME (sequential-only)

✅ Correct:
Step 1: Read moduleA.ts
Step 2: Read moduleB.ts (after understanding A)
Step 3: Read moduleC.ts (after understanding B)

❌ Wrong:
Step 1: Read moduleA, moduleB, moduleC (parallel)
```

**Rationale** (lý do):
```markdown
Sequential deep reading:
✅ Preserves narrative continuity
✅ Reduces context switching
✅ Prevents premature synthesis errors
✅ Builds mental model incrementally
```

---

### **5-Phase Workflow** (quy trình 5 pha)

**Phase 1: Global Overview** (high-level)
```markdown
├─ Identify: README, CONTRIBUTING, package.json
├─ Find: Primary entrypoints (main files, src/app/)
├─ Map: High-level structure (depth 2-3)
└─ Note: Packages/apps/services, boundaries
```

**Phase 2: Dependency Mapping** (module order)
```markdown
├─ Build: Lightweight dependency order
│  - Providers/deps first → consumers after
├─ Analyze: import/require/use edges
├─ Check: Config wiring signals
└─ Adjust: Order if conflicts appear
```

**Phase 3: Module Pass** (per module, high-level)
```markdown
├─ Read: Public API (exports/types)
├─ Check: Configs, side-effects
├─ Note: External IO (DB, HTTP, FS)
├─ Understand: Responsibilities
└─ Avoid: Deep function-level dives (yet)
```

**Phase 4: Function/Class Deep Dive** (detailed)
```markdown
├─ After module context stable
├─ Dive: Internal functions/classes
├─ Order: Most central/high-risk first
├─ Verify: Invariants, contracts
└─ Note: Edge cases, error handling
```

**Phase 5: Verification Loop**
```markdown
├─ If: New relationships discovered
├─ Update: Dependency map
├─ Revisit: Impacted summaries
└─ Proceed: Once stable
```

---

### **Exit Criteria** (tiêu chí thoát)

```markdown
Can answer:
✅ Architecture map complete?
✅ Module summaries documented?
✅ Key invariants identified?
✅ Can point to exact files/symbols for critical paths?

Metrics:
- Budget respected (≤2 per small pass)
- Specific target files/symbols named
- Actionable next step identified
```

---

### **Architecture Mode Example**

**Example: Full Architecture Analysis**

```markdown
User: "Understand the authentication module structure"

Preamble:
- Goal: Map auth module architecture
- Plan: Sequential read of auth/ modules
- Budget: ≤2 per module

Phase 1: Overview
→ List src/auth/ directory
→ Found: jwt.ts, middleware.ts, types.ts, index.ts

Phase 2: Sequential Read (one at a time)

Pass 1:
→ Read src/auth/index.ts
→ Evidence: Exports {validateToken, generateToken} from jwt.ts

Pass 2:
→ Read src/auth/jwt.ts
→ Evidence: Core auth logic, depends on crypto lib

Pass 3:
→ Read src/auth/middleware.ts
→ Evidence: Express middleware, uses validateToken from jwt.ts

Phase 3: Dependency Map
→ jwt.ts (provider) → middleware.ts (consumer)
→ All exports via index.ts (public API)

Exit:
✅ Architecture mapped
✅ Key modules understood
✅ Can point to critical paths
→ Ready for changes

Summary:
- Modules: jwt (core), middleware (integration), index (API)
- Dependencies: middleware → jwt → crypto
- Tool calls: 1 list + 3 reads = 4 total (2 per module avg) ✅
```

---

## Mini Flow Template

### **[CG9] 5-Step Discovery Pass** (≤2 tool calls)

```markdown
Step 1: Preamble & Plan
├─ Restate goal + acceptance
├─ Outline sequential plan
└─ Commit to ≤2 tool calls

Step 2: Single Narrow Search
├─ Query for target symbol in scoped path
├─ Avoid repeats
└─ Select top hit

Step 3: Read Top Hit
├─ Open file around symbol
└─ Cite evidence (e.g., src/utils/math.ts:42)

Step 4: Early Stop
├─ Once exact lines known
└─ Record next action (outside discovery)

Step 5: Summary
├─ Findings
├─ file:line
├─ Tool calls used
├─ Risks
└─ Next step
```

---

## Early Stop Criteria

### **[CG10] When to Stop** (khi nào dừng)

**Stop Discovery When** (dừng khám phá khi):

```markdown
✅ Can name exact content to change
   → File path + line number known

✅ Top hits converge (~70%) on one area
   → Consistent signals pointing to same location

✅ Confidence ≥70% for action
   → Enough context to proceed safely

✅ Further search would exceed budget
   → ≤2 calls limit approaching

✅ Architecture map sufficient
   → Key modules + dependencies understood
```

**Continue Discovery When** (tiếp tục khám phá khi):

```markdown
⚠️ Results scattered across many files
   → No clear convergence

⚠️ Confidence <70%
   → Too much uncertainty

⚠️ Cross-file dependencies unclear
   → Need dependency map

⚠️ Within budget
   → Haven't used 2 calls yet
```

---

## Best Practices

### **[CG11] Advanced Guidelines** (hướng dẫn nâng cao)

**Prefer Targeted Sequential Reads**:
```markdown
✅ Good:
- Read one file fully
- Understand it
- Move to next file

❌ Bad:
- Skim multiple files quickly
- Switch rapidly between modules
- Shallow understanding
```

**Time-constrained Approach** (tiếp cận bị giới hạn thời gian):
```markdown
If limited time:
1. Complete overview
2. Focus on top critical modules (Pareto 20%)
3. Proceed to detailed passes for critical only
4. Document remaining gaps
```

**Depth Control** (kiểm soát độ sâu):
```markdown
Trace only:
✅ Symbols you'll modify
✅ Contracts you rely on

Avoid:
❌ Transitive expansion (unless necessary)
❌ Deep dependency trees
❌ Unrelated modules
```

---

## Integration with Context Coordination

### **[CG13] Tier 1 Integration** (tích hợp tầng 1)

**Role in 3-Tier Architecture**:

```markdown
Tier 1: Context Gathering (THIS FILE) ← DISCOVERY PHASE
├─ Companion to: 15-context-understanding.md (execution)
├─ Domain: Discovery, architecture comprehension
├─ Budget: ≤2 per pass
└─ Activation: When need to locate/understand code

Coordination:
→ Both 15 and 16 are System A (Tactical)
→ Managed by 14a+14b-context-coordination
→ Auto-transition to System B at thresholds
```

**When to Use vs 15-context-understanding.md**:

```markdown
Use 16a+16b-context-gathering when:
✅ Need to locate symbol/file (discovery)
✅ Architecture comprehension required
✅ Unclear where code lives

Use 15-context-understanding.md when:
✅ Already know what to change
✅ Execution phase (act on known context)
✅ Quick targeted edits
```

---

## Deliverables

### **[CG14] Expected Outputs** (kết quả mong đợi)

**Every Discovery Session Must Produce**:

```markdown
1. Architecture Summary (if applicable)
   - Module structure
   - Dependencies
   - Key touchpoints

2. Target Files/Symbols List
   - Exact file paths
   - Line numbers
   - Symbol names

3. Expected Change Scope
   - What will be modified
   - Impact analysis

4. Tool Plan & Usage
   - Calls used vs budget
   - Justification if exceeded

5. Success Metrics Check
   - Budget respected?
   - Citations present?
   - Early stop criteria met?
```

---

## Decision Checklist

### **[CG15] Pre-discovery Verification** (xác thực trước khám phá)

```markdown
Before Starting:
□ Restated objective + plan?
□ Committed to ≤2 tool budget?
□ Understand when to stop? (~70% confidence)

During Discovery:
□ One tool call at a time? (sequential-only)
□ Citing `file:line` when referencing?
□ Deduplicating queries (no repeats)?

Before Stopping:
□ Can name exact file/symbol/line to change?
□ Confidence ≥70%?
□ Evidence gathered?
□ Budget respected (or justified)?
□ Next step clear?
```

---

## 🔗 Cross-References

### **Related Rules** (quy tắc liên quan):

**Core Concepts**:
- `rules/16a-context-gathering-tactical.md` — Tactical Methods (Part 1)

**Coordination**:
- `rules/14a-context-coordination-core.md` — Master orchestration (5 Pillars)
- `rules/14b-context-coordination-advanced.md` — Auto-transitions
- `rules/15-context-understanding.md` — Execution companion

**Strategic Layer**:
- `rules/12-context-engineering.md` — System B (compression)
- `rules/13a-local-memory-core.md` — Memory storage
- `rules/13b-local-memory-advanced.md` — Memory integration

**Recovery Layer**:
- `rules/09-ai-drift-prevention.md` — System C (reset)

---

## 🔗 Research References

**Industry Standards**:
- Sequential architecture analysis: Software engineering best practices
- Early stop heuristics: Agile development, iterative discovery
- Tool budget discipline: Cost optimization, efficiency patterns

**Integration**:
- MongoDB 5 Pillars (Tier 1: Retrieval Intelligence)
- Auto-transition logic (14a+14b-context-coordination)

---

**Version**: 1.0.0 (Part 2 of 2)  
**Status**: Production-Ready ✅  
**Integration**: Tier 1 (Tactical/Discovery) in 3-Layer Context Management  
**Core Methods**: See `rules/16a-context-gathering-tactical.md`

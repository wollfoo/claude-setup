---
trigger: always_on
---
---
type: rule
scope: project
priority: critical
activation: always_on
tier: tactical
system: A
---


# 15. Context Understanding — Balanced Thoroughness

## 📋 Overview

**Context Understanding** (hiểu ngữ cảnh) là **Tier 1 (Tactical)** trong unified context management system, tập trung vào việc **hành động nhanh với ngữ cảnh đủ**, tránh tìm kiếm không cần thiết.

**Triết lý chính**: **"Act with Sufficient Context Quickly"** (hành động nhanh với ngữ cảnh đủ)

**Phối hợp bởi**: `rules/14a-context-coordination-core.md` (Master Orchestration Layer)

---

## Core Principles

### **[CU1] Objective & Scope** (mục tiêu & phạm vi)

**Objective** (mục tiêu):
- Hành động với ngữ cảnh đủ một cách nhanh chóng
- Tránh tìm kiếm không cần thiết
- Giảm thiểu overhead trong quá trình thực thi task

**Scope** (phạm vi):
- Áp dụng cho tasks cần đọc code/config/docs để quyết định và hành động
- Tối ưu cho tasks đơn giản đến trung bình (<10 files)
- Minimal overhead approach

**Out of Scope** (ngoài phạm vi):
- Complex multi-file refactoring (→ use System B)
- Architecture comprehension mode (→ use `rules/16b-context-gathering-architecture.md`)
- Long-running sessions >50 turns (→ System C will activate)

---

### **[CU2] Core Principles** (nguyên tắc cốt lõi)

**Focus on Necessary** (tập trung vào cần thiết):
```markdown
✅ DO:
- Đọc chỉ những gì cần để act
- Tránh searches thừa hoặc lặp lại
- Verify outcomes sau partial edits

❌ DON'T:
- Over-search "just in case"
- Gather context không liên quan
- Ask user khi có thể tự tìm answer
```

**Bias Towards Self-sufficiency** (xu hướng tự túc):
```markdown
Principle: "Không hỏi user nếu có thể tự tìm answer"

Khi gặp uncertainty:
1. Quick targeted read (1 file hoặc 1 search)
2. Verify với minimal check
3. Act với documented assumptions
4. Only escalate nếu truly ambiguous
```

**Verify After Partial Edits** (xác thực sau chỉnh sửa một phần):
```markdown
After each edit:
1. Confirm outcome (quick read-back)
2. If uncertain → 1 more minimal check
3. Document remaining uncertainty
4. Don't end turn with unverified changes
```

---

## Heuristics & Decision Logic

### **[CU3] Search vs Internal Knowledge** (tìm kiếm vs kiến thức nội bộ)

**Decision Tree** (cây quyết định):

```markdown
┌──────────────────────────────────────┐
│  Can I answer with internal knowledge?  │
└──────────────────────────────────────┘
          │
    Yes   │   No
    ├─────┴────┐
    ↓          ↓
✅ Proceed   🔍 Need Tools
Internal     │
           ┌─┴───────────────────────┐
           │  Task simple/standard?  │
           └─────────────────────────┘
                 │
           Yes   │   No
           ├─────┴────┐
           ↓          ↓
      1 minimal    2 targeted
      file read    searches
```

**Prefer Internal Knowledge When** (ưu tiên kiến thức nội bộ khi):
- Task is small/standard (e.g., "add console.log")
- Can identify exact changes without reading files
- Pattern is well-known (e.g., "create React component")
- No cross-file dependencies suspected

**Use Tools When** (sử dụng công cụ khi):
- Exact code context needed (function signature, types)
- Cross-file dependencies exist
- Uncertainty remains after internal recall
- Need evidence for citations (`file:line`)

---

## Escape Hatch Protocol

### **[CU4] Proceed Under Uncertainty** (tiến hành dưới uncertainty)

**Principle** (nguyên tắc):
```markdown
Allowed to proceed even if context may be incomplete
→ Report findings and path forward
→ Better than asking user for info you can discover
```

**When to Use Escape Hatch** (khi nào sử dụng):

```markdown
Conditions:
✅ Gathered enough context to act reasonably (~70% confidence)
✅ Further search would exceed tool budget (>2 calls)
✅ Action is safe and reversible
✅ Can document assumptions clearly

Process:
1. State what you know (with evidence `file:line`)
2. State what you're uncertain about
3. Proceed with most reasonable assumption
4. Document assumption for user review
5. Provide clear adjustment path if assumption wrong
```

**Example** (ví dụ):

```markdown
Known:
- Function exists in `src/auth/jwt.ts:42`
- Returns token string
- Used in 3 places

Uncertain:
- Exact error handling in edge cases

Action:
- Proceed with standard try/catch
- Document: "Assumed standard error propagation; adjust if custom handling needed"
```

---

## Procedure

### **[CU5] 5-Step Execution Flow** (quy trình thực thi 5 bước)

**Step 1: Preamble** (mở đầu)
```markdown
Before ANY tool call:
1. Rephrase user's goal concisely
2. Outline sequential plan (one tool per step)
3. Commit to tool budget (≤2 for simple tasks)
```

**Step 2: Minimal Context Check** (kiểm tra ngữ cảnh tối thiểu)
```markdown
Options:
A. Open most relevant file (1 file only)
B. Run one narrow search query

Choose A if:
- File path is known
- Scope is single-file

Choose B if:
- Need to locate symbol
- Unsure which file
```

**Step 3: Act** (hành động)
```markdown
Take the smallest correct step:
- Single-file edit preferred
- Cite evidence (`file:line`)
- Keep diff minimal
- Document rationale
```

**Step 4: Post-action Validation** (xác thực sau hành động)
```markdown
If uncertain about outcome:
1. Quick read-back (verify change)
2. Check cross-references (if applicable)
3. Document any remaining risks

If confident:
→ Skip extra verification
```

**Step 5: Summary** (tóm tắt)
```markdown
State:
- What was done
- Evidence used (`file:line`)
- Next step (if any)
- Tool calls used (vs budget)
```

---

## Constraints & Limits

### **[CU6] Tool Budget & Behavior** (ngân sách & hành vi công cụ)

**Tool Budget Rules** (quy tắc ngân sách):

```markdown
Small Tasks: ≤ 2 tool calls
├─ 1 file read OR 1 search
├─ 1 verification read (optional)
└─ If exceed → brief rationale required

Medium Tasks: ≤ 5 tool calls
├─ Context usage 30-70%
├─ System B may activate
└─ See rules/14-context-coordination-core.md

Complex Tasks: Unlimited
├─ Context usage >70%
├─ System B compression active
└─ Budget managed by System B
```

**Sequential-only Execution** (thực thi tuần tự):
```markdown
CRITICAL: One tool call per step

✅ Correct:
Step 1: Read file A
Step 2: Search pattern B
Step 3: Edit file A

❌ Wrong:
Step 1: Read file A + Search B + Edit A (parallel)
```

**Minimal Verification** (xác thực tối thiểu):
```markdown
After partial edits:
- Required: 1 minimal check before ending turn
- Optional: Full test run (if quick)
- Never: End turn with unverified changes
```

---

## Integration with Context Coordination

### **[CU7] Tier 1 Integration** (tích hợp tầng 1)

**Role in 3-Tier Architecture**:

```markdown
Tier 1: Context Understanding (THIS FILE) ← YOU ARE HERE
├─ Domain: Simple tasks, clear scope, low uncertainty
├─ Budget: ≤2 tool calls
└─ Activation: context_usage <30%, turns <10

Tier 2: Context Engineering (rules/12-context-engineering.md)
├─ Domain: Medium tasks, accumulating context
├─ Budget: Unlimited with compression
└─ Activation: context_usage ≥30% OR turns ≥10

Tier 3: Drift Prevention (rules/09-ai-drift-prevention.md)
├─ Domain: >50 turns, drift detected
├─ Budget: N/A (reset operation)
└─ Activation: context_usage >80% OR turns >50
```

**Auto-transition to System B When** (tự động chuyển sang System B khi):

```markdown
Triggers (from rules/14a-context-coordination-core.md):
- Context usage ≥30%
- Turn count ≥10
- Files touched ≥5

Action:
1. System B takes over
2. Begin request-response tracking
3. Enable compression
4. Build semantic index

Reference: [CC2] Retrieval Intelligence in rules/14a-context-coordination-core.md
```

---

## Success Metrics

### **[CU8] Performance Indicators** (chỉ số hiệu năng)

**Primary Metrics** (chỉ số chính):

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| **Tool Budget** | ≤2 calls | - | 🎯 |
| **Evidence Citation** | 100% | - | 🎯 |
| **Scope per Step** | Single file/query | - | 🎯 |
| **Unnecessary Questions** | 0 | - | 🎯 |

**Quality Metrics** (chỉ số chất lượng):

```markdown
✅ Success Indicators:
- At least 1 `file:line` citation per response
- Clear preamble present
- Concise final summary
- Budget respected (≤2 unless justified)
- Specific target files/symbols named
- Actionable next step identified

❌ Failure Indicators:
- Repeated searches with no new params
- Opening multiple files at once
- Assertions without `file:line` evidence
- Budget exceeded without rationale
- Asking user for info easily discoverable
```

---

## Examples

### **[CU9] Good vs Bad Patterns** (mẫu tốt vs xấu)

**✅ Good - Minimal Flow**:
```markdown
1. Preamble: Goal + Plan + Budget (≤2)
2. Read `src/auth/jwt.ts:42-65` (Evidence)
3. Edit with minimal diff (cite `file:line`)
4. Summary: Tool calls=2, Next step
```

**❌ Bad - Over-searching**:
```markdown
1. No preamble
2. Broad repo search "jwt" → 50 results
3. Read all 10 files (exceeds budget)
4. Ask user (info was discoverable)
→ Problems: No preamble, no `file:line`, budget exceeded
```

---

## Anti-patterns

### **[CU10] Common Mistakes** (lỗi thường gặp)

**Common Mistakes**:

1. **Repeated Search**: Multiple broad searches → ✅ Single targeted query
2. **Multi-file Opening**: Parallel reads → ✅ Sequential, most relevant first
3. **Evidence-free**: "in auth module" → ✅ Cite `src/auth/jwt.ts:42`
4. **Budget Exceeded**: 5 calls, no reason → ✅ Justify if >2 calls
5. **User Escalation**: Ask for discoverable info → ✅ Search + proceed

---

## Stop Criteria

### **[CU11] When to Stop** (khi nào dừng)

**Early Stop Conditions** (điều kiện dừng sớm):

```markdown
Stop when:
✅ Can name exact content/file/symbol to change
✅ Evidence gathered (≥1 `file:line`)
✅ Confidence ≥70% for action
✅ Results converge on one area
✅ Further search would exceed budget

Continue when:
⚠️ Uncertainty >30%
⚠️ No evidence yet
⚠️ Results scattered across many files
⚠️ Cross-file dependencies unclear
```

---

## Decision Checklist

### **[CU12] Pre-action Verification** (xác thực trước hành động)

**Before Each Tool Call**:

```markdown
□ Is target file/symbol identifiable with 1 narrow read/search?
□ Can internal knowledge answer without reading?
□ What is minimal next action to reduce uncertainty?
□ Are there cross-file dependencies requiring verification?
□ Am I within tool budget (≤2)?
□ Have I stated preamble (goal + plan)?
```

**Before Ending Turn**:

```markdown
□ Have I cited evidence (`file:line`)?
□ Did I stay within budget (or justify)?
□ Is there remaining uncertainty documented?
□ Have I verified partial edits?
□ Is next step clear?
```

---

## 🔗 Related Rules

**Coordination**:
- `rules/14a-context-coordination-core.md` — Master orchestration, auto-transitions
- `rules/16a-context-gathering-tactical.md` — Companion (discovery)
- `rules/16b-context-gathering-architecture.md` — Companion (architecture mode)

**Strategic Layer**:
- `rules/12-context-engineering.md` — System B (compression, checkpoints)
- `rules/13a-local-memory-core.md` — Memory storage

**Recovery Layer**:
- `rules/09-ai-drift-prevention.md` — System C (reset, recovery)
---

## Deliverables

### **[CU13] Expected Outputs** (kết quả mong đợi)

**Every Response Must Include**:

```markdown
1. Evidence of target files/symbols
   → At least 1 `file:line` citation

2. Brief post-action note
   → Outcome + remaining uncertainty (if any)

3. Tool usage report
   → Plan + actual calls + budget status

4. Success metrics check
   → ≤2 calls? Evidence cited? Next step clear?
```

---

## 🔗 Research References

**Industry Standards**:
- Sequential-only execution: MCP 1.0 (Anthropic 2024)
- Tool budget discipline: Cost optimization best practices
- Evidence-first approach: Software engineering standards

**Integration**:
- MongoDB 5 Pillars (Tier 1: Persistence Architecture)
- Auto-transition logic (14-context-coordination.md)


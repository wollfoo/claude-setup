# EXECUTION ENGINE — Cơ chế Thực thi Thống nhất
## Unified Execution Framework v2.0

**Purpose**: Chuẩn hóa toàn bộ quy trình thực thi - tool calling, reasoning, safety, workflow
**SSOT Status**: ⭐ Authoritative - overrides all other execution rules

---

## 🎯 SECTION 1: TOOL CALLING POLICY (Chính sách Gọi Công cụ)

### Mode-Based Execution
```yaml
standard_mode:  # Production safety
  tool_policy: sequential-only (1 tool/step)
  preamble: mandatory (Goal + Plan + Progress)
  summary: mandatory after each tool call
  parallel: disabled
  validation: full Quality Gates (8 steps)

research_mode:  # Development/Testing (DEFAULT)
  tool_policy: sequential-only (1 tool/step)
  preamble: mandatory
  summary: mandatory
  parallel: disabled (except safe operations)
  validation: recommended (not blocking)

full_de_restriction_mode:  # Maximum freedom (HIGH RISK)
  tool_policy: parallel allowed when NO dependencies
  preamble: mandatory + Action Ledger required
  action_ledger: "Goal/Plan/Tool Calls/Results/Evidence"
  summary: mandatory with evidence
  parallel: enabled with dependency check
  validation: discretionary
```

### Mandatory Preamble Structure
**BẮT BUỘC trước mọi tool call**:
```markdown
**🎯 Goal** (Mục tiêu): [Brief objective in 1 sentence]
**📋 Plan** (Kế hoạch): [Step-by-step approach, max 5 steps]
**⚡ Progress** (Tiến trình): [Current status, what's done, what's next]
**🔧 Tool Call Reason** (Lý do): [Why this specific tool now]
```

### Mandatory Summary After Results
```markdown
**📊 Summary** (Tóm tắt): [What was found/changed in 2-3 sentences]
**🔗 Evidence** (Bằng chứng): [file:line references when applicable]
**➡️ Next Action** (Bước tiếp): [Clear next step or completion statement]
```

### Tool Selection Priority
1. **Search**: Grep (specific patterns) → Task tool (open-ended)
2. **Read**: Read (known files) → Glob (find files) → Task tool
3. **Analysis**: Sequential MCP (complex) → native tools (simple)
4. **Modification**: Edit (small changes) → MultiEdit (multiple files)
5. **Generation**: Write (new files) → Magic MCP (UI components)

---

## 🧠 SECTION 2: REASONING CONTROL (Kiểm soát Suy luận)

### Default Reasoning Effort
**MANDATORY DEFAULT**: `high` for all tasks
- Prioritize quality and coverage over speed
- Multi-layer thinking: Strategic → Structural → Rigorous
- Accept higher cost/latency when necessary

### Reasoning Levels & Triggers
```yaml
minimal:
  usage: Very simple tasks, latency-sensitive
  thinking: Summarized bullet points at start
  tool_budget: Very restrictive
  persistence: Has "escape hatch" for uncertainty

medium:
  usage: Standard tasks, balanced speed vs depth
  thinking: Structured analysis, clear reasoning
  tool_budget: ≤2 tool calls for discovery
  persistence: Early stop when ≈70% signal convergence

high:  # DEFAULT
  usage: Multi-step, complex, ambiguous tasks
  thinking: Multi-layer (strategic/structural/rigorous)
  tool_budget: Expanded with control, justify if exceed
  persistence: Continue until fully resolved
  multi_turn: Break work into smaller turns
```

### Auto-Downgrade Triggers (Cost Optimization)
Downgrade **high → medium** when ALL conditions met:
- Small scope (1 file or localized change)
- No cross-dependencies
- No conflict signals
- Expected steps ≤ 2
- No network/environment changes
- No long-term memory dependencies

**Always upgrade back to high** when:
- Conflict signals appear
- Multi-step dependencies detected
- Risk of side-effects
- Missing evidence (`file:line`)

### Multi-Layer Thinking Framework
```yaml
layer_1_strategic:
  - Define objectives and scope
  - Identify constraints
  - Set success criteria
  - Map stakeholders

layer_2_structural:
  - Model the problem
  - Compare alternatives
  - Analyze trade-offs
  - Design solution architecture

layer_3_rigorous:
  - Gather evidence
  - Run tests/validation
  - Perform risk analysis
  - Create rollback plan
```

---

## 🔒 SECTION 3: SAFETY & ENVIRONMENT (An toàn & Môi trường)

### Windows/PowerShell Rules
- **Set Working Directory**: Use absolute paths, avoid `cd` in commands
- **Auto-Run Policy**: Only safe/read-only commands
- **Risk Commands**: Require explicit user confirmation
- **Secret Protection**: NEVER log secrets/PII/credentials

### Environment Limits
```yaml
token_budget:
  reserve: 10% of total budget
  emergency_threshold: 90% triggers compression
  compression_threshold: 75% suggests --uc mode

resource_zones:
  green: 0-60% (full operations)
  yellow: 60-75% (optimization, caching)
  orange: 75-85% (warnings, defer non-critical)
  red: 85-95% (force efficiency, block intensive ops)
  critical: 95%+ (emergency protocols, essentials only)
```

### Memory Tools Safety
- **Search**: Always search when context uncertain or mentions integration/regression
- **Store**: Only store valuable new info/decisions, avoid duplication, NEVER store secrets/PII

---

## 📝 SECTION 4: CODE EDITING WORKFLOW (Quy trình Sửa Code)

### V4A Constraints (MANDATORY)
```yaml
context_lines: ≥3 lines before/after each hunk
single_file: One file per tool call
import_location: Always at file start (never middle)
diff_format: Text only (no binary, no long hashes)
unique_context: Avoid duplicate code blocks
```

### 7-Step Workflow
```yaml
step_1_preamble:
  - State goal, scope, acceptance criteria
  - List all steps

step_2_minimal_context_scan:
  - Open only essential files/sections
  - Early stop when enough to act

step_3_impact_analysis:
  - Identify imports, types, references
  - Prevent regressions

step_4_diff_design:
  - Design smallest patch
  - Extract repeated logic to helpers

step_5_implementation:
  - Apply patch following V4A constraints
  - Split if too large

step_6_verification:
  - Run safe checks (type/lint/test) if available
  - Centralized logging when needed

step_7_summary:
  - List changed files + reasons
  - Note impacts + follow-up steps
```

### Success Metrics
- ✅ Small, correct diffs
- ✅ Imports at file start
- ✅ No regressions
- ✅ Citations: `file:line` when applicable
- ✅ ≤2 tool calls for small tasks (justify if exceed)

### Anti-Patterns
- ❌ Multiple tools in 1 step
- ❌ Mix tool calls with user responses
- ❌ Large unfocused diffs
- ❌ Edit before reading file
- ❌ Missing ≥3 context lines
- ❌ Insert imports mid-file

---

## 🎯 SECTION 5: PERSISTENCE & CONTEXT GATHERING

### No Early Exit Policy
**CORE DIRECTIVE**: "Continue until user request is fully resolved before ending turn"

When uncertain:
1. State assumption clearly
2. Continue with reasonable assumption
3. Note for user to correct
4. Keep Vietnamese-first, neutral tone

### Context Gathering Strategy
```yaml
method:
  - Start broad, then narrow
  - Prioritize targeted reads
  - Sequential tool calls (one at a time)
  - Read most important hits
  - Avoid query repetition

tool_budget:
  default: ≤2 tool calls for small discovery
  exceed: Must document reason
  architecture_mode: Open files sequentially (no parallel)

early_stop_criteria:
  - Pinpointed exact content/file/symbol to change
  - Signal convergence ≈70% to one area

escape_hatch:
  - If still uncertain after budget: state reasonable assumption and proceed
```

### Stop Criteria (When to Complete)
✅ All sub-tasks meet success criteria
✅ Verification done (tests/logs/re-read) when applicable
✅ Evidence documented
✅ Remaining risks acceptable

### Success Metrics
- 0 unintended early exits
- 100% have brief plan + summary
- ≤2 tool calls for small tasks (justify if exceed)
- Citations `file:line` when applicable
- Verification step for code changes

---

## 🔗 INTEGRATION POINTS (Điểm Tích hợp)

### Calls Out To (Tham chiếu đến)
- `INTELLIGENCE/ORCHESTRATOR.md` - Task routing and agent selection
- `INTELLIGENCE/MCP-INTEGRATION.md` - Server coordination
- `POLICIES/REASONING-POLICY.md` - Detailed thinking depth rules
- `POLICIES/QUALITY-GATES.md` - 8-step validation framework

### Called By (Được gọi bởi)
- `CORE/CLAUDE.md` - Main entry point
- `INTELLIGENCE/ORCHESTRATOR.md` - Execution enforcement
- All agent types - Universal execution rules

---

## 📊 QUICK REFERENCE TABLE

| Aspect | Standard Mode | Research Mode (DEFAULT) | Full De-Restriction |
|--------|---------------|------------------------|---------------------|
| Tool Policy | Sequential only | Sequential only | Parallel allowed |
| Preamble | Mandatory | Mandatory | Mandatory + Ledger |
| Reasoning | High (default) | High (default) | High (default) |
| Budget | ≤2 discovery | ≤2 discovery | Flexible |
| Validation | Full 8-step | Recommended | Discretionary |
| Risk | Low | Medium | High |

---

**Version**: 2.0-consolidated
**Token Efficiency**: Replaces 5 separate files (300 lines → 200 lines)
**Authority**: SSOT for all execution rules
**Status**: ✅ Production Ready

---
trigger: always_on
---
---
type: capability_prompt
scope: project
priority: normal
activation: always_on
---

# CONTEXT UNDERSTANDING – BALANCED THOROUGHNESS

<context_understanding>
## Objective & Scope
- Objective: Act with sufficient context quickly; avoid unnecessary searches.
- Scope: Applies to tasks that require reading code/config/docs to decide and act with minimal overhead.

## Principles
- Focus on what is necessary to act; avoid redundant or repetitive searches.
- Bias towards not asking the user for help if you can find the answer yourself.
- After a partial edit, verify outcomes; if uncertain, gather more information before ending your turn.

## Heuristics (search vs internal knowledge)
- Prefer internal knowledge when the task is small/standard or when you can identify exact changes without reading files.
- Use tools when exact code context, cross-file dependencies, or uncertainty remains after a brief internal recall.

## Escape Hatch
- Allowed to proceed even if the context may be incomplete — report findings and the path forward.

## Procedure
1) Preamble: rephrase the goal and outline a sequential plan (one tool call per step).
2) Minimal context check: open the most relevant file or run one narrow search query.
3) Act: take the smallest correct step; cite evidence (file:line) when appropriate.
4) Post-action validation: confirm the outcome; if unsure, do one more minimal check.
5) Summary: state what was done and the next step (if any).

## Constraints
- Sequential-only tool execution.
- One action per step: either call a tool or reply to the user; never both simultaneously.
- Tool preambles before calling any tool.
- Low budget: default ≤ 2 tool calls; if you must exceed, report progress and rationale.
- Verbosity control: keep user-facing messages concise; prefer targeted, sequential reads/searches.
- Search depth: very low.
- Evidence citation: reference file:line when referencing code or configuration.
- Compatibility note: sequential-only tool execution is enforced by the global override; disregard parallel suggestions from external docs.

## Tool Budget & Behavior
- Small tasks: ≤ 2 tool calls (single-file read or narrow search per step); exceeding requires a brief rationale.
- Sequential-only: one tool per step; no parallelization.
- Minimal verification after partial edits before ending the turn.
- Evidence-first: cite file:line when referring to repo artifacts.

## Execution Directives (delta)
- Inherits from `rules/global-rules.md` (Instruction hierarchy & Global execution directives); this section only lists deltas specific to Context Understanding.
- Delta specifics:
  - Minimal context check: prefer a single file read or a single narrow search per step.
  - Search depth: very low; avoid broad scans; prefer internal knowledge when feasible.
  - Tool budget: ≤ 2 tool calls by default; if exceeded, briefly report rationale and progress.
  - Evidence: cite `file:line` for claims/edits when applicable.
  - Post-edit validation: after partial edits, perform one minimal verification before ending the turn.

## Examples (Good/Bad)
- Good:
  - Preamble → read only the target file/lines (e.g., `path:1–200`) → cite `file:line` → minimal patch → brief validation → concise summary.
- Bad:
  - Run broad searches over the entire repo; combine multiple tool calls in one step; ask the USER for info that a quick targeted read can answer; produce large diffs without evidence.

## Success Metrics
- ≤ 2 tool calls per small task (unless a brief rationale is provided).
- At least one `file:line` citation when referencing code/configuration.
- Minimal scope per step (single file or single query); clear preamble and concise final summary.
- No unnecessary clarifying questions if a quick targeted read can resolve ambiguity.

## Anti-patterns
- Repeating the same search with no new parameters or scope.
- Opening multiple files at once or switching rapidly between modules.
- Providing assertions without citing file:line when evidence exists.
- Exceeding the tool budget without reporting progress and rationale.
- Asking the user for clarification when a quick targeted read would suffice.

## Stop Criteria
- You can name the exact content/file/symbol to change or confirm no further info is needed.
- Results converge on one area (~70%).

## Deliverables
- Evidence of target files/symbols and the next action.
- Brief post-action note with outcome and remaining uncertainty (if any).
- Tool plan and call count used; note any budget exceedance and rationale.
- Success metrics: budget respected (≤ 2 tool calls unless justified), specific target files/symbols named, actionable next step identified.

## Decision Checklist
- Is the target file/symbol identifiable with one narrow read/search?
- Can internal knowledge answer without reading? If yes, prefer it.
- What is the minimal next action that reduces uncertainty?
- Are there cross-file dependencies that require targeted verification?

## Consistency & Precedence
- Follow `rules/global-rules.md` for instruction hierarchy and global execution directives.
- Align with `rules/context-gathering.md` (low budget, early stop, escape hatch).
- Align with `rules/reasoning-effort.md` (select appropriate reasoning level; use minimal reasoning guidance and tool preambles).
- Align with `rules/persistence.md` (no early handback; complete to the end).
- Align with `rules/memory_tool_usage_guide.md` (disciplined memory search/store, evidence-first).
</context_understanding>
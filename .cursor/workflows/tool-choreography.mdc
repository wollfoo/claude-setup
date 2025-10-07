---
description: Tool Choreography – goal pre-processing, planning, and sequential tool calling
auto_execution_mode: 3
---

 # Tool Choreography
 
 Goal: Standardize one-to-one sequential tool calling with a preamble and clear progress updates.
 
 References:
 - `rules/tool-calling-override.md`
 - `rules/tool-preambles.md`
 - `rules/context-gathering.md`
 - `rules/context-understanding.md`
 - `rules/agentic-tools.md`, `rules/code-editing-rule.md`
 - `rules/environment-profile.md` (Windows/PowerShell; set Cwd; no inline `cd`; bounded outputs; restricted network)
 - `rules/global-rules.md`, `rules/reasoning-effort.md`, `rules/markdown-formatting.md`
 - `rules/rule-precedence.md`, `rules/working-principles.md`
 
 ## Preconditions
 - Define objective, scope, constraints, and success/stop criteria.
 - Set `reasoning_effort` (mức độ lập luận): default high for complex/multi-step tasks; lower to medium/minimal when latency matters.
 - Plan sequential-only steps; exactly one tool per step; no tool+reply in the same step.
 - Tool budget for small tasks ≤ 2 calls; if exceeding, briefly state rationale.
 - Bound outputs; cite `file:line` when referencing repo artifacts.
 - Environment: Windows/PowerShell; set Cwd; no inline `cd`; restricted network; safe auto-run only for read-only actions.
 
 ## When to use
 - Before any sequence that involves tool calls (read files, search, write files, run commands, ...).
 - When multi-step orchestration and progress transparency are required.
 - When minimizing risk via sequential-only execution and explicit preambles is important.
 
 ## Procedure
 1) Preamble
    - Goal: Rephrase the user's objective for this step.
    - Plan: Outline ordered actions (one tool per step) with stop criteria.
    - Constraints: Note sequential-only, evidence-first, and environment limits.
 2) Execute (sequential-only)
    - One tool call per step. Do not both call a tool and reply in the same step.
    - Reading/searching: one file or one query per step; use early stop and low tool budget.
    - Code edits: use V4A patch (apply_patch); single file per patch; ≥3 lines of pre/post context; unique context; no unrelated edits.
    - Imports: at the top only; if adding imports mid-file, add a dedicated top-of-file hunk.
    - Avoid editing binaries or `.ipynb`.
    - Commands: set Cwd (no inline `cd`); bound outputs; safe to auto-run only read-only commands; request approval for installs/network/state mutations.
 3) Progress updates (after each tool call)
    - Summary: what happened.
    - Next: the next action or stop.
    - Uncertainty: any remaining doubts; apply escape hatch if needed.
 4) Verification
    - Re-read changed areas or run safe checks. Consider edge cases.
 5) Wrap-up
    - Provide final summary: completed items, remaining work, and proposed next steps.
 
 ## Safety & Environment (gate)
 - Follow `rules/environment-profile.md`: set Cwd; no inline `cd`; bounded outputs; restricted network.
 - Treat network/install/delete/state-mutating actions as unsafe; require explicit approval.
 
 ## Constraints
 - Sequential-only execution: one tool per step; no tool+reply in the same step.
 - Reading/searching: single file or single query per step; escalate sequentially when needed.
 - Patching: V4A only; ≥3 lines of pre/post context per hunk; imports at top; single file per patch.
 - Evidence-first: cite `file:line` for claims/edits when applicable.
 - Bounded outputs; adhere to output caps.
 - Safe actions only without approval; otherwise gate and escalate.
 
 ## Success metrics
 - Zero instances of multiple tool calls in one step; no tool+reply mixed.
 - Minimal, correct diffs; imports at top; V4A constraints satisfied.
 - Evidence citations present (`file:line`); bounded outputs respected.
 - Small tasks respect low tool budget (≤ 2 calls) unless justified.
 
 ## Anti-patterns
 - Parallel/batched tool calls; combining unrelated queries.
 - Over-searching without early stop; assertions without citations.
 - Adding imports mid-file; missing context lines; sweeping refactors.
 - Using inline `cd`; running installs/network/stateful commands without approval.
 
 ## Examples
 - Good:
   - Search narrowly for a symbol → open the top file → apply minimal V4A patch → verify and summarize with `file:line`.
 - Bad:
   - Run grep + open files + patch in the same step; patch multiple files at once; no citations.
 
 ## Stop criteria
 - Objective met and verified; or
 - Action requires approval/out-of-scope (stop and escalate with a clear next step).
 
 ## Consistency & Precedence
 - Resolve conflicts per `rules/rule-precedence.md` (System > Developer > AGENTS > Domain).
 - Defer to `rules/tool-calling-override.md` for sequential-only execution policy.
 
 ## Deliverables
 - Complete preamble (goal + plan) at the start of the step.
 - Clear step-by-step progress updates after each tool call.
 - Final summary (completed, remaining, next).
 - Verbosity control: concise user-facing messages; detailed, reviewable patches.
 - If modifying files, produce a standard V4A patch using apply_patch.
 - Evidence citations (`file:line`) and tool plan/call count (when relevant).
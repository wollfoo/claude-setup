---
description: Context Scan – quick, sequential context scan with early stop (Early Stop)
auto_execution_mode: 3
---

# Context Scan

Goal: Gather just enough context to act quickly, avoid over-searching, and follow the sequential-only principle.

References:
- `rules/context-gathering.md`
- `rules/tool-calling-override.md`
- `rules/tool-preambles.md`
- `rules/environment-profile.md`
- `rules/rule-precedence.md`
- `rules/reasoning-effort.md`
- `rules/context-understanding.md`
- `rules/persistence.md`
- `rules/memory_tool_usage_guide.md`

## When to use
- At the start of a new task to understand context/module boundaries.
- When ambiguity is high and you need to identify the minimal impact area.

## Preconditions
- Confirm objective, scope, constraints, and success criteria.
- Identify candidate files/paths; prefer high-signal entry points (READMEs, manifests, main modules).
- Plan to stop early once you can name the exact file/symbol to change.

## Procedure
1) Rephrase the goal per `tool-preambles.md`.
2) Draft a minimal plan with key questions and expected files/paths to inspect.
3) Global overview:
   - List high-level structure (docs/manifests, entrypoints, main directories).
4) Lightweight dependency mapping:
   - Record import/config relations.
   - Prefer reading providers before consumers.
5) Module pass:
6) Selective deep dive:
   - Dive into central/high-risk functions/classes only.
7) Verification loop:
   - If new relations are discovered, update the map and revisit impacted areas.

 ## Constraints
 - Sequential-only: one tool call per step. Do not batch multiple files/queries.
 - Early stop: stop once you can precisely name the content to change.
 - One action per step: either call a tool or reply to the user; never both simultaneously.
 - Low budget: default ≤ 2 tool calls; if you must exceed it, report progress and rationale.
 - Bounded outputs and `file:line` citations (see `rules/environment-profile.md`).
 - Windows/PowerShell: Set Cwd; avoid `cd`; keep outputs bounded (see `rules/environment-profile.md`).
 - No network or state-mutating commands without explicit approval/escalation.

## Stop criteria
- You can identify the exact file/function/class to modify.
- Search results converge (~70%) on one area.
- Budget respected (≤ 2 tool calls for small tasks) or exceedance justified.
- Clear exit point reached with named target files/symbols and scope.
- Evidence cited with `file:line` when appropriate; outputs are bounded.
- Sequential-only execution with preamble/plan present.

## Anti-patterns
- Opening many files at once without narrowing scope.
- Broad scans at repo root instead of targeted queries.
- Continuing to read after the target is already clear (not stopping early).
- Mixing analysis with edits in the same step; violating one-action-per-step.

## Examples
Good:
- Read top-level README, then `src/app/` index, then stop after identifying `handlers/user.ts` as target.

Bad:
- Run multiple wide searches and open 10+ files without deciding where to act.

## Deliverables
- Architecture summary and key touchpoints.
- List of target files/symbols and the expected change scope.
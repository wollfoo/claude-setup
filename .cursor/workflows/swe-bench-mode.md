---
description: SWE-Bench Mode – rigorously verified development mode
auto_execution_mode: 3
---

# SWE-Bench Mode

Goal: Make small, focused code changes via patches, verify thoroughly, cover edge cases, and only finish when correctness is certain.

References:
- `rules/swe-bench.md` (Verified Developer Instructions)
- `rules/environment-profile.md` (Windows/PowerShell; bounded outputs; restricted network; set Cwd; no inline `cd`)
- `rules/tool-preambles.md`, `rules/tool-calling-override.md`, `rules/persistence.md`
- `rules/agentic-tools.md`, `rules/code-editing-rule.md`
- `rules/context-gathering.md`, `rules/context-understanding.md`
- `rules/global-rules.md`, `rules/reasoning-effort.md`, `rules/markdown-formatting.md`, `rules/rule-precedence.md`, `rules/working-principles.md`

## Preconditions
- Define objective, scope, constraints, and success/stop criteria.
- Set `reasoning_effort`: high for complex/multi-step tasks; lower only if latency is critical.
- Plan sequential-only steps; one tool per step; no tool+reply in the same step.
- Bound outputs; cite `file:line` when referencing the repo.
- Environment: Windows/PowerShell; set Cwd; no inline `cd`; restricted network; safe actions only.

## When to use
- When fixing bugs or building high-risk features that require high reliability.
- When tasks resemble SWE-Bench-style evaluations with hidden tests and edge cases.
- When cross-file dependencies or minimal-diff constraints are important.

## Procedure
1) Preamble
    - Restate the goal and outline a sequential plan with explicit stop criteria.
2) Context gathering (early stop, low budget)
    - Prefer internal knowledge first. If needed, run one narrow search or single-file read; cite `path:line`.
    - Stop as soon as you can name the exact file/symbol/lines to change.
3) Patch design (V4A)
    - Single file per patch. ≥3 lines of pre/post context per hunk. Unique context; avoid oversized hunks.
    - Imports at the top only; if adding imports mid-file, add a dedicated top-of-file hunk.
    - Avoid editing binaries or `.ipynb`; avoid unrelated changes in one patch.
4) Apply patch (small steps)
    - Implement the smallest change that solves one logical purpose; record progress.
5) Verification
    - Re-read the modified region to confirm the change. Run safe checks if available. Consider edge cases and hidden tests.
    - Validate environment constraints (output caps, network restrictions, sandbox).
6) Double/Triple check
    - Confirm no unintended side effects, import placement, and context lines are correct.
7) Rollback plan
    - Keep diffs small and reversible; prepare an inverse patch if risk is high.
8) Summary
    - Outline changes, rationale, evidence with `file:line`, and verification results.

## Safety & Environment (gate)
- Follow `environment-profile.md`: set Cwd, no inline `cd`; restricted network; no installs or state mutation without approval.
- Treat network/file-deleting/installing actions as unsafe; request approval before proceeding.

## Constraints
- Sequential-only tool calls; one tool per step; no tool+reply in the same step.
- Evidence first; avoid assumptions; cite `file:line` when referencing the repo.
- Bounded outputs; do not exceed output caps.
- No unrelated changes in a single patch.

## Success metrics
- Minimal, correct diffs that pass visible checks and consider hidden tests.
- Imports at top; ≥3 lines of context per hunk; single file per patch.
- Evidence citations present; sequential-only execution respected; zero unsafe auto-actions.

## Anti-patterns
- Over-searching or parallel tool calls; mixing multiple files in one patch.
- Adding imports mid-file; missing context lines; broad refactors without reading first.
- Running network/install commands without approval; using inline `cd`.

## Examples
- Good: Read target file, apply a minimal V4A hunk to fix a guard, re-read to verify, and summarize with `file:line` citations.
- Bad: Sweep refactor across multiple files with mixed concerns and no verification.

## Stop criteria
- The fix is implemented and verified per checks above; or
- Approval is required/out of environment scope (stop and escalate).

## Consistency & Precedence
- Resolve conflicts per `rules/rule-precedence.md` (System > Developer > AGENTS > Domain).
- Defer to `rules/tool-calling-override.md` for sequential-only execution.

## Deliverables
- Minimal, standard-format patch.
- Verification summary (including critical edge cases) and results.
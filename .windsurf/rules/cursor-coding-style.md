---
trigger: always_on
---

---
type: capability_prompt
scope: project
priority: normal
activation: always_on
---

# CURSOR CODING STYLE – CLARITY + PROACTIVE

## Objective & Scope

- Objective: Provide prescriptive, executable style rules for code changes created via Cursor/Windsurf proposals so they are clear, reviewable, and safe-by-default.
- Scope: Applies to all code edits (logic, structure, naming, comments, imports) produced through code-edit tools. Out of scope: product ideation beyond the user request.

## Core Principles

- Clarity over cleverness; readability and maintainability first.
- Single responsibility per function/module; avoid hidden side effects.
- Self-documenting names; minimal but meaningful comments where intent is non-obvious.
- Deterministic, focused diffs; avoid noisy or cross-cutting edits in one patch.
- Imports must be at the top of the file; never introduce imports mid-file.

## Execution Directives (Style → Action)

- Patch granularity
  - One logical purpose per patch; split unrelated concerns into separate hunks/patches.
  - Keep diffs small and localized; prefer incremental refactors over sweeping changes.
  - Maintain ≥3 lines of context before/after each change (V4A constraint).

- Structure & naming
  - Use descriptive, domain-relevant names; avoid single-letter identifiers except in tight scopes.
  - Favor early returns; minimize deep nesting by extracting helpers.
  - Keep functions focused (rule of thumb: < 50 lines); extract when complexity grows.

- Error handling & logging
  - Validate inputs/assumptions at boundaries; fail fast with actionable messages.
  - Use structured, level-appropriate logs; avoid console spam in hot paths.
  - Logs language: With structured logging, keep keys/fields in English (stable for machine parsing), and the `message` in Vietnamese; important logs can include a short English sentence. If the external standard requires English, add Vietnamese annotations or bilingual content. Follow `rules/language-rules.md`.

- Comments & docs
  - Prefer intent-revealing code; add comments for non-obvious decisions, invariants, or edge cases.
  - Keep comments adjacent to the code they describe; update when refactoring.

- Docstring/comment language: Default to Vietnamese; when mentioning an English term, include a brief Vietnamese explanation following the “Standard Syntax” in [rules/language-rules.md].
- Bilingual (Vietnamese first, English after) for module-level and Public API docstrings, as well as operational guides; apply this when the team primarily uses Vietnamese.

- Imports & dependencies
  - Place imports at file top only; if adding imports during an edit, use a dedicated top-of-file hunk.
  - Remove unused imports/types as part of the patch if they are clearly dead and safe to remove.

## Proactive Editing Workflow

1) Minimal context pass (≤ 2 tool calls) per `rules/context-gathering.md` to locate exact symbols/files.
2) Implement focused patch via the standard diff tool; avoid mixing unrelated edits.
3) Provide a brief, structured change summary (what/why/risk) for the user to review.
4) If the change is high-risk, stage it in smaller steps with verification checkpoints.

## Examples (Good/Bad)

- Good
  - Rename unclear variables/functions to intent-revealing names and update all references.
  - Extract a nested conditional into a well-named helper to flatten control flow.
  - Move imports to the top and remove unused ones as part of the same clarity-focused patch.

- Bad
  - Combine a style refactor with a new feature or API change in one patch.
  - Add imports mid-file or introduce dead code/tests not used by the change.
  - Large sweeping renames without verifying all call sites or providing evidence (`file:line`).

## Success Metrics

- Readability improves (clearer names, simpler control flow, reduced nesting).
- Diffs are small, focused, and easy to review; no unrelated changes bundled.
- Imports are correctly organized at the top; no mid-file imports.
- The code compiles/tests pass (when applicable); no regressions introduced by style edits.

## Anti-patterns

- Code-golfing or overly clever one-liners that hurt readability.
- Mixing concerns (style + feature + infra) in a single patch.
- Introducing hidden side effects, silent behavior changes, or unverified renames.
- Writing comments that restate the code rather than explain intent/invariants.

## Consistency & Precedence

- This rule complements and defers to: `rules/agentic-tools.md`, `rules/code-editing-rule.md`, `rules/tool-calling-override.md`, `rules/context-gathering.md`, `rules/environment-profile.md`, `rules/working-principles.md`, and `rules/language-rules.md`.
- Follow the precedence: System > Developer > AGENTS > Domain (`rules/rule-precedence.md`).

## Stop Criteria

- The patch achieves its single, stated purpose; success metrics are met.
- A concise change summary is provided and no unrelated edits are included.

## Quick Checklist

- Purpose of change is explicit and singular.
- Diff is minimal and localized; unrelated edits split out.
- Imports placed at file top; no mid-file imports.
- Names are intent-revealing; complex logic extracted; early returns preferred.
- Evidence (`file:line`) cited when referencing existing code; brief summary prepared.

- Write code for clarity first. Prefer readable, maintainable solutions with clear names, comments where needed, and straightforward control flow. Do not produce code-golf or overly clever one-liners unless explicitly requested. Use high verbosity for writing code and code tools.

- Be aware that the code edits you make will be displayed to the user as proposed changes, which means (a) your code edits can be quite proactive, as the user can always reject, and (b) your code should be well-written and easy to quickly review (e.g., appropriate variable names instead of single letters). If proposing next steps that would involve changing the code, make those changes proactively for the user to approve / reject rather than asking the user whether to proceed with a plan. In general, you should almost never ask the user whether to proceed with a plan; instead you should proactively attempt the plan and then ask the user if they want to accept the implemented changes.
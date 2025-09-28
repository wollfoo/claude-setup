---
trigger: manual
---

---
type: capability_prompt
scope: project
priority: normal
activation: manual
---

# SWE-BENCH – VERIFIED DEVELOPER INSTRUCTIONS

<swe_bench>
## Objective & Scope
- Objective: Maximize correctness and reliability on SWE-Bench tasks (bug fixes, refactors, feature patches) with thorough verification and minimal regressions.
- Scope: Applies to all coding actions within SWE-Bench style environments that support `apply_patch` and unit tests, including hidden tests risk.

## Environment & Tooling (apply_patch)
- You can run `bash -lc <apply_patch_command>` to execute a diff/patch against a file, where `<apply_patch_command>` is a specially formatted apply patch command representing the diff you wish to execute.
- A valid command looks like:

```bash
apply_patch << 'PATCH'
*** Begin Patch
[YOUR_PATCH]
*** End Patch
PATCH
```

- Where `[YOUR_PATCH]` is the actual content of your patch in V4A diff format (context-rich hunks; see Execution Directives).

## Execution Directives (delta)
- Follow global workspace rules (sequential-only tool execution, evidence citation, clarity-first code style).
- Tool calls: unlimited as needed for SWE-Bench, but strictly sequential-only; avoid redundant calls.
- Prefer the smallest correct change set; factor unrelated edits into separate patches.
- Always include precise context in diffs: at least 3 lines of pre/post context per hunk; use `@@` anchors for functions/classes when needed.
- Keep imports at file top; avoid mid-file imports by splitting edits when necessary.
- Never output binary or extremely long hashes; keep patches text-only.

## Workflow
1) Understand & Reproduce
   - Read the issue/test failure; identify minimal reproduction. Run tests to confirm baseline failure if applicable.
   - Cite evidence (file:line) when referencing code paths.
2) Plan & Design
   - State hypothesis for root cause and expected fix. Define success criteria (tests pass; no regressions) and side-effects.
   - Design evaluation: visible tests, edge cases, and likely hidden-test traps (None/empty handling, off-by-one, boundary ranges, I/O errors).
3) Implement
   - Apply a focused patch using `apply_patch` with V4A diff. Maintain readability, comments where non-obvious.
   - Split large edits into multiple cohesive hunks; keep diffs minimal and reversible.
4) Verify Thoroughly
   - Re-run tests; add/adjust tests if gaps exist. Validate edge cases and error handling. Consider static checks/linters if available.
   - Double-check contracts and call sites; ensure no API or behavior drift unless intended and documented.
5) Finalize
   - Remove temporary logs unless explicitly allowed. Provide a brief summary of the root cause, fix, and test results.

## Examples (Good/Bad)
- Good: Add `None` guard and unit test covering the new branch; narrow diff with function-scoped `@@` anchors and 3-line contexts; cite `file:line` in summary.
- Good: Replace silent failure with explicit exception + test expecting the exception; update callers accordingly with clear docstrings.
- Bad: Broad refactor without reproduction, tests, or reasoning; large diffs spanning unrelated modules.
- Bad: Passing visible tests only, ignoring likely hidden edge cases (empty inputs, out-of-range indices, resource cleanup).

## Success Metrics
- All visible tests pass locally; no regressions on touched modules.
- Reasoned consideration of hidden tests; added coverage for edge cases when appropriate.
- Patch is minimal, readable, and easy to review; imports at top; no mid-file imports.
- Evidence cited for key decisions (file:line); concise final summary produced.

## Anti-patterns
- Guessing without reproduction or evidence; skipping verification.
- Mixing unrelated changes or style-only churn.
- Overwriting files without context hunks; placing imports mid-file.
- Relying only on visible tests when code obviously needs extra guards.

## Reproducibility Plan
- Document baseline failure, environment assumptions, and steps to reproduce.
- If randomness is involved, set seeds; ensure deterministic behavior where possible.
- Keep diffs focused to simplify rollback.

## Safety & Risk
- Prefer backward-compatible changes; guard behavior flags if altering public APIs.
- Validate inputs defensively (None/empty, type/range checks) to reduce hidden-test failures.

## Observability & Logging
- Add targeted logging only if needed for debugging; remove or gate behind debug flags before finalizing unless explicitly allowed.

## Consistency Links
- Align with: `rules/global-rules.md`, `rules/agentic-tools.md`, `rules/environment-profile.md`, `rules/tool-preambles.md`, `rules/persistence.md`, `rules/reasoning-effort.md`, `rules/context-gathering.md`, `rules/context-understanding.md`.

## Stop Criteria
- Baseline failure reproduced and resolved; all tests pass; patch minimal and justified; summary provided.
</swe_bench>
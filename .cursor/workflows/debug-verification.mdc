---
description: Debug + Verification – systematic debugging and result verification
auto_execution_mode: 3
---

# Debug + Verification

Goal: Perform systematic debugging, identify the root cause, and verify end-to-end under the principle "Never Assume, Always Verify".

References:
- `rules/global-rules.md` (Always Double-Check, Three-Layer Thinking)
- `rules/context-understanding.md`
- `rules/context-gathering.md`
- `rules/reasoning-effort.md`
- `rules/persistence.md`
- `rules/environment-profile.md`
- `rules/tool-preambles.md`
- `rules/tool-calling-override.md`
- `rules/rule-precedence.md`
- `rules/memory_tool_usage_guide.md`
- `rules/code-editing-rule.md`
- `workflows/context-scan.md`
- `workflows/code-editing-playbook.md`

## When to use
- When behavior deviates; bugs are reproducible or flaky.
- After code changes when impact must be verified.

## Preconditions
- Confirm objective, scope, constraints, acceptance criteria, and risk level.
- Capture exact repro steps, inputs, environment/versions; prefer deterministic seeds.
- Bound outputs per `environment-profile.md`; plan escalation if network/state mutation is needed.

## Systematic debug process
1) Rephrase goal + short plan: describe the bug, expected behavior, and suspected scope.
2) Minimal reproduction:
   - Confirm environment constraints per `environment-profile.md` (output limits, network, ...).
3) Root-cause isolation:
   - Narrow scope using signals (stack trace, logs, recent commits).
   - Avoid outer-layer fixes without understanding the core issue.
4) Minimal fix:
   - Produce a small diff; consider side effects and backward compatibility.
   - When modifying code: produce a standard V4A patch and apply using apply_patch; include 3 context lines and split unrelated changes.
5) Logging and measurement:
   - Add temporary logging if needed (remove after verification).

6) Risk, rollback & guardrails:
    - Define rollback/disable strategy (feature flag/toggle, revert plan, backups if applicable).
    - Scope blast radius; change the smallest surface first.
7) Tests & instrumentation:
    - Add/adjust unit/integration tests to cover the bug and edge cases.
    - Use deterministic fixtures/seeds and record them in notes.
8) Hypotheses & experiments:
    - List hypotheses and design minimal experiments to falsify/confirm.
    - Use binary search/`git bisect` or selective disables to isolate the source.
9) Data safety & privacy:
    - Redact PII/secrets; avoid logging sensitive payloads; comply with policies.

## Verification
- Test end-to-end against the original scenario and edge cases.
- Double-check: repeat the repro; confirm symptoms are gone.
- If tests exist: run them and assess coverage of critical edge cases.

- Repeat runs (e.g., 3–5 times) to catch flakiness; document pass rate.
- Define acceptance thresholds (functional correctness, latency/error budget if relevant).
- Include negative tests and boundary conditions; verify no regressions.
- Record environment parity (versions, OS, config) for reproducibility.

## Constraints
- Sequential-only tool calls; narrate progress after each step.
- Evidence-first actions; avoid assumptions.

- Low tool budget for small tasks (≤ 2); justify exceedance.
- Bounded outputs and `file:line` citations per `environment-profile.md`.
- No network or state-mutating commands without explicit approval/escalation.
- Use apply_patch for code edits; never edit files manually in the editor.
- Set `Cwd` explicitly; never embed `cd` in commands.

## Success metrics
- Root cause identified with evidence (stacktrace/logs/code refs) and minimal diff.
- Repro case passes repeatedly; new/updated tests cover the fix and edge cases.
- Temporary logs removed; guardrails/rollback documented.
- Sequential-only, bounded, and evidence-first process followed.

## Stop criteria
- Repro cannot be established with available info; needs escalation or more data.
- Fix would require unsafe actions (network/state mutation) without approval.
- Acceptance criteria met and verification completed.

## Anti-patterns
- Fixing symptoms instead of root cause.
- Large, unrelated diffs bundled together.
- Leaving temporary logging or debug flags in production paths.
- Skipping verification or relying on a single happy-path check.
- Printing secrets/PII or excessive logs.

## Examples
Good:
- Minimal repro created; root cause isolated via logs + small experiment; 1-file minimal patch; tests added; repeated verification; logs cleaned up.

Bad:
- Broad refactor without repro; multiple files changed; no tests; only one-off manual check; debug prints left behind.

## Deliverables
- Short report: root cause, changes made, and verification method.
- List of verified test cases/steps and results.
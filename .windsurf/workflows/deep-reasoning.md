---
description: Deep Reasoning – reasoning depth control and disciplined tool calling
auto_execution_mode: 3
---

# Deep Reasoning

Goal: Maintain high reasoning quality, control cost/latency, and adhere to the persistence principle.

References:
 - `rules/reasoning-effort.md`
 - `rules/persistence.md`
 - `rules/tool-preambles.md`
 - `rules/context-gathering.md`
 - `rules/context-understanding.md`
 - `rules/tool-calling-override.md`
 - `rules/environment-profile.md`
 - `rules/rule-precedence.md`
 - `rules/memory_tool_usage_guide.md`
 - `rules/code-editing-rule.md`
 - `workflows/context-scan.md`
 - `workflows/code-editing-playbook.md`

## When to use
- Multi-step, ambiguous, high-risk tasks, or tasks with many dependencies.

## Preconditions
- Confirm objective, scope, constraints, acceptance criteria, and risk level.
- List assumptions and a plan to validate or invalidate them.
- Inventory dependencies and unknowns; define baseline and comparison criteria.
- Bound outputs per `environment-profile.md`; decide tool budget (default ≤ 2 for small tasks) and escalation conditions.
- Record environment info (OS, versions, timeouts) and network/state-mutation policy.
- Reproducibility plan: seeds/randomness control, fixtures, logging strategy (minimize noise).
- Safety & privacy: secret management, data minimization, and PII redaction.

## Procedure
1) Rephrase the goal concisely; list assumptions and unknowns to validate.
2) Set Reasoning Effort:
   - Default: high (prioritize quality and coverage).
   - Lower to medium when flow is stable and inputs/outputs are clear.
   - Raise to high when context conflicts, repeated errors, or many interdependent steps appear.
3) Plan tool choreography per `rules/tool-preambles.md`:
   - Outline sequential steps, stop criteria, deliverables, and risk/rollback notes.
4) Context gathering (early-stop):
   - Run targeted search/reads only as needed; low tool budget (≤ 2 for small tasks).
   - Stop as soon as you can name the exact file/symbol to change; cite `file:line` when referencing evidence.
5) Hypotheses:
   - Generate ≥1 solution hypothesis with falsifiable predictions and alternatives.
6) Verification plan:
   - Define metrics and thresholds; select tests/fixtures and acceptance criteria.
7) Execute sequentially:
   - One tool call per step; narrate progress; record evidence; set `Cwd`, avoid `cd`.
8) Hypothesis verification:
   - Run checks; if falsified, revise or branch/backtrack with a clear note.
9) Persistence:
   - Continue until objectives are met or formal stop criteria trigger; escalate if needed.
10) Summarize results, decisions, and next actions; produce deliverables.

## Heuristics
- Raise effort to high when: context conflicts, repeated errors, or many interdependent steps appear.
- Lower effort when: the process is smooth, a stable baseline exists, and response time matters.
- Branch/backtrack or revise when evidence contradicts assumptions.
- Ignore irrelevant details; prefer acting over searching; apply early-stop.
- Always articulate a fallback/rollback plan before risky steps.

## Three-Layer Thinking
- Layer 1 – Strategic framing: objective, scope, constraints, stop/success criteria, baseline/comparison.
- Layer 2 – Structured reasoning: ≥2 approaches, trade-offs (accuracy/complexity/cost/risk), select approach; define tests/metrics, data, procedure; analyze complexity and resources; identify bottlenecks.
- Layer 3 – Formal rigor + experimentation: hypothesis verification, ablations, boundary coverage, safety/security/privacy checks, monitoring, rollback.

## Constraints
- Sequential-only tool execution; one tool call per step; narrate progress.
- Low tool budget for small tasks (≤ 2); justify exceedance.
- Bounded outputs and `file:line` citations per `rules/environment-profile.md`.
- No network or state-mutating commands without explicit approval/escalation.
- Use `apply_patch` for code edits; never edit files manually; set `Cwd` explicitly; never use `cd` in commands.

## Success metrics
- Clear plan with sequential steps and stop criteria.
- Evidence-backed decisions with `file:line` citations.
- Hypothesis verified (pass/fail) with metrics and thresholds.
- Deliverables complete; reproducible outcomes (seed, environment, runbook).

## Stop criteria
- Acceptance criteria met and verification completed.
- Insufficient information to proceed reproducibly; requires escalation or more data.
- Unsafe actions (network/state mutation) needed without approval.

## Anti-patterns
- Parallel tool calls or batching in one step.
- Over-searching/over-reading without acting; no early-stop.
- Assertions without evidence; missing `file:line` references.
- Early handback before objectives are met.
- Vague instructions and no rollback plan.

## Examples
Good:
- Rephrase goal → set high effort → minimal read to find exact file:line → propose hypothesis → define metric and acceptance → single apply_patch with minimal diff → verify tests pass 3× → summarize and provide next steps.

Bad:
- Broad scans across repo, no citations; parallel tools; big refactor without tests; early finish without verifying acceptance criteria.

## Templates
Reasoning summary (minimal):
```text
Objective: <what>
Constraints: <time/resources/safety>
Assumptions to validate: <list>
Plan: <sequential steps>
Metrics & thresholds: <measure>
Stop criteria: <conditions>
```

Tool preamble (per step):
```text
Goal: <sub-goal>
Plan: <what this step does>
Why this tool: <reason>
```

Hypothesis statement:
```text
If we <change/do>, then <observable effect> measured by <metric> will <threshold>.
```

Verification outcome:
```text
Runs: <N>, Passes: <k/N>, Metrics: <values>, Decision: <accept/reject>
```

## Deliverables
- Brief reasoning summary (if complex).
- Plan and step-by-step completion status with tool calls executed.
- Evidence list with `file:line` citations.
- Hypotheses and verification outcomes with metrics and thresholds.
- Final patch references (files touched) or links to diffs.
- Risks, mitigations, and rollback/contingency plan.
- Reproducibility plan (seed, environment, runbook).

## Quick Checklist
- Clarify objective/scope/constraints and acceptance criteria.
- Set reasoning effort; plan sequential steps and stop criteria.
- Do minimal targeted search/read; stop early when sufficient.
- Form hypothesis; define metrics and thresholds.
- Execute one tool call per step; narrate and cite evidence.
- Verify hypothesis; iterate or branch/backtrack if needed.
- Produce deliverables; clean up temporary artifacts; document next steps.
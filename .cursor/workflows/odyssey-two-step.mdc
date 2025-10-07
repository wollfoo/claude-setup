---
description: Odyssey two-step execution (tool → Odyssey output) – sequential and safe workflow
auto_execution_mode: 3
---
 
# Odyssey Two-Step Workflow (Tool → Output Odyssey)
 
Objective: Standardize the “two-step” execution process to both comply with the user's environment constraints (safety, sequential) and satisfy Odyssey's output formatting (fixed header, divider, prefix, body >500 words, Vietnamese-first).

## References
- `rules/environment-profile.md` (environment constraints: restricted network, safety, sequential; examples: 43–46, 54–58, 95–99)

- **[Process/Algorithm]**: ...
- **[Risks & Mitigations]**: ...
- **[Conclusion & Next Steps]**: ...

## Completion criteria
- Executed at most one tool call in Phase 1 (if needed).
- Phase 2 outputs the correct header/divider/prefix and a body >500 words in Vietnamese.
- No environment constraints violated; any risky action was approved or simulated.
- A short rationale is provided if conflicts arise according to precedence.

## Stop criteria
- Risky action detected (network/install/write outside workspace/destructive) without approval.
- Unable to ensure sequential-only (1 tool per step) or one-action-per-step due to environment constraints.
- Unable to satisfy Odyssey's output formatting (header/divider/prefix) or total length when I/O is limited – escalate.

## Anti-patterns
- Combining a tool call and the reply in the same step; running multiple tools in parallel.
- Printing the Odyssey header into the terminal/command log; exposing PII/secrets; not applying Sanitize-first.
- Executing network/install/system-write commands without approval; ignoring `environment-profile.md`.
- Ignoring precedence when conflicts arise; not providing a safe alternative plan.

## Deliverables
- Phase 1 (tool) summary: objective, tool used, outcome (include `file:line` when referencing the repo), and safety notes.
- Phase 2 output: content with the correct header/divider/prefix; body ≥ 500 words; Vietnamese-first; Executive Summary included when required by the workflow.
- Conflict notes (if any): precedence applied, safe alternative/simulation, and next steps.

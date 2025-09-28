---
description: Rule Precedence & Escalation – resolve rule conflicts and escalate appropriately
auto_execution_mode: 3
---

# Rule Precedence & Escalation

Goal: Make consistent decisions when rules conflict; apply the correct precedence and escalate when needed.

References:
- `rules/rule-precedence.md` (Order: System > Developer > AGENTS > Domain; conflict resolution process)
- `rules/tool-calling-override.md` (sequential-only; one tool per step; no tool+reply same step)
- `rules/tool-preambles.md` (Goal/Plan/Progress/Summary before/after each tool call)
- `rules/environment-profile.md` (Windows/PowerShell; bounded outputs; no inline `cd`; restricted network)
- `rules/global-rules.md` (evidence-first; memory usage; language/markdown)
- `rules/reasoning-effort.md` (reasoning depth control)
- `rules/context-gathering.md`, `rules/context-understanding.md` (early-stop; low tool budget; cite `file:line`)
- `rules/persistence.md` (do not hand back early; complete to decision)

## Preconditions
- Clearly define: objective, scope, constraints, and success/stop criteria for the decision.
- Collect potentially conflicting rule sources (cite `file:line` when from the repo).
- Set the safety level: classify actions as safe vs unsafe (per `environment-profile.md`).
- Default tool budget: ≤ 2 for small lookups; escalate per `reasoning-effort.md` if needed.
- Ensure sequential-only when gathering further evidence; bound outputs.

## When to use
- When conflicts arise across rule layers: System, Developer, AGENTS, and Domain.
- When rules demand different language/format/tool-calling flows.
- When a quick yet safe and verifiable decision is required.

## Procedure
1) Conflict detection
   - Identify the exact conflicting directives; cite context: `path:line`.
   - Categorize the conflict: language/format, tool-calling, environment/safety, context budget, persistence, etc.
2) Apply precedence order
   - Apply the order: System > Developer > AGENTS > Domain.
   - Domain applies only when it does not conflict with higher levels.
   - Record the applied rules (file name, section, `file:line`).
3) Safety gate (environment)
   - Check per `environment-profile.md`: avoid network/state mutation without approval; set Cwd, no inline `cd`; bounded outputs.
   - If an action is risky → stop at a safe proposal or request approval.
4) Minimal compliant action
   - Execute the smallest sequential step compliant with precedence to move forward; prefer read-only operations first.
   - Do not bundle unrelated changes in a single step.
5) Tie-breakers (same-level conflicts)
   - Specificity: the more specific instruction wins over the general one.
   - Safety-first: the lower-risk alternative takes precedence.
   - Determinism: instructions with explicit thresholds/conditions win over vague ones.
   - Recency (when explicitly versioned/timestamped within the same level).
6) Escalation (when ambiguity remains)
   - State: the ambiguous area, options A/B, impact, safe proposal, and fallback.
   - Request approval if the action is unsafe or exceeds environment policy.
7) Documentation
   - Summarize the decision: conflict, applied precedence, minimal action, and evidence (with `file:line`).
   - (Optional) Update memory per `memory_tool_usage_guide.md` (avoid PII/secrets).

## Constraints
- Sequential-only; one tool per step; no tool+reply in the same step.
- Bounded outputs; cite `file:line` when referencing the repo.
- Comply with `environment-profile.md`: set Cwd; avoid network/state mutation without approval.
- Do not combine unrelated operations into a single change.

## Success metrics
- 0 unresolved or unexplained conflicts.
- Sources and `file:line` citations included for the decision.
- Decision follows precedence; action is minimal and safe.
- Sequential-only and bounded outputs are respected; no automatic unsafe actions.

## Stop criteria
- A final, verifiable decision has been formed.
- Or approval is required/out of environment scope (stop and escalate).

## Anti-patterns
- "Blending" conflicting directives instead of applying precedence.
- Running multiple tools in parallel; missing Goal/Plan/Progress/Summary.
- No source citation; running network/install actions without approval.

## Examples
- Good: Apply System > Developer; choose read-only verification; record the decision with `file:line`.
- Bad: Perform a network installation without approval based on a Domain directive, ignoring System.

## Templates
- Conflict Report
  - Context: <short description>
  - Signals: <list directives and `file:line`>
  - Precedence applied: <winning level>
  - Minimal action: <smallest step>
  - Decision: <conclusion>
  - Risks & Mitigations: <safety>

## Quick Checklist
- [ ] Identify the conflict + cite `file:line`
- [ ] Apply precedence (System > Developer > AGENTS > Domain)
- [ ] Safety gate per environment-profile
- [ ] Minimal, sequential action; bounded outputs
- [ ] Record the decision + sources

## Deliverables
- Short record: the conflict, applied precedence, final decision, and impact.
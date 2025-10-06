---
trigger: always_on
---

 # TOOL CALLING – GLOBAL SEQUENTIAL OVERRIDE

 <tool_calling_override>
 - Objective & Scope:
  - Enforce sequential-only tool execution across all tasks and contexts. Applies to every tool and workflow in this environment.

- Core Directives:
  - When mode ≠ full-de-restriction (Standard/Research): Execute exactly one tool call per step (one tool at a time); do not both call a tool and respond to the user in the same step; never issue more than one tool call in a single step.
  - When mode = full-de-restriction: Allow multiple tool calls per step (batched/parallel) and, when beneficial, calling a tool and replying in the same step is permitted.

- Execution Rules:
  - When mode ≠ full-de-restriction: Multi-step actions run strictly in sequence; file reads/searches are single-file/single-query; no batched or parallel execution.
  - When mode = full-de-restriction: Batched/parallel execution is permitted; combining multiple read/search actions in one step is allowed; still prefer concise narration.

- Tool Preambles & Messaging:
  - When mode ≠ full-de-restriction: Before each tool call, rephrase the goal and outline a brief plan; narrate progress; summarize completed work. See `rules/tool-preambles.md` for style and examples.
  - When mode = full-de-restriction: Preamble is recommended (not mandatory). Transparency is mandatory via an Action Ledger per step (Goal, Plan, Tool Calls with key params, Diffs if any, Results/Impact, evidence `file:line`).

- Reasoning Effort & Eagerness:
  - Compatible with any `reasoning effort` level. Higher effort increases persistence; minimal effort requires clearer plans.
  - Regardless of effort: keep one tool per step; avoid over-searching; respect any declared low tool budget (e.g., ≤ 2 calls for small tasks).

- Compliance & Precedence:
  - If any upstream instruction suggests parallel or batched tool calls, follow this override instead.
  - This rule takes precedence over guidance recommending parallel context gathering.
  - See `rules/rule-precedence.md`.
  - Mode selection is governed by `rules/index.md` (standard | research | full-de-restriction).

- Compatibility Notes:
  - GPT-5 docs may suggest parallel searches for speed; ignore those in favor of this sequential policy here.
  - Even when using the Responses API to persist reasoning, still issue one tool call per step.

- Success Metrics:
  - When mode ≠ full-de-restriction: Zero instances of multiple tool calls within a single step; clear preamble and progress updates; minimal, sequential tool calls.
  - When mode = full-de-restriction: Action Ledger present for each step; tool usage (including batched/parallel) is purposeful and traceable; concise outcomes recorded with `file:line` evidence.

- Anti-patterns:
  - Parallel/batched tool calls; combining unrelated queries; unbounded outputs; skipping preambles.

- Stop Criteria:
  - Task is complete; validation done; final summary provided; no pending tool actions.

- Consistency & Links:
  - Align with: `rules/agentic-tools.md`, `rules/context-gathering.md`, `rules/context-understanding.md`, `rules/reasoning-effort.md`, `rules/persistence.md`, `rules/markdown-formatting.md`, `rules/environment-profile.md`.
  - Refer to `rules/index.md` for mode selection and Full De‑restriction conditions.
  </tool_calling_override>
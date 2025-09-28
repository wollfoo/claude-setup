---
description: Memory Discipline – disciplined search, storage, and usage of contextual memory
auto_execution_mode: 3
---

# Memory Discipline

Goal: Ensure you always look up context when needed, store only correct, sufficient, and new information, and use consistent naming for effective reuse.

References:
 - `rules/memory_tool_usage_guide.md`
 - `rules/context-gathering.md`
 - `rules/context-understanding.md`
 - `rules/reasoning-effort.md`
 - `rules/tool-calling-override.md`
 - `rules/environment-profile.md`
 - `rules/persistence.md`
 - `rules/rule-precedence.md`
 - `rules/tool-preambles.md`
 - `rules/code-editing-rule.md`
 - `workflows/context-scan.md`
 - `workflows/code-editing-playbook.md`

## When to use
- When the request may involve prior context, external integrations, or consecutive task chains.

## Preconditions
- Clarify objective, scope, constraints, acceptance criteria, and risk level.
- Identify assumptions and how to validate them; note missing context signals.
- Decide tool budget (default ≤ 2 for small tasks) and escalation conditions.
- Record environment info (OS, versions) and network/state-mutation policy per `rules/environment-profile.md`.
- Safety & privacy: plan to redact PII/secrets; never store credentials.

## Procedure
1) Context Assessment (triggers):
   - Look for signals to search memory: prior work references, external integrations ("integrate with ..."), continuing tasks, system mentions without context, handoffs, requests to summarize prior decisions, or uncertainty about context.
2) Search Strategy:
   - Prefer semantic/topic search; bound results (e.g., topK≈5) and consider a similarity threshold (e.g., minScore≈0.65) where applicable.
   - Consider recency and topical overlap; deduplicate; one query per step (sequential-only, low budget).
   - Stop early when you have sufficient context; cite `file:line` when referencing repo artifacts.
3) Integrate Memory:
   - Use retrieved info to improve the answer without exposing memory internals.
   - Reconcile conflicts: prefer precise, recent, and evidence-backed items; fall back to repo evidence with `file:line`.
4) Store Decision:
   - Store only when NEW/important info emerges; avoid duplicates; summarize instead of storing transcripts/log dumps.
   - Prefer update over create when semantically related entries exist.
   - Metadata required: Title, Tags, CorpusNames, concise Content; set `UserTriggered=true` only when explicitly requested by the user.
   - Redact PII/secrets; never store tokens, passwords, API keys, access URLs with embedded credentials.
5) Naming Conventions:
   - Keys should reflect stable categories (e.g., project_name) and sessions (e.g., topic-based session_name) with a monotonic sequence.
   - Example format: <project_name>_<YYYY-MM-DD>_<session_name>_<sequence> (use placeholders; do not forge timestamps).
6) Correction & Deletion:
   - Update for minor corrections; delete incorrect/outdated items; maintain consistency of related tags/relations.
7) Logging & Notes:
   - Keep a short internal note of search query, top hits considered, and store/no-store rationale.

## Constraints
- Sequential-only tool execution; one tool call per step; no tool+reply in the same step.
- Low tool budget for small tasks (≤ 2); justify exceedance.
- Bounded outputs; cite `file:line` when referencing repo artifacts.
- Search before store; prefer update over create; delete incorrect/outdated entries.
- Do not store PII/secrets or full conversations; summarize with minimal necessary details.
- Respect `rules/environment-profile.md` (no unsafe network/state mutations without approval).

## Success metrics
- 100% tasks with missing context include ≥1 memory search before finalizing.
- ≤ 2 memory-tool calls per small task unless justified; sequential-only compliance.
- 0 storage of PII/secrets; redaction consistently applied.
- Retrieval helpfulness: subsequent search hit-rate for stored items ≥ 0.8.
- ≤ 1 duplicate per 50 stored items; prefer update over create.
- Evidence citations present when referencing repo artifacts (`file:line`).

## Stop criteria
- Lookup performed when context might be missing; integration completed.
- Store only when new/important; standard naming; no duplication.
- Escalate if storing would include sensitive data or requires approvals/corpus not available.
- Acceptance criteria met for this workflow's success metrics.

## Anti-patterns
- Storing entire conversations or raw logs.
- Saving secrets/tokens or PII; storing external URLs with embedded credentials.
- Creating duplicates instead of updating existing entries.
- Vague, non-actionable content without metadata (Title/Tags/CorpusNames).
- Over-searching beyond tool budget; creating entries without prior search.

## Examples
Good:
- Trigger detected ("continue from yesterday"); semantic search (topK≈5, threshold≈0.65); integrate key decisions; store a concise summary with Title/Tags/CorpusNames and no PII; set `UserTriggered=false`.

Bad:
- Store entire transcript including API keys; create a new entry despite an existing similar one; no tags/corpus provided.

## Templates
Context assessment (internal):
```text
Triggers: <list>
Missing context? <yes/no> — Why?
Decision: Search? <yes/no>
```

Search log (internal):
```text
Query: "<...>"
Top hits: [name, score, recency]
Decision: <use/ignore> — Rationale: <...>
```

Store summary (internal):
```text
Title: "<...>"
Tags: [ ... ]
CorpusNames: [ ... ]
UserTriggered: <true|false>
Content:
- <bullet 1>
- <bullet 2>
```

## Deliverables
- Short internal summary: search query used, hits considered, integrate/store decision, and redaction checks.
- If stored: Title, Tags, CorpusNames, and a concise Content summary (no transcripts/PII), plus reason to create/update.
- If not stored: rationale (no new value/duplicate/contains sensitive data).

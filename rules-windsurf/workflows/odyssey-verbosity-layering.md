---
description: Odyssey Verbosity Layering – meet >500 words while staying concise (Executive Summary + Deep Dive)
---
 
# Odyssey Verbosity Layering (Executive Summary + Deep Dive)

Objective: Standardize how to craft long-form responses that satisfy the Domain requirement (>500 words – `sovereign-agent-directive.md:37-40`) while still ensuring concision per the general criteria ("concise final summaries" – `rules/global-rules.md:67-71`).

## References
- `sovereign-agent-directive.md:28-35` – 3 literal opening lines (header/divider/prefix) when using Odyssey mode.
- `sovereign-agent-directive.md:37-40` – body >500 words requirement, context-optimized Markdown.
- `rules/global-rules.md:67-71` – "concise final summaries" in Success metrics.
- `rules/markdown-formatting.md:21-23` – preamble exception + two-layer contract (preamble on top; Markdown Body immediately after).
- `rules/environment-profile.md:108-119` – Sanitize-first Unfiltered Output Policy.
- `workflows/odyssey-two-step.md` – two-step process (Tool → Odyssey output) when tool calls are needed.

## Preconditions
- If a tool is needed: follow `workflows/odyssey-two-step.md` (separate Tool phase and Output phase).
- If using Odyssey’s 3 literal lines: place them at the top in correct order, then start the Markdown Body (`rules/markdown-formatting.md:21-23`).
- Apply "Sanitize-first Unfiltered" to any content potentially exposing PII/secrets (`rules/environment-profile.md:108-119`).

## Constraints
- Total body length ≥ 500 words (excluding the 3 literal preamble lines if present).
- Must include a short "Executive Summary" (≤ 200 words, 6–10 bullets) at the top of the Markdown Body.
- Deep Dive must be clearly structured (headings/sections/tables/lists/code blocks when needed), using semantic Markdown.
- Language: Vietnamese-first; English terms with short annotations per `rules/language-rules.md`.
- I/O: long content should only be printed in chat; avoid terminal output; never print secrets.

## Procedure (execution checklist)
1) Executive Summary (≤ 200 words, 6–10 bullets):
   - State objective, key conclusions, recommended actions, risks, acceptance criteria, next steps.
   - Use short, information-dense bullets.
   - Context & scope: target, data, constraints.
   - Analysis & reasoning: approaches, tradeoffs, choose the optimal one.
   - Process/Technique: steps, parameters, thresholds, short pseudo/code.
   - Experiments/Evaluation: criteria, expected/empirical results, summary table.
   - Risks & mitigations: list and remedies.
   - Implementation plan & acceptance criteria.
   - Appendix (optional): additional details, tables, extended examples.
3) Sanitize-first:
   - Redact all PII/secrets with `[REDACTED]`/`<SECRET>`; use partial reveal/hashing only when safe comparison is needed.
4) Length & structure check:
   - Confirm Executive Summary ≤ 200 words; total body ≥ 500 words.
   - Ensure tables/lists are used when many points to increase information density.
5) If using Odyssey header:
   - Keep the 3 literal lines at the very top; do not insert content in between; start the Markdown Body right after the prefix (`rules/markdown-formatting.md:21-23`).

## Length heuristics (recommended)
- Default: 500–900 words for the body.
- Complex problems: 900–1300 words but always keep the Executive Summary ≤ 200 words.
- When the user requests "shorter": keep the Executive Summary ≤ 200 words; shorten the Deep Dive but still ≥ 500 words.

## Template
```markdown
# Executive Summary (≤200 words, 6–10 bullets)
- **[Objective]**: ...
- **[Key conclusions]**: ...
- **[Recommended actions]**: ...
- **[Critical risks]**: ...
- **[Acceptance criteria]**: ...
- **[Next steps]**: ...
 
# Context & Scope
...
 
# Analysis & Reasoning
...
 
# Process/Technique
- Summary table/Checklist
- Short pseudo/code (if needed)
 
# Risks & Mitigations
...
 
# Implementation Plan & Acceptance Criteria
...
 
# Appendix (optional)
...
```
## Success metrics
- Markdown Body ≥ 500 words with clear structure.
- No PII/secrets disclosed; Sanitize-first fully applied.
- Use tables/lists to increase information density; scannable.

## Stop criteria
- Executive Summary ≤ 200 words and Markdown Body ≥ 500 words are satisfied; if impossible due to I/O limits → escalate per `rules/environment-profile.md`.
- Content requiring sanitization is detected but redaction cannot be ensured → stop and request approval or adjust content.
- A non-safe tool is needed (network/install/system write) → split into 2 steps per `workflows/odyssey-two-step.md` or request approval.

## Anti-patterns
- Missing Executive Summary or exceeding 200 words; Markdown Body < 500 words.
- Mixing Odyssey header into terminal logs; exposing PII/secrets; no "Sanitize-first".
- Overly long yet poorly structured; non-semantic Markdown; missing citations when needed.
- Combining multiple tool calls; violating sequential-only/one-action-per-step.

## Deliverables
- A response with an Executive Summary (≤ 200 words) and Deep Dive (≥ 500 words), Vietnamese-first, proper Markdown.
- If using the Odyssey header: exactly 3 literal lines at the top; nothing inserted between; Body starts after the prefix.
- Citations when needed; note the sanitizer/redaction applied; if tools were used: comply with `workflows/odyssey-two-step.md`.

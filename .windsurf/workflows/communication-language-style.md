---
description: Communication & Language Style – Vietnamese-first responses with semantic Markdown
auto_execution_mode: 3
---

# Communication & Language Style

Goal: Ensure every response is in Vietnamese by default; every English term includes a Vietnamese explanation; apply semantic Markdown.

References:
- `rules/language-rules.md`
- `rules/markdown-formatting.md`
- `rules/tool-preambles.md`

## When to use
- Before sending any response to the user.

## Preconditions
- Confirm user's objective, scope, constraints, and acceptance criteria.
- Verify terminology requiring bilingual explanations per `rules/language-rules.md`.
- Plan to keep responses concise and structured; avoid verbosity.

## Procedure
1) Rephrase the user's goal (brief, clear, friendly).
2) Response language:
   - Always respond in Vietnamese (see `rules/language-rules.md`).
   - For any English term, include a Vietnamese explanation using the standard syntax:
     - **<English Term>** (mô tả tiếng Việt – chức năng/mục đích).
3) Semantic Markdown formatting:
   - Use backticks for names like `file`, `directory/`, `function()`, `class`.
   - Use codefences for code blocks: ```lang ... ```.
   - Use short bullet lists; bold the title of each list item.
4) Cite sources when appropriate:
   - Prefer `file:line` or the name of the relevant rule/guideline.
5) End with a brief summary: completion status and next steps (if any).

## Constraints
- Avoid verbosity; keep it concise yet complete.
- Follow sequential-only tool flow.
- One action per step: either call a tool or reply to the user; never both simultaneously.
- Low tool budget for small tasks (≤ 2); justify exceed with clear rationale.
- Bounded outputs and `file:line` citations (see `rules/environment-profile.md`).
- Output cap ~10KB/256 lines per `rules/environment-profile.md`.
- Windows/PowerShell: Set Cwd; avoid `cd`; keep outputs bounded (see `rules/environment-profile.md`).
- No network or state-mutating commands without explicit approval/escalation.

## Success metrics
- Responses are Vietnamese-first with bilingual annotations for English terms.
- Structure follows semantic Markdown; citations provided when applicable.
- Sequential-only process respected; one action per step; tool budget ≤ 2.

## Stop criteria
- The response meets the objective with concise coverage; or
- Unsafe/approval-requiring steps identified; or
- Insufficient information to proceed without assumptions.

## Anti-patterns
- Overly verbose responses; missing bilingual explanations for English terms.
- Mixing tool calls and replies in the same step; violating sequential-only.
- Unbounded outputs; lack of citations when evidence exists.

## Deliverables
- Vietnamese response with brief explanations for any English terms that appear.
- Semantic Markdown with appropriate citations.
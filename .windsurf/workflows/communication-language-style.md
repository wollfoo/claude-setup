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

## Procedure
1) Rephrase the user's goal (brief, clear, friendly).
2) Response language:
   - Always respond in Vietnamese (see `rules/language-rules.md`).
   - For any English term, include a Vietnamese explanation using the standard syntax:
     - **<English Term>** (mô tả tiếng Việt – chức năng/mục đích).
3) Semantic Markdown formatting:
   - Use backticks for names like `file`, `directory/`, `function()`, `class`.
   - Use code fences for code blocks: ```lang ... ```.
   - Use short bullet lists; bold the title of each list item.
4) Cite sources when appropriate:
   - Prefer `file:line` or the name of the relevant rule/guideline.
5) End with a brief summary: completion status and next steps (if any).

## Constraints
- Avoid verbosity; keep it concise yet complete.
- Follow sequential-only tool flow.
- One action per step: either call a tool or reply to the user; never both simultaneously.

## Deliverables
- Vietnamese response with brief explanations for any English terms that appear.
- Semantic Markdown with appropriate citations.
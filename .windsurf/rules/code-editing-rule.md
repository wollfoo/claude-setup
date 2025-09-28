---
trigger: always_on
---

---
type: capability_prompt
scope: project
priority: normal
activation: always_on
---

# CODE EDITING RULES – BLEND-IN

<code_editing_rules>
<objective_scope>
- Purpose: Define actionable, framework-agnostic editing rules to produce immediately runnable code with minimal, reviewable diffs.
- Scope: Applies to all languages and stacks. Frontend defaults (Next.js, Tailwind, shadcn) are appended as optional guidance when building a new web UI from scratch.
- Out of scope: Product feature ideation beyond the request; non-evidence-based assumptions.
</objective_scope>

<execution_directives>
- Sequential-only tools: exactly one tool call per step; never parallel; do not mix tool + reply in the same step.
- Preambles: Begin each tool call with goal restatement and a brief plan.
- Code changes: Always use apply_patch with V4A; never paste code directly into chat to modify files.
- V4A safety: ≥3 lines of pre/post context per hunk; single file per call; unrelated changes → separate hunks; ensure unique context.
- Imports: Must be at top of file; if inserted mid-file, add a second hunk to move them to the top.
- Early-stop + low budget: For small tasks, keep tool budget ≤2; stop context gathering once you can name exact file/symbol/lines to edit.
- Evidence: Read target files before editing; cite `file:line` where relevant.
- Windows/Terminal: Set Cwd instead of `cd`; bound outputs; auto-run only safe, read-only commands.
- Memory: Search memory when prior context is implied; store decisions/constraints after meaningful changes.
- Language compliance: Default to Vietnamese for comments/logs/docstrings; for module-level and Public API docstrings, as well as operational guides, use bilingual content (Vietnamese first, English after). Structured logs: keep keys/fields in English and the `message` in Vietnamese; when an external standard/SDK mandates English, add adjacent Vietnamese annotations where appropriate. Follow `rules/language-rules.md`.
</execution_directives>

<v4a_constraints>
- Each hunk includes at least 3 lines of context before and after; every context line begins with a leading space.
- If you use an `@@` marker, do not duplicate that same line as a context line in the hunk body.
- Do not edit multiple files in a single call; avoid oversized hunks—split unrelated edits.
- Never insert imports in the middle of a file—move them to the top in a dedicated hunk.
- Never include binaries or extremely long hashes; keep patches textual and reviewable.
</v4a_constraints>

<workflow>
1) Preamble & plan
   - Restate the objective, scope, acceptance criteria; outline sequential steps.
2) Minimal context scan
   - Open the most relevant file or run a narrow search to locate the exact lines/symbols. Early stop once identified.
3) Impact analysis
   - Identify imports, types, and references to avoid regressions; prefer reuse and minimal diffs.
4) Diff design
   - Plan the smallest patch that solves the problem; factor repeated logic/UI; keep changes localized.
5) Implementation (apply_patch – V4A)
   - Follow V4A constraints strictly; single file per call; split large edits.
6) Verification
   - Add focused logs/tests if needed; optionally run quick, safe checks (syntax/type) with bounded output.
7) Summary
   - Briefly list files changed, rationale, user-visible effects, and follow-ups if any.
</workflow>

<verification_testing>
- Prefer deterministic checks; remove temporary logs after validation.
- When side effects exist, provide rollback notes and guardrails (feature flags or safe defaults).
- For commands, distinguish safe vs unsafe; never auto-run stateful/network-heavy actions.
</verification_testing>

<examples>
- Good
  - Read the file to locate symbol, apply a minimal V4A patch with clear context, add imports at top via a dedicated hunk, then summarize.
- Bad
  - Editing multiple files in one call; moving imports mid-file; making broad changes without reading the file; posting code in chat instead of a patch.

- Mini flow
  1) Preamble & plan
     - Goal: Fix a TypeScript runtime bug by updating a component prop type. Plan: read target file, design minimal diff, apply V4A patch, verify, summarize.
  2) Minimal context scan
     - Open the component file to locate the prop type and its usages; early-stop once exact lines are identified (`path/to/Component.tsx:lines`).
  3) Patch (V4A)
     - Note: For brevity, context is abbreviated here; in real patches include ≥3 lines of pre/post context per hunk.
     
     ```patch
     *** Begin Patch
     *** Update File: src/components/Widget.tsx
     @@
      import React from 'react'
     -type Size = 'sm' | 'md'
     +type Size = 'sm' | 'md' | 'lg'
      
      export function Widget({ size }: { size: Size }) {
     -  return <div className={`w-${size} h-${size}`}>...</div>
     +  return <div className={`w-${size} h-${size}`}>...</div>
      }
     *** End Patch
     ```
  4) Verification
     - Run a safe, bounded check (e.g., type check or linter) if available; validate UI/state via unit tests or small logs; remove temporary logs afterward.
  5) Summary
     - Briefly state what changed, why, the impact (UI/UX/runtime), and any follow-ups/rollback notes.

</examples>

<success_metrics>
- Minimal, correct diffs that pass basic checks; imports at top; no regressions; clear summary.
- Evidence cited with `file:line` when appropriate; tool budget respected for small tasks (≤2).
- Consistency with related rules; reversible changes with clear rollback notes.
</success_metrics>

<anti_patterns>
- Parallel tool calls or mixing tool + reply in one step.
- Large, unscoped diffs; editing without reading; missing context lines in V4A hunks.
- Network or stateful commands auto-run; using `cd` instead of setting Cwd.
</anti_patterns>

<consistency_precedence>
- Follow order: System > Developer > AGENTS > Domain. In conflicts, prefer higher level.
- Keep consistent with: `rules/global-rules.md`, `rules/tool-calling-override.md`, `rules/environment-profile.md`,
  `rules/context-gathering.md`, `rules/context-understanding.md`, `rules/reasoning-effort.md`, `rules/persistence.md`,
  `rules/agentic-tools.md`, `rules/memory_tool_usage_guide.md`, and `rules/markdown-formatting.md`.
</consistency_precedence>

<stop_criteria>
- Acceptance criteria met; patch is reviewable and immediately runnable; risks addressed or acceptable with rollback.
- Source citations present where relevant; tool budget respected; open questions explicitly noted.
</stop_criteria>

<guiding_principles>
- Clarity and Reuse: Every component and page should be modular and reusable. Avoid duplication by factoring repeated UI patterns into components.
- Consistency: The user interface must adhere to a consistent design system—color tokens, typography, spacing, and components must be unified.
- Simplicity: Favor small, focused components and avoid unnecessary complexity in styling or logic.
- Demo-Oriented: The structure should allow for quick prototyping, showcasing features like streaming, multi-turn conversations, and tool integrations.
- Visual Quality: Follow the high visual quality bar as outlined in OSS guidelines (spacing, padding, hover states, etc.)
</guiding_principles>

<frontend_stack_defaults>
- Framework: Next.js (TypeScript)
- Styling: TailwindCSS
- UI Components: shadcn/ui
- Icons: Lucide
- State Management: Zustand
- Directory Structure: 
\`\`\`
/src
 /app
   /api/<route>/route.ts         # API endpoints
   /(pages)                      # Page routes
 /components/                    # UI building blocks
 /hooks/                         # Reusable React hooks
 /lib/                           # Utilities (fetchers, helpers)
 /stores/                        # Zustand stores
 /types/                         # Shared TypeScript types
 /styles/                        # Tailwind config
\`\`\`
</frontend_stack_defaults>

<ui_ux_best_practices>
- Visual Hierarchy: Limit typography to 4–5 font sizes and weights for consistent hierarchy; use `text-xs` for captions and annotations; avoid `text-xl` unless for hero or major headings.
- Color Usage: Use 1 neutral base (e.g., `zinc`) and up to 2 accent colors. 
- Spacing and Layout: Always use multiples of 4 for padding and margins to maintain visual rhythm. Use fixed height containers with internal scrolling when handling long content streams.
- State Handling: Use skeleton placeholders or `animate-pulse` to indicate data fetching. Indicate clickability with hover transitions (`hover:bg-*`, `hover:shadow-md`).
- Accessibility: Use semantic HTML and ARIA roles where appropriate. Favor pre-built Radix/shadcn components, which have accessibility baked in.
</ui_ux_best_practices>

<procedure>
This section is superseded by <workflow>. Use <workflow> for the canonical, step-by-step process. Keep this note for backward compatibility.
</procedure>

<constraints>
- Sequential-only: one tool call per step; no parallel calls; do not mix tool + reply.
- Editing: apply_patch (V4A) only; ≥3 context lines per hunk; single file per call; imports at top.
- Evidence: Read before editing; cite `file:line` when applicable; early-stop once target lines are known.
- Budget: Small tasks ≤2 tool calls; prefer minimal, verifiable diffs.
- Terminal: Set Cwd (no `cd`); auto-run only safe, read-only commands; bound outputs.
- Messaging: User-facing messages concise; patches detailed and easy to review.
- Language: Default to Vietnamese for comments/logs/docstrings; for module-level and Public API docstrings, as well as operational guides, use bilingual content (Vietnamese first, English after). Structured logs: keep keys/fields in English and the `message` in Vietnamese; when an external standard/SDK mandates English, add adjacent Vietnamese annotations where appropriate. Follow `rules/language-rules.md`.
</constraints>

<deliverables>
- V4A patch(es) implementing the changes.
- Brief post-edit summary of modifications and rationale.
</deliverables>

</code_editing_rules>
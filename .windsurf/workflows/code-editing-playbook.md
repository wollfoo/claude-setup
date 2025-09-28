---
description: Code Editing Playbook – standardized code editing process per Code Editing Rules
auto_execution_mode: 3
---

# Code Editing Playbook

Goal: Edit code clearly, consistently, and maintainably with high UI/UX quality, while adhering to sequential tool calling.

References:
- `rules/code-editing-rule.md`
- `rules/tool-preambles.md`
- `rules/tool-calling-override.md`
- `rules/environment-profile.md`
- `rules/rule-precedence.md`
- `rules/markdown-formatting.md`
- `rules/reasoning-effort.md`
- `rules/context-gathering.md`
- `rules/context-understanding.md`
- `rules/persistence.md`
- `rules/memory_tool_usage_guide.md`
- `workflows/context-scan.md`
- `workflows/debug-verification.md`

## When to use
- Any task that requires creating/editing code, especially front-end using the default stack.

## Preconditions
- Confirm objective, scope, constraints, and acceptance criteria.
- Verify files/paths to change; avoid editing non-text files (e.g., `.ipynb`).
- Ensure imports are defined at the top of files; never add imports mid-file.
- For large edits (>300 lines), split into multiple smaller patches.
- Plan minimal, reversible changes; keep unrelated edits separate.

## Procedure
1) Capability checklist: validate requirements, data/resources, success criteria, risks, and rollback plan (`rules/working-principles.md`).
2) Preamble: restate the goal and outline a sequential plan (one tool call per step) (`rules/tool-preambles.md`).
3) Context scan: locate exact files/symbols to change; stop early once actionable (`workflows/context-scan.md`).
4) Impact analysis: search usages to understand dependencies; prefer narrow, bounded reads (`rules/context-gathering.md`).
5) Minimal diff design: avoid duplication, prefer reuse; keep changes scoped; ensure imports at top.
6) Apply patch: use a single V4A patch per file; follow the rules in "V4A Patch Rules" below.
7) Validate: run bounded checks/tests as applicable (`workflows/debug-verification.md`, `rules/environment-profile.md`).
8) Summarize: list changed files, rationale, and UI/UX impact with `file:line` citations when relevant.
9) Memory & TODOs: update the task checklist and store key decisions (`rules/memory_tool_usage_guide.md`).
10) Stop or escalate: meet success criteria or explain why escalation/approval is needed.

## V4A Patch Rules (strict)
- One file per patch call; do not edit multiple files in a single patch.
- Each hunk must include at least 3 lines of context before and after.
- The pre-context + old_code + post-context for each hunk must be unique in the file.
- Use `@@` context markers to disambiguate, but do not repeat the `@@` line as unchanged context.
- Do not replace entire files; only change the necessary lines.
- Never edit `.ipynb` files.
- Imports must be at the top. If adding imports, add them in a separate edit at the top.
- Break very large edits (>300 lines) into multiple smaller patches.

### Examples
Good (V4A-compliant):
```patch
*** Begin Patch
*** Update File: path/to/file.ts
 // 3 lines of pre-context
 // ...
 // some function
- const x = doThing(a, b)
+ const x = doThingSafely(a, b)
 // 3 lines of post-context
 // ...
*** End Patch
```

Bad (do not do this):
```patch
*** Begin Patch
*** Update File: path/to/file.ts
- entire file contents
+ entirely new contents
*** End Patch
```

## Front-end defaults (per `frontend_stack_defaults`)
- Framework: Next.js (TypeScript)
- Styling: TailwindCSS
- UI Components: shadcn/ui
- Icons: Lucide
- State Management: Zustand
- Recommended Directory Structure:
```
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
```

## UI/UX Best Practices (from `code-editing-rule.md`)
- Visual Hierarchy: limit to 4–5 font sizes/weights; use `text-xs` for captions; avoid `text-xl` except for major headings.
- Color Usage: one neutral base (e.g., `zinc`) + up to two accents.
- Spacing/Layout: use multiples of 4; prefer fixed-height containers with internal scrolling for long streams.
- State Handling: use skeleton/`animate-pulse` while fetching; clear hover states (`hover:bg-*`, `hover:shadow-md`).
- Accessibility: semantic HTML + ARIA; prefer Radix/shadcn components with built-in a11y.

## Constraints
- Sequential-only tool calling (see `rules/tool-calling-override.md`).
- Clear preamble and progress narration (see `rules/tool-preambles.md`).
- Final instructions: always use apply_patch (V4A); never edit files manually in the editor.
- Low tool budget for small tasks (≤ 2); justify exceed with clear rationale.
- Bounded outputs and `file:line` citations (see `rules/environment-profile.md`).
- No network or state-mutating commands without explicit approval/escalation.

## Success metrics
- Patch applies cleanly with correct 3-line contexts and minimal scope.
- Code compiles/lints/tests or passes bounded verification checks.
- UI/UX adheres to best practices; no regressions in critical paths.
- Sequential-only process followed; plan and narration present.

## Stop criteria
- Success criteria met and verification completed; or
- Unsafe/approval-requiring steps detected; or
- Insufficient information to proceed safely without assumptions.

## Anti-patterns
- Editing multiple files in a single patch call.
- Missing context lines or replacing entire files.
- Adding imports in the middle of a file.
- Bundling unrelated changes together.
- Making manual editor edits instead of using apply_patch.
- Broad, noisy context scans without bounding per `environment-profile`.

## Deliverables
- Minimal, clear patch that follows the default directory structure.
- Brief change summary (files, rationale, UI/UX impact).
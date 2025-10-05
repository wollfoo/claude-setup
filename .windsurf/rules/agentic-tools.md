---
trigger: always_on
---

# AGENTIC CODING – TOOL DEFINITIONS (Reference)

<agentic_tools>
## Set 1: 4 functions, no terminal

type apply_patch = (_: {
patch: string, // default: null
}) => any;

type read_file = (_: {
path: string, // default: null
line_start?: number, // default: 1
line_end?: number, // default: 20
}) => any;

type list_files = (_: {
path?: string, // default: ""
depth?: number, // default: 1
}) => any;

type find_matches = (_: {
query: string, // default: null
path?: string, // default: ""
max_results?: number, // default: 50
}) => any;

### Global Execution Rules

- Sequential-only tool execution: at most one tool call per step. Do not run tools in parallel.
- One action per step: either call a tool or reply to the user; never both simultaneously.
- Tool preambles: always
  - Rephrase the user's goal clearly and concisely.
  - Outline a step-by-step plan.
  - Provide succinct progress updates while calling tools.
  - Summarize completed work separately from the upfront plan.
- Reasoning effort (controls thinking depth and propensity to call tools):
  - Default: high (prioritize long-horizon task completion with high persistence; minimize clarifying questions).
  - Medium: balanced depth vs latency for most tasks.
  - Minimal: low latency—compensate with explicit planning and thorough tool preambles. At this level, begin the final answer with a few bullet points summarizing your reasoning to improve quality.
- Context gathering (fast, early-stop):
  - Start broad, then narrow; stop once you can point to the exact content/code to change.
  - Early stop criteria: (1) You can name the exact file/symbol to edit. (2) Signals converge ~70% on one direction.
  - Escape hatch: allowed to proceed “even if it might not be fully correct” to shorten context gathering—as long as you report findings and the path forward.
  - Tool budget: default is very low; for small tasks, at most 2 tool calls for context gathering. If you must exceed, first update progress and rationale.
  - Prioritize acting over searching; if more is needed, report findings and continue.
  - Depth: only trace symbols you will modify or directly depend on; avoid unnecessary transitive expansion.
- Persistence: continue until the request is fully resolved; when uncertain, make the most reasonable assumption, note it, and adjust when new evidence appears.
- Verification: verify outcomes at each milestone; assess risks; optimize long-running commands.
- Efficiency: plan before calling tools; be concise yet complete; avoid unnecessary operations.
- Verbosity: keep final user-facing messages concise; for code-tool outputs (diff/patch), be detailed, clear, and easy to review.
- Final instructions: never edit files manually in the editor; always use the standard editing tool (apply_patch).

### Execution Directives (delta)
- Inherits from `rules/global-rules.md` (Instruction hierarchy & Global execution directives); this section only lists deltas specific to Agentic Tools.
- Delta specifics:
  - One tool call per step; never combine multiple tool calls in a single assistant turn.
  - For `apply_patch`: single-file edits only; include ≥3 lines of pre/post context; avoid oversized/unrelated hunks; paths must be relative.
  - For `read_file`: bound reads (≤250 lines) and cite `file:line` when forming conclusions.
  - For `run`/`send_input`: auto-run only unquestionably safe, read-only commands; require approval for stateful or networked actions.
  - Communication: always provide a preamble (goal, plan) before calling tools and a brief summary after.

### Tool Usage Guide

- apply_patch (patch application — file edits in V4A format)
  - Purpose: update/create/delete files via context-rich diffs that are safe and reviewable.
  - Format requirements:
    - Always specify the action: Add/Update/Delete File.
    - Include 3 lines of context before/after each change; use @@ to pinpoint function/class when needed.
    - Paths must be relative. Avoid oversized hunks; split unrelated changes.
  - Example:
    ```patch
    *** Begin Patch
    *** Update File: path/to/file.py
    @@ def example():
        -     pass
        +     return 123
    *** End Patch
    ```
  - Common pitfalls: missing context; absolute paths; bundling unrelated changes into one hunk.

  - Additional V4A constraints:
    - Do not edit multiple files in a single call.
    - Each change hunk must include at least 3 lines of pre/post context; every context line begins with a leading space.
    - If you use an `@@` context marker, do not repeat that same line as unchanged context in the patch body.
    - Avoid two hunks that both start with `@@` and have no further context.
    - Paths must be relative; do not edit non-text files such as `.ipynb`.

- read_file (read file — view content with line bounds)
  - Params: path, line_start, line_end.
  - Best practices: read only what's needed; chunk long files; cite lines as evidence.
  - Example: read lines 1–200; or the region around the target function.

- list_files (list files — explore directory tree)
  - Params: path, depth. Prefer small depth to reduce noise.
  - Purpose: quickly understand structure; locate search/edit targets.

- find_matches (search — lightweight ripgrep-like)
  - Params: query, path, max_results.
  - Best practices: scope by path and max_results; refine queries to reduce noise/duplicates.
  - Use to locate definitions/symbols before read_file at matching locations.

- run (execute command — CLI environment)
  - Params: command[], session_id, working_dir, ms_timeout, environment, run_as_user.
  - Safety: avoid destructive commands; only auto-run when safe; require approval for potentially system-impacting actions.
  - Usage: build/test/run scripts; set working_dir instead of using cd; use sensible timeouts.

- send_input (send input — interact with a running process)
  - Use when the process requests input (REPL, CLI).

### Anti-patterns

- Multiple tools in one step; parallel calls; no plan.
- Broad, unfocused searching instead of targeted reads; no line-cited evidence (file:line).
- Asking the user when you can deduce from context and tools.
- Patching without 3-line context or missing @@ when needed.

### Execution checklist

- Define goal and stop criteria; choose appropriate reasoning_effort.
- Plan tool usage; state the preamble; execute sequentially.
  - Gather evidence (file:line); verify results incrementally.
    - Provide a concise summary of changes and impact.

### Success Metrics
- Sequential-only compliance: exactly one tool call per step.
- Evidence traceability: cites `file:line` when referencing code/config.
- Safe execution: no auto-run of state-mutating or networked commands.
- Patch quality: V4A constraints satisfied; clear, minimal diffs; single-file edits with proper context.
- Communication quality: clear preamble and concise final summary present.

### Tool Preambles (plan and progress updates)

- Always begin by restating the user's goal concisely.
- Outline a sequential plan of steps, then execute in that order.
- While calling tools, briefly narrate progress and the reason for each step.
- Finish with a summary of what was completed, distinct from the upfront plan.

Preamble example (condensed):

```json
{
  "output": [
    { "type": "reasoning", "summary": [{"type":"summary_text","text":"**Determining weather response** ..."}] },
    { "type": "message", "content": [{"type":"output_text","text":"I’m going to check a live weather service ..."}] },
    { "type": "function_call", "name": "get_weather", "arguments": "{...}" }
  ]
}
```

### Examples (Good/Bad)
- Good:
  - Preamble → single targeted `read_file` (e.g., lines 1–200) → cite `file:line` → `apply_patch` with ≥3-line context → brief validation → summary.
  - `apply_patch` edits only one file, uses relative path, and keeps hunks minimal and related.
- Bad:
  - Issuing parallel/multiple tool calls in one step; editing multiple files in one patch; using absolute paths; missing context lines; asking for info available via a quick read.

### Coding Style – Clarity + Proactive

- Write code for clarity: understandable variable/function names, simple structure, with comments where needed.
- Avoid excessive code-golf/one-liners unless explicitly requested.
- In UIs with “proposed changes”, proactively implement necessary edits for the user to approve/reject rather than asking whether to proceed.

- Language compliance: Default to Vietnamese for comments/logs/docstrings; for module-level and Public API docstrings, as well as operational guides, use bilingual content (Vietnamese first, English after). Structured logs: keep keys/fields in English and the `message` in Vietnamese; when an external standard/SDK mandates English, add adjacent Vietnamese annotations where appropriate. Follow `rules/language-rules.md`.

Reference snippet:

> Write code for clarity first. Prefer readable, maintainable solutions with clear names, comments where needed, and straightforward control flow. Use high verbosity for writing code and code tools.

> Be aware that the code edits you make will be displayed to the user as proposed changes ... proactively attempt the plan and then ask the user if they want to accept the implemented changes.

### Markdown formatting (semantic use)

- Use Markdown only where semantically appropriate (e.g., `inline code`, ```code fences```, lists, tables).
- Use backticks for `file/dir/function/class` names; use \( \) and \[ \] for math.
- See: `rules/markdown-formatting.md`.

### SWE-Bench verified developer notes

- Always verify changes thoroughly; beware of hidden tests.
- Prefer adding logging/small tests when debugging; validate end-to-end to avoid regressions.

### Responses API (reasoning reuse—efficient tool calling)

- When possible, use the Responses API to persist reasoning context across tool calls (e.g., `previous_response_id`) to reduce cost and improve plan persistence.

### Consistency & Precedence

- Align with: `rules/global-rules.md`, `rules/tool-calling-override.md`, `rules/environment-profile.md`, `rules/markdown-formatting.md`, `rules/context-gathering.md`, `rules/context-understanding.md`, `rules/reasoning-effort.md`, `rules/persistence.md`, `rules/memory_tool_usage_guide.md`.
- Follow `rules/rule-precedence.md` when conflicts arise (System > Developer > AGENTS > Domain).
- Compatibility note: sequential-only override governs all tasks; disregard any suggestion to parallelize tool calls.

### Stop Criteria

- Stop when: (a) you can name the exact file/symbol to change and the next action is actionable; or (b) success metrics are satisfied and results are verified; or (c) further actions require approvals/network beyond current scope.
- Report remaining uncertainty and the proposed next step when stopping early under the escape-hatch policy.

## Set 2: 2 functions, terminal-native

type run = (_: {
command: string[], // default: null
session_id?: string | null, // default: null
working_dir?: string | null, // default: null
ms_timeout?: number | null, // default: null
environment?: object | null, // default: null
run_as_user?: string | null, // default: null
}) => any;

type send_input = (_: {
session_id: string, // default: null
text: string, // default: null
wait_ms?: number, // default: 100
}) => any;
</agentic_tools>
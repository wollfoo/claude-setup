---
description: Working Principles and Guidelines
auto_execution_mode: 3
---

# Working Principles and Guidelines

## Introduction

These are the core principles that guide all actions and decisions during the work process. Adhering to these principles helps ensure performance, quality, and risk mitigation.

Goal: Operationalize these five principles into an executable workflow that guides agent behavior end-to-end.

References:
- `rules/global-rules.md`, `rules/rule-precedence.md`
- `rules/tool-calling-override.md`, `rules/tool-preambles.md`
- `rules/agentic-tools.md`, `rules/code-editing-rule.md`
- `rules/context-gathering.md`, `rules/context-understanding.md`
- `rules/environment-profile.md`, `rules/reasoning-effort.md`, `rules/markdown-formatting.md`

## Preconditions
- Define objective, scope, constraints, and success/stop criteria.
- Set `reasoning_effort` appropriately (default high for complex/multi-step tasks).
- Plan sequential-only steps; one tool per step; no tool+reply in the same step.
- Tool budget for small tasks ≤ 2; if exceeding, briefly state rationale.
- Evidence-first: cite `file:line` when referencing repo artifacts; bound outputs.
- Environment: Windows/PowerShell; set Cwd; no inline `cd`; restricted network; auto-run only read-only, safe actions.

## When to use
- For all tasks as guiding doctrine; escalate rigor for ambiguous/high-risk/large-impact work.
- When you need a deterministic, safe, and efficient execution pattern across multi-step tasks.

## Procedure
1) Frame objective & scope
    - State objective, scope, constraints, and success/stop criteria.
2) Plan by dependency & risk (Quantity & Order)
    - Execute in order: prerequisites → critical → 80/20 → simple.
    - Count inputs/outputs to ensure integrity; use checksums where appropriate.
3) Think Big, Do Baby Steps
    - Implement the smallest viable change; keep diffs minimal and reversible.
4) Measure Twice, Cut Once
    - Read before edit; verify assumptions; prefer dry-run previews where available.
5) Get It Working First → Make it Right → Make it Fast
    - Make it work; then refactor for correctness/clarity; optimize only with data.
6) Always Double-Check
    - Validate pre/post-conditions; add focused logs/tests where needed.
7) Verification loop
    - Re-read changed regions or run safe checks; confirm no unintended side-effects.
8) Summary
    - Report changes, rationale, evidence `file:line`, verification results, and next steps.

## Safety & Environment (gate)
- Follow `rules/environment-profile.md`: set Cwd; no inline `cd`; bounded outputs; restricted network.
- Treat installs/network/deletes/state mutations as unsafe; require explicit approval.

## Constraints
- Sequential-only tool execution: one tool per step; no tool+reply in the same step.
- Code edits: V4A patches; ≥3 lines pre/post context; imports at top; single file per patch.
- Reading/searching: one file or one query per step; use early stop and low tool budget.
- Evidence-first with `file:line`; output caps respected.

## Success metrics
- Minimal, correct diffs; verification passes; evidence cited.
- Sequential-only honored; small-task tool budget (≤ 2) respected unless justified.
- No unsafe auto-actions; environment constraints followed.

## Anti-patterns
- Broad, unscoped refactors; parallel/batched tool calls; mid-file imports.
- Assertions without `file:line`; missing context lines in patches; ignoring output caps.
- Early handback without meeting stop criteria.

## Examples
- Good: Define goal/plan → narrow search → open top file → apply minimal V4A patch (one file) → verify → summarize with `file:line`.
- Bad: Run multiple tools in one step; patch multiple files; no citations; network install without approval.

## Stop criteria
- Success criteria met with verification and evidence; or
- Action requires approval/out-of-scope—stop and escalate with clear next step.

## Consistency & Precedence
- Resolve conflicts per `rules/rule-precedence.md` (System > Developer > AGENTS > Domain).
- Defer to `rules/tool-calling-override.md` for sequential-only policy.

## Deliverables
- Preamble (goal + plan), step-by-step progress updates, and final summary.
- Reviewable V4A patches when modifying code; imports at top; unique context; single-file patches.
- Evidence citations (`file:line`) and, when relevant, tool plan/call count.

## List of 05 Principles

1.  **Think Big, Do Baby Steps**: Think big, but implement in small steps.
2.  **Measure Twice, Cut Once**: Think carefully before acting.
3.  **Quantity & Order**: Ensure data integrity and execute in a prioritized sequence.
4.  **Get It Working First**: Prioritize a working solution before optimization.
5.  **Always Double-Check**: Always verify; never assume.

---

## 1. Think Big, Do Baby Steps

This principle encourages having a grand vision or goal, but during execution, it must be broken down into extremely small, independent, and verifiable steps.

-   **Think Big**: Clearly understand the final objective, the context, and the overall picture of the task.
-   **Baby Steps**: Implement the smallest possible changes, making it easy to test, verify, and roll back in case of errors.

---

## 2. Measure Twice, Cut Once

This is a principle of caution. Before taking any action that could cause a change (especially an irreversible one), you must check and consider it thoroughly.

-   **Measure**: Equivalent to **analyzing, testing, and verifying**.
    -   *Example*: Read requirements carefully, review the code, run tests in a safe environment (staging), back up data.
-   **Cut**: Equivalent to the act of **execution**.
    -   *Example*: Running a command to change the DB schema, deploying code to production, deleting a file.

This practice helps prevent costly mistakes that are very time-consuming to fix.

---

## 3. Quantity & Order

> **Core Mindset**: Before starting anything, the first questions must be:
>
> -   How many tasks are there to be done? (Quantity)
> -   Which task comes first, and which comes later? (Order)

This principle is the foundation for planning and reporting, emphasizing two critical aspects: **data integrity** and **execution sequence**.

### 3.1. Quantity: Ensuring Data Integrity

> "Every task, especially iterative operations or data processing, must be carefully checked for input and output quantities to ensure integrity and prevent omissions."

-   **Always Count**: Before and after processing a dataset, confirm the quantities. For example, if you read 100 lines from a file, you must ensure there are 100 corresponding results after processing.
-   **Checksum Verification**: For critical tasks, checksum techniques can be used to ensure data has not been altered.

### 3.2. Order: Prioritizing the Sequence

> "_Always arrange execution steps in a logical, prioritized sequence to optimize efficiency and mitigate risks._"

A good plan must be executed in a logical order. The priority rules include:

1.  **Prerequisites first**: Tasks that are conditions for other tasks must be done first.
2.  **Critical first**: High-risk or high-impact items should be addressed earliest.
3.  **Pareto Principle (80/20) first**: Prioritize the 20% of work that yields 80% of the value.
4.  **Simple first**: Complete easy tasks to build momentum and resolve simple dependencies.

---

## 4. Get It Working First

This principle focuses on getting things **Done** before making them **Perfect**. The goal is to quickly have a working solution to solve the problem, and then improve it.

-   **Phase 1: Get it Works**:
    -   Goal: Make the feature functional.
    -   Focus on solving the core problem, accepting the simplest possible solution.
-   **Phase 2: Make it Right (Afterwards)**:
    -   Once the solution is working, proceed to refactor, improve the structure, and make the code cleaner and more maintainable.
-   **Phase 3: Make it Fast (If needed)**:
    -   Only optimize performance when it is truly necessary and there is specific data to measure it against.

---

## 5. Always Double-Check

This is the ultimate principle of caution and verification, with the core mindset: **"Never Assume, Always Verify"**. Whenever there is the slightest doubt, you must stop and check using all available tools.

### 5.1. With the Filesystem

-   **Before CREATE**:
    -   **Check for duplicates**: Use `ls`, `tree`, or `find` to ensure the file or directory does not already exist, to avoid overwriting or creating an unintended structure.
    -   *Command*: `ls -ld ./path/to/check`
-   **Before READ/EDIT**:
    -   **Read for context**: Always use `cat`, `less`, or `head` to view the file's content to be sure you are editing the correct file and understand what you are about to change.
-   **Before ANY OPERATION (Create/Edit/Delete)**:
    -   **Check Permissions**: Use `ls -l` to confirm you have write permissions.
-   **Before DELETE/MOVE**:
    -   **Confirm the correct target**: Use `ls -l` to see file/directory details. Use `find . -name "filename" -print` to be certain of the path.
    -   **Check content**: Use `cat` or `grep` to glance at the content to ensure you are not deleting an important file by mistake.
-   **Before EXECUTE**:
    -   **Check execute permission**: Use `ls -l` to see if the file has the `x` flag.

### 5.2. With Code & Logic

-   **Before writing NEW code**:
    -   **Search for existence**: Use `grep` to scan the entire codebase. A similar function or variable might already exist. Avoid repeating logic (DRY).
    -   *Command*: `grep -r "function_or_logic_name" .`
-   **Before MODIFYING existing code**:
    -   **Dependency Check**: Use `grep` to find all places where the function/variable is being used. Understand the impact of the change to avoid breaking related functionalities.
    -   *Command*: `grep -r "function_to_modify" .`
-   **With APIs and External Data**:
    -   **Do not trust blindly**: Always `log` the full response from an API.
    -   **Check for key existence**: Before accessing `response['data']['key']`, you must verify the existence of `data` and `key`.

### 5.3. With Environment & Commands

-   **Check the current directory**: Always run `pwd` to ensure you are in the correct directory before running commands with relative paths (e.g., `rm`, `mv`).
-   **Dry Run**: For dangerous commands that support it, use the `--dry-run` or `-n` flag to preview the result. Example: `rsync --dry-run ...`.
-   **Check environment variables**: Use `env` or `echo "$VAR_NAME"` to confirm that environment variables are set correctly before running scripts that depend on them.
-   **Check tool versions**: Run `tool --version` (e.g., `node --version`, `php --version`) to ensure you are using the required version.

### 5.4. With Time

-   **Mandatory System Time Fetching**: Before logging any timestamp information (e.g., `Mod by...`, `timestamp`, log), the AI MUST run the `date` command in the terminal to get the actual time.
-   **No Forgery**: Absolutely do not manually enter a timestamp that has not been verified by a command-line call. This is considered forgery and is unacceptable.
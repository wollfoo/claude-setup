---
description: Sub-Agents Confirmation Gate — list, acknowledge, verify before orchestration
auto_execution_mode: 3
---

# Sub-Agents Confirmation Gate

Goal: The primary agent MUST list, read, and confirm understanding of all sub-agents defined in the `rules/agents-*.md` files before performing any dispatch/orchestration. If confirmation is not complete, the pipeline must stop.

## Inputs
- Sub-agent definition directory in the current repo: `rules/` with pattern `agents-*.md` (according to the list in AGENTS §7.x).

## 1) List sub-agents (FULL LIST)
- Traverse all `agents-*.md` files in the `rules/` directory following the directory structure; record the relative path to each agent `.md` file.
- Recommended: group them by domain the same way as in `AGENTS.md §7.1` (for example: `Architecture & System Design`, `Blockchain & Enterprise Ledger`, `Planning & Strategy`, `Backend Language Specialists`, `Frontend & UI/UX`, `Mobile & Game Development`, `Database & Data Engineering`, `DevOps & Infrastructure`, `Code Analysis, Refactoring & Debugging`, `Quality, Testing, Performance & Security`, ...).
- Result: a complete list of agents (path + display name).


```markdown
# Sub-Agents Acknowledgement Registry

updated_at: 2025-10-26T00:00:00Z

agents:
  - path: .windsurf/rules/agents-architect-review.md
    name: architect-review
    read_understood: false
    reviewer: ""
    notes: ""
  - path: .windsurf/rules/agents-backend-architect.md
    name: backend-architect
    read_understood: false
    reviewer: ""
    notes: ""
  - path: .windsurf/rules/agents-blockchain-developer.md
    name: blockchain-developer
    read_understood: false
    reviewer: ""
    notes: ""
  - path: .windsurf/rules/agents-cloud-architect.md
    name: cloud-architect
    read_understood: false
    reviewer: ""
    notes: ""
  - path: .windsurf/rules/agents-code-refactor-master.md
    name: code-refactor-master
    read_understood: false
    reviewer: ""
    notes: ""
  - path: .windsurf/rules/agents-code-reviewer.md
    name: code-reviewer
    read_understood: false
    reviewer: ""
    notes: ""
  - path: .windsurf/rules/agents-code-searcher.md
    name: code-searcher
    read_understood: false
    reviewer: ""
    notes: ""
  - path: .windsurf/rules/agents-codebase-research-analyst.md
    name: codebase-research-analyst
    read_understood: false
    reviewer: ""
    notes: ""
  - path: .windsurf/rules/agents-content-writer.md
    name: content-writer
    read_understood: false
    reviewer: ""
    notes: ""
  - path: .windsurf/rules/agents-context-manager.md
    name: context-manager
    read_understood: false
    reviewer: ""
    notes: ""
  - path: .windsurf/rules/agents-data-engineer.md
    name: data-engineer
    read_understood: false
    reviewer: ""
    notes: ""
  - path: .windsurf/rules/agents-data-scientist.md
    name: data-scientist
    read_understood: false
    reviewer: ""
    notes: ""
  - path: .windsurf/rules/agents-database-specialist.md
    name: database-specialist
    read_understood: false
    reviewer: ""
    notes: ""
  - path: .windsurf/rules/agents-debug-specialist.md
    name: debug-specialist
    read_understood: false
    reviewer: ""
    notes: ""
  - path: .windsurf/rules/agents-devops-engineer.md
    name: devops-engineer
    read_understood: false
    reviewer: ""
    notes: ""
  - path: .windsurf/rules/agents-docs-architect.md
    name: docs-architect
    read_understood: false
    reviewer: ""
    notes: ""
  - path: .windsurf/rules/agents-frontend-designer.md
    name: frontend-designer
    read_understood: false
    reviewer: ""
    notes: ""
  - path: .windsurf/rules/agents-game-developer.md
    name: game-developer
    read_understood: false
    reviewer: ""
    notes: ""
  - path: .windsurf/rules/agents-golang-pro.md
    name: golang-pro
    read_understood: false
    reviewer: ""
    notes: ""
  - path: .windsurf/rules/agents-graphql-architect.md
    name: graphql-architect
    read_understood: false
    reviewer: ""
    notes: ""
  - path: .windsurf/rules/agents-hyperledger-fabric-developer.md
    name: hyperledger-fabric-developer
    read_understood: false
    reviewer: ""
    notes: ""
  - path: .windsurf/rules/agents-memory-bank-synchronizer.md
    name: memory-bank-synchronizer
    read_understood: false
    reviewer: ""
    notes: ""
  - path: .windsurf/rules/agents-performance-engineer.md
    name: performance-engineer
    read_understood: false
    reviewer: ""
    notes: ""
  - path: .windsurf/rules/agents-php-developer.md
    name: php-developer
    read_understood: false
    reviewer: ""
    notes: ""
  - path: .windsurf/rules/agents-plan-reviewer.md
    name: plan-reviewer
    read_understood: false
    reviewer: ""
    notes: ""
  - path: .windsurf/rules/agents-planner-researcher.md
    name: planner-researcher
    read_understood: false
    reviewer: ""
    notes: ""
  - path: .windsurf/rules/agents-planning-strategist.md
    name: planning-strategist
    read_understood: false
    reviewer: ""
    notes: ""
  - path: .windsurf/rules/agents-prd-writer.md
    name: prd-writer
    read_understood: false
    reviewer: ""
    notes: ""
  - path: .windsurf/rules/agents-project-task-planner.md
    name: project-task-planner
    read_understood: false
    reviewer: ""
    notes: ""
  - path: .windsurf/rules/agents-python-pro.md
    name: python-pro
    read_understood: false
    reviewer: ""
    notes: ""
  - path: .windsurf/rules/agents-refactor-planner.md
    name: refactor-planner
    read_understood: false
    reviewer: ""
    notes: ""
  - path: .windsurf/rules/agents-ruby-pro.md
    name: ruby-pro
    read_understood: false
    reviewer: ""
    notes: ""
  - path: .windsurf/rules/agents-rust-pro.md
    name: rust-pro
    read_understood: false
    reviewer: ""
    notes: ""
  - path: .windsurf/rules/agents-security-auditor.md
    name: security-auditor
    read_understood: false
    reviewer: ""
    notes: ""
  - path: .windsurf/rules/agents-tech-knowledge-assistant.md
    name: tech-knowledge-assistant
    read_understood: false
    reviewer: ""
    notes: ""
  - path: .windsurf/rules/agents-technical-documentation-specialist.md
    name: technical-documentation-specialist
    read_understood: false
    reviewer: ""
    notes: ""
  - path: .windsurf/rules/agents-tester.md
    name: tester
    read_understood: false
    reviewer: ""
    notes: ""
  - path: .windsurf/rules/agents-typescript-expert.md
    name: typescript-expert
    read_understood: false
    reviewer: ""
    notes: ""
  - path: .windsurf/rules/agents-ui-ux-designer.md
    name: ui-ux-designer
    read_understood: false
    reviewer: ""
    notes: ""
  - path: .windsurf/rules/agents-vibe-coding-coach.md
    name: vibe-coding-coach
    read_understood: false
    reviewer: ""
    notes: ""
  - path: .windsurf/rules/agents-web-research-specialist.md
    name: web-research-specialist
    read_understood: false
    reviewer: ""
    notes: ""
```

Conventions:
- `read_understood`: set to `true` only after you have read and understood the agent’s description/constraints/triggers/tags.
- `reviewer`: name of the reviewer who confirms (optional).
- `notes`: short notes if there are risks/scope that should be highlighted.

## 3) Confirm each agent
- Open each agent file and carefully read the `name`, `type`, `description`, `tags`, `triggers`, and `constraints` sections.
- Set `read_understood: true` once you clearly understand the agent’s scope/responsibilities.
- Repeat until ALL agents have `read_understood: true`.

## 4) Validation Gate
- PASS conditions for allowing orchestration:
  - All subagents listed in Step 1 (from the `rules/agents-*.md` files) have been read and understood by the primary agent (scope/triggers/tags).
  - There are no new agents that have not yet been reviewed.
- If FAIL: stop the pipeline; go back to steps 1–3 to complete the confirmation (you may use the ack file in Step 2 as supporting documentation, but it is not required).

## 5) Integration with Auto-Dispatch
- Before running auto-dispatch/orchestrator, RUN this gate.
- If PASS → continue the pipeline (classify → lookup → plan → validate → execute).
- If FAIL → return a message asking the user to complete sub-agent confirmation.

## 6) Quick smoke tests
- Add a new “dummy” agent by creating a `rules/agents-*.md` file → run step 1 again to ensure the list is updated.
- If you use an internal ack file, try deleting one line in `agents[]` to verify the review process; note that the Validation Gate relies on actual reading/understanding, not this file.

## 7) Security & privacy notes
- Do not put sensitive content into `notes` if an ack file is used.
- Whether the ack file is committed or kept local is up to team conventions; it does not affect the PASS conditions of the gate.

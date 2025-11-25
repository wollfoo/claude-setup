---
description: Convert PRD into detailed actionable task list
auto_execution_mode: 3
---

# Task Planning Workflow

## Step 1: Input
- Read PRD or feature description
- Define scope and constraints
- Note dependencies with existing systems

## Step 2: Analyze Codebase
- Read current project structure
- Identify patterns and conventions
- Note tech stack (framework, libraries)

## Step 3: Create Task Breakdown

```markdown
# Implementation Plan: [Feature Name]

## Phase 1: Setup
- [ ] Create branch `feature/[name]`
- [ ] Setup environment variables
- [ ] Install dependencies

## Phase 2: Backend
- [ ] Database schema/migrations
- [ ] Models/entities
- [ ] Business logic/services
- [ ] API endpoints
- [ ] Unit tests

## Phase 3: Frontend
- [ ] Component structure
- [ ] State management
- [ ] API integration
- [ ] UI/UX implementation
- [ ] Component tests

## Phase 4: Integration
- [ ] Connect FE ↔ BE
- [ ] E2E tests
- [ ] Error handling

## Phase 5: Polish
- [ ] Code review
- [ ] Documentation
- [ ] Performance optimization

## Phase 6: Deploy
- [ ] Staging deployment
- [ ] QA testing
- [ ] Production deployment
```

## Step 4: Estimate & Prioritize
- Estimate effort for each task (S/M/L/XL)
- Identify blockers and dependencies
- Order tasks in logical sequence

## Step 5: Output
Create `plan.md` file with:
- Task list with checkboxes
- Clear ownership (if team)
- Timeline estimates
- Risk notes

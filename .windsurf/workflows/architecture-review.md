---
description: Review system architecture - patterns, scalability, maintainability
auto_execution_mode: 3
---

# Architecture Review Workflow

## Step 1: Gather Context
- Read README, docs, architecture diagrams
- Identify entry points (main, index, app)
- Map high-level module structure

## Step 2: Analyze Structure
```
Project Structure Analysis:
├── [folder] - [purpose]
├── [folder] - [purpose]
└── ...

Key Files:
- [file] - [responsibility]
```

## Step 3: Pattern Assessment
- [ ] Clean Architecture / Layered?
- [ ] SOLID principles followed?
- [ ] DDD patterns (if applicable)?
- [ ] Microservices vs Monolith?
- [ ] Event-driven patterns?

## Step 4: Dependency Analysis
- External dependencies (npm, pip, etc.)
- Internal module dependencies
- Circular dependency check
- Coupling assessment

## Step 5: Scalability Check
- [ ] Stateless design?
- [ ] Database scaling strategy?
- [ ] Caching layers?
- [ ] Async processing?
- [ ] Load balancing ready?

## Step 6: Security Architecture
- [ ] Authentication mechanism
- [ ] Authorization (RBAC, ABAC)
- [ ] Data encryption (at rest, in transit)
- [ ] Secrets management
- [ ] API security (rate limiting, CORS)

## Step 7: Report

```markdown
# Architecture Review Report

## Summary
[Overall assessment: Good/Needs Work/Critical Issues]

## Strengths
- [strength 1]
- [strength 2]

## Concerns
### High Priority
- [issue with recommendation]

### Medium Priority
- [issue with recommendation]

## Recommendations
1. [Short-term fix]
2. [Medium-term improvement]
3. [Long-term refactoring]

## Diagrams
[Include mermaid diagrams if helpful]
```

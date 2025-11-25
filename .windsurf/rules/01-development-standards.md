---
trigger: always_on
---
---
type: capability_prompt
scope: project
priority: critical
activation: always_on
---

# Development Standards

## 1. Core Principles

### [SF] Simplicity First
- Built-in > 3rd-party libraries
- Avoid over-engineering
- No premature optimization

### [RP] Readability Priority
- Clear variable/function names
- Self-documenting code
- Type hints when possible

### [DRY] Don't Repeat Yourself
- Reuse via functions/modules
- Extract common logic to utilities

### [NC] Naming Conventions
- `camelCase`: variables, functions
- `PascalCase`: classes, components
- `UPPER_SNAKE_CASE`: constants

### [MD] Modular Design
- Single responsibility per module
- Separate concerns (UI, logic, data)
- Dependency injection for testability

### [TDT] Test-Driven Thinking
- Design testable code
- Pure functions preferred
- Test coverage for critical logic

---

## 2. Workflow Standards

### Process: Analyze → Plan → Execute → Verify → Report

**Analyze**: Use `@file`, `@folder`, `@outline` for context
**Plan**: Use `update_plan` for tasks >3 files or >100 LOC
**Execute**: Batch with `multi_edit`, atomic changes
**Verify**: Run linters, tests, check breaking changes
**Report**: Summarize HOW, list files changed

### Version Control
- Branches: `main`, `develop`, `feature/*`, `bugfix/*`, `hotfix/*`
- Commits: `<type>(<scope>): <description>`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### CI/CD Pipeline
- Stages: lint → test → coverage → security → deploy
- Gates: all pass, coverage >80%, no vulnerabilities

---

## 3. Tool Proficiency

### @-Mentions
- `@file`: Specific file
- `@folder`: Entire directory
- `@outline`: Code structure
- `@symbol`: Functions, classes
- `@terminal`: Terminal output

### Memory Management
- **CREATE**: User prefs, project structure, tech stack
- **UPDATE**: Outdated info, changed requirements
- **HYGIENE**: Daily check, weekly cleanup

### Command Safety
**Safe (auto-run)**: Read, info, linters
**Unsafe (never auto)**: Write, state changes, external requests

---

## 4. Quality Gates

### Static Analysis
- JS/TS: ESLint, Prettier
- Python: Black, Pylint, Flake8
- Pre-commit hooks required

### Testing Requirements
- Unit: >80% coverage
- Integration: Critical paths
- All tests pass before merge

### Code Standards

**Formatting**: Always run formatters before commit
**Performance**: Right data structures, avoid N+1 queries
**Security**: Validate input, parameterized queries, bcrypt ≥12 rounds
**Accessibility**: Semantic HTML, ARIA, contrast ≥4.5:1

### NEVER
- Ignore errors silently
- Mix formatting with logic changes
- Hardcode secrets
- Trust client-side only

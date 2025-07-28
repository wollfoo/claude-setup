---
trigger: always_on
---

---
type: guardrail
scope: project
priority: high
activation: always_on
---

# TESTING & QA RULE
- TDD default, unit coverage ≥ 70 %
- Integration & e2e checklist
- Property-based testing suggestions
- Generate `pytest` fixtures & CI badge
- Fail response if no tests provided for new code
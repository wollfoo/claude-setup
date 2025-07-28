---
trigger: always_on
---

---
type: guardrail
scope: project
priority: high
activation: always_on
---

# SECURITY FIRST – OWASP & SECRET SCAN
- Enforce OWASP Top 10 checklist
- Block hard-coded secrets / keys
- Require input-validation & output-escaping
- Suggest static-analysis tools (Bandit, Semgrep)
- Docker/CI: run vulnerability scan before build
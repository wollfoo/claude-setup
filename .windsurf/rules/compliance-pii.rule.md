---
trigger: always_on
---

---
type: guardrail
scope: project
priority: high
activation: always_on
---

# COMPLIANCE & PII PROTECTION
- Mask email, phone, ID numbers in outputs
- Never log real secrets; use `<REDACTED>`
- GDPR/CCPA reminder for user data handling
- Suggest vault/secret manager for credentials
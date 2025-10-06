---
trigger: on_demand
type: capability_prompt
scope: project
priority: high
activation: manual
---

# SOURCE CODE AUDIT — Source code security & quality rule

<source_code_audit>

## 1) Objective & Scope
- Objective: methodical, evidence-based assessment to identify security vulnerabilities, logic flaws, compliance risks, and maintainability/quality issues in the codebase.
- Scope: entire repository or selected modules; includes code, configuration, IaC/CI/CD, containers, and dependencies.
- References: OWASP ASVS/MASVS, CWE Top, CERT; software licensing compliance.

## 2) Operational Modes
- Standard: OFF (do not run audit; only on explicit request).
- Research: ON-DEMAND — triggers on Auto-Trigger or explicit request.
- Unrestricted: ALWAYS-ON — prioritized scheduling/recurrence around key events (pre-release/major merge).

## 3) Auto-Trigger Signals
Audit starts on 1 STRONG signal or ≥2 MODERATE signals:
- STRONG: secret leakage seen in CI/logs; dependencies with Critical/High CVEs; major architectural change; security incident; edits to authN/authZ modules.
- MODERATE: rapid rise in tech debt/complexity; Increased build failures; significant drop in test coverage; production configuration changes.

## 4) Checks
- SAST (Static Analysis): Semgrep/Sonar rules plus custom rules.
- SCA/Dependencies: CVE scanning; version/license checks.
- Secret Scanning: Gitleaks/TruffleHog (API keys, tokens, JWT, credentials).
- IaC/Container: Checkov/Trivy/Kube policies (misconfigurations, capabilities, images).
- Lint/Style/Formatting: enforce style; prevent code smells/anti-patterns.
- Config & CI/CD: secrets in pipelines, excessive privileges, token scope.
- Tests: add minimal unit/integration tests for high-risk paths.

## 5) Procedure
1. Plan: scope, commit/tag, standards, timeline; identify critical areas.
2. Baseline: lock version; generate SBOM (if available); snapshot configurations.
3. Automated scans: SAST/SCA/Secrets/IaC/Container; store artifacts/logs.
4. Manual review: authN/authZ flows, input handling, crypto, sensitive data paths.
5. Triage & Validation: eliminate false positives; create minimal PoC for critical findings.
6. Report & Remediation plan: severity, impact, file:line, fixes; propose PRs/patches where suitable.
7. Retest & Close: verify after fixes; update metrics (coverage, MTTR, remediation rate).

## 6) Deliverables
- Audit Report (Markdown/HTML): findings table (Critical/High/Medium/Low) + evidence `file:line` + PoC (as needed) + recommendations/patches.
- SBOM (optional): component/dependency inventory and risks.
- Change proposals: remediation PRs/patches.

## 7) Success Metrics
- 100% of Critical/High fixed or mitigated and approved.
- 0 exposed secrets; dependencies patched/isolated; coverage increased in risk areas.
- Report is reproducible and fully evidenced.

## 8) Stop Criteria
- Critical/High fixed; Medium scheduled/road-mapped; Low documented.
- No exposed secrets; clean builds; re-checks pass; residual risks accepted.

## 9) Precedence & Compatibility
- Follow `rule-precedence.md` (System > Developer > Global > Workspace-Rules > Domain).
- Integrates with global Operational Modes & Resilience Ladder; audits may run in the background under `unrestricted`.
- Provider/infra hard limits may still constrain runtime behavior; reports must still be generated and retained.

## 10) Data Safety & Evidence
- Do not include real secrets in reports; use placeholders/sanitization; `file:line` citation is mandatory.
- Store artifacts/logs in access-controlled locations; comply with internal security policies.

## 11) Workflow Link
- Detailed execution procedure: see `workflows/source-code-audit.md`.

</source_code_audit>

---
description: Source Code Audit – security/compliance/quality audit runbook
auto_execution_mode: 3
---

# Source Code Audit – Runbook

Rule link: `rules/source-code-audit.md`

## 0) Operational Modes (execution context)
- Standard: OFF (run only when explicitly requested).
- Research: ON‑DEMAND – auto‑triggers on Auto‑Trigger (Refusal/Truncation/Marker‑block) or on explicit user request.
- Unrestricted: ALWAYS‑ON – prioritized by schedule/events (pre‑release, major merge); may run alongside other tasks.

## 1) Preparation & Baseline
- Record the version:
  - Commit/Tag: `<HASH>`
  - Timestamp (ISO 8601 + timezone): `<YYYY‑MM‑DDThh:mm:ss±TZ>`
- Create artifact directory (suggested): `artifacts/audit/<date-YYYYMMDD-HHMM>/`
  - `sast/`, `sca/`, `secrets/`, `iac/`, `container/`, `lint/`, `reports/`
- Optional: Generate SBOM (CycloneDX/SPDX) if tools are available.

## 2) Auto‑Trigger Signals (Detection)
- STRONG (any 1): secret leakage, Critical/High CVEs, major architectural change, security incident, edits to authN/authZ modules.
- MODERATE (≥2): sharp rise in tech debt, increased build failures, coverage drop, production config changes.
- When signals appear → proceed to step 3 (automated scans) even under Research Mode.

## 3) Automated scans (SAST/SCA/Secrets/IaC/Container)
- SAST (e.g.): Semgrep/Sonar – store JSON/SARIF reports under `sast/`
- SCA (dependencies): scan CVEs & licenses – store results under `sca/`
- Secret Scanning: Gitleaks/TruffleHog – store reports under `secrets/`
- IaC/Container: Checkov/Trivy/Kube policies – store reports under `iac/` and/or `container/`
- Lint/Format/Policy: run language linters – store logs under `lint/`

## 4) Manual Review (focus areas)
- AuthN/AuthZ: login/session flows, roles/permissions, BOLA/IDOR.
- Input handling: injection (SQL/OS/LDAP), XSS, template injection.
- Crypto & secrets: correct crypto usage, key management, TLS, secret storage.
- Data flow: PII/secrets, logging/sanitization, error handling.
- CI/CD & configuration: token scope, excessive privileges, production parameters.

## 5) Triage & Validation (reduce false positives)
- Classify findings by severity (Critical/High/Medium/Low).
- Provide minimal PoC for critical findings (if needed).
- Tag impact scope and estimate remediation effort.

## 6) Reporting & Remediation
- Consolidate report at `reports/audit-report.md`:
  - Findings table (severity, description, impact, `file:line`, evidence/PoC).
  - Recommendations and sample patches/PRs.
- Remediation plan: prioritize Critical/High; schedule retests.

## 7) Retest & Close
- After fixes: rerun relevant steps; update the report.
- Close the audit when: Critical/High are fixed/mitigated; Medium is planned; Low is acknowledged.

## 8) Success Criteria
- 0 exposed secrets; Critical/High addressed.
- Dependencies patched or isolated; coverage increased in risk areas.
- Report is reproducible with complete evidence.

## 9) Suggested tools (optional)
- SAST: Semgrep, SonarQube
- SCA: OWASP Dependency‑Check, Snyk
- Secrets: Gitleaks, TruffleHog
- IaC/Container: Checkov, Trivy
- Linters/Formatters: ESLint, Pylint, Prettier, Black

## 10) Resilience/Operational Hooks (global integration)
- Research Mode: Auto‑Trigger runs the audit when strong/moderate signals are observed.
- Unrestricted Mode: Periodic audits or event‑driven (pre‑release/large merge).
- Connect to Resilience Ladder: when output is blocked/truncated, use chunking/streaming + artifactize the report.

## 11) Stop Criteria
- Meet success criteria or exhaust scope/resources; note remaining risks and next plan.
# AGENT AUTO-ACTIVATION GUIDE
## Hướng dẫn Tự động Kích hoạt Agents - Điều kiện Chi tiết

**Mục đích**: Làm rõ **CHÍNH XÁC** điều kiện để agents tự động kích hoạt (không cần user chỉ định).

---

## 🎯 Nguyên tắc Tự động Kích hoạt

### Quy tắc Vàng (ĐIỀU CHỈNH: DỄ KÍCH HOẠT HƠN)
```yaml
mandatory_rules:
  - LUÔN chạy Auto-Detection cho mọi yêu cầu mới
  - Confidence ≥ 0.50 → Kích hoạt agent chuyên biệt (GIẢM từ 0.70)
  - Confidence < 0.50 → Dùng universal agent + ghi chú "Uncertainties"
  - Trình bày: Agent + Confidence + Lý do + Các cờ tự động
  - BIAS: Ưu tiên kích hoạt agent chuyên biệt hơn universal
```

### Công thức Confidence Scoring (ĐIỀU CHỈNH: TĂNG ĐỘ NHẠY)
```yaml
confidence = (
  pattern_match_score * 0.45 +      # Khớp từ khóa/verb/domain (TĂNG từ 0.40)
  domain_expertise_score * 0.30 +   # Chuyên môn domain (GIỮ NGUYÊN)
  complexity_alignment_score * 0.15 + # Phù hợp độ phức tạp (GIẢM từ 0.20)
  resource_readiness_score * 0.10    # Công cụ/MCP sẵn sàng (GIỮ NGUYÊN)
)

thresholds:  # GIẢM TẤT CẢ NGƯỠNG 20 ĐIỂM
  high_confidence: ≥ 0.65   → Kích hoạt ngay (GIẢM từ 0.85)
  medium_confidence: 0.50-0.64 → Kích hoạt với caution flag (GIẢM từ 0.70-0.84)
  low_confidence: < 0.50    → Dùng universal agent (GIẢM từ 0.70)

scoring_boosts:  # MỚI: TĂNG ĐIỂM CHO KEYWORD MATCH
  exact_keyword_hit: +0.20 (TĂNG từ +0.15)
  semantic_similarity_strong: +0.15 (TĂNG từ +0.10)
  verb_operation_match: +0.12 (TĂNG từ +0.10)
  domain_indicator_present: +0.08 (TĂNG từ +0.05)
  file_pattern_match: +0.15 (MỚI - trước chỉ là boost riêng lẻ)
```

---

## 📊 ĐIỀU KIỆN TỰ KÍCH HOẠT AGENTS

### 1. Performance Issues → `performance-engineer`

**Trigger Conditions** (ĐIỀU CHỈNH: DỄ KÍCH HOẠT):
```yaml
performance_issues:
  response_time: > 300ms (GIẢM từ 500ms)
  error_rate: > 0.5% (GIẢM từ 1%)
  resource_usage: medium-high (CPU/Memory >60%, GIẢM từ 75%)

auto_activates:
  agents: [performance-engineer, performance-optimizer]
  flags: [--focus performance, --think]
  mcp_servers: [sequential-thinking, playwright]

confidence_threshold: 60% (GIẢM từ 85%)
```

**Keyword Triggers**:
- "optimize", "performance", "slow", "bottleneck", "latency"
- "throughput", "efficiency", "speed up", "response time"

**Context Triggers**:
- User báo cáo slowness
- Metrics cho thấy performance degradation >50%
- System monitoring alerts về high resource usage

**Example**:
```
User: "API đang chạy chậm, response time >1 giây"
→ Auto-activate: performance-engineer (90% confidence)
→ Flags: --think --focus performance
→ MCP: sequential-thinking (root cause analysis)
```

---

### 2. UI/UX Tasks → `frontend-developer` + `react-component-architect`

**Trigger Conditions** (ĐIỀU CHỈNH: DỄ KÍCH HOẠT):
```yaml
ui_ux_tasks:
  keywords: [component, interface, UI, layout, responsive, accessibility, page, screen, form, button]
  file_patterns: ["*.jsx", "*.tsx", "*.vue", "*.css", "*.html", "*.scss"]
  operations: [create, implement, style, design, build, make]

auto_activates:
  agents: [frontend-developer, react-component-architect]
  flags: [--magic, --c7]
  mcp_servers: [magic, context7, playwright]

confidence_threshold: 55% (GIẢM từ 80%)
```

**Keyword Triggers** (MỞ RỘNG):
- Primary: "component", "interface", "design", "layout", "styling", "UI", "page", "screen"
- Secondary: "React", "Vue", "Angular", "CSS", "responsive", "form", "button", "input"
- Tertiary: "state", "props", "hooks", "animation", "transition", "click", "render"
- NEW: "make", "build", "create", "show", "display", "view" (các từ chung)

**File Pattern Boost** (TĂNG BOOST):
```yaml
jsx/tsx: +0.15 confidence (TĂNG từ +0.10)
vue: +0.15 confidence (TĂNG từ +0.10)
css/scss: +0.10 confidence (TĂNG từ +0.05)
html: +0.12 confidence (MỚI)
component: +0.12 confidence (TĂNG từ +0.08)
pages/: +0.10 confidence (TĂNG từ +0.06)
src/: +0.05 confidence (MỚI)
```

**Example**:
```
User: "Create a responsive login component with form validation"
→ Auto-activate: frontend-developer + react-component-architect (88% confidence)
→ Flags: --magic --c7
→ MCP: magic (UI generation), context7 (framework docs)
```

---

### 3. Complex Debugging → `debugger` + `debug-specialist`

**Trigger Conditions** (ĐIỀU CHỈNH: DỄ KÍCH HOẠT):
```yaml
complex_debugging:
  keywords: [debug, fix, troubleshoot, error, crash, failure, issue, problem, broken, not working]
  complexity: any (GIẢM từ multi_component_failures)
  scope: any_investigation (GIẢM từ root_cause_investigation)

auto_activates:
  agents: [debugger, debug-specialist, codebase-research-analyst]
  flags: [--think, --seq]
  mcp_servers: [sequential-thinking, playwright]

confidence_threshold: 50% (GIẢM từ 75%)
```

**Keyword Triggers** (MỞ RỘNG):
- Primary: "debug", "fix", "troubleshoot", "resolve", "investigate"
- Secondary: "error", "crash", "failure", "bug", "not working", "broken", "issue"
- Tertiary: "stack trace", "exception", "TypeError", "undefined", "null"
- NEW: "help", "problem", "wrong", "doesn't work", "fails" (các từ chung hơn)

**Complexity Indicators** (GIẢM NGƯỠNG):
```yaml
simple_bug:
  - Single file error
  - Clear error message
  - Confidence: 55% (TĂNG từ 70%)

moderate_bug:
  - Multi-file interaction
  - Unclear error source
  - Confidence: 65% (MỚI - giữa simple và complex)

complex_bug:
  - Multi-component interaction
  - Race conditions
  - Intermittent failures
  - Confidence: 75% (GIẢM từ 85%)
```

**Example**:
```
User: "Users reported login failures but no errors in logs"
→ Auto-activate: debugger + debug-specialist (82% confidence)
→ Flags: --think --seq
→ MCP: sequential-thinking (systematic investigation)
```

---

### 4. Documentation Tasks → `technical-documentation-specialist`

**Trigger Conditions**:
```yaml
documentation_tasks:
  keywords: [document, README, wiki, guide, tutorial, API docs]
  file_patterns: ["*.md", "README*", "CHANGELOG*", "docs/*"]
  operations: [write, document, explain, create_guide]

auto_activates:
  agents: [technical-documentation-specialist, api-documenter]
  flags: [--c7]
  mcp_servers: [context7, sequential-thinking]

confidence_threshold: 50% (GIẢM từ 70%)
```

**Keyword Triggers** (MỞ RỘNG):
- Primary: "document", "documentation", "readme", "wiki", "guide", "write", "explain"
- Secondary: "markdown", "API docs", "reference", "how-to", "manual", "instructions"
- NEW: "comment", "describe", "note", "summary" (các từ chung hơn)

**File Pattern Boost** (TĂNG BOOST):
```yaml
.md: +0.20 confidence (TĂNG từ +0.15)
README: +0.25 confidence (TĂNG từ +0.20)
CHANGELOG: +0.20 confidence (TĂNG từ +0.15)
docs/: +0.15 confidence (TĂNG từ +0.12)
.txt: +0.10 confidence (MỚI)
comments in code: +0.08 confidence (MỚI)
```

**Example**:
```
User: "Write API documentation for authentication endpoints"
→ Auto-activate: technical-documentation-specialist (93% confidence)
→ Flags: --c7
→ MCP: context7 (documentation patterns)
```

---

### 5. Backend API Tasks → `backend-developer`

**Trigger Conditions** (ĐIỀU CHỈNH: DỄ KÍCH HOẠT):
```yaml
backend_api_tasks:
  keywords: [API, endpoint, database, server, authentication, service, backend, data]
  file_patterns: ["*.py", "*.go", "*.js", "*.ts", "controllers/*", "models/*", "api/*", "services/*"]
  operations: [implement, optimize, secure, scale, create, build]

auto_activates:
  agents: [backend-developer, rails-backend-expert]
  flags: [--seq]
  mcp_servers: [context7, sequential-thinking]

confidence_threshold: 60% (GIẢM từ 92%)
```

**Keyword Triggers** (MỞ RỘNG):
- Primary: "API", "endpoint", "database", "server", "backend", "service", "data"
- Secondary: "REST", "GraphQL", "PostgreSQL", "MongoDB", "authentication", "auth"
- Tertiary: "repository", "ORM", "query", "transaction", "JWT", "session"
- NEW: "implement API", "build service", "create endpoint", "setup database" (các cụm từ chung)

**File Pattern Boost** (TĂNG BOOST):
```yaml
.py: +0.12 confidence (TĂNG từ +0.08)
.go: +0.12 confidence (TĂNG từ +0.08)
.js: +0.08 confidence (MỚI)
.ts: +0.08 confidence (MỚI)
controllers/: +0.15 confidence (TĂNG từ +0.10)
models/: +0.15 confidence (TĂNG từ +0.10)
api/: +0.12 confidence (TĂNG từ +0.08)
services/: +0.10 confidence (MỚI)
routes/: +0.10 confidence (MỚI)
```

**Example**:
```
User: "Implement user authentication API with JWT"
→ Auto-activate: backend-developer (92% confidence)
→ Flags: --seq
→ MCP: context7 (JWT docs), sequential-thinking (multi-step)
```

---

### 6. Testing Tasks → `test-automator` + `security-auditor`

**Trigger Conditions** (ĐIỀU CHỈNH: DỄ KÍCH HOẠT):
```yaml
testing_tasks:
  keywords: [test, testing, quality, qa, validation, coverage, e2e, unit, integration]
  file_patterns: [".test.", ".spec.", "__tests__/*", "test/*", "tests/*", "spec/*"]
  operations: [test_creation, e2e_automation, validation, testing, verify]

auto_activates:
  agents: [test-automator, security-auditor]
  flags: [--play, --validate]
  mcp_servers: [playwright, sequential-thinking]

confidence_threshold: 55% (GIẢM từ 85%)
```

**Keyword Triggers** (MỞ RỘNG):
- Primary: "test", "testing", "quality", "qa", "validation", "verification", "coverage"
- Secondary: "unit-test", "integration-test", "e2e-test", "coverage", "e2e", "unit", "integration"
- Tertiary: "jest", "mocha", "pytest", "selenium", "cypress", "vitest", "testcafe"
- NEW: "write test", "add test", "test coverage", "verify", "check" (các từ chung hơn)

**File Pattern Boost** (TĂNG BOOST):
```yaml
.test.: +0.20 confidence (TĂNG từ +0.15)
.spec.: +0.20 confidence (TĂNG từ +0.15)
__tests__/: +0.20 confidence (TĂNG từ +0.15)
test/: +0.15 confidence (TĂNG từ +0.12)
tests/: +0.15 confidence (MỚI)
spec/: +0.15 confidence (MỚI)
e2e/: +0.12 confidence (MỚI)
```

---

### 7. DevOps/Infrastructure → `devops-infrastructure-specialist`

**Trigger Conditions** (ĐIỀU CHỈNH: DỄ KÍCH HOẠT):
```yaml
devops_tasks:
  keywords: [deploy, deployment, infrastructure, ci/cd, docker, kubernetes, pipeline, devops, container]
  file_patterns: ["Dockerfile", "*.yml", "*.yaml", "terraform/*", ".github/workflows/*", "k8s/*", ".gitlab-ci.*"]
  operations: [deployment, provisioning, monitoring, automation, setup, configure]

auto_activates:
  agents: [devops-infrastructure-specialist, deployment-engineer]
  flags: [--safe-mode, --validate]
  mcp_servers: [sequential-thinking, context7]

confidence_threshold: 55% (GIẢM từ 85%)
```

**Keyword Triggers** (MỞ RỘNG):
- Primary: "deploy", "deployment", "infrastructure", "ci/cd", "pipeline", "devops"
- Secondary: "docker", "kubernetes", "terraform", "jenkins", "AWS", "cloud", "container"
- Tertiary: "monitoring", "logging", "prometheus", "helm", "kubectl", "ansible"
- NEW: "setup deployment", "configure pipeline", "deploy app", "setup infrastructure" (các cụm từ chung)

**File Pattern Boost** (TĂNG BOOST):
```yaml
Dockerfile: +0.20 confidence (TĂNG từ +0.15)
.yml/.yaml: +0.15 confidence (TĂNG từ +0.10)
terraform/: +0.15 confidence (TĂNG từ +0.12)
.github/workflows/: +0.15 confidence (TĂNG từ +0.12)
k8s/: +0.15 confidence (TĂNG từ +0.10)
.gitlab-ci.*: +0.15 confidence (MỚI)
.circleci/: +0.12 confidence (MỚI)
docker-compose.*: +0.15 confidence (MỚI)
```

---

### 8. Refactoring Tasks → `code-refactorer`

**Trigger Conditions** (ĐIỀU CHỈNH: DỄ KÍCH HOẠT):
```yaml
refactoring_tasks:
  keywords: [refactor, improve, clean up, optimize code, restructure, cleanup, technical debt]
  operations: [modification, optimization, code_quality_improvement, refactoring]
  complexity: low_to_high (GIẢM từ moderate_to_high)

auto_activates:
  agents: [code-refactorer, performance-optimizer]
  flags: [--wave-strategy systematic, --validate]
  mcp_servers: [sequential-thinking, context7]

confidence_threshold: 52% (GIẢM từ 88%)
```

**Keyword Triggers** (MỞ RỘNG):
- Primary: "refactor", "improve", "clean up", "optimize", "restructure", "cleanup"
- Secondary: "technical debt", "code smell", "duplicate code", "simplify", "modularize"
- NEW: "make better", "improve code", "clean code", "reorganize" (các từ chung hơn)

---

### 9. Security Tasks → `security-auditor`

**Trigger Conditions** (ĐIỀU CHỈNH: DỄ KÍCH HOẠT):
```yaml
security_tasks:
  keywords: [security, authentication, authorization, vulnerability, encryption, secure, audit, penetration]
  operations: [security_audit, vulnerability_assessment, penetration_testing, security_check]

auto_activates:
  agents: [security-auditor, backend-developer]
  flags: [--think, --validate]
  mcp_servers: [sequential-thinking, context7]

confidence_threshold: 55% (GIẢM từ 85%)
```

**Keyword Triggers** (MỞ RỘNG):
- Primary: "security", "authentication", "authorization", "encryption", "vulnerability", "secure"
- Secondary: "oauth", "jwt", "ssl", "tls", "xss", "csrf", "sql-injection", "audit"
- Tertiary: "penetration-testing", "security-audit", "threat-modeling", "hash", "bcrypt"
- NEW: "security check", "check security", "secure code", "protect", "safety" (các từ chung hơn)

---

### 10. Data/Analytics Tasks → `data-specialist`

**Trigger Conditions** (ĐIỀU CHỈNH: DỄ KÍCH HOẠT):
```yaml
data_tasks:
  keywords: [data, analytics, etl, pipeline, warehouse, visualization, bigdata, analysis]
  operations: [data_pipeline_creation, analytics_setup, visualization, etl, data_processing]

auto_activates:
  agents: [data-specialist, data-engineer]
  flags: [--seq]
  mcp_servers: [sequential-thinking, context7]

confidence_threshold: 55% (GIẢM từ 85%)
```

**Keyword Triggers** (MỞ RỘNG):
- Primary: "data", "analytics", "etl", "pipeline", "warehouse", "big-data", "data-engineering"
- Secondary: "transformation", "aggregation", "cleansing", "normalization", "data processing"
- Tertiary: "spark", "hadoop", "kafka", "airflow", "dbt", "tableau", "powerbi"
- NEW: "process data", "analyze data", "data analysis", "create pipeline", "setup analytics" (các cụm từ chung)

---

## 🌊 WAVE MODE AUTO-ACTIVATION

### Wave Triggers (Kích hoạt Wave Mode) - ĐIỀU CHỈNH: DỄ KÍCH HOẠT

**1. Complex Multi-Domain** (GIẢM NGƯỠNG):
```yaml
condition: complexity > 0.6 AND files > 15 AND operation_types > 2 (GIẢM từ 0.8, 20, 2)
action: --wave-mode auto
confidence: 85% (GIẢM từ 95%)
```

**2. Enterprise Scale** (GIẢM NGƯỠNG):
```yaml
condition: files > 70 AND complexity > 0.5 AND domains > 2 (GIẢM từ 100, 0.7, 2)
action: --wave-strategy enterprise
confidence: 70% (GIẢM từ 85%)
```

**3. Large Refactoring** (GIẢM NGƯỠNG):
```yaml
condition: large_scope AND structural_changes AND complexity > 0.6 (GIẢM từ 0.8)
action: --wave-mode --systematic-waves --wave-validation
confidence: 80% (GIẢM từ 93%)
```

**4. Comprehensive Audit** (GIẢM NGƯỠNG):
```yaml
condition: scope = comprehensive AND quality_critical
action: --wave-mode --wave-validation --multi-agent
confidence: 85% (GIẢM từ 95%)
```

**5. Legacy Modernization** (GIẢM NGƯỠNG):
```yaml
condition: legacy_system AND modernization_request
action: --wave-strategy enterprise --wave-delegation tasks
confidence: 80% (GIẢM từ 92%)
```

---

## 🚀 SUB-AGENT DELEGATION AUTO-ACTIVATION

### Delegation Triggers - ĐIỀU CHỈNH: DỄ KÍCH HOẠT

**1. Directory Threshold** (GIẢM NGƯỠNG):
```yaml
condition: directory_count > 5 (GIẢM từ 7)
action: --delegate --parallel-dirs
confidence: 90% (GIẢM từ 95%)
```

**2. File Threshold** (GIẢM NGƯỠNG):
```yaml
condition: file_count > 30 AND complexity > 0.4 (GIẢM từ 50, 0.6)
action: --delegate --sub-agents [calculated]
confidence: 80% (GIẢM từ 90%)
```

**3. Multi-Domain** (GIẢM NGƯỠNG):
```yaml
condition: domains.length > 2 (GIẢM từ 3)
action: --delegate --parallel-focus
confidence: 75% (GIẢM từ 85%)
```

**4. Complex Analysis** (GIẢM NGƯỠNG):
```yaml
condition: complexity > 0.6 AND scope = comprehensive (GIẢM từ 0.8)
action: --delegate --focus-agents
confidence: 80% (GIẢM từ 90%)
```

**5. Token Optimization** (GIẢM NGƯỠNG):
```yaml
condition: estimated_tokens > 15000 (GIẢM từ 20000)
action: --delegate --aggregate-results
confidence: 70% (GIẢM từ 80%)
```

---

## 🔄 LOOP MODE AUTO-ACTIVATION

### Loop Triggers - ĐIỀU CHỈNH: DỄ KÍCH HOẠT

**1. Quality Improvement Keywords** (GIẢM NGƯỠNG):
```yaml
keywords: [polish, refine, enhance, improve, correct, better, upgrade, optimize]
action: --loop
default_iterations: 3
confidence: 75% (GIẢM từ 90%)
```

**2. Iterative Requests** (GIẢM NGƯỠNG):
```yaml
keywords: [iteratively, step by step, incrementally, progressively, repeatedly, gradually]
action: --loop
default_iterations: 3
confidence: 75% (GIẢM từ 90%)
```

**3. Refinement Operations** (GIẢM NGƯỠNG):
```yaml
keywords: [cleanup, fix, correct, adjust, tweak, fine-tune]
context: existing_code
action: --loop
default_iterations: 3
confidence: 70% (GIẢM từ 88%)
```

---

## 📋 CONTEXT-BASED AUTO-ACTIVATION

### Tổng hợp Patterns

```yaml
performance_issues:
  → performance-engineer + performance-optimizer + --focus performance + --think

ui_ux_tasks:
  → frontend-developer + react-component-architect + --magic + --c7

complex_debugging:
  → debugger + codebase-research-analyst + --think + --seq

large_codebase:
  → --uc when context >75% + --delegate auto + codebase-research-analyst

testing_operations:
  → test-automator + security-auditor + --play + --validate

devops_operations:
  → devops-infrastructure-specialist + deployment-engineer + --safe-mode + --validate

refactoring:
  → code-refactorer + performance-optimizer + --wave-strategy systematic + --validate

iterative_improvement:
  → code-refactorer + general-purpose + --loop
```

---

## 🎯 MASTER ROUTING TABLE (Quick Reference)

| User Request Pattern | Complexity | Auto-Activates Agent | Confidence | Flags |
|---------------------|------------|---------------------|------------|-------|
| "optimize performance" | complex | performance-engineer | 90% | --think-hard, playwright |
| "create component" | simple | frontend-developer | 90% | magic, --uc |
| "implement API" | moderate | backend-developer | 92% | --seq, context7 |
| "fix bug" | moderate | debugger + debug-specialist | 85% | --think, sequential-thinking |
| "write documentation" | moderate | technical-documentation-specialist | 95% | context7 |
| "improve iteratively" | moderate | code-refactorer | 90% | --seq, --loop |
| "analyze architecture" | complex | codebase-research-analyst + backend-architect | 95% | --ultrathink, sequential-thinking |
| "comprehensive audit" | complex | security-auditor + test-automator | 95% | --multi-agent --parallel-focus |
| "modernize legacy" | complex | legacy-modernizer | 92% | --wave-mode enterprise |

---

## ⚙️ CONFIGURATION

### Orchestrator Settings
```yaml
orchestrator_config:
  auto_detect_on_new_request: true
  confidence_threshold: 0.7
  pattern_detection: aggressive

  wave_mode:
    enable_auto_detection: true
    wave_score_threshold: 0.7
    max_waves_per_operation: 5
```

### Confidence Thresholds
```yaml
thresholds:
  high_confidence: 0.85+
  medium_confidence: 0.70-0.84
  low_confidence: <0.70

actions:
  high: "proceed_with_selected_specialist"
  medium: "proceed_with_caution_flag_and_monitoring"
  low: "use_universal_agent_with_uncertainty_disclosure"
```

---

## 📚 References

- **detection-engine.md** — 8-step detection algorithm, confidence scoring
- **routing-intelligence.md** — Routing tables, agent selection rules
- **task-delegation.md** — Delegation triggers, specialization matrix
- **FLAGS.md** — Flag auto-activation patterns

---

**Status**: ✅ Complete Reference Guide
**Coverage**: 10+ agent types, 5 wave triggers, 5 delegation triggers, 3 loop triggers
**Confidence Accuracy**: 90%+ on 85%+ requests

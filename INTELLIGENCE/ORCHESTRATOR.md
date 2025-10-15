# ORCHESTRATOR — Hệ thống Định tuyến Thông minh
## Intelligent Routing System v2.0

**Purpose**: Tự động phát hiện và định tuyến tác vụ đến Sub-Agent phù hợp nhất
**SSOT Status**: ⭐ Authoritative for task routing and agent selection

---

## 🚨 MANDATORY AUTO-DETECTION PROTOCOL (Bắt buộc)

### **CORE DIRECTIVE**: Auto-detect for EVERY new user request

```yaml
mandatory_workflow:
  step_1_parse:
    - Extract keywords and patterns from request
    - Identify domain (frontend/backend/infrastructure/docs/etc)
    - Classify operation type (analysis/creation/modification/debugging)

  step_2_score:
    - Calculate complexity score (0.0-1.0)
    - Estimate resource requirements (tokens, time, tools)
    - Evaluate confidence for each specialist agent

  step_3_select:
    - Choose best-match agent if confidence ≥ 80%
    - Fall back to universal agent if confidence < 80%
    - Generate detailed routing recommendation

  step_4_present:
    - Display agent selection + confidence score
    - Explain reasoning (pattern hits, domain, operations)
    - List key flags that will be auto-activated

  step_5_execute:
    - Use Task tool to delegate to selected agent
    - Apply Quality Gates before completion
    - Validate all outputs meet criteria
```

### **Required Output Format**
```markdown
🤖 **SUB-AGENT AUTO-DETECTION** (Tự động Phát hiện Sub-Agent)

**Selected Agent** (Agent được chọn): `{agent_name}`
**Confidence Score** (Điểm tin cậy): `{score}%`

**Reasoning** (Lý do lựa chọn):
- Domain Match: {domain} ({pattern_count} keywords matched)
- Operation Type: {operation_types}
- Complexity: {complexity_score} ({simple|moderate|complex})
- Estimated Time: {time_estimate}

**Auto-Activated Flags** (Cờ tự động kích hoạt):
- {flag_1}: {reason_1}
- {flag_2}: {reason_2}
- {flag_3}: {reason_3}

**Execution Mode** (Chế độ thực thi): {mode}
**MCP Servers** (Máy chủ MCP): {servers}
**Tool Budget** (Ngân sách công cụ): {budget}

---
```

### **Confidence Threshold Enforcement**
```yaml
confidence_rules:
  high_confidence: ≥90%
    action: Execute immediately with selected specialist
    validation: Standard quality gates

  medium_confidence: 80-89%
    action: Execute with selected specialist
    validation: Enhanced quality gates + verification

  low_confidence: <80%
    action: Use universal agent (general-purpose)
    validation: Full quality gates + manual review flag
    note: "⚠️ Confidence below threshold. Using universal agent with enhanced validation."
```

---

## 🧠 DETECTION ENGINE (Cơ chế Phát hiện)

### Pattern Recognition Matrix

#### Domain Identification
```yaml
frontend:
  keywords: [UI, component, React, Vue, CSS, responsive, accessibility, design, layout]
  files: ["*.jsx", "*.tsx", "*.vue", "*.css", "*.scss"]
  operations: [create, implement, style, optimize, test]
  typical_agents: [frontend-developer, react-component-architect, vue-component-architect]
  confidence_boost: +15% if UI keywords + component files

backend:
  keywords: [API, database, server, endpoint, auth, performance, service, controller]
  files: ["*.js", "*.ts", "*.py", "*.go", "controllers/*", "models/*", "api/*"]
  operations: [implement, optimize, secure, scale]
  typical_agents: [backend-developer, rails-backend-expert, django-backend-expert]
  confidence_boost: +15% if API keywords + backend files

infrastructure:
  keywords: [deploy, Docker, CI/CD, monitoring, scaling, config, DevOps, cloud]
  files: ["Dockerfile", "*.yml", "*.yaml", ".github/*", "terraform/*"]
  operations: [setup, configure, automate, monitor]
  typical_agents: [devops-infrastructure-specialist, deployment-engineer]
  confidence_boost: +20% if infra keywords + config files

documentation:
  keywords: [document, README, wiki, guide, manual, instructions, write, explain]
  files: ["*.md", "*.rst", "docs/*", "README*"]
  operations: [write, document, explain, translate]
  typical_agents: [technical-documentation-specialist, content-writer]
  confidence_boost: +10% if doc keywords + markdown files

analysis:
  keywords: [analyze, review, investigate, debug, troubleshoot, understand, audit]
  operations: [analyze, review, investigate, troubleshoot]
  typical_agents: [codebase-research-analyst, code-searcher, debugger]
  confidence_boost: +15% if analysis keywords + complex scope

quality:
  keywords: [refactor, improve, clean, optimize, test, quality, performance]
  operations: [refactor, improve, optimize, test]
  typical_agents: [code-refactorer, performance-optimizer, test-automator]
  confidence_boost: +15% if quality keywords + technical debt indicators
```

#### Complexity Scoring
```yaml
simple: 0.0-0.3
  indicators:
    - Single file operations
    - Basic CRUD tasks
    - Straightforward queries
    - <3 step workflows
  token_budget: 5K
  time_estimate: <5 min
  confidence_multiplier: 1.0

moderate: 0.4-0.6
  indicators:
    - Multi-file operations (2-5 files)
    - Analysis tasks
    - Refactoring requests
    - 3-10 step workflows
  token_budget: 15K
  time_estimate: 5-30 min
  confidence_multiplier: 1.1

complex: 0.7-1.0
  indicators:
    - System-wide changes (>5 files)
    - Architectural decisions
    - Performance optimization
    - >10 step workflows
  token_budget: 30K+
  time_estimate: >30 min
  confidence_multiplier: 1.2
```

### Confidence Calculation Algorithm
```python
def calculate_confidence(request, agent):
    base_score = 0.0

    # 1. Keyword Matching (30%)
    keyword_match = count_matching_keywords(request, agent.keywords)
    base_score += (keyword_match / total_keywords) * 0.30

    # 2. Domain Context (40%)
    domain_score = analyze_domain_fit(request, agent.domain)
    base_score += domain_score * 0.40

    # 3. Historical Success (20%)
    historical_score = get_success_rate(agent, similar_tasks)
    base_score += historical_score * 0.20

    # 4. Resource Availability (10%)
    resource_score = check_resources(agent.requirements)
    base_score += resource_score * 0.10

    # Apply complexity multiplier
    complexity = calculate_complexity(request)
    final_score = base_score * complexity_multiplier[complexity]

    # Apply confidence boost
    if has_strong_signals(request, agent):
        final_score += agent.confidence_boost

    return min(final_score, 1.0) * 100  # Convert to percentage
```

---

## 🚦 AUTO-ACTIVATION TRIGGERS (Kích hoạt Tự động)

### Delegation Triggers
```yaml
parallel_dirs_trigger:
  condition: directory_count > 7
  action: --delegate --parallel-dirs
  confidence: 95%
  agents: [general-purpose, codebase-research-analyst]

multi_file_trigger:
  condition: file_count > 50 AND complexity > 0.6
  action: --delegate --sub-agents [calculated]
  confidence: 90%
  agents: [general-purpose, code-searcher]

multi_domain_trigger:
  condition: domains.length > 3
  action: --multi-agent --parallel-focus
  confidence: 85%
  agents: [workflow-orchestrator, tech-lead-orchestrator]

complex_analysis_trigger:
  condition: complexity > 0.8 AND scope == comprehensive
  action: --delegate --focus-agents
  confidence: 90%
  agents: [codebase-research-analyst, security-auditor]
```

### MCP Server Auto-Activation
```yaml
context7_trigger:
  conditions:
    - External library imports detected
    - Framework-specific questions
    - Documentation requests
  action: --c7 or --context7
  confidence: 85%

sequential_trigger:
  conditions:
    - Complex debugging scenarios
    - System design questions
    - --think flags present
  action: --seq or --sequential
  confidence: 90%

magic_trigger:
  conditions:
    - UI component requests
    - Design system queries
    - Frontend persona active
  action: --magic
  confidence: 85%

playwright_trigger:
  conditions:
    - Testing workflows
    - Performance monitoring requests
    - E2E test generation
  action: --play or --playwright
  confidence: 80%
```

### Persona Auto-Activation
```yaml
performance_trigger:
  conditions:
    - Keywords: optimize, performance, bottleneck, slow
    - Performance issues detected (response >500ms, errors >1%)
  action: --persona-performance + --focus performance
  confidence: 85%

frontend_trigger:
  conditions:
    - Keywords: component, UI, responsive, accessibility
    - File patterns: *.jsx, *.vue, *.css
  action: --persona-frontend + --magic
  confidence: 80%

analyzer_trigger:
  conditions:
    - Keywords: analyze, debug, investigate, root cause
    - Multi-component failures
  action: --persona-analyzer + --think + --seq
  confidence: 75%

scribe_trigger:
  conditions:
    - Keywords: document, write, guide, README, wiki
    - Documentation files involved
  action: --persona-scribe=en
  confidence: 70%
```

---

## 🎯 MASTER ROUTING TABLE (Bảng Định tuyến Chính)

| Pattern | Complexity | Domain | Auto-Activated Agent | Confidence | Flags |
|---------|------------|--------|---------------------|------------|-------|
| "implement feature" | moderate | any | software-engineer | 88% | --seq, --c7 |
| "implement API" | moderate | backend | backend-developer | 92% | --seq, --c7 |
| "implement UI component" | simple | frontend | frontend-developer | 94% | --magic, --c7 |
| "create component" | simple | frontend | react-component-architect | 90% | --magic, --uc |
| "analyze architecture" | complex | any | codebase-research-analyst | 95% | --ultrathink, --seq |
| "analyze large codebase" | complex | any | codebase-research-analyst | 95% | --delegate, --parallel-dirs |
| "fix bug" | moderate | any | debugger | 85% | --think, --seq |
| "debug issue" | moderate | any | debug-specialist | 87% | --think, --seq |
| "optimize performance" | complex | any | performance-optimizer | 90% | --think-hard, --play |
| "improve code quality" | moderate | quality | code-refactorer | 88% | --seq, --wave-mode |
| "write documentation" | moderate | docs | technical-documentation-specialist | 95% | --persona-scribe, --c7 |
| "comprehensive audit" | complex | multi | security-auditor | 95% | --multi-agent, --parallel-focus |
| "refactor code" | moderate | quality | code-refactorer | 90% | --seq, --wave-strategy systematic |
| "search code" | simple | any | code-searcher | 92% | --grep patterns |
| "deploy application" | complex | infra | deployment-engineer | 88% | --safe-mode, --validate |

---

## 📊 TASK TOOL USAGE (Sử dụng Task Tool)

### **MANDATORY**: Always use Task tool for delegation

```yaml
task_tool_policy:
  when_to_use: ALL agent delegations (no exceptions)

  required_parameters:
    subagent_type: {agent_name_from_routing_table}
    description: "Brief 3-5 word task description"
    prompt: "Detailed task with context, requirements, and success criteria"

  prompt_template: |
    **Context**: {current_situation}
    **Objective**: {what_to_achieve}
    **Requirements**:
    - {requirement_1}
    - {requirement_2}
    - {requirement_3}
    **Success Criteria**:
    - {criteria_1}
    - {criteria_2}
    **Constraints**:
    - {constraint_1}
    - {constraint_2}
    **Expected Output**: {output_format}
```

### Example Task Tool Call
```python
Task(
    subagent_type="backend-developer",
    description="Implement user authentication API",
    prompt="""
**Context**: Building REST API for user management system
**Objective**: Implement JWT-based authentication endpoints
**Requirements**:
- POST /api/auth/register endpoint
- POST /api/auth/login endpoint
- GET /api/auth/profile endpoint (protected)
- Password hashing with bcrypt
- JWT token generation and validation
**Success Criteria**:
- All endpoints return proper status codes
- Passwords securely hashed
- JWT tokens valid for 24 hours
- Unit tests coverage ≥80%
**Constraints**:
- Use existing Express.js framework
- Follow project's error handling patterns
- Database: PostgreSQL with Sequelize ORM
**Expected Output**: Working endpoints + tests + documentation
"""
)
```

---

## ✅ QUALITY GATES INTEGRATION (Tích hợp Kiểm soát Chất lượng)

### Pre-Execution Gates
```yaml
gate_1_validation:
  check: Agent selection confidence ≥ 80%
  action_if_fail: Use universal agent + flag for review

gate_2_resource_check:
  check: Token budget available, tools accessible
  action_if_fail: Activate --uc mode, defer non-critical

gate_3_dependency_check:
  check: Required files exist, permissions OK
  action_if_fail: Request clarification or proceed with assumptions
```

### Post-Execution Gates (MANDATORY before completion)
```yaml
gate_1_syntax:
  validation: Language parsers, linters
  tools: Context7 validation, intelligent suggestions
  required: PASS before marking complete

gate_2_type:
  validation: Type compatibility, Sequential analysis
  tools: TypeScript compiler, mypy, etc.
  required: PASS or justified exceptions

gate_3_lint:
  validation: Code quality rules
  tools: ESLint, Pylint, Rubocop, etc.
  required: PASS or justified exceptions

gate_4_test:
  validation: Unit tests (≥80%), integration tests (≥70%)
  tools: Playwright E2E, coverage analysis
  required: PASS for critical paths

gate_5_performance:
  validation: Sequential analysis, benchmarking
  tools: Performance profiling, optimization suggestions
  required: No regressions detected

gate_6_documentation:
  validation: Context7 patterns, completeness
  tools: Doc linters, accuracy verification
  required: Key changes documented

gate_7_integration:
  validation: Playwright testing, deployment validation
  tools: E2E tests, compatibility checks
  required: PASS for integration points

gate_8_evidence:
  validation: Comprehensive evidence provided
  required: Quantitative + qualitative + documentation
```

### Completion Criteria (ALL must be met)
```yaml
completion_requirements:
  validation: All applicable gates pass + evidence provided
  ai_integration: MCP coordination + persona integration + ≥90% context retention
  performance: Response time targets + resource limits + success thresholds
  quality: Code quality standards + performance assessment + integration testing
```

---

## 🔗 INTEGRATION POINTS

### Calls Out To
- `CORE/EXECUTION-ENGINE.md` - Execution rules enforcement
- `INTELLIGENCE/PERSONAS.md` - Persona activation and behavior
- `INTELLIGENCE/MCP-INTEGRATION.md` - Server coordination
- `POLICIES/QUALITY-GATES.md` - Detailed validation framework

### Called By
- `CORE/CLAUDE.md` - Main entry point for routing
- All command handlers - Task delegation decisions

---

## 📈 PERFORMANCE OPTIMIZATION

### Token Management
```yaml
efficient_routing:
  detection: 1-2K tokens
  decision: 500-1K tokens
  total_overhead: <3K tokens (vs 8K+ in v1.0)

caching:
  pattern_cache: Store successful routing patterns
  confidence_cache: Reuse confidence scores for similar tasks
  ttl: 3600 seconds (1 hour)
```

---

**Version**: 2.0-optimized
**Token Efficiency**: 300 lines (vs 700 in v1.0) = 57% reduction
**Authority**: SSOT for agent routing and selection
**Mandatory**: Auto-detection for ALL new requests
**Status**: ✅ Production Ready with enhanced validation

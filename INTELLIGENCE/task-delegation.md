# TASK DELEGATION — Hệ thống phân công và chuyên biệt
## SuperClaude Sub-Agent Delegation & Specialization Matrix

**Purpose**: Định nghĩa triggers cho task delegation, Wave orchestration, và ma trận chuyên biệt của Sub-Agents.

---

## 🎯 Delegation Decision Matrix

### Delegation Scoring Factors
- **Complexity >0.6**: +0.3 score
- **Parallelizable Operations**: +0.4 (scaled by opportunities/5, max 1.0)
- **High Token Requirements >15K**: +0.2 score
- **Multi-domain Operations >2**: +0.1 per domain

### Wave Opportunity Scoring
- **High Complexity >0.8**: +0.4 score
- **Multiple Operation Types >2**: +0.3 score
- **Critical Quality Requirements**: +0.2 score
- **Large File Count >50**: +0.1 score
- **Iterative Indicators**: +0.2 (scaled by indicators/3)
- **Enterprise Scale**: +0.15 score

### Strategy Recommendations
- **Wave Score >0.7**: Use wave strategies
- **Directories >7**: `parallel_dirs`
- **Focus Areas >2**: `parallel_focus`
- **High Complexity**: `adaptive_delegation`
- **Default**: `single_agent`

### Wave Strategy Selection
- **Performance Focus**: `progressive_waves`
- **Critical Operations**: `wave_validation`
- **Multiple Operations**: `adaptive_waves`
- **Enterprise Scale**: `enterprise_waves`
- **Default**: `systematic_waves`

---

## 🚀 Auto-Delegation Triggers

```yaml
directory_threshold:
  condition: directory_count > 7
  action: auto_enable --delegate --parallel-dirs
  confidence: 95%

file_threshold:
  condition: file_count > 50 AND complexity > 0.6
  action: auto_enable --delegate --sub-agents [calculated]
  confidence: 90%

multi_domain:
  condition: domains.length > 3
  action: auto_enable --delegate --parallel-focus
  confidence: 85%

complex_analysis:
  condition: complexity > 0.8 AND scope = comprehensive
  action: auto_enable --delegate --focus-agents
  confidence: 90%

token_optimization:
  condition: estimated_tokens > 20000
  action: auto_enable --delegate --aggregate-results
  confidence: 80%
```

---

## 🌊 Wave Auto-Delegation Triggers

- Complex improvement: complexity > 0.8 AND files > 20 AND operation_types > 2 → --wave-count 5 (95%)
- Multi-domain analysis: domains > 3 AND tokens > 15K → --adaptive-waves (90%)
- Enterprise scale: files > 100 AND complexity > 0.7 AND domains > 2 → --enterprise-waves (85%)
- Large refactoring: large_scope AND structural_changes AND complexity > 0.8 → --systematic-waves --wave-validation (93%)

---

## 📊 Delegation Routing Table

| Operation | Complexity | Auto-Delegates | Performance Gain |
|-----------|------------|----------------|------------------|
| `/load @monorepo/` | moderate | --delegate --parallel-dirs | 65% |
| `/analyze --comprehensive` | high | --multi-agent --parallel-focus | 70% |
| Comprehensive system improvement | high | --wave-mode --progressive-waves | 80% |
| Enterprise security audit | high | --wave-mode --wave-validation | 85% |
| Large-scale refactoring | high | --wave-mode --systematic-waves | 75% |

---

## 🎨 Sub-Agent Specialization Matrix

### Core Technical Specialists

#### Frontend Specialist
```yaml
domain_tags: [ui, ux, web, mobile, responsive, accessibility]

primary_keywords:
  - component, interface, design, layout, styling, responsive, accessibility
  - animation, transition, interaction, user-experience

secondary_keywords:
  - React, Vue, Angular, Svelte, Next.js, Nuxt.js
  - CSS, Tailwind, styled-components, SCSS, LESS
  - HTML, JSX, TSX, template, markup

tertiary_keywords:
  - state, props, hooks, composition-api, reactive, virtual-dom
  - redux, vuex, pinia, context, store, state-management

operation_types:
  - component_creation, ui_implementation, styling_optimization
  - accessibility_compliance, responsive_design, animation_implementation
  - state_management_setup, form_handling, validation

file_pattern_confidence_boost:
  ".jsx": +0.10
  ".tsx": +0.10
  ".vue": +0.10
  ".css": +0.05
  ".scss": +0.05
  "component": +0.08
  "pages/": +0.06

tools: [magic, context7, playwright, Read, Write, Edit]
mcp_servers: [magic, context7, playwright]
personas: [frontend, performance, qa]
complexity_capability: [simple, moderate, complex]
```

#### Backend Specialist
```yaml
domain_tags: [api, database, server, microservices, data, backend]

primary_keywords:
  - API, endpoint, database, server, service, backend, microservice
  - authentication, authorization, middleware, controller, model

secondary_keywords:
  - REST, GraphQL, gRPC, WebSocket, HTTP, HTTPS
  - SQL, NoSQL, PostgreSQL, MySQL, MongoDB, Redis
  - Node.js, Express, FastAPI, Django, Flask, Rails

tertiary_keywords:
  - repository, ORM, query, transaction, migration, schema
  - JWT, OAuth, session, cookie, token, encryption

operation_types:
  - api_implementation, database_design, service_architecture
  - authentication_setup, authorization_implementation
  - data_modeling, query_optimization, caching_strategy

file_pattern_confidence_boost:
  ".py": +0.08
  ".go": +0.08
  ".js": +0.05
  ".ts": +0.05
  "controllers/": +0.10
  "models/": +0.10
  "api/": +0.08

tools: [context7, sequential-thinking, Read, Write, Edit, Bash]
mcp_servers: [context7, sequential-thinking]
personas: [backend, architect, performance]
complexity_capability: [moderate, complex]
```

#### DevOps Specialist
```yaml
domain_tags: [deployment, infrastructure, ci_cd, monitoring, automation, cloud]

primary_keywords:
  - deploy, deployment, infrastructure, ci/cd, pipeline, automation
  - docker, kubernetes, container, orchestration, terraform, ansible

secondary_keywords:
  - jenkins, github-actions, gitlab-ci, circleci, travis-ci
  - AWS, Azure, GCP, cloud, serverless, lambda, function
  - monitoring, logging, metrics, prometheus, grafana, elk

tertiary_keywords:
  - helm, kubectl, docker-compose, vagrant
  - nginx, apache, load-balancer, reverse-proxy
  - scaling, auto-scaling, health-check, rollback

operation_types:
  - deployment_automation, infrastructure_provisioning
  - pipeline_configuration, monitoring_setup, scaling_optimization
  - containerization, orchestration_setup

file_pattern_confidence_boost:
  "Dockerfile": +0.15
  ".yml": +0.10
  ".yaml": +0.10
  "terraform/": +0.12
  ".github/workflows/": +0.12
  "k8s/": +0.10

tools: [sequential-thinking, Bash, Read, Write, Edit]
mcp_servers: [sequential-thinking, context7]
personas: [devops, architect]
complexity_capability: [moderate, complex]
```

---

### Process & Quality Specialists

#### QA Specialist
```yaml
domain_tags: [testing, quality, validation, verification, qa, test-automation]

primary_keywords:
  - test, testing, quality, qa, validation, verification, coverage
  - unit-test, integration-test, e2e-test, acceptance-test

secondary_keywords:
  - jest, mocha, pytest, junit, cucumber, selenium, cypress
  - assertion, mock, stub, fixture, snapshot
  - test-driven, behavior-driven, TDD, BDD

operation_types:
  - test_creation, quality_validation, coverage_analysis
  - regression_testing, e2e_automation, test_framework_setup

file_pattern_confidence_boost:
  ".test.": +0.15
  ".spec.": +0.15
  "__tests__/": +0.15
  "test/": +0.12

tools: [playwright, sequential-thinking, Read, Write, Bash]
mcp_servers: [playwright, sequential-thinking]
personas: [qa, analyzer]
complexity_capability: [simple, moderate, complex]
```

#### Security Specialist
```yaml
domain_tags: [security, authentication, authorization, encryption, vulnerability]

primary_keywords:
  - security, authentication, authorization, encryption, vulnerability
  - oauth, jwt, ssl, tls, https, cors, xss, csrf, sql-injection

secondary_keywords:
  - penetration-testing, security-audit, threat-modeling
  - hash, salt, bcrypt, argon2, certificate, key-management
  - firewall, waf, ids, ips, siem

operation_types:
  - security_audit, vulnerability_assessment
  - authentication_implementation, authorization_setup
  - encryption_integration, security_policy_enforcement

tools: [sequential-thinking, Grep, Read, Bash]
mcp_servers: [sequential-thinking, context7]
personas: [analyzer, backend, architect]
complexity_capability: [moderate, complex]
```

#### Performance Specialist
```yaml
domain_tags: [optimization, performance, scalability, efficiency, speed]

primary_keywords:
  - optimize, performance, scalability, bottleneck, latency, throughput
  - efficiency, speed, fast, slow, cache, cdn

secondary_keywords:
  - profiling, benchmark, monitoring, metrics, apm
  - lazy-loading, code-splitting, tree-shaking, compression
  - database-optimization, query-optimization, indexing

operation_types:
  - performance_analysis, bottleneck_identification
  - optimization_implementation, caching_strategy
  - scalability_improvement, monitoring_setup

tools: [playwright, sequential-thinking, Read, Grep, Bash]
mcp_servers: [playwright, sequential-thinking]
personas: [performance, architect]
complexity_capability: [moderate, complex]
```

---

### Domain Knowledge Specialists

#### Data Specialist
```yaml
domain_tags: [data, analytics, etl, data-pipeline, data-warehouse, big-data]

primary_keywords:
  - data, analytics, etl, pipeline, warehouse, big-data, data-engineering
  - transformation, aggregation, cleansing, normalization

secondary_keywords:
  - spark, hadoop, kafka, airflow, dbt, tableau, powerbi
  - pandas, numpy, sql, nosql, data-modeling

operation_types:
  - data_pipeline_creation, etl_implementation
  - analytics_setup, visualization_development, data_modeling

tools: [sequential-thinking, Read, Write, Bash]
mcp_servers: [sequential-thinking, context7]
personas: [analyzer, architect]
complexity_capability: [moderate, complex]
```

#### ML/AI Specialist
```yaml
domain_tags: [machine-learning, ai, deep-learning, neural-networks, ml-ops]

primary_keywords:
  - machine-learning, ai, artificial-intelligence, model, training, prediction
  - neural-network, deep-learning, ml, ai-model

secondary_keywords:
  - tensorflow, pytorch, scikit-learn, keras, xgboost
  - supervised, unsupervised, reinforcement-learning
  - classification, regression, clustering, nlp, computer-vision

operation_types:
  - model_development, training_pipeline_setup
  - feature_engineering, model_evaluation, deployment_automation

tools: [sequential-thinking, Read, Write, Bash]
mcp_servers: [sequential-thinking, context7]
personas: [analyzer, performance]
complexity_capability: [complex]
```

#### Documentation Specialist
```yaml
domain_tags: [documentation, technical-writing, api-docs, guides, tutorials]

primary_keywords:
  - document, documentation, readme, wiki, guide, tutorial, manual
  - technical-writing, api-docs, reference, how-to

secondary_keywords:
  - markdown, rst, docstring, comment, annotation
  - swagger, openapi, jsdoc, sphinx, mkdocs
  - changelog, release-notes, migration-guide

operation_types:
  - documentation_creation, api_documentation
  - guide_writing, readme_generation, changelog_maintenance

file_pattern_confidence_boost:
  ".md": +0.15
  "README": +0.20
  "CHANGELOG": +0.15
  "docs/": +0.12

tools: [context7, sequential-thinking, Read, Write]
mcp_servers: [context7, sequential-thinking]
personas: [scribe, mentor]
complexity_capability: [simple, moderate]
```

---

## 🌊 Wave-Specific Specialization

### Wave Orchestration Specialists

**Review Wave** → codebase-research-analyst + code-reviewer
- Focus: current_state, quality_assessment
- Tools: Read, Grep, sequential-thinking

**Planning Wave** → backend-architect + planning-strategist
- Focus: strategy, design
- Tools: sequential-thinking, context7, Write

**Implementation Wave** → software-engineer + general-purpose
- Focus: code_modification, feature_creation
- Tools: Edit, MultiEdit, Task

**Validation Wave** → test-automator + security-auditor
- Focus: testing, validation
- Tools: sequential-thinking, playwright, context7

**Optimization Wave** → performance-engineer + database-optimizer
- Focus: performance_tuning, resource_optimization
- Tools: Read, sequential-thinking, Grep

---

## 🚀 Wave Orchestration Engine

### Wave Control Matrix
```yaml
wave-activation:
  automatic: "complexity >= 0.7"
  explicit: "--wave-mode, --force-waves"
  override: "--single-wave, --wave-dry-run"

wave-strategies:
  progressive: "Incremental enhancement"
  systematic: "Methodical analysis"
  adaptive: "Dynamic configuration"
  enterprise: "Large-scale coordinated operations"
```

### Wave-Enabled Commands
- **Tier 1**: `/analyze`, `/build`, `/implement`, `/improve`
- **Tier 2**: `/design`, `/task`

---

## ⚡ Performance Optimization

### Token Management
Intelligent resource allocation based on unified Resource Management Thresholds (reference: `detection-engine.md#resource-management-thresholds`).

### Operation Batching
- **Tool Coordination**: Parallel operations when no dependencies
- **Context Sharing**: Reuse analysis results across related routing decisions
- **Cache Strategy**: Store successful routing patterns for session reuse
- **Task Delegation**: Intelligent sub-agent spawning for parallel processing
- **Resource Distribution**: Dynamic token allocation across sub-agents

### Resource Allocation
- **Detection Engine**: 1-2K tokens for pattern analysis
- **Decision Trees**: 500-1K tokens for routing logic
- **MCP Coordination**: Variable based on servers activated

---

## 📚 References

- **`detection-engine.md`** — Detection algorithm, confidence scoring, pre-operation validation
- **`routing-intelligence.md`** — Routing tables, decision trees, flag precedence
- **`agents/README.md`** — Complete agent directory and hierarchy
- **`MCP.md`** — MCP server coordination and fallback strategies
- **`PROFILE-MODES.md`** — Mode-based execution policies

---

**Status**: ✅ Production Ready
**Coverage**: 12+ specialists across 3 categories (Technical, Quality, Domain)
**Delegation Triggers**: 5 auto-triggers with 80-95% confidence thresholds

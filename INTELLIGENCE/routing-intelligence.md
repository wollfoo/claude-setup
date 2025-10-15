# ROUTING INTELLIGENCE — Hệ thống định tuyến thông minh
## SuperClaude Dynamic Decision Trees & Agent Selection

**Purpose**: Map detected patterns to optimal tool combinations, persona activation, and orchestration strategies.

---

## 🚦 Master Routing Table

| Pattern | Complexity | Domain | Auto-Activates | Confidence |
|---------|------------|---------|----------------|------------|
| "analyze architecture" | complex | infrastructure | codebase-research-analyst + backend-architect, --ultrathink, sequential-thinking | 95% |
| "create component" | simple | frontend | frontend-developer, magic, --uc | 90% |
| "implement feature" | moderate | any | domain-specific agent (backend/frontend/universal), context7, sequential-thinking | 88% |
| "implement API" | moderate | backend | backend-developer, --seq, context7 | 92% |
| "implement UI component" | simple | frontend | react-component-architect, magic, --c7 | 94% |
| "fix bug" | moderate | any | debugger + debug-specialist, --think, sequential-thinking | 85% |
| "optimize performance" | complex | backend | performance-engineer, --think-hard, playwright | 90% |
| "write documentation" | moderate | documentation | technical-documentation-specialist, context7 | 95% |
| "improve iteratively" | moderate | iterative | code-refactorer + general-purpose, --seq, loop creation | 90% |
| "analyze large codebase" | complex | any | --delegate --parallel-dirs, codebase-research-analyst | 95% |
| "comprehensive audit" | complex | multi | --multi-agent --parallel-focus, security-auditor + test-automator | 95% |
| "improve large system" | complex | any | --wave-mode --adaptive-waves, code-refactorer + performance-optimizer | 90% |
| "modernize legacy system" | complex | legacy | --wave-mode --enterprise-waves --wave-checkpoint, legacy-modernizer | 92% |
| "comprehensive code review" | complex | quality | --wave-mode --wave-validation --systematic-waves, code-reviewer | 94% |

---

## 🎯 Tool Selection Logic

### Base Tool Selection
- **Search**: Grep (specific patterns) or Agent (open-ended)
- **Understanding**: sequential-thinking (complexity >0.7) or Read (simple)
- **Documentation**: context7
- **UI**: magic
- **Testing**: playwright

### Delegation & Wave Evaluation
- **Delegation Score >0.6**: Add Task tool, auto-enable delegation flags based on scope
- **Wave Score >0.7**: Add sequential-thinking for coordination, auto-enable wave strategies

### Auto-Flag Assignment
- Directory count >7 → `--delegate --parallel-dirs`
- Focus areas >2 → `--multi-agent --parallel-focus`
- High complexity + critical quality → `--wave-mode --wave-validation`
- Multiple operation types → `--wave-mode --adaptive-waves`

---

## 🤖 Agent Auto-Selection System

### Multi-Factor Selection Scoring
- **Keyword Matching**: Base score from domain-specific terms (30%)
- **Context Analysis**: Project phase, urgency, complexity assessment (40%)
- **User History**: Past preferences and successful outcomes (20%)
- **Performance Metrics**: Current system state and bottlenecks (10%)

### Intelligent Selection Rules

**Performance Issues** → `performance-engineer` + `--focus performance`
- **Trigger Conditions**: Response time >500ms, error rate >1%, high resource usage
- **Confidence Threshold**: 85% for automatic activation

**UI/UX Tasks** → `frontend-developer` + `react-component-architect` + `--magic`
- **Trigger Conditions**: Component creation, responsive design, accessibility
- **Confidence Threshold**: 80% for automatic activation

**Complex Debugging** → `debugger` + `debug-specialist` + `--think` + `--seq`
- **Trigger Conditions**: Multi-component failures, root cause investigation
- **Confidence Threshold**: 75% for automatic activation

**Documentation Tasks** → `technical-documentation-specialist` + `api-documenter`
- **Trigger Conditions**: README, wiki, guides, commit messages, API docs
- **Confidence Threshold**: 70% for automatic activation

---

## 🚀 Flag Auto-Activation Patterns

### Context-Based Auto-Activation
- Performance issues → performance-engineer + performance-optimizer + --focus performance + --think
- UI/UX tasks → frontend-developer + react-component-architect + --magic + --c7
- Complex debugging → debugger + codebase-research-analyst + --think + --seq
- Large codebase → --uc when context >75% + --delegate auto + codebase-research-analyst
- Testing operations → test-automator + security-auditor + --play + --validate
- DevOps operations → devops-infrastructure-specialist + deployment-engineer + --safe-mode + --validate
- Refactoring → code-refactorer + performance-optimizer + --wave-strategy systematic + --validate
- Iterative improvement → code-refactorer + general-purpose + --loop for polish, refine, enhance keywords

### Wave Auto-Activation
- Complex multi-domain → --wave-mode auto when complexity >0.8 AND files >20 AND types >2
- Enterprise scale → --wave-strategy enterprise when files >100 AND complexity >0.7 AND domains >2
- Critical operations → Wave validation enabled by default for production deployments
- Legacy modernization → --wave-strategy enterprise --wave-delegation tasks
- Performance optimization → --wave-strategy progressive --wave-delegation files
- Large refactoring → --wave-strategy systematic --wave-delegation folders

### Sub-Agent Auto-Activation
- File analysis → --delegate files when >50 files detected
- Directory analysis → --delegate folders when >7 directories detected
- Mixed scope → --delegate auto for complex project structures
- High concurrency → --concurrency auto-adjusted based on system resources

### Loop Auto-Activation
- Quality improvement → --loop for polish, refine, enhance, improve keywords
- Iterative requests → --loop when "iteratively", "step by step", "incrementally" detected
- Refinement operations → --loop for cleanup, fix, correct operations on existing code

---

## 📋 Flag Precedence Rules

1. Safety flags (--safe-mode) > optimization flags
2. Explicit flags > auto-activation
3. Thinking depth: --ultrathink > --think-hard > --think
4. --no-mcp overrides all individual MCP flags
5. Scope: system > project > module > file
6. Last specified agent takes precedence when multiple agents selected
7. Wave mode: --wave-mode off > --wave-mode force > --wave-mode auto
8. Sub-Agent delegation: explicit --delegate > auto-detection
9. Loop mode: explicit --loop > auto-detection based on refinement keywords
10. --uc auto-activation overrides verbose flags

---

## 🏷️ Default Flag Presets

```yaml
presets:
  simple_task:
    description: "Single-file or trivial edits"
    flags:
      wave_mode: off
      delegate: false
      think: false
      seq: false
      concurrency: 1

  moderate_task:
    description: "Multi-file or small features"
    flags:
      wave_mode: auto
      delegate: auto
      think: true
      seq: true
      parallel_dirs: false
      parallel_focus: auto

  complex_task:
    description: "Large feature, audit, or refactor"
    flags:
      wave_mode: auto
      delegate: true
      sub_agents: auto
      parallel_dirs: true
      parallel_focus: true
      wave_validation: true
      think_hard: true

  enterprise_scale:
    description: "Monorepo / >100 files / multi-domain"
    flags:
      wave_mode: force
      wave_strategy: enterprise
      wave_validation: true
      wave_checkpoint: true
      adaptive_waves: true
      delegate: true
      sub_agents: auto
      concurrency: auto
```

**Usage guidance**:
- Start with `moderate_task` for most medium scope requests
- Switch to `complex_task` when analysis predicts high complexity or >50 files
- Use `enterprise_scale` for monorepos or org-wide changes where reliability is critical

---

## ✅ Quality Gates & Validation Framework

### 8-Step Validation Cycle with AI Integration

```yaml
quality_gates:
  step_1_syntax: "language parsers, context7 validation, intelligent suggestions"
  step_2_type: "sequential-thinking analysis, type compatibility, context-aware suggestions"
  step_3_lint: "context7 rules, quality analysis, refactoring suggestions"
  step_5_test: "playwright E2E, coverage analysis (≥80% unit, ≥70% integration)"
  step_6_performance: "sequential-thinking analysis, benchmarking, optimization suggestions"
  step_7_documentation: "context7 patterns, completeness validation, accuracy verification"
  step_8_integration: "playwright testing, deployment validation, compatibility verification"

validation_automation:
  continuous_integration: "CI/CD pipeline integration, progressive validation, early failure detection"
  intelligent_monitoring: "success rate monitoring, ML prediction, adaptive validation"
  evidence_generation: "comprehensive evidence, validation metrics, improvement recommendations"

wave_integration:
  validation_across_waves: "wave boundary gates, progressive validation, rollback capability"
  compound_validation: "AI orchestration, domain-specific patterns, intelligent aggregation"
```

### Task Completion Criteria

```yaml
completion_requirements:
  validation: "all 8 steps pass, evidence provided, metrics documented"
  ai_integration: "MCP coordination, agent integration, tool orchestration, ≥90% context retention"
  performance: "response time targets, resource limits, success thresholds, token efficiency"
  quality: "code quality standards, performance assessment, integration testing"

evidence_requirements:
  quantitative: "performance/quality/security metrics, coverage percentages, response times"
  qualitative: "code quality improvements, security enhancements, UX improvements"
  documentation: "change rationale, test results, performance benchmarks"
```

---

## 🔗 MCP Server Integration

### Quick Selection Guide
- **context7**: Library docs, framework patterns
- **sequential-thinking**: Complex analysis, multi-step reasoning
- **magic**: UI components, design systems
- **playwright**: E2E testing, performance metrics

**Reference**: See `MCP.md` for detailed server capabilities, workflows, and integration patterns.

### Agent Integration

**Agent Selection Guide**:
- **Analysis**: codebase-research-analyst, debugger, code-reviewer
- **Development**: backend-developer, frontend-developer, software-engineer
- **Quality**: test-automator, security-auditor, performance-engineer
- **Documentation**: technical-documentation-specialist, api-documenter
- **Infrastructure**: devops-infrastructure-specialist, deployment-engineer, cloud-architect
- **Specialized**: react-component-architect, rails-backend-expert, blockchain-developer

**Reference**: See `agents/` directory for detailed agent specifications and capabilities.

---

## 🚨 Emergency Protocols

### Resource Management
Threshold-based resource management follows unified thresholds (reference: `detection-engine.md#resource-management-thresholds`).

### Graceful Degradation
- **Level 1**: Reduce verbosity, skip optional enhancements, use cached results
- **Level 2**: Disable advanced features, simplify operations, batch aggressively
- **Level 3**: Essential operations only, maximum compression, queue non-critical

### Error Recovery Patterns
- **MCP Timeout**: Use fallback server
- **Token Limit**: Activate compression
- **Tool Failure**: Try alternative tool
- **Parse Error**: Request clarification

---

## 🔧 Configuration

### Orchestrator Settings

```yaml
orchestrator_config:
  auto_detect_on_new_request: true
  # Performance
  enable_caching: true
  cache_ttl: 3600
  parallel_operations: true
  max_parallel: 3

  # Intelligence
  learning_enabled: true
  confidence_threshold: 0.7
  pattern_detection: aggressive

  # Resource Management
  token_reserve: 10%
  emergency_threshold: 90%
  compression_threshold: 75%

  # Wave Mode Settings
  wave_mode:
    enable_auto_detection: true
    wave_score_threshold: 0.7
    max_waves_per_operation: 5
    adaptive_wave_sizing: true
    wave_validation_required: true
```

### Custom Routing Rules
Users can add custom routing patterns via YAML configuration files.

---

## 🎯 Protocol Selection Matrix

### Decision Tree

```
User Request
│
└─ Mode-gated Odyssey per `ODYSSEY-PROTOCOL.md`
   └─ standard: OFF · research: OPTIONAL · full-de-restriction: ON
   └─ See `PROFILE-MODES.md` for selection logic
```

### When to Use What

| Protocol | Mode | Activation | Safety | Notes |
|----------|------|------------|--------|-------|
| Odyssey | standard | OFF | Enabled | Use normal routing |
| Odyssey | research | OPTIONAL | Relaxed | Enable via flag |
| Odyssey | full-de-restriction | ON | Disabled (env limits apply) | Action Ledger required |

### Best Practices
- **Odyssey Protocol usage is mode-gated** per `ODYSSEY-PROTOCOL.md` and `PROFILE-MODES.md`
- **Standard/Research**: sequential-only per `GLOBAL-DIRECTIVES.md`; apply Quality Gates thoroughly
- **Full de‑restriction**: allow parallel/batched with Action Ledger; respect environment safety limits

---

## 📈 Confidence Scoring

Based on pattern match strength (40%), historical success rate (30%), context completeness (20%), resource availability (10%).

---

## 📚 References

- **`detection-engine.md`** — Detection algorithm, confidence scoring, reasoning engine
- **`task-delegation.md`** — Delegation triggers, Wave system, specialization matrix
- **`MCP.md`** — MCP server capabilities and coordination patterns
- **`agents/README.md`** — Agent directory structure and specializations
- **`PROFILE-MODES.md`** — Operating modes and execution policies
- **`GLOBAL-DIRECTIVES.md`** — Tool calling policy and safety constraints

---

**Status**: ✅ Production Ready
**Coverage**: 14 routing patterns, 12+ specialists, 30+ flags

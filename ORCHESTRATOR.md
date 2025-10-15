# ORCHESTRATOR.md - SuperClaude Intelligent Routing System

Intelligent routing system for Claude Code SuperClaude framework.

## Default Auto‑Detection Policy

- Luôn chạy Sub‑Agent Auto‑Detection cho mọi yêu cầu người dùng mới (không yêu cầu tiền tố cố định).
- Nếu best‑match có confidence ≥ `orchestrator_config.confidence_threshold` → kích hoạt Sub‑Agent đó; ngược lại dùng universal agent và ghi chú "Uncertainties".
- Trình bày tóm tắt lựa chọn: agent, confidence, lý do (pattern hits/domain/operation types), và các cờ chính.
- Tôn trọng mode/markers & tool policy từ SSOT: `PROFILE-MODES.md`, `ODYSSEY-PROTOCOL.md`, `GLOBAL-DIRECTIVES.md`.
- Áp dụng Quality Gates trước khi đánh dấu hoàn tất (xem Validation section).

## 🧠 Detection Engine

**Reference**: See `intelligence/detection-engine.md` for comprehensive detection system including:
- Pre-Operation Validation Checks (Resource, Compatibility, Risk Assessment)
- Resource Management Thresholds (Green/Yellow/Orange/Red/Critical zones)
- Pattern Recognition Rules (Complexity Detection, Domain Identification, Operation Type Classification)
- Intent Extraction Algorithm (8-step mandatory flow)
- Multi-Factor Confidence Scoring formula
- Reasoning Report Format
- Performance Optimization (3-layer caching, parallel processing)

**Quick Summary**:
- **Confidence Scoring**: pattern_match (40%) + domain_expertise (30%) + complexity_alignment (20%) + resource_readiness (10%)
- **Thresholds**: High (≥0.85), Medium (0.70-0.84), Low (<0.70)
- **Resource Zones**: Green (0-60%), Yellow (60-75%), Orange (75-85%), Red (85-95%), Critical (95%+)

## 🚦 Routing Intelligence

**Reference**: See `intelligence/routing-intelligence.md` for comprehensive routing system including:
- Master Routing Table (14 patterns with confidence scores)
- Tool Selection Logic (base tools, delegation evaluation, auto-flag assignment)
- Agent Auto-Selection System (multi-factor scoring)
- Flag Auto-Activation Patterns (context-based, wave, sub-agent, loop)
- Flag Precedence Rules (10 rules)
- Default Flag Presets (simple_task, moderate_task, complex_task, enterprise_scale)
- Quality Gates & Validation Framework (8-step validation cycle)
- MCP Server Integration Quick Guide
- Emergency Protocols (resource management, graceful degradation, error recovery)

### Wave Orchestration Engine
Multi-stage command execution with compound intelligence. Automatic complexity assessment or explicit flag control.

**Wave Control Matrix**:
```yaml
wave-activation:
  automatic: "complexity >= 0.7"
  explicit: "--wave-mode, --force-waves"
  override: "--single-wave, --wave-dry-run"

wave-strategies:
  progressive: "Incremental enhancement"
  systematic: "Methodical analysis"
  adaptive: "Dynamic configuration"
```

**Wave-Enabled Commands**:
- **Tier 1**: `/analyze`, `/build`, `/implement`, `/improve`
- **Tier 2**: `/design`, `/task`

## 🚦 Protocol Selection Matrix

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

### Best Practices for Claude Code

- **Odyssey Protocol usage is mode-gated** per `ODYSSEY-PROTOCOL.md` and `PROFILE-MODES.md`.
- **Standard/Research**: sequential-only per `GLOBAL-DIRECTIVES.md`; apply Quality Gates thoroughly.
- **Full de‑restriction**: allow parallel/batched with Action Ledger; always respect environment safety limits.

## 🏷️ Default Flag Presets

Ready-to-use presets for common scenarios. These influence routing behavior and tool orchestration.

```yaml
presets:
  simple_task:
    description: "Single-file or trivial edits"
    flags:
      wave_mode: off              # --single-wave
      delegate: false             # no sub-agents
      think: false                # no deep reasoning
      seq: false
      concurrency: 1

  moderate_task:
    description: "Multi-file or small features"
    flags:
      wave_mode: auto             # --wave-mode auto
      delegate: auto              # enable if beneficial
      think: true                 # --think
      seq: true                   # coordinate steps
      parallel_dirs: false
      parallel_focus: auto

  complex_task:
    description: "Large feature, audit, or refactor"
    flags:
      wave_mode: auto             # auto-detect waves
      delegate: true              # --delegate
      sub_agents: auto            # compute specializations
      parallel_dirs: true         # when directory_count > 7
      parallel_focus: true        # when domains > 3
      wave_validation: true       # gate between waves
      think_hard: true            # --think-hard
      ultrathink: false

  enterprise_scale:
    description: "Monorepo / >100 files / multi-domain"
    flags:
      wave_mode: force            # --force-waves
      wave_strategy: enterprise   # --wave-strategy enterprise
      wave_validation: true
      wave_checkpoint: true       # --wave-checkpoint
      adaptive_waves: true        # --adaptive-waves
      delegate: true
      sub_agents: auto
      concurrency: auto
```

Usage guidance:
- Start with `moderate_task` for most medium scope requests.
- Switch to `complex_task` when analysis predicts high complexity or >50 files.
- Use `enterprise_scale` for monorepos or org-wide changes where reliability is critical.

## 🎯 Task Delegation Intelligence

**Reference**: See `intelligence/task-delegation.md` for comprehensive delegation system including:
- Delegation Decision Matrix (scoring factors)
- Wave Opportunity Scoring
- Strategy Recommendations
- Auto-Delegation Triggers (5 triggers with 80-95% confidence)
- Wave Auto-Delegation Triggers
- Delegation Routing Table
- Sub-Agent Specialization Matrix (12+ specialists)
- Wave-Specific Specialization (5 wave types)
- Wave Orchestration Engine
- Performance Optimization strategies

**Quick Summary**:
- **Delegation Score >0.6**: Add Task tool, auto-enable delegation flags
- **Wave Score >0.7**: Use wave strategies with sequential coordination
- **Auto-Triggers**: >7 directories (95%), >50 files + complexity >0.6 (90%), >3 domains (85%)

## ⚡ Performance Optimization

Resource management, operation batching, and intelligent optimization for sub-100ms performance targets.

**Token Management**: Intelligent resource allocation based on unified Resource Management Thresholds (see Detection Engine section)

**Operation Batching**:
- **Tool Coordination**: Parallel operations when no dependencies
- **Context Sharing**: Reuse analysis results across related routing decisions
- **Cache Strategy**: Store successful routing patterns for session reuse
- **Task Delegation**: Intelligent sub-agent spawning for parallel processing
- **Resource Distribution**: Dynamic token allocation across sub-agents

**Resource Allocation**:
- **Detection Engine**: 1-2K tokens for pattern analysis
- **Decision Trees**: 500-1K tokens for routing logic
- **MCP Coordination**: Variable based on servers activated

## 🔗 Integration Intelligence

Smart MCP server selection and orchestration.

### MCP Server Selection Matrix
**Reference**: See MCP.md for detailed server capabilities, workflows, and integration patterns.

**Quick Selection Guide**:
- **context7**: Library docs, framework patterns
- **sequential**: Complex analysis, multi-step reasoning
- **magic**: UI components, design systems
- **playwright**: E2E testing, performance metrics

### Intelligent Server Coordination
**Reference**: See MCP.md for complete server orchestration patterns and fallback strategies.

**Core Coordination Logic**: Multi-server operations, fallback chains, resource optimization

### Agent Integration
**Reference**: See agents/ directory for detailed agent specifications and capabilities.

**Agent Selection Guide**:
- **Analysis**: codebase-research-analyst, debugger, code-reviewer
- **Development**: backend-developer, frontend-developer, software-engineer
- **Quality**: test-automator, security-auditor, performance-engineer
- **Documentation**: technical-documentation-specialist, api-documenter
- **Infrastructure**: devops-infrastructure-specialist, deployment-engineer, cloud-architect
- **Specialized**: react-component-architect, rails-backend-expert, blockchain-developer

## 🚨 Emergency Protocols

Handling resource constraints and failures gracefully.

### Resource Management
Threshold-based resource management follows the unified Resource Management Thresholds (see Detection Engine section above).

### Graceful Degradation
- **Level 1**: Reduce verbosity, skip optional enhancements, use cached results
- **Level 2**: Disable advanced features, simplify operations, batch aggressively
- **Level 3**: Essential operations only, maximum compression, queue non-critical

### Error Recovery Patterns
- **MCP Timeout**: Use fallback server
- **Token Limit**: Activate compression
- **Tool Failure**: Try alternative tool
- **Parse Error**: Request clarification

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

**Architecture Notes**:
- Detection logic → `intelligence/detection-engine.md`
- Routing logic → `intelligence/routing-intelligence.md`
- Delegation logic → `intelligence/task-delegation.md`
- Performance optimization → ORCHESTRATOR.md (this file) + intelligence/ files
- Integration patterns → MCP.md + agents/ directory

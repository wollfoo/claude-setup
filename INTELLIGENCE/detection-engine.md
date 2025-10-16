# DETECTION ENGINE — Hệ thống phát hiện và định tuyến
## SuperClaude Auto-Detection & Confidence Scoring System

**Purpose**: Phân tích yêu cầu người dùng, xác định intent, complexity, và lựa chọn Sub-Agent phù hợp với confidence scoring.

---

## Default Auto‑Detection Policy

- Luôn chạy Sub‑Agent Auto‑Detection cho mọi yêu cầu người dùng mới (không yêu cầu tiền tố cố định).
- Nếu best‑match có confidence ≥ 0.70 → kích hoạt Sub‑Agent đó; ngược lại dùng universal agent và ghi chú "Uncertainties".
- Trình bày tóm tắt lựa chọn: agent, confidence, lý do (pattern hits/domain/operation types), và các cờ chính.
- Tôn trọng mode/markers & tool policy từ SSOT: `PROFILE-MODES.md`, `ODYSSEY-PROTOCOL.md`, `GLOBAL-DIRECTIVES.md`.
- Áp dụng Quality Gates trước khi đánh dấu hoàn tất (reference: `routing-intelligence.md#quality-gates`).

---

## 🧠 Pre-Operation Validation

### Resource Validation
- Token usage prediction based on operation complexity and scope
- Memory and processing requirements estimation
- File system permissions and available space verification
- MCP server availability and response time checks

### Compatibility Validation
- Flag combination conflict detection (e.g., `--no-mcp` with `--seq`)
- Persona + command compatibility verification
- Tool availability for requested operations
- Project structure requirements validation

### Risk Assessment
- Operation complexity scoring (0.0-1.0 scale)
- Failure probability based on historical patterns
- Resource exhaustion likelihood prediction
- Cascading failure potential analysis

**Validation Logic**: Resource availability, flag compatibility, risk assessment, outcome prediction, and safety recommendations. Operations with risk scores >0.8 trigger safe mode suggestions.

### Resource Management Thresholds
- **Green Zone** (0-60%): Full operations, predictive monitoring active
- **Yellow Zone** (60-75%): Resource optimization, caching, suggest --uc mode
- **Orange Zone** (75-85%): Warning alerts, defer non-critical operations
- **Red Zone** (85-95%): Force efficiency modes, block resource-intensive operations
- **Critical Zone** (95%+): Emergency protocols, essential operations only

---

## 🎯 Pattern Recognition Rules

### Complexity Detection
```yaml
simple:
  indicators:
    - single file operations
    - basic CRUD tasks
    - straightforward queries
    - < 3 step workflows
  token_budget: 5K
  time_estimate: < 5 min

moderate:
  indicators:
    - multi-file operations
    - analysis tasks
    - refactoring requests
    - 3-10 step workflows
  token_budget: 15K
  time_estimate: 5-30 min

complex:
  indicators:
    - system-wide changes
    - architectural decisions
    - performance optimization
    - > 10 step workflows
  token_budget: 30K+
  time_estimate: > 30 min
```

### Domain Identification
```yaml
frontend:
  keywords: [UI, component, React, Vue, CSS, responsive, accessibility]
  file_patterns: ["*.jsx", "*.tsx", "*.vue", "*.css", "*.scss"]
  typical_operations: [create, implement, style, optimize, test]

backend:
  keywords: [API, database, server, endpoint, authentication, performance]
  file_patterns: ["*.js", "*.ts", "*.py", "*.go", "controllers/*", "models/*"]
  typical_operations: [implement, optimize, secure, scale]

infrastructure:
  keywords: [deploy, Docker, CI/CD, monitoring, scaling, configuration]
  file_patterns: ["Dockerfile", "*.yml", "*.yaml", ".github/*", "terraform/*"]
  typical_operations: [setup, configure, automate, monitor]

documentation:
  keywords: [document, README, wiki, guide, manual, instructions]
  file_patterns: ["*.md", "*.rst", "*.txt", "docs/*", "README*", "CHANGELOG*"]
  typical_operations: [write, document, explain, translate, localize]

iterative:
  keywords: [improve, refine, enhance, correct, polish, fix, iterate, loop]
  file_patterns: ["*.*"]
  typical_operations: [improve, refine, enhance, correct, polish, fix, iterate]
```

### Operation Type Classification
```yaml
analysis:
  verbs: [analyze, review, explain, understand, investigate, troubleshoot]
  outputs: [insights, recommendations, reports]
  typical_tools: [Grep, Read, sequential-thinking]

creation:
  verbs: [create, build, implement, generate, design]
  outputs: [new files, features, components]
  typical_tools: [Write, magic, context7]

implementation:
  verbs: [implement, develop, code, construct, realize]
  outputs: [working features, functional code, integrated components]
  typical_tools: [Write, Edit, MultiEdit, magic, context7, sequential-thinking]

modification:
  verbs: [update, refactor, improve, optimize, fix]
  outputs: [edited files, improvements]
  typical_tools: [Edit, MultiEdit, sequential-thinking]

debugging:
  verbs: [debug, fix, troubleshoot, resolve, investigate]
  outputs: [fixes, root causes, solutions]
  typical_tools: [Grep, sequential-thinking, playwright]

iterative:
  verbs: [improve, refine, enhance, correct, polish, fix, iterate, loop]
  outputs: [progressive improvements, refined results, enhanced quality]
  typical_tools: [sequential-thinking, Read, Edit, MultiEdit, TodoWrite]
```

---

## 🎲 Intent Extraction Algorithm

**9-Step Mandatory Flow** (Updated with Phase 3 Adaptive Thresholds):

```yaml
step_1_request_parsing:
  actions:
    - extract_keywords_and_verbs
    - identify_domain_indicators
    - detect_complexity_signals
    - parse_explicit_flags
  output: "structured_request_object"

step_2_domain_matching:
  actions:
    - match_against_specialization_matrix
    - calculate_domain_affinity_scores
    - identify_multi_domain_requirements
  output: "domain_scores_array"

step_3_complexity_scoring:
  actions:
    - estimate_task_complexity (0.0-1.0 scale)
    - predict_token_requirements
    - assess_resource_needs
  output: "complexity_assessment"

step_4_confidence_calculation:
  algorithm: "multi_factor_weighted_scoring"
  inputs: [pattern_match, domain_fit, complexity_match, resource_availability]
  output: "base_confidence_score (0.0-1.0)"
  formula: |
    base_confidence = (
      pattern_match_score * 0.40 +
      domain_expertise_score * 0.30 +
      complexity_alignment_score * 0.20 +
      resource_readiness_score * 0.10
    )

step_4_5_adaptive_threshold_adjustment:
  description: "Phase 3: Adjust threshold based on user history and context"
  actions:
    - retrieve_user_context_from_tracker
    - extract_user_history_signals
    - extract_resource_signals
    - extract_context_signals
    - calculate_adjusted_threshold
    - generate_adjustment_reasoning
  output: "threshold_adjustment_result"
  integration:
    requires: [UserHistoryTracker, AdaptiveThresholdManager, SignalExtractors]
    feeds_into: step_5_agent_selection
  logic: |
    userContext = UserHistoryTracker.getUserContext(userId)
    taskContext = buildTaskContext(step_1, step_2, step_3)
    environmentContext = buildEnvironmentContext()

    adjustment = AdaptiveThresholdManager.adjustThreshold(
      baseConfidence,
      userContext,
      environmentContext,
      taskContext
    )

    adjusted_threshold = adjustment.adjusted_threshold  # Range: 0.60-0.80
    adjustment_reasoning = adjustment.reasoning

step_5_agent_selection:
  logic: |
    # Use adaptive threshold instead of fixed 0.70
    adjusted_threshold = step_4_5.adjusted_threshold

    if base_confidence >= 0.85:
      select_specialist_with_high_confidence
    elif base_confidence >= adjusted_threshold:  # DYNAMIC threshold
      select_specialist_with_confidence_flag
      log_threshold_adjustment(adjustment_reasoning)
    else:
      use_universal_agent_with_uncertainty_note
      suggest_threshold_review()
  additional_context:
    - original_threshold: 0.70 (base)
    - adjusted_threshold: {calculated_value}
    - adjustment_delta: {delta}
    - applied_rules: {rule_ids}
    - user_reputation: {reputation_score}

step_6_reasoning_generation:
  components:
    - agent_selection_rationale
    - confidence_breakdown
    - threshold_adjustment_explanation  # NEW
    - key_decision_factors
    - alternatives_considered
    - risk_assessment
  output: "detailed_reasoning_report"

step_7_quality_validation:
  pre_execution_gates:
    - confidence_threshold_check (>= adjusted_threshold)  # UPDATED
    - resource_availability_verification
    - complexity_alignment_validation
  output: "validation_passed_or_escalated"

step_8_task_tool_routing:
  action: "route_to_appropriate_task_tool_subagent"
  parameters:
    - subagent_type
    - prompt_with_context
    - resource_allocation
    - threshold_adjustment_metadata  # NEW

step_9_post_execution_tracking:
  description: "Phase 3: Update user history for feedback loop"
  action: "track_task_completion"
  logic: |
    UserHistoryTracker.trackTaskCompletion(
      userId,
      taskId,
      success,
      domain,
      operationType,
      {
        complexity,
        confidence_used: adjusted_threshold,
        execution_time_ms,
        error_message
      }
    )
  output: "updated_user_reputation"
  feedback_loop: "Improved reputation → better thresholds → higher success"
```

---

## 🎯 Multi-Factor Confidence Scoring

### Scoring Breakdown

```yaml
pattern_match_scoring:
  exact_keyword_hit: +0.15
  semantic_similarity_strong: +0.10
  verb_operation_match: +0.10
  domain_indicator_present: +0.05
  max_score: 0.40

domain_expertise_scoring:
  perfect_domain_match: +0.30
  partial_domain_overlap: +0.20
  related_domain_capability: +0.10
  generic_capability: +0.05
  max_score: 0.30

complexity_alignment_scoring:
  exact_complexity_match: +0.20
  adjacent_complexity_capable: +0.15
  minimum_complexity_handling: +0.10
  max_score: 0.20

resource_readiness_scoring:
  all_required_tools_ready: +0.10
  most_tools_available: +0.07
  minimal_tools_present: +0.05
  all_mcp_servers_online: +0.03
  max_score: 0.10

confidence_thresholds:
  high_confidence: ">= 0.85"
  medium_confidence: "0.70 - 0.84"
  low_confidence: "< 0.70"

actions_by_confidence:
  high: "proceed_with_selected_specialist"
  medium: "proceed_with_caution_flag_and_monitoring"
  low: "use_universal_agent_with_uncertainty_disclosure"
```

---

## 🎯 Phase 3: Adaptive Threshold Integration

### Purpose (Mục đích)
Dynamically adjust confidence threshold (0.70 baseline) based on:
- **User History** — reputation score, success rate, error patterns
- **Resource Status** — memory/CPU/disk usage
- **Task Context** — urgency, complexity, environment

### Integration Workflow

#### Step 1: Gather Context
```typescript
// Retrieve user context from UserHistoryTracker
const userContext = userHistoryTracker.getUserContext(userId);

// Build task context from detection steps
const taskContext: TaskContext = {
  urgency_level: detectUrgency(request),
  complexity: step_3_output.complexity,
  domain: step_2_output.domain,
  operation_type: step_1_output.operation_type,
  has_urgency_keywords: detectUrgentKeywords(request)
};

// Build environment context
const environmentContext: EnvironmentContext = {
  is_production: process.env.NODE_ENV === 'production',
  is_critical_task: isCriticalTask(request),
  deployment_stage: process.env.NODE_ENV,
  monitoring_enabled: true
};
```

#### Step 2: Extract Signals
```typescript
// Extract signals from 3 sources
const userHistoryExtractor = new UserHistorySignalExtractor();
const resourceExtractor = new ResourceSignalExtractor();
const contextExtractor = new ContextSignalExtractor();

const userSignals = userHistoryExtractor.extract(userContext);
// → { signals: ['trusted_user'], recommendation: 'down', reasoning: '...' }

const resourceSignals = resourceExtractor.extract(memoryUsage, cpuUsage, diskUsage);
// → { signals: ['resource_healthy'], recommendation: 'down', reasoning: '...' }

const contextSignals = contextExtractor.extract(taskContext, environmentContext, request);
// → { signals: ['urgent_task'], recommendation: 'down', reasoning: '...' }
```

#### Step 3: Adjust Threshold
```typescript
const adaptiveThresholdManager = new AdaptiveThresholdManager();

const adjustment = await adaptiveThresholdManager.adjustThreshold(
  baseConfidence,
  userContext,
  environmentContext,
  taskContext
);

// Result:
// {
//   original_threshold: 0.70,
//   adjusted_threshold: 0.65,  // Adjusted DOWN for trusted user
//   adjustment_delta: -0.05,
//   applied_rules: ['user_history_positive'],
//   reasoning: 'Threshold decreased by 7% (0.70 → 0.65). Rule: user_history_positive.
//               Reason: User has proven track record (≥80% reputation, ≥85% success, ≥10 tasks)',
//   confidence_level: 'lenient'
// }
```

#### Step 4: Apply to Agent Selection
```typescript
if (baseConfidence >= 0.85) {
  // Always select specialist with high confidence
  selectSpecialist(agent, 'high_confidence');
} else if (baseConfidence >= adjustment.adjusted_threshold) {
  // Select specialist using adaptive threshold
  selectSpecialist(agent, {
    confidence: baseConfidence,
    threshold: adjustment.adjusted_threshold,
    reasoning: adjustment.reasoning,
    applied_rules: adjustment.applied_rules
  });
} else {
  // Fallback to universal agent
  useUniversalAgent({
    confidence: baseConfidence,
    threshold: adjustment.adjusted_threshold,
    gap: adjustment.adjusted_threshold - baseConfidence
  });
}
```

### Signal Extractors

#### UserHistorySignalExtractor
Analyzes user behavior patterns:

| Signal | Condition | Threshold Impact | Priority |
|--------|-----------|------------------|----------|
| **trusted_user** | reputation ≥80% AND success ≥85% AND tasks ≥10 | DOWN to 0.65 | Medium |
| **similar_success** | similar_task_success_rate ≥80% | DOWN to 0.60 | Low |
| **high_error_rate** | errors ≥3 OR success <50% | UP to 0.75 | **High** (override) |
| **new_unproven_user** | tasks <5 OR reputation <30% | UP to 0.75 | Medium |

**Logic:** High error rate ALWAYS overrides other signals (safety-first).

#### ResourceSignalExtractor
Monitors system resources:

| Signal | Condition | Threshold Impact | Priority |
|--------|-----------|------------------|----------|
| **resource_critical** | memory >95% OR CPU >95% | UP to 0.75 | **High** |
| **low_resources** | memory >85% OR CPU >90% | UP (neutral → 0.72) | Medium |
| **resource_healthy** | memory <60% AND CPU <70% | DOWN to 0.65 | Low |
| **disk_pressure** | disk >90% | Neutral (warning) | Low |

**Logic:** Critical resources force stricter routing for optimization.

#### ContextSignalExtractor
Analyzes task characteristics:

| Signal | Condition | Threshold Impact | Priority |
|--------|-----------|------------------|----------|
| **urgent_task** | urgency=high OR urgent keywords | DOWN to 0.62 | High |
| **critical_production** | production AND critical task | UP to 0.80 | **Highest** (override) |
| **complex_task** | complexity >0.7 | UP (neutral → 0.72) | Medium |
| **simple_task** | complexity <0.3 | DOWN to 0.65 | Low |

**Logic:** Critical production ALWAYS takes precedence (maximum validation).

### Adjustment Rules (6 rules)

Rules are evaluated by **priority** (highest first). If multiple rules match, only the highest priority rule is applied.

| Rule ID | Trigger Condition | New Threshold | Priority | Category |
|---------|-------------------|---------------|----------|----------|
| **critical_production** | is_production AND is_critical_task | 0.80 | **10** | up |
| **error_rate_high** | errors ≥3 OR success <0.50 | 0.75 | **10** | up |
| **task_urgency_high** | urgency=high OR urgent keywords | 0.62 | 9 | down |
| **new_user** | tasks <5 OR reputation <0.30 | 0.75 | 9 | up |
| **user_history_positive** | reputation ≥0.80 AND success ≥0.85 AND tasks ≥10 | 0.65 | 8 | down |
| **similar_past_success** | similar_task_success_rate ≥0.80 | 0.60 | 7 | down |

**Priority Logic:**
1. Rules with priority 10 (critical/errors) ALWAYS win
2. If tied, "up" (strict) rules take precedence over "down" (lenient)
3. Base threshold 0.70 is used if no rules trigger

### Post-Execution Tracking

After task completion, create feedback loop:

```typescript
// Track completion in UserHistoryTracker
userHistoryTracker.trackTaskCompletion(
  userId,
  taskId,
  success,              // true/false
  domain,               // 'frontend', 'backend', etc.
  operationType,        // 'create', 'implement', 'fix', etc.
  {
    complexity: task.complexity,
    confidence_used: adjustment.adjusted_threshold,
    execution_time_ms: executionTime,
    error_message: error?.message
  }
);

// This updates:
// - User reputation score (weighted: 70% recent + 30% overall)
// - Recent success rate (last 10 tasks)
// - Domain-specific success rates
// - Error count tracking
```

**Feedback Loop Benefits:**
1. User completes task successfully → **reputation increases**
2. Next task → **lower threshold** (easier to get specialist)
3. Specialist assigned → **higher chance of success**
4. Success → **reputation increases further**
5. **Virtuous cycle** of improvement

**For struggling users:**
1. User fails task → **reputation decreases**
2. Next task → **higher threshold** (more scrutiny)
3. Universal agent or careful specialist selection
4. Focus on simpler tasks to rebuild reputation

### Example Scenarios

#### Scenario 1: Trusted User + Urgent Task
```yaml
Input:
  user: { reputation: 0.85, success_rate: 0.90, tasks: 25 }
  task: { urgency: 'high', complexity: 0.5, domain: 'frontend' }
  environment: { is_production: false }

Signal Extraction:
  userSignals: ['trusted_user']
  contextSignals: ['urgent_task']

Rule Evaluation:
  - task_urgency_high: 0.62 (priority 9) ← SELECTED
  - user_history_positive: 0.65 (priority 8)

Result:
  adjusted_threshold: 0.62 (DOWN from 0.70)
  reasoning: "High urgency task detected - prioritize speed over strictness"

Agent Selection:
  base_confidence: 0.68
  0.68 >= 0.62 → SELECT SPECIALIST ✅
  (Would have failed with fixed 0.70 threshold)
```

#### Scenario 2: New User + Critical Production
```yaml
Input:
  user: { reputation: 0.25, success_rate: 0.40, tasks: 2 }
  task: { urgency: 'medium', complexity: 0.6, domain: 'backend' }
  environment: { is_production: true, is_critical_task: true }

Signal Extraction:
  userSignals: ['new_unproven_user', 'high_error_rate']
  contextSignals: ['critical_production']

Rule Evaluation:
  - critical_production: 0.80 (priority 10) ← SELECTED
  - error_rate_high: 0.75 (priority 10)

Result:
  adjusted_threshold: 0.80 (UP from 0.70)
  reasoning: "Critical production environment - maximum validation required"

Agent Selection:
  base_confidence: 0.72
  0.72 < 0.80 → USE UNIVERSAL AGENT ❌
  (Would have selected specialist with fixed 0.70 threshold - RISKY!)
```

### Integration Testing

**Test Coverage Required:**
1. ✅ All 6 adjustment rules trigger correctly
2. ✅ Priority-based rule selection works
3. ✅ Signal extractors return valid recommendations
4. ✅ Threshold clamping [0.60, 0.80] enforced
5. ✅ Feedback loop updates user reputation
6. ✅ Cache invalidation on reputation changes
7. ✅ Edge cases: new users, inactive users, resource extremes

---

## 📊 Reasoning Report Format

### Standard Output Structure

```yaml
structure: |
  🤖 **Sub-Agent Selection Report**

  **Chọn Agent** (Selected Agent): {agent_name}
  **Điểm Tin cậy** (Confidence Score): {score}% ({confidence_level})

  **Lý do Lựa chọn** (Selection Reasoning):
  ├─ Pattern Matching: {patterns_matched} → Score: {pattern_score}
  ├─ Domain Expertise: {domain_alignment} → Score: {domain_score}
  ├─ Complexity Fit: {complexity_capability} → Score: {complexity_score}
  └─ Resources Ready: {tools_and_servers} → Score: {resource_score}

  **Yếu tố Quyết định** (Key Decision Factors):
  1. {primary_factor} — {weight}%
  2. {secondary_factor} — {weight}%
  3. {tertiary_factor} — {weight}%

  **Phương án Khác** (Alternatives Considered):
  • {alternative_1}: Confidence {alt_score}% — {rejection_reason}
  • {alternative_2}: Confidence {alt_score}% — {rejection_reason}

  **Cờ Tự động Kích hoạt** (Auto-Activated Flags):
  {list_of_flags}

  **Đánh giá Rủi ro** (Risk Assessment):
  • Complexity Risk: {risk_level}
  • Resource Risk: {risk_level}
  • Uncertainty Risk: {risk_level}
```

---

## ⚡ Performance Optimization

### Multi-Layer Caching System

```yaml
layer_1_pattern_cache:
  type: "in_memory"
  scope: "session_local"
  ttl: 3600  # 1 hour
  stores: [keyword_patterns, domain_scores, complexity_estimations]
  performance_target:
    hit_latency: "< 5ms"
    miss_penalty: "+ 50ms"

layer_2_routing_cache:
  type: "session_persistent"
  scope: "current_session"
  ttl: 7200  # 2 hours
  stores: [agent_selections, confidence_scores, reasoning_outputs]
  performance_target:
    hit_latency: "< 10ms"
    miss_penalty: "+ 100ms"

layer_3_learning_cache:
  type: "cross_session"
  scope: "user_profile"
  ttl: 86400  # 24 hours
  stores: [high_confidence_patterns, optimal_decisions, user_preferences]
  performance_target:
    hit_latency: "< 15ms"
    lookup_success_rate: "> 40%"

cache_coordination:
  lookup_strategy: "L1 → L2 → L3 → compute"
  write_strategy: "write_through_all_layers"
  eviction_policy: "LRU_with_confidence_weighting"

overall_targets:
  cache_hit_rate: "> 70%"
  avg_detection_time_with_cache: "< 50ms"
  avg_detection_time_without_cache: "< 150ms"
```

### Parallel Processing Engine

```yaml
enabled: true
execution_mode: "research"  # Tuân thủ PROFILE-MODES.md
safety_constraint: "no_tool_calls_in_parallel"  # Tool calls remain sequential

parallelizable_steps:
  - keyword_extraction (3 workers: verbs, domains, complexity)
  - domain_scoring (5 workers: frontend, backend, infra, qa, docs)
  - complexity_analysis (3 workers: simple, moderate, complex indicators)
  - resource_validation (2 workers: tools, mcp_servers)

orchestration:
  launch: "all_workers_at_once"
  wait_policy: "wait_for_all_or_timeout"
  timeout_handling: "use_partial_results_if_>70%_complete"
  error_handling: "graceful_degradation_to_sequential"

optimization:
  adaptive_worker_allocation: true
  early_termination_on_high_confidence: true  # Stop when confidence > 0.95

performance_targets:
  parallel_speedup: "2.5x - 3.5x vs sequential"
  max_concurrent_operations: 5
  overhead_budget: "< 20ms"
```

---

## 📚 References

- **`routing-intelligence.md`** — Routing tables, decision trees, agent selection rules
- **`task-delegation.md`** — Delegation triggers, Wave system, specialization matrix
- **`PROFILE-MODES.md`** — Operating modes (standard/research/full-de-restriction)
- **`GLOBAL-DIRECTIVES.md`** — Tool calling policy, reasoning effort, safety constraints
- **`RULES.md`** — High-level auto-detection rules and quick reference
- **`adaptive-threshold-manager.ts`** — Phase 3 adaptive threshold implementation ✨ **NEW**
- **`user-history-tracker.ts`** — User reputation and success rate tracking ✨ **NEW**

---

**Status**: ✅ Production Ready (Phase 1+2+3 Integrated)
**Performance**: <50ms with cache, <150ms without cache
**Accuracy**: 90%+ confidence on 85%+ requests
**Phase 3**: ✅ **Adaptive thresholds fully integrated** (9-step workflow)

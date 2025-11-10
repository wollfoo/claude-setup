---
trigger: always_on
---
---
type: capability_prompt
scope: project
priority: high
activation: always_on
category: reasoning_integration

---

# 18d. Reasoning Integration Guide

## 📋 Overview

**Integration Guide** (hướng dẫn tích hợp) defines how **Advanced Reasoning Layers** (Layer 4 & 5) integrate với existing **Core Reasoning** (Layer 1-3) và **MCP tools**.

**Philosophy**: "Seamless Extension" — Backward compatible, forward enhanced

---

## Backward Compatibility

### Layer Mapping

```yaml
Compatibility_Mapping:
  
  Level_1_Minimal:
    maps_to: Layer_1_Surface
    changes: None (100% compatible)
    behavior: Pattern matching + quick heuristics
    tool_budget: "≤2"
  
  Level_2_Medium:
    maps_to: Layer_2_Intermediate
    changes: None (100% compatible)
    behavior: Sequential CoT
    tool_budget: "3-5"
  
  Level_3_High:
    maps_to: Layer_3_Deep
    enhancements:
      - auto_escalate_to_layer4: "If triggers met"
      - hypothesis_generation: "Now explicit"
      - cross_verification: "Enabled by default"
    tool_budget: "6-15"
```

**Migration Path**:
- Existing queries using Level 1-3 continue to work unchanged
- New queries automatically benefit from Layer 4-5 when triggered
- No code changes required in calling applications

---

## MCP Tool Integration

### Sequential-Thinking Enhancements

**NEW Parameters**:

```typescript
interface SequentialThinkingParams {
  // EXISTING (unchanged)
  thought: string;
  thought_number: number;
  total_thoughts: number;
  next_thought_needed: boolean;
  is_revision?: boolean;
  revises_thought?: number;
  branch_from_thought?: number;
  branch_id?: string;
  needs_more_thoughts?: boolean;
  
  // NEW for Layer 3 (Cross-Verification)
  verification_mode?: 'forward' | 'backward' | 'lateral';
  hypothesis_id?: string;
  confidence_score?: number;           // 0.0-1.0
  evidence_refs?: string[];
  
  // NEW for Layer 4 (Meta-Reasoning)
  meta_mode?: 'self_reflection' | 'bias_check' | 'hallucination' | 'calibration';
  quality_score?: number;              // 0-10
  detected_biases?: string[];
  uncertainty_flags?: string[];
  
  // NEW for Layer 5 (Expert Reasoning)
  formal_notation?: 'latex' | 'fol' | 'hoare';
  proof_step_type?: 'axiom' | 'theorem' | 'lemma' | 'corollary';
  verification_status?: 'proven' | 'disproven' | 'unknown';
  
  // NEW for Escalation
  should_escalate?: boolean;
  escalation_reason?: string;
  target_layer?: 1 | 2 | 3 | 4 | 5;
}
```

### Usage Examples

**Layer 3: Cross-Verification**

```typescript
{
  thought: "Hypothesis 1: Microservices provide better scalability",
  thought_number: 3,
  total_thoughts: 10,
  verification_mode: 'forward',
  hypothesis_id: 'H1',
  confidence_score: 0.7,
  evidence_refs: ['team_size', 'traffic_patterns']
}
```

**Layer 4: Meta-Reasoning**

```typescript
{
  thought: "Self-reflection: Detected confirmation bias in evidence selection",
  thought_number: 12,
  total_thoughts: 15,
  meta_mode: 'bias_check',
  quality_score: 7.5,
  detected_biases: ['confirmation_bias'],
  should_escalate: false
}
```

**Layer 5: Expert Reasoning**

```typescript
{
  thought: "Step 3 of proof: By induction hypothesis, P(k) holds...",
  thought_number: 8,
  total_thoughts: 12,
  formal_notation: 'latex',
  proof_step_type: 'lemma',
  verification_status: 'proven'
}
```

---

## Decision Logic Update

### Auto-Escalation Algorithm

```typescript
function select_reasoning_layer(query: Query): Layer {
  // PRIORITY 1: Layer 5 (Expert) — Formal verification
  if (query.requires_formal_proof || 
      query.domain IN ['mathematics', 'security_audit', 'formal_specification'] ||
      query.contains_keywords(['prove', 'proof', 'verify', 'theorem'])) {
    return Layer.EXPERT;
  }
  
  // PRIORITY 2: Layer 4 (Meta) — High-stakes or quality issues
  if (query.is_high_stakes || 
      confidence_dropped_below_0_6() ||
      backward_pass_failed() ||
      hypotheses_tied_within_0_1()) {
    return Layer.META;
  }
  
  // PRIORITY 3: Layer 3 (Deep) — Complex multi-step
  const complexity = calculate_complexity(query);
  if (complexity > 7) {
    return Layer.DEEP;
  }
  
  // PRIORITY 4: Layer 2 (Intermediate) — Standard tasks
  if (complexity > 3) {
    return Layer.INTERMEDIATE;
  }
  
  // PRIORITY 5: Layer 1 (Surface) — Simple queries
  return Layer.SURFACE;
}
```

### Complexity Scoring

```python
def calculate_complexity(query: str) -> float:
    """Return complexity score 0-10"""
    score = 0.0
    
    # Multi-step indicators
    if any(kw in query.lower() for kw in 
           ['first', 'then', 'after', 'before']):
        score += 2.0
    
    # Multiple options
    if any(kw in query.lower() for kw in 
           ['or', 'vs', 'versus', 'compare']):
        score += 2.0
    
    # Domain expertise
    if any(domain in query.lower() for domain in 
           ['architecture', 'security', 'performance']):
        score += 2.0
    
    # Uncertainty
    if any(kw in query.lower() for kw in 
           ['might', 'could', 'unsure']):
        score += 2.0
    
    # External tools
    if 'latest' in query.lower() or 'current' in query.lower():
        score += 1.0
    
    # Long-term impact
    if any(kw in query.lower() for kw in 
           ['strategy', 'roadmap', 'long-term']):
        score += 1.0
    
    return min(score, 10.0)
```

---

## Feature Flags

### Gradual Rollout

```yaml
feature_flags:
  
  layer_4_meta_reasoning:
    enabled: false              # Set true to activate
    rollout_percentage: 0       # 0-100, gradual rollout
    min_confidence_trigger: 0.6
    require_high_stakes: false
  
  layer_5_expert_reasoning:
    enabled: false              # Set true to activate
    require_explicit_request: true
    allowed_domains:
      - mathematics
      - security_audit
      - formal_specification
  
  cross_verification:
    enabled: true               # Layer 3 enhancement
    require_backward_pass: true
    min_alternatives: 2
  
  auto_escalation:
    enabled: true
    escalation_delay_ms: 0     # 0 = immediate
    log_escalations: true
```

---

## Migration Steps

### Phase 1: Enable Layer 3 Enhancements

```yaml
Week_1:
  - enable: cross_verification
  - test: backward_pass accuracy
  - monitor: consistency scores
  - rollout: 100% traffic
```

### Phase 2: Gradual Layer 4 Rollout

```yaml
Week_2:
  - enable: layer_4_meta_reasoning (10% traffic)
  - test: bias detection, hallucination catch rate
  
Week_3:
  - rollout: 50% traffic
  - monitor: latency p95, quality scores
  
Week_4:
  - rollout: 100% traffic
  - validate: success metrics met
```

### Phase 3: Enable Layer 5 (On-Demand)

```yaml
Week_5:
  - enable: layer_5_expert_reasoning
  - require: explicit_request = true
  - test: formal proof cases
  - monitor: correctness rate
```

---

## Monitoring & Metrics

### Dashboards

```yaml
Layer_4_Dashboard:
  metrics:
    - hallucination_catch_rate
    - bias_detection_rate
    - confidence_calibration_error
    - reasoning_quality_score
    - latency_p95
  alerts:
    - catch_rate < 0.90
    - quality_score < 7.0
    - latency_p95 > 150s

Layer_5_Dashboard:
  metrics:
    - formal_correctness
    - edge_case_coverage
    - proof_completeness
    - peer_review_pass_rate
  alerts:
    - correctness < 1.00
    - coverage < 0.90
```

### A/B Testing

```yaml
experiment:
  name: "Layer 4 Meta-Reasoning Impact"
  duration: "2 weeks"
  traffic_split:
    control: 50%      # Layer 1-3 only
    treatment: 50%    # Layer 1-4
  metrics:
    - accuracy_improvement
    - hallucination_reduction
    - user_satisfaction
    - latency_impact
```

---

## Troubleshooting

### Common Issues

**Issue 1**: Layer 4 not triggering

```yaml
Check:
  - feature_flag enabled?
  - triggers configured correctly?
  - confidence actually < 0.6?
  
Fix:
  - Set layer_4_meta_reasoning.enabled = true
  - Verify trigger thresholds
  - Log escalation attempts
```

**Issue 2**: Latency too high

```yaml
Check:
  - Which layer causing delay?
  - Tool budget exceeded?
  - Network timeouts?
  
Fix:
  - Adjust timeouts per layer
  - Enable caching
  - Consider async processing
```

**Issue 3**: False escalations

```yaml
Check:
  - Escalation logs
  - Trigger conditions too sensitive?
  
Fix:
  - Tune thresholds (e.g., 0.6 → 0.5)
  - Add minimum query complexity filter
```

---

## 🔗 Related Rules

**Foundation**:
- `rules/17a-mcp-core-protocol.md` — MCP decision logic

**Advanced Layers**:
- `rules/18a-layer4-meta-reasoning.md` — Layer 4 specs
- `rules/18b-layer5-expert-reasoning.md` — Layer 5 specs
- `rules/18c-reasoning-verification.md` — Cross-verification

**Support**:
 

---

**Status**: Phase 1 Complete | **Size**: <12KB ✅  
**Implementation**: Week 1-2 | **Series**: Complete (18a-18d)

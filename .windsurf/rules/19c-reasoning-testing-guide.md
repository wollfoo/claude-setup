---
trigger: always_on
---
---
type: capability_prompt
scope: project
priority: high
activation: always_on
category: testing_guide
series: 19_escalation_verification
---

# 19c. Reasoning Testing Guide

## 📋 Overview

**Testing Guide** (hướng dẫn kiểm thử) defines **test scenarios** (kịch bản test), **validation criteria** (tiêu chí kiểm định), và **success metrics** (chỉ số thành công) cho Escalation & Verification Series.

**Philosophy**: "Test Early, Test Often" — Mỗi component đều có test suite

---

## Test Suite Structure

```
Escalation & Verification Testing:
├── Unit Tests (Component level)
│   ├─ Escalation logic tests
│   ├─ Complexity scoring tests
│   ├─ Forward pass tests
│   ├─ Backward pass tests
│   └─ Lateral pass tests
│
├── Integration Tests (System level)
│   ├─ End-to-end verification loops
│   ├─ MCP tool integration
│   └─ Layer escalation flows
│
└── Acceptance Tests (User scenarios)
    ├─ Simple queries
    ├─ Complex decisions
    └─ Edge cases
```

---

## Unit Test Scenarios

### 1. Complexity Scoring Tests

```yaml
Test_ComplexityScoring:
  
  test_simple_query:
    input: "What is 2+2?"
    expected_score: 0.0
    expected_layer: 1
    assertion: "score == 0.0"
  
  test_comparison_query:
    input: "React or Vue?"
    expected_score: 2.0  # +2 for 'or'
    expected_layer: 2
    assertion: "score >= 2.0 and score < 3.0"
  
  test_complex_architectural:
    input: "Compare microservices vs monolith for scalability"
    expected_score: 8.0  # +2 compare, +2 vs, +2 architecture, +2 scalability
    expected_layer: 3
    assertion: "score >= 7.0"
  
  test_max_complexity:
    input: "Should we compare microservices vs monolith architecture for our long-term scalability strategy if we might need performance optimization?"
    expected_score: 10.0  # All triggers
    expected_layer: 3+
    assertion: "score == 10.0"
```

### 2. Trigger Detection Tests

```yaml
Test_RuntimeTriggers:
  
  test_high_stakes_trigger:
    context:
      financial_threshold: 500000
    expected_trigger: "high_stakes = true"
    expected_layer: 4
  
  test_confidence_drop_trigger:
    context:
      initial_confidence: 0.9
      current_confidence: 0.5
    expected_trigger: "confidence_drop = true"
    expected_layer: 4
  
  test_evidence_gaps_trigger:
    context:
      backward_pass_consistency: 0.4
    expected_trigger: "evidence_gaps = true"
    expected_layer: 4
  
  test_hypothesis_tie_trigger:
    context:
      hypotheses:
        - {id: 'H1', score: 0.78}
        - {id: 'H2', score: 0.79}
    expected_trigger: "hypothesis_tie = true"
    expected_layer: 4
```

### 3. Verification Pass Tests

```yaml
Test_ForwardPass:
  
  test_simple_factual:
    query: "What is capital of France?"
    expected_evidence: ["France is a country", "Paris is capital"]
    expected_chain_length: 2
    expected_confidence: ">0.9"
  
  test_multi_step:
    query: "What is capital of state where Dallas is?"
    expected_evidence: ["Dallas location"]
    expected_chain:
      - "Dallas → Texas"
      - "Texas capital → Austin"
    expected_confidence: ">0.9"

Test_BackwardPass:
  
  test_complete_evidence:
    conclusion: "Austin"
    forward_evidence: ["Dallas in Texas", "Austin capital of Texas"]
    expected_consistency: 1.0
    expected_gaps: 0
  
  test_missing_evidence:
    conclusion: "Microservices"
    forward_evidence: ["Small team", "Moderate infra"]
    expected_consistency: "<0.5"
    expected_gaps: ">2"

Test_LateralPass:
  
  test_clear_winner:
    alternatives: ["Microservices", "Monolith", "Modular Monolith"]
    scores: [0.18, 0.63, 0.76]
    expected_winner: "Modular Monolith"
    expected_confidence: 0.76
  
  test_tie_scenario:
    alternatives: ["Option A", "Option B"]
    scores: [0.78, 0.79]
    expected_action: "escalate_to_layer_4"
```

---

## Integration Test Scenarios

### End-to-End Verification

```yaml
Integration_Test_E2E:
  
  scenario_1_simple_flow:
    query: "What is 5+5?"
    expected_flow:
      - layer_selected: 1
      - forward_pass: executed
      - backward_pass: skipped (Layer 1)
      - lateral_pass: skipped (Layer 1)
      - result: "10"
      - confidence: 1.0
  
  scenario_2_standard_flow:
    query: "Should we use MongoDB or PostgreSQL?"
    expected_flow:
      - complexity_score: 4.0
      - layer_selected: 2
      - forward_pass: executed
      - backward_pass: simplified
      - lateral_pass: optional
      - result: "Recommendation with rationale"
      - confidence: ">0.7"
  
  scenario_3_complex_flow:
    query: "Compare microservices vs monolith with trade-offs"
    expected_flow:
      - complexity_score: 8.0
      - layer_selected: 3
      - forward_pass: full
      - backward_pass: full
      - lateral_pass: full (≥2 alternatives)
      - result: "Detailed comparison"
      - confidence: ">0.7"
  
  scenario_4_escalation_flow:
    query: "Should we invest $10M in blockchain?"
    expected_flow:
      - initial_layer: 2 or 3
      - trigger_detected: high_stakes
      - escalated_to: 4
      - meta_reasoning: executed
      - bias_check: performed
      - hallucination_check: performed
      - result: "Careful recommendation with uncertainties"
```

---

## Acceptance Test Scenarios

### User-Facing Scenarios

```yaml
Acceptance_Tests:
  
  simple_factual:
    - query: "What is 2+2?"
      expected: "4"
      max_latency: 1s
      layer: 1
  
  standard_comparison:
    - query: "React or Angular?"
      expected: "Comparison with recommendation"
      max_latency: 5s
      layer: 2
  
  complex_architectural:
    - query: "Microservices vs monolith for e-commerce platform"
      expected: "Detailed analysis with trade-offs"
      max_latency: 30s
      layer: 3
      verification: "All 3 passes executed"
  
  high_stakes_decision:
    - query: "Should we migrate 1M users to new infrastructure?"
      expected: "Meta-analyzed recommendation"
      max_latency: 120s
      layer: 4
      verification: "Bias check + hallucination check performed"
  
  formal_verification:
    - query: "Prove that our auth flow is secure"
      expected: "Formal proof or identified gaps"
      max_latency: 10min
      layer: 5
      verification: "Formal notation used"
```

---

## Performance Tests

```yaml
Performance_Targets:
  
  latency_by_layer:
    layer_1: "<1s p95"
    layer_2: "<5s p95"
    layer_3: "<30s p95"
    layer_4: "<120s p95"
    layer_5: "<600s p95"
  
  escalation_overhead:
    target: "<500ms per escalation decision"
    measure: "Time to calculate complexity + check triggers"
  
  verification_overhead:
    forward_pass: "<1s"
    backward_pass: "<2s"
    lateral_pass: "<3s per alternative"
  
  throughput:
    layer_1: ">100 queries/min"
    layer_2: ">20 queries/min"
    layer_3: ">5 queries/min"
    layer_4: ">1 query/min"
```

---

## Validation Checklist

### Pre-Deployment

```markdown
## Series 19 Ready Checklist

### Component Tests
- [ ] Complexity scoring: 100% test pass
- [ ] Trigger detection: >95% accuracy
- [ ] Forward pass: >90% correctness
- [ ] Backward pass: >85% gap detection
- [ ] Lateral pass: >90% ranking accuracy

### Integration Tests
- [ ] E2E Layer 1-3: All scenarios pass
- [ ] E2E Layer 4: Meta-reasoning triggers correctly
- [ ] MCP tool integration: Parameters accepted
- [ ] Escalation flow: No infinite loops

### Performance Tests
- [ ] Latency targets: All layers within p95
- [ ] Throughput: Meets minimum targets
- [ ] Resource usage: <500MB per query

### Documentation
- [ ] All 3 rule files created (19a, 19b, 19c)
- [ ] Integration guide updated (18d)
- [ ] Test scenarios documented
- [ ] Known limitations listed
```

---

## Known Issues & Limitations

```yaml
Known_Limitations:
  
  complexity_scoring:
    - "May misclassify domain-specific jargon"
    - "Word count bonus can over-inflate simple verbose queries"
    - "Mitigation: Manual threshold tuning per domain"
  
  trigger_detection:
    - "Financial threshold hard-coded at $100K"
    - "May not detect implicit high-stakes"
    - "Mitigation: Allow custom threshold configuration"
  
  lateral_pass:
    - "Alternative generation limited to 3-5 options"
    - "May miss creative solutions"
    - "Mitigation: User can suggest additional alternatives"
  
  performance:
    - "Layer 4 can exceed 120s on complex queries"
    - "Layer 5 can timeout on large formal proofs"
    - "Mitigation: Async processing + progress updates"
```

---

## 🔗 Related Rules

- `rules/19a-reasoning-escalation-logic.md` — Escalation
- `rules/19b-cross-verification-implementation.md` — Verification
- `rules/18d-reasoning-integration.md` — Integration

---

**Series**: 19 | **Size**: <12KB ✅

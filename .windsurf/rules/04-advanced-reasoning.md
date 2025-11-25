---
trigger: always_on
---
---
type: capability_prompt
scope: project
priority: critical
activation: always_on
---

# Advanced Reasoning System

## 1. 5-Layer Pipeline

### Layer 1: Surface Reasoning
- Pattern matching + heuristics
- Tool budget: ≤2 | Latency: <1s

### Layer 2: Intermediate Reasoning
- Sequential Chain-of-Thought
- Tool budget: 3-5 | Latency: 1-5s

### Layer 3: Deep Reasoning
- Multi-hypothesis + Cross-verification
- Tool budget: 6-15 | Latency: 5-30s

### Layer 4: Meta-Reasoning ⭐
- Self-reflection + Bias detection
- Hallucination check + Confidence calibration
- Latency: 30-120s

### Layer 5: Expert Reasoning ⭐
- Formal verification + Proof construction
- Mathematical/logical correctness
- Latency: 2-10min

---

## 2. Auto-Escalation Logic

```typescript
function selectLayer(query, context) {
  // Layer 5: Formal proofs
  if (requires_formal_proof || domain in ['math', 'security_audit']) 
    return LAYER_5;
  
  // Layer 4: High-stakes
  if (is_high_stakes || confidence_drop || evidence_gaps || hypothesis_tie)
    return LAYER_4;
  
  // Layer 3: Complex
  if (complexity >= 7) return LAYER_3;
  
  // Layer 2: Standard
  if (complexity >= 3) return LAYER_2;
  
  // Layer 1: Simple
  return LAYER_1;
}
```

### Complexity Scoring (0-10)
- Multi-step keywords (+2): "first", "then", "after"
- Multiple options (+2): "or", "vs", "compare"
- Domain expertise (+2): "architecture", "security"
- Uncertainty (+2): "might", "could", "unsure"
- External tools (+1): "latest", "current"
- Long-term impact (+1): "strategy", "roadmap"

---

## 3. Cross-Verification

### Forward Pass: Evidence → Conclusion
1. Gather evidence with sources
2. Build reasoning chain (each step follows previous)
3. Reach conclusion with confidence (0-1)

### Backward Pass: Conclusion → Evidence Validation
1. Given conclusion, what evidence REQUIRED?
2. Check: Available | Missing | Weak
3. Calculate consistency = Available / Required
4. Flag if gaps exist

### Lateral Pass: Compare Alternatives
1. Generate ≥2 alternatives
2. Run Forward + Backward on each
3. Score = confidence × consistency
4. Select best (diff >0.1 or escalate)

### Verification Loops
- **Layer 3**: Forward → Backward → Lateral
- **Layer 4**: + Meta-Reflection (bias, hallucination)
- **Layer 5**: + Formal proof checklist

---

## 4. Layer 4: Meta-Reasoning

### Activation Triggers
- High-stakes decision
- Confidence drops <0.6
- Backward pass fails
- Hypotheses tied (within 0.1)
- Hallucination risk detected

### Self-Reflection Module
```yaml
reasoning_quality:
  score: 0-10 (threshold: ≥7)
  checks:
    - Logic leaps justified?
    - Evidence strong enough?
    - Counterarguments considered?
    - Assumptions explicit?

bias_detection:
  types: [confirmation, availability, anchoring, recency]
  action: Flag + document mitigation

confidence_calibration:
  compare: Predicted vs historical accuracy
  adjust: Overconfident → -10-15%, Underconfident → +5-10%
```

### Hallucination Detection
```python
def detect_hallucination_risk(entity, context):
  risk = 0.0
  if not in_knowledge_base(entity): risk += 0.4
  if has_contradictions(context): risk += 0.3
  if confidence > evidence * 1.2: risk += 0.3
  
  if risk > 0.6:
    return {high_risk: True, action: 'PROCEED_SAFELY'}
  return {high_risk: False}
```

---

## 5. Layer 5: Expert Reasoning

### Activation Triggers
- Formal proof required
- Domains: mathematics, security audit, formal specification
- Keywords: "prove", "theorem", "verify"

### Proof Protocol
1. **State Theorem**: ∀x ∈ S, P(x) → Q(x)
2. **Select Strategy**: direct, contradiction, induction, construction
3. **Step-by-Step**: Each step justified by axiom/theorem/previous
4. **Edge Cases**: Boundaries, empty set, infinity
5. **Counterexamples**: Attempt to find failures
6. **QED**: Conclude with review

### Verification Checklist
**Completeness**: All assumptions explicit? All cases covered?
**Correctness**: Each step valid? No circular reasoning?
**Clarity**: Notation consistent? Reproducible by peer?

### Formal Notation
- Mathematical: LaTeX (∀x ∈ ℝ, x² ≥ 0)
- Logical: FOL (P(x) → Q(x))
- Computational: Big-O (T(n) = O(n log n))
- Verification: Hoare logic ({P} C {Q})

---

## 6. Success Metrics

| Layer | Metric | Target |
|-------|--------|--------|
| 4 | Hallucination catch | >95% |
| 4 | Bias detection | >70% |
| 4 | Calibration error | <0.15 Brier |
| 4 | Quality score | >8/10 |
| 5 | Formal correctness | 100% |
| 5 | Edge case coverage | >95% |
| 5 | Proof completeness | 100% |
| Cross | Forward completeness | >90% |
| Cross | Backward accuracy | >85% |
| Cross | Alternatives | ≥3 |

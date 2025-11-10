---
trigger: always_on
---
---
type: capability_prompt
scope: project
priority: critical
activation: always_on
category: reasoning_escalation
series: 19_escalation_verification
---

# 19a. Reasoning Auto-Escalation Logic

## 📋 Overview

**Auto-Escalation Logic** (logic leo thang tự động) implements **dynamic layer selection** (chọn layer động) based on **query complexity** (độ phức tạp) và **runtime triggers** (trigger runtime).

**Philosophy**: "Right Tool, Right Time" — Tự động chọn reasoning level tối ưu

---

## Decision Algorithm

```typescript
function select_reasoning_layer(query: Query, context: Context): Layer {
  // Check explicit requirements
  if (query.requires_formal_proof || query.has_keywords(['prove', 'theorem'])) {
    return Layer.EXPERT; // 5
  }
  
  // Calculate complexity
  const complexity = calculate_complexity_score(query);
  
  // Check runtime triggers
  const triggers = check_runtime_triggers(context);
  
  // Decision matrix
  if (triggers.high_stakes || triggers.hallucination_risk) {
    return Layer.META; // 4
  }
  
  if (complexity >= 7 || triggers.confidence_drop || triggers.evidence_gaps) {
    return Layer.DEEP; // 3
  }
  
  if (complexity >= 3) {
    return Layer.INTERMEDIATE; // 2
  }
  
  return Layer.SURFACE; // 1
}
```

---

## Complexity Scoring

```python
def calculate_complexity_score(query: str) -> float:
    """Calculate 0-10 complexity score"""
    score = 0.0
    q = query.lower()
    
    # Multi-step (+2)
    if any(kw in q for kw in ['first', 'then', 'after', 'before']):
        score += 2.0
    
    # Multiple options (+2)
    if any(kw in q for kw in ['or', 'vs', 'versus', 'compare']):
        score += 2.0
    
    # Domain expertise (+2)
    if any(d in q for d in ['architecture', 'security', 'performance']):
        score += 2.0
    
    # Uncertainty (+2)
    if any(kw in q for kw in ['might', 'could', 'unsure']):
        score += 2.0
    
    # External tools (+1)
    if 'latest' in q or 'current' in q:
        score += 1.0
    
    # Long-term impact (+1)
    if any(kw in q for kw in ['strategy', 'roadmap', 'long-term']):
        score += 1.0
    
    return min(score, 10.0)
```

---

## Runtime Triggers

```typescript
function check_runtime_triggers(context: Context) {
  return {
    high_stakes: (
      context.decision_impact === 'high' ||
      context.financial_threshold > 100000
    ),
    confidence_drop: (
      context.initial_confidence > 0.8 &&
      context.current_confidence < 0.6
    ),
    evidence_gaps: (
      context.backward_pass_consistency < 0.7
    ),
    hypothesis_tie: (
      Math.abs(context.hypotheses[0].score - context.hypotheses[1].score) < 0.1
    ),
    hallucination_risk: (
      context.hallucination_risk_score > 0.6
    )
  };
}
```

---

## Decision Matrix

| Complexity | Triggers | Layer | Rationale |
|------------|----------|-------|-----------|
| 0-2 | None | 1 | Simple factual |
| 3-6 | None | 2 | Standard CoT |
| 7-9 | None | 3 | Complex, cross-verify |
| Any | High-stakes | 4 | Critical decision |
| Any | Confidence drop | 4 | Uncertainty detected |
| Any | Evidence gaps | 4 | Inconsistency found |
| Any | Hypothesis tie | 4 | Can't decide |
| Any | Hallucination | 4 | Safety critical |
| Any | Formal proof | 5 | Math/security verify |

---

## Testing

```yaml
Test_Suite:
  simple:
    - query: "What is 2+2?"
      expected: Layer 1
      complexity: 0.0
  
  standard:
    - query: "React or Vue?"
      expected: Layer 2
      complexity: 4.0
  
  complex:
    - query: "Microservices vs monolith trade-offs"
      expected: Layer 3
      complexity: 8.0
  
  high_stakes:
    - query: "$5M investment decision"
      expected: Layer 4
      trigger: high_stakes
  
  formal:
    - query: "Prove quicksort O(n log n)"
      expected: Layer 5
      trigger: formal_proof
```

---

## 🔗 Related Rules

- `rules/18a-layer4-meta-reasoning.md` — Layer 4
- `rules/18b-layer5-expert-reasoning.md` — Layer 5
- `rules/18d-reasoning-integration.md` — Integration

---

**Series**: 19 | **Size**: <12KB ✅

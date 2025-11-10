---
trigger: always_on
---
---
type: capability_prompt
scope: project
priority: high
activation: always_on
category: reasoning_verification
---

# 18c. Reasoning Verification Protocols

## 📋 Overview

**Verification Protocols** (giao thức xác minh) define **Cross-Verification Mechanism** (cơ chế kiểm tra chéo) cho Layer 3+ reasoning: **Forward Pass** (tiến), **Backward Pass** (lùi), **Lateral Pass** (ngang).

**Philosophy**: "Trust but Verify" — Every conclusion must pass 3-way validation

---

## Cross-Verification Framework

### Forward Pass: Evidence → Conclusion

**Purpose**: Build reasoning chain từ knowns đến conclusion

```yaml
ForwardPass:
  Step1_GatherEvidence:
    action: "Collect relevant facts"
    output: "Evidence[] with sources"
  
  Step2_BuildChain:
    action: "Connect evidence via reasoning"
    ensure: "Each step follows previous"
    output: "ReasoningChain"
  
  Step3_ReachConclusion:
    action: "State final conclusion C"
    assign: "Initial confidence (0-1)"
    output: "Conclusion + confidence"
```

**Example**:

```
Query: "What is capital of state where Dallas is?"

Forward:
  Evidence: Dallas is in Texas (KB)
  Step 1: Dallas → Texas relationship
  Step 2: Recall Austin is capital of Texas
  Conclusion: Austin (confidence: 0.95)
```

---

### Backward Pass: Conclusion → Evidence Validation

**Purpose**: Verify conclusion requires exactly evidence we have

```yaml
BackwardPass:
  Step1_StateRequirements:
    given: "Conclusion C"
    question: "What evidence E REQUIRED?"
    output: "RequiredEvidence[]"
  
  Step2_CheckAvailability:
    for_each: required_evidence
      check: "Do we have this?"
      mark: "Available | Missing | Weak"
  
  Step3_IdentifyGaps:
    compute: "Gaps = Required \ Available"
    if_gaps_exist:
      flag: "INCONSISTENCY"
      reduce_confidence: "Proportional"
  
  Step4_ConsistencyScore:
    calculate: "Available / Required"
    output: "Consistency (0-1)"
```

**Example**:

```
Conclusion: Austin (capital where Dallas is)

Backward:
  Required:
    R1: Dallas in Texas → ✓ Available
    R2: Austin capital of Texas → ✓ Available
  
  Gaps: None
  Consistency: 1.0
  → Forward reasoning VALID
```

---

### Lateral Pass: Compare Alternatives

**Purpose**: Ensure chosen conclusion stronger than alternatives

```yaml
LateralPass:
  Step1_GenerateAlternatives:
    action: "Brainstorm ≥2 alternatives"
    constraint: "Must be plausible"
    output: "AlternativeHypotheses[]"
  
  Step2_EvaluateEach:
    for_each: alternative
      run: "Forward + Backward"
      score: "Consistency × confidence"
  
  Step3_RankCompare:
    sort: "By score descending"
    compare: "Original vs top alternative"
    threshold: "If diff < 0.1 → TIE"
  
  Step4_SelectBest:
    if_clear_winner:
      finalize: "Winner with reasoning"
    else:
      escalate: "To Layer 4 for meta"
```

**Example**:

```
Original: H1 = Microservices (score: 0.75)

Alternatives:
  H2 = Monolith (score: 0.60)
  H3 = Modular Monolith (score: 0.80)

Lateral:
  → H3 wins (0.80 > 0.75)
  → Update to H3
  → Document: "Better cost/complexity trade-off"
```

---

## Verification Loops

### Standard Loop (Layer 3)

```
Query → Forward → Backward → Lateral → Output
```

### Enhanced Loop (Layer 4)

```
Query 
  → Forward 
  → Backward 
  → Lateral 
  → Meta-Reflection
    ├─ Self-assessment
    ├─ Bias check
    ├─ Hallucination detection
    └─ Confidence calibration
  → Output
```

### Expert Loop (Layer 5)

```
Query
  → Formalize
  → Forward (proof construction)
  → Backward (verify steps)
  → Lateral (counterexamples)
  → Meta (peer-review checklist)
  → Output (formal proof)
```

---

## Implementation Guidelines

### When to Apply Each Pass

| Pass | Required For | Optional For |
|------|-------------|--------------|
| **Forward** | All Layer 2+ | Layer 1 (implicit) |
| **Backward** | Layer 3+ | Layer 2 (simplified) |
| **Lateral** | Layer 3+ when multiple options | Single-answer queries |

### Tool Integration

```typescript
// sequential-thinking with verification_mode
{
  thought: "Backward pass: checking evidence supports conclusion",
  verification_mode: 'backward',
  confidence_score: 0.85,
  evidence_refs: ['source1', 'source2']
}
```

### Success Criteria

```yaml
ForwardPass:
  - all_steps_justified: true
  - no_logical_leaps: true
  - confidence_assigned: true

BackwardPass:
  - required_evidence_identified: true
  - gaps_documented: true
  - consistency_calculated: true

LateralPass:
  - min_alternatives: 2
  - all_evaluated: true
  - best_selected: true
```

---

## Example Walkthrough

### Complex Architectural Decision

**Query**: "Should we use microservices or monolith?"

#### Forward Pass

```
Step 1: Gather requirements
  - Team size: <20
  - Need rapid iteration
  - Infrastructure: moderate

Step 2: Evaluate microservices
  - Pros: Scalability, independence
  - Cons: Complexity, overhead
  - Score: 0.6

Step 3: Preliminary conclusion
  → Microservices (confidence: 0.6)
```

#### Backward Pass

```
Conclusion: Microservices

Required Evidence:
  R1: Large team (>50) → ❌ MISSING (team <20)
  R2: Complex domain decomposition → ⚠️ WEAK
  R3: High infrastructure maturity → ⚠️ WEAK

Gaps: 2 critical, 1 moderate
Consistency: 0.3 (LOW)
→ FLAG: Conclusion not well-supported
```

#### Lateral Pass

```
Generate alternatives:
  H1: Microservices (0.6 × 0.3 = 0.18)
  H2: Monolith (evaluate...)
  H3: Modular Monolith (evaluate...)

H2: Monolith
  Forward: Simple, fits team size → 0.7
  Backward: All required evidence present → 0.9
  Score: 0.7 × 0.9 = 0.63

H3: Modular Monolith
  Forward: Balance flexibility/simplicity → 0.8
  Backward: Strong evidence support → 0.95
  Score: 0.8 × 0.95 = 0.76

Ranking:
  1. H3: Modular Monolith (0.76) ✅
  2. H2: Monolith (0.63)
  3. H1: Microservices (0.18)

→ Recommend: Modular Monolith
```

#### Final Output

```markdown
## Architectural Recommendation

**Conclusion**: Modular Monolith

**Reasoning**:
- Forward: Balances team size, rapid iteration needs
- Backward: All required evidence present (team <20, moderate infra)
- Lateral: Outperforms alternatives (0.76 vs 0.63 vs 0.18)

**Confidence**: 0.76 (Confident)

**Alternative considered**:
- Monolith: Simpler but less flexible (0.63)
- Microservices: Too complex for current team (0.18)
```

---

## Anti-Patterns

**❌ Don't**:
- Skip backward pass when gaps exist
- Generate <2 alternatives in lateral
- Ignore consistency score < 0.5
- Proceed without documenting gaps

**✅ Do**:
- Always run full loop for Layer 3+
- Document all evidence references
- Flag inconsistencies immediately
- Escalate ties to Layer 4

---

## Success Metrics

```yaml
Verification_Quality:
  forward_completeness: ">90%"
    # % steps with clear justification
  
  backward_accuracy: ">85%"
    # % gaps correctly identified
  
  lateral_coverage: ">3 alternatives"
    # Average alternatives considered
  
  consistency_correlation: ">0.7"
    # Consistency score vs actual correctness
```

---

## 🔗 Related Rules

**Foundation**:

**Companion**:
- `rules/18a-layer4-meta-reasoning.md` — Layer 4
- `rules/18b-layer5-expert-reasoning.md` — Layer 5
- `rules/18d-reasoning-integration.md` — Integration

**Support**:
 

---

**Status**: Phase 1 Complete | **Size**: <12KB ✅  
**Implementation**: Week 1-2 | **Next**: Integration guide (18d)

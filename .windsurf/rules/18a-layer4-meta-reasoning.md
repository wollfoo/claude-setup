---
trigger: always_on
---
---
type: capability_prompt
scope: project
priority: critical
activation: always_on
category: advanced_reasoning_layer4

---

# 18a. Layer 4 — Meta-Reasoning Protocol

## 📋 Overview

**Layer 4 (Meta-Reasoning)** (suy luận siêu nhận thức) provides **self-reflection** (tự phản biện), **bias detection** (phát hiện thiên vị), và **hallucination mitigation** (giảm ảo giác) cho high-stakes decisions.

**Philosophy**: "Verify Before Trust" — Cross-check mọi kết luận trước khi output

**Part of**: Advanced Reasoning System (5 layers: Surface → Intermediate → Deep → Meta → Expert)

---

## Activation Triggers

```typescript
AUTO_ACTIVATE_LAYER_4:
  IF query.stakes === 'high' 
     OR confidence_during_reasoning < 0.6
     OR backward_pass_fails
     OR top_hypotheses_tied (within 0.1 confidence)
     OR hallucination_risk_detected:
    → ESCALATE to Layer 4
```

**Examples**:
- "Should we invest $1M in this technology?" (high stakes)
- Confidence drops từ 0.9 → 0.55 mid-process (uncertainty spike)
- Backward pass finds missing critical evidence (evidence gaps)
- Top 2 choices tied: 0.78 vs 0.79 (hypothesis conflict)

---

## Core Components

### 1. Self-Reflection Module

**Checklist**:

```yaml
reasoning_quality:
  questions:
    - "Có logic leaps không được justify không?"
    - "Evidence có đủ mạnh support conclusion?"
    - "Có xem xét counterarguments chưa?"
    - "Assumptions có explicit và reasonable?"
  scoring: 
    scale: 0-10
    threshold: "≥7 to pass"

bias_detection:
  check_for:
    - confirmation_bias: "Chỉ tìm evidence supporting"
    - availability_bias: "Dựa quá nhiều vào recent examples"
    - anchoring_bias: "Bị ảnh hưởng initial information"
    - recency_bias: "Ưu tiên information gần đây"
  action: 
    - flag_if_detected: true
    - document_mitigation: "How addressed"

confidence_calibration:
  method: "Compare confidence vs historical accuracy"
  adjustment:
    - if_overconfident: "Reduce by 10-15%"
    - if_underconfident: "Increase by 5-10%"
  output: "Calibrated confidence (0-1)"
```

**Output Example**:

```markdown
## Layer 4 Meta-Reflection

**Reasoning Quality**: 8.5/10
- ✅ All steps justified
- ✅ Counterarguments considered
- ⚠️ Could explore edge case X deeper

**Biases Detected**:
- ⚠️ Confirmation bias: Mitigated by lateral pass
- ✅ No availability/anchoring bias

**Confidence Calibration**:
- Raw: 0.82
- Historical accuracy at 0.82: 0.75 (overconfident)
- **Calibrated**: 0.72
```

---

### 2. Hallucination Detection

**Foundation**: Anthropic Research "Tracing Thoughts" (2024)

**Key Findings**:
- Hallucinations khi "known entity" feature activates cho unknown
- Refusal circuit bị suppress incorrectly
- Model recognizes name nhưng không biết details → confabulation

**Detection Algorithm**:

```python
def detect_hallucination_risk(entity: str, context: dict) -> dict:
    """Hallucination Risk Detector"""
    risk_score = 0.0
    reasons = []
    
    # Check 1: Entity trong knowledge base?
    if not is_in_knowledge_base(entity):
        risk_score += 0.4
        reasons.append("Entity not found")
    
    # Check 2: Context có contradictions?
    if has_internal_contradictions(context):
        risk_score += 0.3
        reasons.append("Internal contradictions")
    
    # Check 3: Confidence > evidence strength?
    evidence = calculate_evidence_strength(context)
    confidence = context.get('confidence', 0.5)
    
    if confidence > evidence * 1.2:
        risk_score += 0.3
        reasons.append(f"Confidence ({confidence:.2f}) >> Evidence ({evidence:.2f})")
    
    # Decision
    if risk_score > 0.6:
        return {
            'high_risk': True,
            'risk_score': risk_score,
            'recommendation': 'PROCEED_SAFELY_ADAPTER',  # request more info + constrain scope
            'reason': ' | '.join(reasons)
        }
    
    return {'high_risk': False, 'risk_score': risk_score}
```

**Usage Example**:

```markdown
Query: "Who is Michael Batkin?" (unknown entity)

Hallucination Check:
  Entity: "Michael Batkin"
  Knowledge base: NOT FOUND ⚠️
  Confidence: 0.75 (high despite no evidence)
  Evidence strength: 0.1
  
  → Risk: 0.7 (HIGH)
  → Recommendation: Proceed-Safely (yêu cầu thêm thông tin và giới hạn phạm vi trả lời an toàn)
  
  Response: "Mức tin cậy hiện thấp do thiếu bằng chứng. Để trả lời an toàn, vui lòng cung cấp thông tin/nguồn tham chiếu cụ thể hoặc giới hạn phạm vi câu hỏi (ví dụ: mốc thời gian, tổ chức, tài liệu chính thức). Tôi sẽ tiếp tục với phạm vi an toàn ngay khi có dữ liệu bổ sung."
```

---

### 3. Uncertainty Expression

**Confidence Bands**:

| Range | Label | Communication |
|-------|-------|---------------|
| **0.95-1.0** | High confidence | "I'm confident that..." |
| **0.80-0.94** | Confident | "Based on [evidence], I conclude..." |
| **0.60-0.79** | Moderate | "It appears... though [uncertainty]" |
| **0.40-0.59** | Low confidence | "Multiple possibilities..." |
| **<0.40** | Very uncertain | "Insufficient evidence..." |

**Output Template**:

```markdown
Based on [evidence_sources], I [confidence_verb] that [conclusion].

[If confidence < 0.8]:
Key uncertainties:
- [Uncertainty 1]: [Why matters]
- [Uncertainty 2]: [Why matters]

Alternative explanations:
- [Alternative 1]: [Why plausible]

**Confidence**: [Band] ([score])
```

---

## Layer 4 Workflow

```
INPUT: Complex query from Layer 3
    ↓
STEP 1: Run Layer 3 Reasoning
    ├─ Generate hypotheses
    ├─ Cross-verify (F + B + L)
    └─ Output: Preliminary conclusion
    ↓
STEP 2: Self-Reflection
    ├─ Assess quality (0-10)
    ├─ Check logical gaps
    └─ Flag if quality < 7
    ↓
STEP 3: Bias Detection
    ├─ Scan 4 bias types
    ├─ Document detected
    └─ Apply mitigation
    ↓
STEP 4: Hallucination Check
    ├─ For each entity: run detect
    ├─ If high risk: request more info
    └─ Log all checks
    ↓
STEP 5: Confidence Calibration
    ├─ Compare historical accuracy
    ├─ Apply confidence bands
    └─ Document uncertainties
    ↓
OUTPUT: Meta-verified conclusion
    + Quality score
    + Detected biases (if any)
    + Calibrated confidence
    + Warnings (if any)
```

---

## Success Metrics

```yaml
Layer_4_Targets:
  hallucination_catch_rate: ">95%"
    # Known-false test cases, % refused
  
  bias_detection_rate: ">70%"
    # Adversarial queries, % flagged
  
  confidence_calibration_error: "<0.15 Brier"
    # (predicted - actual)^2 averaged
  
  reasoning_quality_score: ">8/10"
    # Human eval, 50-query sample
  
  latency_p95: "<120s"
    # Time from trigger to output
```

---

## Integration Points

**MCP Tool Enhancement**:

```typescript
// NEW Layer 4 parameters
interface SequentialThinkingParams {
  // ... existing ...
  
  // Layer 4 additions
  verification_mode?: 'meta';
  quality_score?: number;        // 0-10
  detected_biases?: string[];
  should_escalate?: boolean;
}
```

**Decision Logic**:

```typescript
function select_layer(query: Query): Layer {
  // High-stakes or quality issues → Layer 4
  if (query.is_high_stakes || 
      confidence_dropped_below_0_6() ||
      backward_pass_failed() ||
      hypotheses_tied()) {
    return Layer.META;
  }
  // ... other layers ...
}
```

---

## 🔗 Related Rules

**Foundation**:
- `rules/17a-mcp-core-protocol.md` — MCP logic

**Companion**:
- `rules/18b-layer5-expert-reasoning.md` — Layer 5 specs
- `rules/18c-reasoning-verification.md` — Cross-verification
- `rules/18d-reasoning-integration.md` — Integration guide

**Support**:
 

---

**Status**: Phase 1 Complete | **Size**: <12KB ✅  
**Implementation**: Week 1-2 | **Next**: Layer 5 (18b)

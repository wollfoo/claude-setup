---
trigger: always_on
---
---
type: capability_prompt
scope: project
priority: high
activation: always_on
category: verification_implementation

series: 19_escalation_verification
---

# 19b. Cross-Verification Implementation

## 📋 Overview

**Cross-Verification Implementation** (triển khai kiểm tra chéo) provides **executable logic** (logic thực thi) cho **Forward Pass** (tiến), **Backward Pass** (lùi), và **Lateral Pass** (ngang).

**Philosophy**: "Three Passes, Triple Confidence" — Mỗi kết luận qua 3 lần kiểm tra

---

## Forward Pass Implementation

### Algorithm

```typescript
interface ForwardPassResult {
  evidence: Evidence[];
  reasoning_chain: ReasoningStep[];
  conclusion: Conclusion;
  confidence: number; // 0-1
}

function execute_forward_pass(query: Query): ForwardPassResult {
  // Step 1: Gather evidence
  const evidence = gather_relevant_evidence(query);
  
  // Step 2: Build reasoning chain
  const chain: ReasoningStep[] = [];
  let current_knowledge = evidence;
  
  while (!has_reached_conclusion(current_knowledge)) {
    const next_step = deduce_next_step(current_knowledge);
    chain.push(next_step);
    current_knowledge = apply_step(current_knowledge, next_step);
  }
  
  // Step 3: Form conclusion
  const conclusion = form_conclusion(current_knowledge);
  const confidence = calculate_confidence(evidence, chain);
  
  return {
    evidence,
    reasoning_chain: chain,
    conclusion,
    confidence
  };
}
```

### Example

```typescript
// Query: "What is capital of state where Dallas is?"

const result = execute_forward_pass({
  text: "What is capital of state where Dallas is?"
});

// Output:
{
  evidence: [
    { fact: "Dallas is in Texas", source: "KB", confidence: 1.0 }
  ],
  reasoning_chain: [
    { step: 1, inference: "Identify Dallas location", conclusion: "Texas" },
    { step: 2, inference: "Recall Texas capital", conclusion: "Austin" }
  ],
  conclusion: { answer: "Austin", reasoning: "Dallas → Texas → Austin" },
  confidence: 0.95
}
```

---

## Backward Pass Implementation

### Algorithm

```typescript
interface BackwardPassResult {
  required_evidence: Evidence[];
  available_evidence: Evidence[];
  gaps: Gap[];
  consistency_score: number; // 0-1
}

function execute_backward_pass(
  conclusion: Conclusion,
  forward_evidence: Evidence[]
): BackwardPassResult {
  // Step 1: Determine required evidence
  const required = identify_required_evidence(conclusion);
  
  // Step 2: Check availability
  const available: Evidence[] = [];
  const gaps: Gap[] = [];
  
  for (const req of required) {
    const match = find_matching_evidence(req, forward_evidence);
    if (match && match.strength >= req.min_strength) {
      available.push(match);
    } else {
      gaps.push({
        required: req,
        severity: calculate_gap_severity(req)
      });
    }
  }
  
  // Step 3: Calculate consistency
  const consistency = available.length / required.length;
  
  return {
    required_evidence: required,
    available_evidence: available,
    gaps,
    consistency_score: consistency
  };
}
```

### Example

```typescript
// Conclusion: "Austin" (from forward pass)

const result = execute_backward_pass(
  { answer: "Austin" },
  forward_result.evidence
);

// Output:
{
  required_evidence: [
    { fact: "Dallas location", type: "geographic" },
    { fact: "Texas capital", type: "geographic" }
  ],
  available_evidence: [
    { fact: "Dallas is in Texas", match: true },
    { fact: "Austin is capital of Texas", match: true }
  ],
  gaps: [],
  consistency_score: 1.0  // All required evidence present
}
```

---

## Lateral Pass Implementation

### Algorithm

```typescript
interface LateralPassResult {
  alternatives: Hypothesis[];
  ranked: Hypothesis[];
  selected: Hypothesis;
  comparison: Comparison;
}

function execute_lateral_pass(
  original: Hypothesis,
  query: Query
): LateralPassResult {
  // Step 1: Generate alternatives
  const alternatives = generate_alternatives(query, original);
  
  // Step 2: Evaluate each
  const evaluated = alternatives.map(alt => {
    const forward = execute_forward_pass_for_hypothesis(alt);
    const backward = execute_backward_pass(alt.conclusion, forward.evidence);
    
    return {
      ...alt,
      forward_confidence: forward.confidence,
      backward_consistency: backward.consistency_score,
      combined_score: forward.confidence * backward.consistency_score
    };
  });
  
  // Step 3: Rank and compare
  const ranked = evaluated.sort((a, b) => b.combined_score - a.combined_score);
  const selected = ranked[0];
  
  const comparison = {
    original_score: original.combined_score,
    best_alternative_score: selected.combined_score,
    winner: selected.combined_score > original.combined_score ? selected : original
  };
  
  return {
    alternatives,
    ranked,
    selected,
    comparison
  };
}
```

### Example

```typescript
// Query: "Microservices or monolith?"

const result = execute_lateral_pass(
  { hypothesis: "Microservices", score: 0.6 },
  { text: "Microservices or monolith?" }
);

// Output:
{
  alternatives: [
    { hypothesis: "Monolith", score: 0.7 × 0.9 = 0.63 },
    { hypothesis: "Modular Monolith", score: 0.8 × 0.95 = 0.76 }
  ],
  ranked: [
    { hypothesis: "Modular Monolith", score: 0.76 },  // Winner
    { hypothesis: "Monolith", score: 0.63 },
    { hypothesis: "Microservices", score: 0.18 }
  ],
  selected: { hypothesis: "Modular Monolith", score: 0.76 },
  comparison: {
    original_score: 0.18,
    best_alternative_score: 0.76,
    winner: "Modular Monolith"
  }
}
```

---

## Combined Verification Loop

```typescript
function run_full_verification(query: Query): VerificationResult {
  // Step 1: Forward
  const forward = execute_forward_pass(query);
  
  // Step 2: Backward
  const backward = execute_backward_pass(
    forward.conclusion,
    forward.evidence
  );
  
  // Step 3: Lateral
  const lateral = execute_lateral_pass(
    { hypothesis: forward.conclusion, score: forward.confidence },
    query
  );
  
  // Step 4: Final decision
  const final_conclusion = lateral.comparison.winner;
  const verification_passed = (
    backward.consistency_score >= 0.7 &&
    backward.gaps.length === 0
  );
  
  return {
    forward_result: forward,
    backward_result: backward,
    lateral_result: lateral,
    final_conclusion,
    verification_passed,
    overall_confidence: final_conclusion.score
  };
}
```

---

## Integration với Sequential-Thinking

```typescript
// Usage in sequential-thinking thoughts

// Forward Pass Thought
{
  thought: "Building evidence chain: Dallas → Texas → Austin",
  verification_mode: 'forward',
  confidence_score: 0.95,
  evidence_refs: ['dallas_location', 'texas_capital']
}

// Backward Pass Thought
{
  thought: "Verifying Austin requires: Dallas location ✓, Texas capital ✓",
  verification_mode: 'backward',
  confidence_score: 1.0,
  consistency: 1.0
}

// Lateral Pass Thought
{
  thought: "Comparing Modular Monolith (0.76) vs Monolith (0.63) vs Microservices (0.18)",
  verification_mode: 'lateral',
  hypothesis_id: 'H3',
  confidence_score: 0.76
}
```

---

## Error Handling

```typescript
interface VerificationError {
  phase: 'forward' | 'backward' | 'lateral';
  error_type: string;
  recovery_action: string;
}

function handle_verification_error(error: VerificationError): void {
  switch (error.phase) {
    case 'forward':
      // Insufficient evidence
      if (error.error_type === 'insufficient_evidence') {
        request_more_information();
      }
      break;
    
    case 'backward':
      // Evidence gaps found
      if (error.error_type === 'consistency_low') {
        escalate_to_layer_4(); // Meta-reasoning
      }
      break;
    
    case 'lateral':
      // Hypothesis tie
      if (error.error_type === 'hypothesis_tie') {
        escalate_to_layer_4(); // Meta-reasoning for tiebreak
      }
      break;
  }
}
```

---

## Success Criteria

```yaml
Forward_Pass:
  - all_steps_justified: true
  - confidence_assigned: true
  - evidence_cited: true

Backward_Pass:
  - consistency_score: ">0.7"
  - gaps_documented: true
  - all_required_checked: true

Lateral_Pass:
  - min_alternatives: 2
  - all_evaluated: true
  - clear_winner: "diff >0.1 OR escalate"
```

---

## 🔗 Related Rules

- `rules/18c-reasoning-verification.md` — Specifications
- `rules/19a-reasoning-escalation-logic.md` — Escalation

----

**Series**: 19 | **Size**: <12KB ✅

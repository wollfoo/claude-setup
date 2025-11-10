---
trigger: always_on
---
---
type: capability_prompt
scope: project
priority: critical
activation: on_demand
category: advanced_reasoning_layer5

---

# 18b. Layer 5 — Expert Reasoning Protocol

## 📋 Overview

**Layer 5 (Expert Reasoning)** (suy luận chuyên gia) provides **formal verification** (xác minh chính thức), **proof construction** (xây dựng chứng minh), và **rigorous validation** (xác thực nghiêm ngặt) cho tasks requiring mathematical/logical correctness.

**Philosophy**: "Prove, Don't Assume" — Every claim must be rigorously justified

**Part of**: Advanced Reasoning System (highest layer for formal correctness)

---

## Activation Triggers

```typescript
AUTO_ACTIVATE_LAYER_5:
  IF query.requires_formal_proof
     OR query.domain IN ['mathematics', 'security_audit', 'formal_specification']
     OR user_explicitly_requests_verification
     OR query.contains_keywords(['prove', 'proof', 'verify', 'theorem']):
    → ESCALATE to Layer 5
```

**Examples**:
- "Prove that quicksort is O(n log n) on average"
- "Verify our authentication flow is secure"
- "Formally specify the API contract"
- "Is this algorithm correct for all edge cases?"

---

## Core Components

### 1. Formal Notation

**Supported**:

```yaml
Mathematical:
  format: LaTeX notation
  use_for: Proofs, equations, theorems
  example: "∀x ∈ ℝ, x² ≥ 0"

Logical:
  format: First-order logic (FOL)
  use_for: Logical reasoning, specs
  example: "P(x) → Q(x)"

Computational:
  format: Big-O notation
  use_for: Algorithm analysis
  example: "T(n) = O(n log n)"

Verification:
  format: Hoare logic, temporal logic
  use_for: Program correctness
  example: "{P} C {Q}"
```

---

### 2. Proof Construction Protocol

```yaml
Step1_StateTheorem:
  format: "∀x ∈ S, P(x) → Q(x)"
  clarify:
    - assumptions: "List all"
    - domain: "Define S"
    - goal: "What to prove"

Step2_SelectStrategy:
  options:
    - direct: "Show P(x) → Q(x) directly"
    - contradiction: "Assume ¬Q(x), derive contradiction"
    - induction: "Base + inductive step"
    - construction: "Build object satisfying property"
  justify: "Why appropriate"

Step3_StepByStep:
  for_each_step:
    statement: "Mathematical claim"
    justification: "Axiom | Theorem | Previous"
    verification: "Check logical validity"
  ensure:
    - no_logical_leaps: true
    - each_step_follows: true

Step4_HandleEdgeCases:
  identify: "Boundaries, empty set, infinity"
  address_explicitly: "Show proof holds"

Step5_SearchCounterexamples:
  attempt: "Find cases where fails"
  if_found: "Refine theorem or fix error"
  if_none: "Strengthen confidence"

Step6_QED:
  conclude: "Therefore, proven"
  review:
    - completeness: "All cases?"
    - correctness: "Each step valid?"
    - clarity: "Reproducible?"
```

---

### 3. Verification Checklist

**Before Finalizing**:

```markdown
## Completeness
- [ ] All assumptions explicit & reasonable
- [ ] No logical leaps without justification
- [ ] All edge cases addressed
- [ ] Proof covers entire domain

## Correctness
- [ ] Each step follows via valid inference
- [ ] No circular reasoning
- [ ] Counterexamples searched
- [ ] Independent verification possible

## Clarity
- [ ] Notation consistent
- [ ] Reproducible by peer
- [ ] Key insights highlighted
- [ ] References precise
```

---

## Layer 5 Workflow

```
INPUT: Query requiring formal verification
    ↓
STEP 1: Formalize Problem
    ├─ Define domain, variables
    ├─ State assumptions explicitly
    └─ Express in formal notation
    ↓
STEP 2: Select Proof Strategy
    ├─ Evaluate options
    └─ Document rationale
    ↓
STEP 3: Construct Proof
    ├─ Step-by-step justifications
    ├─ Check rigor at each step
    └─ Handle edge cases
    ↓
STEP 4: Search Counterexamples
    ├─ Test boundaries
    ├─ If found: refine
    └─ If none: proceed
    ↓
STEP 5: Peer-Review Checklist
    ├─ Completeness ✓
    ├─ Correctness ✓
    └─ Clarity ✓
    ↓
OUTPUT: Formal proof
    + Verification status
    + Limitations/assumptions
    + Confidence level
```

---

## Example: Security Audit

**Task**: Verify authentication flow secure against token reuse

### 1. Formal Specification

**Theorem**: ∀ user ∈ Users, ∀ request ∈ Requests:

```
authenticated(user, request) → 
  valid_token(request.token) ∧ 
  token.user_id === user.id ∧
  ¬expired(request.token) ∧
  ¬used_before(request.token)
```

**Assumptions**:
- JWT library cryptographically secure
- Secret key not compromised
- System clock accurate

### 2. Proof Strategy

Direct verification via code inspection + logical analysis

### 3. Step-by-Step Verification

**Step 1**: Token validation

```typescript
// auth.ts:45
const decoded = verify_jwt(token, SECRET_KEY);
```
✅ JWT library performs signature verification

**Step 2**: User ID match

```typescript
// auth.ts:52
if (decoded.user_id !== user.id) throw UnauthorizedError();
```
✅ Explicit check before access

**Step 3**: Expiration

```typescript
// auth.ts:48
if (decoded.exp < Date.now() / 1000) throw TokenExpiredError();
```
✅ Prevents expired token use

**Step 4**: Reuse prevention

```typescript
// auth.ts:55
const nonce = await redis.get(`token:${decoded.jti}`);
if (nonce) throw TokenReusedError();
await redis.setex(`token:${decoded.jti}`, decoded.exp, '1');
```
✅ Redis stores nonces, prevents reuse

**Step 5**: No bypass

```typescript
// All routes enforce middleware
// No alternative paths skip auth
```
✅ Comprehensive coverage

### 4. Edge Cases

| Case | Handling | Status |
|------|----------|--------|
| Expired token | Rejected line 48 | ✅ |
| Mismatched user_id | Rejected line 52 | ✅ |
| No token | Rejected line 40 | ✅ |
| Reuse attempt | Rejected line 56 | ✅ |
| Forged token | Rejected line 45 | ✅ |

### 5. Counterexamples

**Attempted**:
- ❌ Reuse: Blocked by nonce
- ❌ Forgery: Blocked by signature
- ❌ Expired: Blocked by exp check
- ❌ Stolen: Blocked by user_id

**Result**: No counterexamples found

### 6. Conclusion

✅ **PROVEN**: Authentication flow verified secure against token reuse under stated assumptions.

**Limitations**:
- Assumes JWT library secure
- Assumes Redis available
- Assumes key management secure

**Confidence**: 0.95 (High, limited by external deps)

---

## Success Metrics

```yaml
Layer_5_Targets:
  formal_correctness: "100%"
    # Automated checkers, peer review
  
  edge_case_coverage: ">95%"
    # % identified cases addressed
  
  proof_completeness: "100%"
    # All steps justified
  
  peer_review_pass: ">90%"
    # Independent approval rate
  
  latency_p95: "<10min"
    # Trigger to output
```

---

## Integration Points

**MCP Tool Enhancement**:

```typescript
// NEW Layer 5 parameters
interface SequentialThinkingParams {
  // ... existing ...
  
  // Layer 5 additions
  formal_notation?: string;      // LaTeX, FOL, etc.
  proof_step_type?: 'axiom' | 'theorem' | 'lemma' | 'corollary';
  verification_status?: 'proven' | 'disproven' | 'unknown';
}
```

**Usage**:

```typescript
{
  thought: "Step 3: By induction, P(k) holds. Show P(k+1)...",
  thought_number: 8,
  total_thoughts: 12,
  formal_notation: 'latex',
  proof_step_type: 'lemma',
  verification_status: 'proven'
}
```

---

## 🔗 Related Rules

**Foundation**:
- `rules/17a-mcp-core-protocol.md` — MCP

**Companion**:
- `rules/18a-layer4-meta-reasoning.md` — Layer 4
- `rules/18c-reasoning-verification.md` — Cross-verify
- `rules/18d-reasoning-integration.md` — Integration

**Support**:
 

---

**Status**: Phase 1 Complete | **Size**: <12KB ✅  
**Implementation**: Week 1-2 | **Next**: Verification protocols (18c)

# VAGUE PATTERN DATABASE — Database các pattern mơ hồ
## Phase 3: Intent Disambiguation Pattern Repository

**Purpose** (Mục đích): Database tập trung các vague patterns, clarification questions, và inference rules cho Intent Disambiguator.

**Target Performance**: 30-80ms response time cho disambiguation process.

---

## 📊 DATABASE STRUCTURE

### Pattern Entry Format
```yaml
pattern_id: unique_identifier
pattern_string: "user's vague request"
base_confidence: 0.0-1.0
keywords: [list of keywords]
negative_indicators: [indicators lowering confidence]
clarification_questions: [questions to ask]
inference_rules:
  - condition: "context condition"
    condition_type: project | session | file | behavioral
    confidence_boost: +0.05 to +0.20
    inferred_domain: frontend | backend | testing | documentation | devops
    inferred_focus: performance | quality | structure | debugging | features
```

---

## 🎯 VAGUE PATTERNS CATALOG

### Pattern 1: "improve code" (Cải thiện mã)

**Pattern ID**: `improve_code`
**Base Confidence**: 0.50 (50%)
**Category**: Code Quality

**Keywords**:
- `improve`, `better`, `enhance`, `optimize`, `refactor`, `code`

**Negative Indicators** (giảm confidence):
- `specific`, `exact`, `which`, `what`, `how`

**Clarification Questions**:
1. "Which aspect would you like to improve?"
   - **Options**: performance | quality | structure | readability | maintainability
2. "Which file or module needs improvement?"
3. "What specific issue are you trying to solve?"

**Inference Rules**:

```yaml
rule_1:
  condition: project_is_frontend_heavy
  condition_type: project
  confidence_boost: +0.10
  inferred_domain: frontend
  inferred_focus: quality
  reasoning: "Frontend-heavy project → likely UI code quality improvement"

rule_2:
  condition: recent_performance_issues
  condition_type: session
  confidence_boost: +0.15
  inferred_focus: performance
  reasoning: "Recent performance problems → likely performance optimization"

rule_3:
  condition: recent_refactoring_tasks
  condition_type: session
  confidence_boost: +0.12
  inferred_focus: structure
  reasoning: "Recent refactoring activity → likely structural improvement"
```

**Example Scenarios**:

```typescript
Input: "improve code"

Scenario 1 - Ask (Low Confidence):
  base_confidence: 0.50
  context_boost: 0.00 (no matching rules)
  final_confidence: 0.50
  decision: ASK
  question: "Which aspect would you like to improve? (performance|quality|structure)"

Scenario 2 - Assume (Medium Confidence):
  base_confidence: 0.50
  context_boost: +0.10 (project_is_frontend_heavy)
  final_confidence: 0.60
  decision: ASSUME
  inferred_domain: frontend
  inferred_focus: quality

Scenario 3 - Proceed (High Confidence):
  base_confidence: 0.50
  context_boost: +0.25 (performance_issues + refactoring_tasks)
  final_confidence: 0.75
  decision: PROCEED
  inferred_focus: performance + structure
```

---

### Pattern 2: "fix app" (Sửa lỗi ứng dụng)

**Pattern ID**: `fix_app`
**Base Confidence**: 0.45 (45%)
**Category**: Debugging

**Keywords**:
- `fix`, `bug`, `error`, `issue`, `problem`, `broken`, `app`, `application`

**Negative Indicators**:
- `specific`, `exact`, `which`, `where`, `when`

**Clarification Questions**:
1. "What is broken?"
   - **Options**: UI | API | deployment | database | authentication | performance
2. "What error message are you seeing?"
3. "When did the issue start occurring?"

**Inference Rules**:

```yaml
rule_1:
  condition: recent_errors_in_logs
  condition_type: session
  confidence_boost: +0.20
  inferred_focus: debugging
  reasoning: "Recent errors detected → likely debugging task"

rule_2:
  condition: recent_ui_changes
  condition_type: file
  confidence_boost: +0.15
  inferred_domain: frontend
  inferred_focus: debugging
  reasoning: "Recent UI file changes → likely UI bug"

rule_3:
  condition: recent_api_changes
  condition_type: file
  confidence_boost: +0.15
  inferred_domain: backend
  inferred_focus: debugging
  reasoning: "Recent API changes → likely API bug"
```

**Example Scenarios**:

```typescript
Input: "fix app"

Scenario 1 - Ask:
  base_confidence: 0.45
  context_boost: 0.00
  final_confidence: 0.45
  decision: ASK
  question: "What is broken? (UI|API|deployment|database)"

Scenario 2 - Assume:
  base_confidence: 0.45
  context_boost: +0.15 (recent_ui_changes)
  final_confidence: 0.60
  decision: ASSUME
  inferred_domain: frontend
  inferred_focus: debugging

Scenario 3 - Proceed:
  base_confidence: 0.45
  context_boost: +0.35 (recent_errors + recent_api_changes)
  final_confidence: 0.80
  decision: PROCEED
  inferred_domain: backend
  inferred_focus: debugging
```

---

### Pattern 3: "make better" (Làm tốt hơn)

**Pattern ID**: `make_better`
**Base Confidence**: 0.40 (40%)
**Category**: General Improvement

**Keywords**:
- `make`, `better`, `improve`, `enhance`, `upgrade`, `modernize`

**Negative Indicators**:
- `specific`, `exact`, `which`, `what`, `how`

**Clarification Questions**:
1. "What aspect needs to be better?"
   - **Options**: performance | UX | code quality | security | reliability
2. "Which component or feature are you focusing on?"
3. "What does 'better' mean in this context?"

**Inference Rules**:

```yaml
rule_1:
  condition: near_deadline
  condition_type: behavioral
  confidence_boost: +0.15
  inferred_focus: quick_fix
  reasoning: "Deadline pressure → likely quick improvement"

rule_2:
  condition: project_is_new
  condition_type: project
  confidence_boost: +0.10
  inferred_focus: quality
  reasoning: "New project → likely establishing quality standards"
```

**Example Scenarios**:

```typescript
Input: "make better"

Scenario 1 - Ask:
  base_confidence: 0.40
  context_boost: 0.00
  final_confidence: 0.40
  decision: ASK
  question: "What aspect needs to be better? (performance|UX|quality|security)"

Scenario 2 - Assume:
  base_confidence: 0.40
  context_boost: +0.15 (near_deadline)
  final_confidence: 0.55
  decision: ASSUME (borderline)
  inferred_focus: quick_fix

Scenario 3 - Proceed:
  base_confidence: 0.40
  context_boost: +0.30 (near_deadline + project_is_new)
  final_confidence: 0.70
  decision: PROCEED
  inferred_focus: quick_fix + quality
```

---

### Pattern 4: "optimize the app" (Tối ưu ứng dụng)

**Pattern ID**: `optimize_app`
**Base Confidence**: 0.55 (55%)
**Category**: Performance Optimization

**Keywords**:
- `optimize`, `performance`, `speed`, `faster`, `slow`, `app`, `application`

**Negative Indicators**:
- `specific`, `exact`, `which`, `where`

**Clarification Questions**:
1. "Which part needs optimization?"
   - **Options**: frontend | backend | database | API | caching
2. "What performance issue are you experiencing?"
3. "What is your target performance metric?"

**Inference Rules**:

```yaml
rule_1:
  condition: recent_backend_files
  condition_type: file
  confidence_boost: +0.15
  inferred_domain: backend
  inferred_focus: performance
  reasoning: "Recent backend work → likely backend optimization"

rule_2:
  condition: recent_frontend_files
  condition_type: file
  confidence_boost: +0.15
  inferred_domain: frontend
  inferred_focus: performance
  reasoning: "Recent frontend work → likely UI performance"

rule_3:
  condition: recent_database_changes
  condition_type: file
  confidence_boost: +0.18
  inferred_domain: backend
  inferred_focus: database_optimization
  reasoning: "Recent database changes → likely query optimization"
```

**Example Scenarios**:

```typescript
Input: "optimize the app"

Scenario 1 - Ask:
  base_confidence: 0.55
  context_boost: 0.00
  final_confidence: 0.55
  decision: ASSUME (borderline)
  question: "Which part? (frontend|backend|database)"

Scenario 2 - Assume:
  base_confidence: 0.55
  context_boost: +0.15 (recent_backend_files)
  final_confidence: 0.70
  decision: PROCEED
  inferred_domain: backend
  inferred_focus: performance

Scenario 3 - Proceed (High Confidence):
  base_confidence: 0.55
  context_boost: +0.33 (backend_files + database_changes)
  final_confidence: 0.88
  decision: PROCEED
  inferred_domain: backend
  inferred_focus: database_optimization
```

---

### Pattern 5: "update code" (Cập nhật mã)

**Pattern ID**: `update_code`
**Base Confidence**: 0.48 (48%)
**Category**: Code Modification

**Keywords**:
- `update`, `change`, `modify`, `edit`, `code`

**Negative Indicators**:
- `specific`, `exact`, `which`, `what`, `where`

**Clarification Questions**:
1. "What do you want to update?"
   - **Options**: dependencies | features | logic | styling | configuration
2. "Which file or module needs updating?"
3. "What specific change are you making?"

**Inference Rules**:

```yaml
rule_1:
  condition: recent_dependency_updates
  condition_type: session
  confidence_boost: +0.12
  inferred_focus: dependencies
  reasoning: "Recent dependency work → likely dependency update"

rule_2:
  condition: recent_feature_additions
  condition_type: session
  confidence_boost: +0.15
  inferred_focus: features
  reasoning: "Recent feature work → likely feature update"
```

**Example Scenarios**:

```typescript
Input: "update code"

Scenario 1 - Ask:
  base_confidence: 0.48
  context_boost: 0.00
  final_confidence: 0.48
  decision: ASK
  question: "What do you want to update? (dependencies|features|logic)"

Scenario 2 - Assume:
  base_confidence: 0.48
  context_boost: +0.12 (recent_dependency_updates)
  final_confidence: 0.60
  decision: ASSUME
  inferred_focus: dependencies

Scenario 3 - Proceed:
  base_confidence: 0.48
  context_boost: +0.27 (dependencies + features)
  final_confidence: 0.75
  decision: PROCEED
  inferred_focus: dependencies + features
```

---

## 🎨 CONFIDENCE THRESHOLD SYSTEM

### Three-Tier Decision Making

**Tier 1: ASK** (confidence < 0.55)
- **Action**: Request user clarification
- **Reasoning**: Too ambiguous to infer intent safely
- **User Experience**: Ask specific question with options
- **Example**: "improve code" → "Which aspect? (performance|quality|structure)"

**Tier 2: ASSUME** (confidence 0.55-0.69)
- **Action**: Make smart assumption based on context
- **Reasoning**: Moderate confidence from context signals
- **User Experience**: Proceed with assumption, explain reasoning
- **Example**: "improve code" + recent_performance_issues → assume performance optimization

**Tier 3: PROCEED** (confidence ≥ 0.70)
- **Action**: Proceed confidently with inferred intent
- **Reasoning**: Strong confidence from multiple context signals
- **User Experience**: Execute task with high certainty
- **Example**: "optimize app" + recent_backend_files + database_changes → backend database optimization

---

## 📈 CONFIDENCE BOOST CALCULATION

### Boost Magnitude Guidelines

**Small Boost** (+0.05 to +0.10):
- Single weak context signal
- Indirect inference
- Example: `project_is_new` → +0.10

**Medium Boost** (+0.10 to +0.15):
- Strong single context signal
- Direct inference
- Example: `recent_backend_files` → +0.15

**Large Boost** (+0.15 to +0.20):
- Very strong context signal
- High confidence inference
- Example: `recent_errors_in_logs` → +0.20

**Maximum Total Boost**: +0.30 (capped to prevent over-confidence)

---

## 🔍 CONTEXT CONDITION TYPES

### Project-Level Conditions
```yaml
project_is_frontend_heavy:
  check: projectContext.primary_domain === 'frontend'
  boost: +0.10

project_is_backend_heavy:
  check: projectContext.primary_domain === 'backend'
  boost: +0.10

project_is_new:
  check: projectContext.age_months < 3
  boost: +0.10
```

### Session-Level Conditions
```yaml
recent_errors_in_logs:
  check: sessionContext.recent_tasks includes 'error|bug|fix'
  boost: +0.20

recent_performance_issues:
  check: sessionContext.recent_tasks includes 'slow|performance|optimize'
  boost: +0.15

recent_refactoring_tasks:
  check: sessionContext.recent_tasks includes 'refactor|improve|clean'
  boost: +0.12
```

### File-Level Conditions
```yaml
recent_backend_files:
  check: recently_modified_files includes 'server|api|database|controller|model'
  boost: +0.15

recent_frontend_files:
  check: recently_modified_files includes 'component|page|.vue|.jsx|.tsx'
  boost: +0.15

recent_database_changes:
  check: recently_modified_files includes 'database|migration|schema'
  boost: +0.18
```

### Behavioral Conditions
```yaml
near_deadline:
  check: recent_tasks.length > 5 AND session_duration_minutes < 60
  boost: +0.15
  reasoning: "High task frequency in short time = deadline pressure"
```

---

## 🎯 PATTERN EXPANSION GUIDELINES

### Adding New Patterns

**Step 1: Identify Vague Phrase**
- Listen for user requests that lack specificity
- Examples: "clean up", "reorganize", "simplify"

**Step 2: Define Base Confidence**
- Very vague (3+ interpretations): 0.35-0.45
- Moderately vague (2 interpretations): 0.45-0.55
- Slightly vague (1 interpretation): 0.55-0.65

**Step 3: List Keywords**
- Primary keywords (must match ≥2)
- Secondary keywords (optional)

**Step 4: Define Clarification Questions**
- Ask specific options (not open-ended)
- Provide 3-5 common options
- Use domain-specific language

**Step 5: Create Inference Rules**
- Identify context signals
- Assign confidence boosts
- Define inferred domain/focus

---

## 📊 PERFORMANCE TARGETS

**Response Time**: 30-80ms for disambiguation process

**Breakdown**:
```yaml
pattern_detection: 5-10ms
context_extraction: 10-20ms
inference_application: 10-30ms
decision_making: 5-10ms
clarification_generation: 5-10ms

total_target: 35-80ms (average: 55ms)
```

**Cache Performance**:
- Cache hit rate target: ≥70%
- Cache hit latency: <5ms
- Cache miss latency: 35-80ms

**Accuracy Targets**:
- Pattern detection accuracy: ≥95%
- Inference accuracy: ≥85%
- User satisfaction with clarifications: ≥80%

---

## 🔗 INTEGRATION WITH PHASE 1+2

### Integration Flow

```
User Request
    ↓
Phase 1: Quick Filter (4.2ms avg)
    ├─ High confidence (≥0.85) → Route to specialist
    ↓
Phase 3: Intent Disambiguation (30-80ms)
    ├─ Vague pattern detected
    ├─ Confidence < 0.55 → ASK user
    ├─ Confidence 0.55-0.69 → ASSUME + notify
    ├─ Confidence ≥ 0.70 → PROCEED
    ↓
Phase 2: Context Analysis (20-50ms)
    ├─ Apply context boost
    ├─ Final specialist selection
    ↓
Execute Task
```

### Fallback Strategy

```yaml
if Phase_1_fails AND request_is_vague:
  activate_Phase_3_disambiguation()

if Phase_3_confidence < 0.55:
  ask_user_clarification()

if user_provides_clarification:
  rerun_Phase_1_with_clarified_request()

if Phase_3_confidence >= 0.70:
  proceed_to_Phase_2_context_analysis()
```

---

**Database Status**: ✅ Complete with 5 core patterns
**Pattern Coverage**: ~40-50% of vague requests (initial estimate)
**Expansion Potential**: 20+ additional patterns identified
**Target**: 80%+ vague request coverage by end of Phase 3

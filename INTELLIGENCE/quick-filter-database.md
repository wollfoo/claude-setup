# QUICK FILTER DATABASE — Cơ sở dữ liệu lọc nhanh
## High-Confidence Pattern Matching for Sub-10ms Detection

**Purpose**: Instant specialist activation for clear, unambiguous requests

---

## 🎯 High-Confidence Patterns (Mẫu tin cậy cao)

### **Frontend Domain** (Lĩnh vực giao diện)

```yaml
exact_match_patterns:
  confidence: 0.85-0.95

  component_creation:
    keywords: [
      "create component",
      "build component",
      "generate component",
      "new component",
      "add component"
    ]
    specialist: "frontend-developer"
    base_confidence: 0.88
    flags: ["--magic", "--c7"]

  react_specific:
    keywords: [
      "create react",
      "build react",
      "react component",
      "jsx component",
      "tsx component"
    ]
    specialist: "react-component-architect"
    base_confidence: 0.92
    flags: ["--magic", "--c7"]

  vue_specific:
    keywords: [
      "create vue",
      "build vue",
      "vue component",
      "sfc component",
      "composition api"
    ]
    specialist: "vue-component-architect"
    base_confidence: 0.90
    flags: ["--magic", "--c7"]

  ui_styling:
    keywords: [
      "style component",
      "add css",
      "tailwind styling",
      "responsive design",
      "make responsive"
    ]
    specialist: "frontend-developer"
    base_confidence: 0.86
    flags: ["--magic"]

  accessibility:
    keywords: [
      "accessible component",
      "aria labels",
      "wcag compliance",
      "screen reader",
      "keyboard navigation"
    ]
    specialist: "accessibility-specialist"
    base_confidence: 0.90
    flags: ["--c7"]
```

---

### **Backend Domain** (Lĩnh vực máy chủ)

```yaml
exact_match_patterns:

  api_creation:
    keywords: [
      "create api",
      "build api",
      "implement api",
      "new endpoint",
      "add endpoint"
    ]
    specialist: "backend-developer"
    base_confidence: 0.90
    flags: ["--seq", "--c7"]

  rest_api:
    keywords: [
      "rest api",
      "restful api",
      "rest endpoint",
      "crud api",
      "http endpoint"
    ]
    specialist: "backend-developer"
    base_confidence: 0.92
    flags: ["--seq", "--c7"]

  graphql:
    keywords: [
      "graphql",
      "graphql schema",
      "graphql resolver",
      "graphql query",
      "graphql mutation"
    ]
    specialist: "graphql-architect"
    base_confidence: 0.94
    flags: ["--seq", "--c7"]

  database:
    keywords: [
      "database query",
      "sql query",
      "optimize query",
      "database schema",
      "create migration"
    ]
    specialist: "database-optimizer"
    base_confidence: 0.88
    flags: ["--seq"]

  authentication:
    keywords: [
      "implement auth",
      "add authentication",
      "oauth setup",
      "jwt auth",
      "login system"
    ]
    specialist: "backend-developer"
    base_confidence: 0.87
    flags: ["--seq", "--c7"]
    mcp: ["context7", "sequential-thinking"]
```

---

### **Testing & Quality** (Kiểm thử & Chất lượng)

```yaml
exact_match_patterns:

  testing:
    keywords: [
      "write test",
      "create test",
      "unit test",
      "integration test",
      "e2e test"
    ]
    specialist: "test-automator"
    base_confidence: 0.89
    flags: ["--play"]
    mcp: ["playwright", "sequential-thinking"]

  debugging:
    keywords: [
      "fix bug",
      "debug issue",
      "troubleshoot",
      "find error",
      "resolve error"
    ]
    specialist: "debugger"
    base_confidence: 0.85
    flags: ["--think", "--seq"]
    mcp: ["sequential-thinking"]

  code_review:
    keywords: [
      "review code",
      "code review",
      "check quality",
      "audit code",
      "analyze code"
    ]
    specialist: "code-reviewer"
    base_confidence: 0.90
    flags: ["--seq"]

  performance:
    keywords: [
      "optimize performance",
      "improve speed",
      "make faster",
      "reduce latency",
      "performance issue"
    ]
    specialist: "performance-engineer"
    base_confidence: 0.87
    flags: ["--think", "--seq"]
    mcp: ["sequential-thinking", "playwright"]
```

---

### **Documentation** (Tài liệu)

```yaml
exact_match_patterns:

  documentation:
    keywords: [
      "write docs",
      "create documentation",
      "update readme",
      "api docs",
      "write guide"
    ]
    specialist: "technical-documentation-specialist"
    base_confidence: 0.92
    flags: ["--c7"]
    mcp: ["context7"]

  api_documentation:
    keywords: [
      "document api",
      "openapi spec",
      "swagger docs",
      "api reference",
      "endpoint docs"
    ]
    specialist: "api-documenter"
    base_confidence: 0.94
    flags: ["--c7"]
```

---

### **DevOps & Infrastructure** (Vận hành & Hạ tầng)

```yaml
exact_match_patterns:

  deployment:
    keywords: [
      "deploy app",
      "setup deployment",
      "ci/cd pipeline",
      "configure deployment",
      "automate deploy"
    ]
    specialist: "deployment-engineer"
    base_confidence: 0.88
    flags: ["--seq", "--safe-mode"]

  docker:
    keywords: [
      "create dockerfile",
      "docker container",
      "containerize app",
      "docker compose",
      "build image"
    ]
    specialist: "devops-infrastructure-specialist"
    base_confidence: 0.90
    flags: ["--seq"]

  kubernetes:
    keywords: [
      "kubernetes",
      "k8s deployment",
      "helm chart",
      "kubectl",
      "pod config"
    ]
    specialist: "devops-infrastructure-specialist"
    base_confidence: 0.91
    flags: ["--seq", "--c7"]
```

---

## 🔍 Pattern Matching Logic (Logic khớp mẫu)

### **Exact Match Priority** (Ưu tiên khớp chính xác)

```yaml
matching_algorithm:

  step_1_normalization:
    - convert_to_lowercase()
    - remove_punctuation()
    - trim_whitespace()

    example:
      input: "Create React Component!"
      normalized: "create react component"

  step_2_exact_match:
    - check_database_patterns()
    - return_first_match_if_confidence_>=_0.85

    example:
      normalized: "create react component"
      match: "create react" → react-component-architect
      confidence: 0.92
      result: INSTANT ACTIVATION (skip full analysis)

  step_3_partial_match:
    - if_no_exact_match: check_keyword_combinations()
    - boost_confidence_for_multiple_keyword_hits()

    example:
      normalized: "build accessible button component"
      keywords: ["build", "accessible", "component"]
      matches:
        - "build component" → 0.88
        - "accessible component" → 0.90
      combined_confidence: max(0.88, 0.90) + 0.03 = 0.93
      specialist: "accessibility-specialist"

  step_4_fallback:
    - if_confidence_<_0.85: proceed_to_full_analysis()
    - reason: "Quick filter inconclusive"
```

---

## ⚡ Performance Optimization (Tối ưu hiệu suất)

### **Hash-Based Lookup** (Tra cứu dựa trên hash)

```yaml
data_structure:

  pattern_hash_map:
    structure: "HashMap<String, PatternMetadata>"

    key: "normalized_keyword_phrase"
    value:
      specialist: "agent_name"
      confidence: float
      flags: ["--flag1", "--flag2"]
      mcp: ["server1", "server2"]

    complexity: "O(1) average case"

    example:
      hash_map = {
        "create react component": {
          specialist: "react-component-architect",
          confidence: 0.92,
          flags: ["--magic", "--c7"],
          mcp: ["magic", "context7"]
        },
        "fix bug": {
          specialist: "debugger",
          confidence: 0.85,
          flags: ["--think", "--seq"],
          mcp: ["sequential-thinking"]
        }
      }
```

---

### **Prefix Trie for Partial Matches** (Cây tiền tố cho khớp một phần)

```yaml
trie_structure:

  purpose: "Fast prefix matching for incomplete phrases"

  example_trie:
    root
    ├── "create"
    │   ├── "component" → [frontend-developer: 0.88]
    │   ├── "react" → [react-component-architect: 0.92]
    │   └── "api" → [backend-developer: 0.90]
    ├── "fix"
    │   └── "bug" → [debugger: 0.85]
    └── "write"
        ├── "test" → [test-automator: 0.89]
        └── "docs" → [technical-documentation-specialist: 0.92]

  search_complexity: "O(k) where k = keyword length"

  usage:
    input: "create re"
    trie_search: finds "create react" prefix
    autocomplete_suggestion: "Did you mean 'create react component'?"
    specialist_hint: "react-component-architect (0.92)"
```

---

## 📊 Confidence Boosting Rules (Quy tắc tăng điểm tin cậy)

```yaml
boost_scenarios:

  multiple_keyword_match:
    condition: "2+ keywords from same pattern"
    boost: +0.03

    example:
      input: "create accessible react component"
      matches: ["create react", "accessible component"]
      base: 0.92
      boost: +0.03
      final: 0.95

  tech_stack_confirmation:
    condition: "keyword + known project tech stack"
    boost: +0.05

    example:
      project_stack: "React, TypeScript"
      input: "create component"
      base: 0.88
      boost: +0.05 (React project)
      final: 0.93

  domain_continuity:
    condition: "same domain as last 2+ tasks"
    boost: +0.04

    example:
      recent_tasks: [frontend, frontend, frontend]
      input: "add button"
      base: 0.82
      boost: +0.04 (continuity)
      final: 0.86

  urgency_keywords:
    condition: "contains 'urgent', 'critical', 'production'"
    boost: +0.02
    note: "Don't boost confidence, but prioritize execution"

    example:
      input: "fix critical production bug"
      base: 0.85
      boost: +0.02
      final: 0.87
      priority: HIGH (due to "critical production")
```

---

## 🚫 Anti-Pattern Detection (Phát hiện phản mẫu)

```yaml
exclude_patterns:

  too_vague:
    keywords: [
      "improve this",
      "make better",
      "optimize",
      "fix it",
      "help me"
    ]
    action: "skip quick filter → full analysis"
    reason: "Insufficient context for instant decision"

  ambiguous_domain:
    keywords: [
      "improve performance" (could be frontend OR backend),
      "add feature" (need more context),
      "refactor code" (which code?)
    ]
    action: "skip quick filter → multi-signal analysis"

  multi_domain:
    condition: "keywords from 3+ different domains"
    action: "skip quick filter → Wave mode evaluation"

    example:
      input: "build full-stack app with auth and tests"
      domains: [frontend, backend, security, testing]
      decision: "Too complex for quick filter → delegate to multi-agent system"
```

---

## 📈 Success Metrics (Chỉ số thành công)

```yaml
performance_kpis:

  speed:
    - quick_filter_time: <10ms (95th percentile)
    - cache_hit_rate: >85%
    - instant_activation_rate: >60% of total requests

  accuracy:
    - quick_filter_accuracy: >92%
    - false_positive_rate: <5%
    - confidence_calibration: ±0.03 vs actual outcome

  coverage:
    - patterns_in_database: 100+ high-confidence patterns
    - domains_covered: 12+ specialist domains
    - languages_supported: all major frameworks
```

---

## 🔄 Maintenance & Updates (Bảo trì & Cập nhật)

```yaml
update_schedule:

  weekly:
    - review_failed_quick_filters()
    - add_new_high_confidence_patterns()
    - adjust_confidence_scores_based_on_data()

  monthly:
    - comprehensive_accuracy_audit()
    - retire_low_performing_patterns()
    - expand_synonym_database()

  quarterly:
    - major_pattern_database_overhaul()
    - performance_optimization_review()
    - new_specialist_integration()
```

---

## 📝 Examples (Ví dụ minh họa)

### **Example 1: Instant Hit** (Khớp ngay lập tức)
```yaml
input: "create React button component"
normalized: "create react button component"

quick_filter_execution:
  time: 3ms

  step_1_hash_lookup:
    key: "create react component"
    match: FOUND
    confidence: 0.92

  step_2_boost_check:
    keyword_count: 3 (create, react, component)
    boost: +0.03
    final_confidence: 0.95

  step_3_decision:
    threshold: 0.85
    result: 0.95 >= 0.85 → INSTANT ACTIVATION
    specialist: "react-component-architect"
    flags: ["--magic", "--c7"]
    skip_full_analysis: true

outcome: ✅ Activated in 3ms (vs 150ms for full analysis)
```

---

### **Example 2: Partial Match** (Khớp một phần)
```yaml
input: "build accessible navigation menu"
normalized: "build accessible navigation menu"

quick_filter_execution:
  time: 6ms

  step_1_hash_lookup:
    exact_match: NOT FOUND

  step_2_trie_search:
    prefix: "build accessible"
    matches: ["accessible component"]
    confidence: 0.90

  step_3_keyword_combination:
    keywords: ["build", "accessible", "navigation"]
    domains: [frontend, accessibility]
    combined_confidence: 0.88

  step_4_decision:
    threshold: 0.85
    result: 0.88 >= 0.85 → ACTIVATE
    specialists: ["accessibility-specialist", "frontend-developer"]
    flags: ["--magic", "--c7"]

outcome: ✅ Activated in 6ms (multi-specialist coordination)
```

---

### **Example 3: Quick Filter Miss** (Lọc nhanh không khớp)
```yaml
input: "improve this code"
normalized: "improve this code"

quick_filter_execution:
  time: 4ms

  step_1_vague_pattern_check:
    pattern: "improve this"
    category: "too_vague"
    action: SKIP_QUICK_FILTER

  step_2_fallback:
    reason: "Insufficient context"
    next_stage: "Full 8-Step Analysis"
    expected_time: ~150ms

  step_3_full_analysis:
    [proceeds to detection-engine.md flow]

outcome: ⚠️ Quick filter bypassed → Full analysis required
```

---

## 🎯 Integration Points (Điểm tích hợp)

```yaml
integration_with_detection_engine:

  flow:
    user_request
      ↓
    [Quick Pre-Filter] <10ms
      ↓
    if confidence >= 0.85:
      → INSTANT ACTIVATION ✓
    else:
      → Full 8-Step Analysis (detection-engine.md)

  data_sharing:
    - quick_filter_result: passed to full analysis as hint
    - partial_matches: used to boost domain scoring
    - failed_patterns: logged for pattern expansion
```

---

**Status**: ✅ Ready for Implementation
**Expected Impact**: +10% activation rate, 60% requests <10ms
**Risk Level**: Low (fallback to full analysis always available)

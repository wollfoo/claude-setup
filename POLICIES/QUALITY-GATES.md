# QUALITY GATES — Framework Kiểm soát Chất lượng
## 8-Step Validation Framework v2.0

**Purpose**: Đảm bảo chất lượng cao trước khi đánh dấu hoàn tất
**SSOT Status**: ⭐ Authoritative for validation criteria

---

## 🎯 CORE PRINCIPLES (Nguyên tắc Cốt lõi)

### Prevention > Detection > Correction
- Build quality in (không test sau)
- Automated validation (consistency + reliability)
- Evidence-based decisions (metrics + data)
- Continuous monitoring (phát hiện sớm)

### Quality Standards
```yaml
non_negotiable:
  - Syntax must be valid
  - No type errors in typed languages
  - Critical paths must have tests
  - No secrets in logs/commits

recommended:
  - Lint rules compliance
  - Performance benchmarks met
  - Documentation complete
  - Integration tests pass

nice_to_have:
  - Advanced optimization
  - Comprehensive edge case coverage
  - Detailed performance profiling
```

---

## ✅ 8-STEP VALIDATION CYCLE (MANDATORY)

### Gate 1: Syntax Validation
```yaml
purpose: Verify code is syntactically correct
tools:
  - Language parsers (built-in)
  - Context7 validation (MCP)
  - Intelligent syntax suggestions

checks:
  - Valid syntax per language spec
  - Proper import/export statements
  - Bracket/parenthesis matching
  - String quote consistency

pass_criteria:
  - Parser returns no errors
  - All brackets/quotes balanced
  - Imports resolve correctly

fail_action:
  - Report syntax errors with line numbers
  - Suggest corrections
  - BLOCK completion until fixed

ai_integration:
  - Context7: Language-specific validation
  - Sequential: Complex syntax analysis
```

### Gate 2: Type Validation
```yaml
purpose: Ensure type compatibility and correctness
tools:
  - TypeScript compiler (tsc)
  - Python type checker (mypy)
  - Go type checker (go vet)
  - Sequential MCP for analysis

checks:
  - Type annotations correct
  - Function signatures match
  - Variable types consistent
  - Generic types properly used

pass_criteria:
  - Type checker returns 0 errors
  - Or justified exceptions documented

fail_action:
  - Report type errors with context
  - Suggest type fixes
  - BLOCK for critical type errors
  - WARN for minor issues

ai_integration:
  - Sequential: Type compatibility analysis
  - Context7: Framework type patterns
```

### Gate 3: Lint Validation
```yaml
purpose: Code quality and style compliance
tools:
  - ESLint (JavaScript/TypeScript)
  - Pylint/Flake8 (Python)
  - RuboCop (Ruby)
  - Context7 for quality rules

checks:
  - Code style consistency
  - Unused variables/imports
  - Complexity metrics (cyclomatic)
  - Best practice violations

pass_criteria:
  - Linter score ≥ 8.0/10
  - Or justified exceptions documented
  - No critical violations

fail_action:
  - Report violations with severity
  - Suggest auto-fixes where possible
  - BLOCK for critical violations
  - WARN for minor style issues

ai_integration:
  - Context7: Project-specific rules
  - Sequential: Refactoring suggestions
```

### Gate 4: Test Validation (Critical)
```yaml
purpose: Verify functionality through tests
tools:
  - Unit test frameworks (Jest, pytest, RSpec)
  - Integration test suites
  - Playwright E2E (MCP)
  - Coverage analysis tools

checks:
  - Unit tests pass (≥80% coverage)
  - Integration tests pass (≥70% coverage)
  - E2E tests pass for critical paths
  - No test failures or skips

pass_criteria:
  - All tests pass
  - Coverage thresholds met
  - No failing assertions
  - Critical paths fully tested

fail_action:
  - Report failing tests with details
  - Show coverage gaps
  - BLOCK completion until tests pass
  - Suggest test improvements

ai_integration:
  - Playwright: E2E test execution + visual regression
  - Sequential: Test strategy analysis
  - Context7: Testing patterns
```

### Gate 5: Performance Validation
```yaml
purpose: Ensure no performance regressions
tools:
  - Benchmarking frameworks
  - Profiling tools
  - Sequential MCP for analysis
  - Performance monitoring

checks:
  - Response time within budgets
  - Memory usage acceptable
  - CPU usage reasonable
  - No performance regressions

pass_criteria:
  - API response time <200ms (backend)
  - Page load time <3s on 3G (frontend)
  - No memory leaks detected
  - CPU usage <30% average

fail_action:
  - Report performance issues
  - Suggest optimizations
  - WARN for minor regressions
  - BLOCK for critical regressions (>50%)

ai_integration:
  - Sequential: Bottleneck analysis
  - Playwright: Real-world performance metrics
  - Context7: Optimization patterns
```

### Gate 6: Documentation Validation
```yaml
purpose: Ensure changes are documented
tools:
  - Doc linters
  - Context7 patterns (MCP)
  - Completeness checkers
  - Accuracy verification

checks:
  - Key changes documented
  - API docs updated (if applicable)
  - README updated (if applicable)
  - Comments for complex logic

pass_criteria:
  - All public APIs documented
  - Breaking changes noted
  - Migration guides provided (if needed)
  - Code comments for complexity >5

fail_action:
  - List missing documentation
  - Suggest doc improvements
  - WARN for missing docs
  - BLOCK for undocumented public APIs

ai_integration:
  - Context7: Documentation patterns + style guides
  - Sequential: Content completeness analysis
```

### Gate 7: Integration Validation
```yaml
purpose: Verify integration with existing system
tools:
  - Integration test suites
  - Playwright E2E (MCP)
  - Deployment validation
  - Compatibility checks

checks:
  - Integrates with existing modules
  - No breaking changes (or documented)
  - APIs backward compatible
  - Dependencies resolve

pass_criteria:
  - Integration tests pass
  - No unexpected side effects
  - Deployment succeeds
  - System remains stable

fail_action:
  - Report integration failures
  - Identify breaking changes
  - BLOCK for breaking changes without migration
  - Suggest compatibility fixes

ai_integration:
  - Playwright: End-to-end integration testing
  - Sequential: Dependency analysis
  - Context7: Integration patterns
```

### Gate 8: Evidence Validation (Final)
```yaml
purpose: Comprehensive evidence of quality
required_evidence:
  quantitative:
    - Performance metrics (response times, throughput)
    - Quality metrics (coverage %, complexity scores)
    - Security metrics (vulnerabilities found/fixed)

  qualitative:
    - Code quality improvements
    - Security enhancements
    - UX improvements
    - Maintainability gains

  documentation:
    - Change rationale
    - Test results summary
    - Performance benchmarks
    - Migration notes (if applicable)

pass_criteria:
  - All evidence provided
  - Evidence supports success
  - Metrics meet thresholds
  - Documentation complete

fail_action:
  - List missing evidence
  - Request additional validation
  - BLOCK until evidence complete

ai_integration:
  - Sequential: Evidence synthesis
  - Context7: Evidence standards
```

---

## 🚦 VALIDATION AUTOMATION (Tự động hóa Kiểm thử)

### CI/CD Integration
```yaml
continuous_integration:
  - Trigger: On every commit/PR
  - Pipeline: Syntax → Type → Lint → Test → Build
  - Gates: Progressive validation (fail fast)
  - Report: Detailed results + suggestions

progressive_validation:
  - Gate 1-3: Pre-commit hooks (fast feedback)
  - Gate 4-5: CI pipeline (comprehensive)
  - Gate 6-7: Pre-merge checks
  - Gate 8: Post-merge verification

early_failure_detection:
  - Fail at first gate failure
  - Provide clear error messages
  - Suggest immediate fixes
  - Prevent cascade failures
```

### Intelligent Monitoring
```yaml
success_rate_tracking:
  - Track gate pass rates
  - Identify problematic areas
  - Suggest preventive measures

ml_prediction:
  - Predict likely failures
  - Prioritize high-risk changes
  - Recommend additional validation

adaptive_validation:
  - Adjust thresholds based on context
  - Skip irrelevant gates (with justification)
  - Enhance validation for critical paths
```

---

## 📊 COMPLETION CRITERIA (Tiêu chí Hoàn thành)

### ALL Must Be Met
```yaml
validation:
  - All 8 gates pass (or justified exceptions)
  - Evidence provided for each gate
  - Metrics documented

ai_integration:
  - MCP coordination successful
  - Persona integration effective
  - Tool orchestration optimal
  - ≥90% context retention

performance:
  - Response time targets met
  - Resource limits respected
  - Success thresholds achieved
  - Token efficiency maintained

quality:
  - Code quality standards met
  - Performance assessment positive
  - Integration testing passed
  - No critical issues remaining
```

### Evidence Requirements
```yaml
quantitative_evidence:
  - Performance metrics: {response_time, throughput, resource_usage}
  - Quality metrics: {coverage_%, complexity_score, maintainability_index}
  - Security metrics: {vulnerabilities, severity_levels}

qualitative_evidence:
  - Code quality improvements: "Reduced complexity from 15 to 8"
  - Security enhancements: "Fixed 3 critical SQL injection risks"
  - UX improvements: "Reduced page load time by 40%"

documentation_evidence:
  - Change rationale: "Why this approach was chosen"
  - Test results: "98% unit coverage, all tests passing"
  - Performance benchmarks: "API response time: 120ms (target: <200ms)"
  - Migration notes: "No breaking changes, backward compatible"
```

---

## 🔗 INTEGRATION WITH ORCHESTRATOR

### Pre-Execution Validation
```yaml
before_agent_delegation:
  - Validate agent selection confidence ≥ 80%
  - Check resource availability
  - Verify dependency prerequisites
  - Estimate completion feasibility
```

### Post-Execution Validation (MANDATORY)
```yaml
after_agent_completion:
  - Run all 8 quality gates
  - Collect evidence
  - Generate validation report
  - Block completion if any critical gate fails
```

### Validation Report Format
```markdown
## QUALITY GATES VALIDATION REPORT (Báo cáo Kiểm định Chất lượng)

**Task**: {task_description}
**Agent**: {agent_name}
**Completion Time**: {timestamp}

### Gate Results
✅ Gate 1 - Syntax: PASS
✅ Gate 2 - Type: PASS
✅ Gate 3 - Lint: PASS (1 warning, justified)
✅ Gate 4 - Test: PASS (Coverage: 85%)
✅ Gate 5 - Performance: PASS (Response: 150ms)
✅ Gate 6 - Documentation: PASS
✅ Gate 7 - Integration: PASS
✅ Gate 8 - Evidence: PASS

### Evidence Summary
- **Performance**: API response time 150ms (target <200ms) ✅
- **Quality**: Coverage 85% (target ≥80%) ✅
- **Security**: 0 vulnerabilities found ✅

### Conclusion
**Status**: ✅ APPROVED FOR COMPLETION
**Quality Score**: 9.2/10
**Recommendation**: Safe to proceed
```

---

## 🚨 FAILURE HANDLING

### Gate Failure Actions
```yaml
critical_failure:
  gates: [1_syntax, 2_type, 4_test, 7_integration]
  action: BLOCK completion
  notify: Immediate user notification
  retry: After fixes applied

warning_failure:
  gates: [3_lint, 5_performance, 6_documentation]
  action: WARN but allow completion with justification
  notify: Include in validation report
  retry: Optional, recommended

informational:
  gates: [8_evidence]
  action: Request additional information
  notify: Soft reminder
  retry: Allow completion with partial evidence
```

---

**Version**: 2.0-optimized
**Token Efficiency**: 100 lines focused framework
**Authority**: SSOT for quality validation
**Mandatory**: ALL gates before completion
**Status**: ✅ Production Ready

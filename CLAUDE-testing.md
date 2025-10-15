# CLAUDE-testing.md

**Testing Strategies** (chiến lược kiểm thử) - **Test frameworks** (framework kiểm thử), **coverage requirements** (yêu cầu coverage), và **quality gates** (cổng chất lượng).

## 🧪 Testing Pyramid Strategy

### Unit Tests (70%) - Component Level
**Core Tools**: Read, Edit, Write, MultiEdit, Bash
**Focus**: Individual tool functionality, error handling, permission checks

```bash
# Example: Tool validation pattern
test_tool() {
  setup_test_environment
  execute_operation
  verify_expected_outcome
  cleanup_test_artifacts
}
```

### Integration Tests (20%) - Cross-Component
**MCP Servers**: Context7, Sequential, Magic, Playwright
**Configuration**: settings.json validation, permission loading
**Focus**: Server availability, cross-component workflows

### E2E Tests (10%) - Full Workflow
**Complete Development Workflows**:
- Project initialization → Configuration → File operations → Git integration
- Tool chain: Read → Edit → Write → Bash(git)
- Validation: All operations succeed in realistic scenarios

---

## 📊 Test Coverage Requirements

### Coverage Matrix
```yaml
core_tools:
  required: 90%
  tools: [Read, Edit, Write, MultiEdit]
  paths: [file_access, permission_check, error_handling]

execution_tools:
  required: 85%
  tools: [Bash, WebFetch, WebSearch]
  paths: [command_execution, timeout_handling, security_validation]

search_tools:
  required: 80%
  tools: [Grep, Glob, LS, Agent]
  paths: [pattern_matching, result_filtering, performance_optimization]

specialized_tools:
  required: 75%
  tools: [NotebookRead, NotebookEdit, TodoWrite]
  paths: [format_validation, data_integrity, state_management]
```

### Coverage Measurement
```bash
# Coverage analysis pattern
analyze_coverage() {
  run_tests_for_category "$1"
  calculate_percentage  # passed/total tests
  generate_report       # HTML/JSON output
  validate_thresholds   # fail if below required %
}
```

---

## 🚦 Quality Gates

### Pre-commit Gates
**Configuration Validation**:
- CLAUDE.md structure check
- settings.json syntax validation
- Required sections present

**Security Checks**:
- Secret detection patterns (API keys, tokens, passwords, private keys)
- File permission validation (*.key, *.pem must be 600)
- Exposed credential scanning

**Essential Tests**:
- Core tool functionality (Read, Edit)
- Configuration integration
- Basic workflow validation

```bash
# Pre-commit hook pattern
validate_configuration() && security_validation() && run_essential_tests()
```

### CI Pipeline Gates
```yaml
# .github/workflows/claude-ci.yml - Key steps
jobs:
  quality-gates:
    steps:
      - Configuration Validation
      - Security Scanning
      - Unit Tests (parallel execution)
      - Integration Tests
      - Performance Tests
      - Coverage Analysis (≥target thresholds)
      - Quality Report Generation
```

---

## 🔬 Testing Methodologies

### 1. Behavior-Driven Development (BDD)
**Gherkin Syntax** for feature testing:
```gherkin
Feature: File Operations
  Scenario: Reading a file
    Given file "test.txt" with content "Hello"
    When I use Read tool
    Then I should see "Hello"
    And operation completes in <100ms
```

**Implementation Pattern**:
- Parse Gherkin scenarios (Given/When/Then/And)
- Setup preconditions → Execute actions → Verify outcomes
- Automated scenario-to-test mapping

### 2. Property-Based Testing
**Properties for File Operations**:
- Read-after-write returns same content
- Edit modifies only target content
- Permission errors preserve original file

```bash
# Property testing pattern (100+ iterations)
property_test() {
  for i in 1..100; do
    generate_random_input
    verify_property_holds  # invariant must be true
  done
}
```

---

## 📈 Test Automation

### Test Runner
```bash
# claude-test-runner.sh - Core workflow
initialize_environment()   # Setup isolation, cleanup traps
discover_tests()          # Find test_*.sh files
run_parallel()            # Max concurrent jobs: 4
generate_report()         # HTML + success metrics
```

**Execution Features**:
- Parallel test execution (4 jobs default)
- 300s timeout per test
- Isolated /tmp directories
- Comprehensive HTML reports

### Performance Testing
**Load Testing**:
- Concurrent users: 10
- Test duration: 60s
- Operations tested: Read, Grep, Bash commands
- Metrics: Response time, throughput, error rate

**Analysis Pattern**:
```bash
load_test() {
  spawn_concurrent_workers(10)
  run_for_duration(60s)
  collect_metrics()
  analyze_results()
}
```

---

## 📋 Quality Standards

**Required Metrics**:
- Unit test coverage: ≥90% (core tools)
- Integration coverage: ≥85% (execution tools)
- E2E coverage: ≥80% (critical workflows)
- Performance: <100ms response time (90th percentile)
- Security: Zero exposed secrets in commits

**Continuous Evolution**:
Testing strategy adapts based on project needs, technology changes, and quality requirements. Review quarterly and update based on failure patterns.

---

**Quick Reference**:
- Test discovery: `tests/test_*.sh`
- Run all: `./claude-test-runner.sh`
- Coverage report: `/tmp/claude-test-results-*/test-report.html`
- CI pipeline: `.github/workflows/claude-code-ci.yml`

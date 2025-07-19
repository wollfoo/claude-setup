# CLAUDE-testing.md

**Testing Strategies** (chiến lược kiểm thử) - **Test frameworks** (framework kiểm thử), **coverage requirements** (yêu cầu coverage), và **quality gates** (cổng chất lượng) cho **Claude Code** development environment.

## 🧪 **Testing Framework Strategy** (Chiến lược framework kiểm thử)

### **1. Testing Pyramid** (Kim tự tháp kiểm thử)

#### **Unit Tests (70%)** - Component Level Testing
```bash
# Test Configuration cho các tools
test_read_tool() {
  local test_file="/tmp/test_file.txt"
  echo "Sample content" > "$test_file"
  
  # Test file reading
  local result=$(claude-tool read "$test_file")
  local expected="Sample content"
  
  if [ "$result" = "$expected" ]; then
    echo "PASS: Read tool test"
    return 0
  else
    echo "FAIL: Read tool test - Expected: '$expected', Got: '$result'"
    return 1
  fi
}

test_edit_tool() {
  local test_file="/tmp/test_edit.txt"
  echo "Original content" > "$test_file"
  
  # Test file editing
  claude-tool edit "$test_file" "Original content" "Modified content"
  local result=$(cat "$test_file")
  local expected="Modified content"
  
  if [ "$result" = "$expected" ]; then
    echo "PASS: Edit tool test"
    return 0
  else
    echo "FAIL: Edit tool test - Expected: '$expected', Got: '$result'"
    return 1
  fi
}

test_bash_tool() {
  # Test command execution
  local result=$(claude-tool bash "echo 'test output'")
  local expected="test output"
  
  if [[ "$result" == *"$expected"* ]]; then
    echo "PASS: Bash tool test"
    return 0
  else
    echo "FAIL: Bash tool test - Expected: '$expected', Got: '$result'"
    return 1
  fi
}
```

#### **Integration Tests (20%)** - Cross-Component Testing  
```bash
# Test MCP Server Integration
test_mcp_integration() {
  local server_name="gemini-cli"
  
  # Test server availability
  if claude mcp list | grep -q "$server_name"; then
    echo "PASS: MCP server $server_name is available"
  else
    echo "FAIL: MCP server $server_name not found"
    return 1
  fi
  
  # Test server functionality
  local test_prompt="What is 2+2?"
  local result=$(claude mcp call "$server_name" generate "$test_prompt")
  
  if [[ "$result" == *"4"* ]]; then
    echo "PASS: MCP server $server_name functionality test"
    return 0
  else
    echo "FAIL: MCP server $server_name functionality test"
    return 1
  fi
}

# Test Configuration Integration
test_configuration_integration() {
  local config_file=".claude/settings.json"
  
  # Test configuration loading
  if [ -f "$config_file" ]; then
    # Validate JSON syntax
    if jq empty "$config_file" 2>/dev/null; then
      echo "PASS: Configuration file syntax valid"
    else
      echo "FAIL: Configuration file has invalid JSON syntax"
      return 1
    fi
    
    # Test permission loading
    local permissions=$(jq -r '.permissions.allow[]' "$config_file" 2>/dev/null)
    if [ -n "$permissions" ]; then
      echo "PASS: Permission configuration loaded"
      return 0
    else
      echo "FAIL: Permission configuration not found"
      return 1
    fi
  else
    echo "FAIL: Configuration file not found"
    return 1
  fi
}
```

#### **End-to-End Tests (10%)** - Full Workflow Testing
```bash
# Complete Development Workflow Test
test_development_workflow() {
  echo "Testing complete development workflow..."
  
  # 1. Project initialization
  local test_project="/tmp/test-project-$(date +%s)"
  mkdir -p "$test_project"
  cd "$test_project"
  
  # 2. Setup Claude configuration
  mkdir -p .claude
  cat > .claude/settings.json << EOF
{
  "permissions": {
    "allow": ["Read", "Edit", "Write", "Bash(git:*)"],
    "defaultMode": "acceptEdits"
  }
}
EOF
  
  # 3. Create test files
  echo "console.log('Hello, World!');" > app.js
  echo "# Test Project" > README.md
  
  # 4. Initialize git
  git init
  git add .
  git commit -m "Initial commit"
  
  # 5. Test Claude operations
  if claude-tool read "app.js" | grep -q "Hello, World"; then
    echo "PASS: File reading in workflow"
  else
    echo "FAIL: File reading in workflow"
    return 1
  fi
  
  # 6. Test file modification
  claude-tool edit "app.js" "console.log('Hello, World!');" "console.log('Hello, Claude!');"
  
  if grep -q "Hello, Claude" app.js; then
    echo "PASS: File editing in workflow"
  else
    echo "FAIL: File editing in workflow"
    return 1
  fi
  
  # 7. Test git operations
  if claude-tool bash "git status" | grep -q "modified"; then
    echo "PASS: Git integration in workflow"
  else
    echo "FAIL: Git integration in workflow"
    return 1
  fi
  
  # Cleanup
  cd - > /dev/null
  rm -rf "$test_project"
  
  echo "PASS: Complete development workflow test"
  return 0
}
```

---

## 📊 **Test Coverage Requirements** (Yêu cầu coverage kiểm thử)

### **1. Coverage Metrics** (Chỉ số coverage)

#### **Tool Coverage Matrix** (Ma trận coverage công cụ)
```bash
# Coverage Requirements by Tool Category
COVERAGE_REQUIREMENTS = {
  "core_tools": {
    "required_coverage": "90%",
    "tools": ["Read", "Edit", "Write", "MultiEdit"],
    "critical_paths": ["file_access", "permission_check", "error_handling"]
  },
  "execution_tools": {
    "required_coverage": "85%", 
    "tools": ["Bash", "WebFetch", "WebSearch"],
    "critical_paths": ["command_execution", "timeout_handling", "security_validation"]
  },
  "search_tools": {
    "required_coverage": "80%",
    "tools": ["Grep", "Glob", "LS", "Agent"],
    "critical_paths": ["pattern_matching", "result_filtering", "performance_optimization"]
  },
  "specialized_tools": {
    "required_coverage": "75%",
    "tools": ["NotebookRead", "NotebookEdit", "TodoWrite"],
    "critical_paths": ["format_validation", "data_integrity", "state_management"]
  }
}
```

#### **Coverage Measurement** (Đo lường coverage)
```bash
# Test Coverage Analysis
analyze_test_coverage() {
  local tool_category="$1"
  local test_results_dir="/tmp/claude-test-results"
  
  mkdir -p "$test_results_dir"
  
  case "$tool_category" in
    "core_tools")
      run_core_tool_tests > "$test_results_dir/core_tools.log"
      ;;
    "execution_tools")
      run_execution_tool_tests > "$test_results_dir/execution_tools.log"
      ;;
    "search_tools")
      run_search_tool_tests > "$test_results_dir/search_tools.log"
      ;;
    "specialized_tools")
      run_specialized_tool_tests > "$test_results_dir/specialized_tools.log"
      ;;
  esac
  
  # Calculate coverage percentage
  local total_tests=$(grep -c "^test_" "$test_results_dir/$tool_category.log")
  local passed_tests=$(grep -c "PASS:" "$test_results_dir/$tool_category.log")
  local coverage_percent=$((passed_tests * 100 / total_tests))
  
  echo "Coverage for $tool_category: $coverage_percent% ($passed_tests/$total_tests tests passed)"
  
  return $coverage_percent
}

# Coverage Report Generation
generate_coverage_report() {
  local report_file="/tmp/claude-coverage-report-$(date +%Y%m%d).html"
  
  cat > "$report_file" << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Claude Code Test Coverage Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .high-coverage { background-color: #d4edda; }
        .medium-coverage { background-color: #fff3cd; }
        .low-coverage { background-color: #f8d7da; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <h1>Claude Code Test Coverage Report</h1>
    <p>Generated: __TIMESTAMP__</p>
    <table>
        <tr>
            <th>Tool Category</th>
            <th>Coverage %</th>
            <th>Tests Passed</th>
            <th>Total Tests</th>
            <th>Status</th>
        </tr>
EOF

  # Add coverage data for each category
  for category in "core_tools" "execution_tools" "search_tools" "specialized_tools"; do
    local coverage=$(analyze_test_coverage "$category")
    local status_class="low-coverage"
    local status_text="NEEDS IMPROVEMENT"
    
    if [ "$coverage" -ge 90 ]; then
      status_class="high-coverage"
      status_text="EXCELLENT"
    elif [ "$coverage" -ge 80 ]; then
      status_class="medium-coverage" 
      status_text="GOOD"
    elif [ "$coverage" -ge 70 ]; then
      status_class="medium-coverage"
      status_text="ACCEPTABLE"
    fi
    
    echo "<tr class=\"$status_class\">" >> "$report_file"
    echo "<td>$category</td>" >> "$report_file"
    echo "<td>$coverage%</td>" >> "$report_file"
    echo "<td>$(grep -c "PASS:" "/tmp/claude-test-results/$category.log")</td>" >> "$report_file"
    echo "<td>$(grep -c "^test_" "/tmp/claude-test-results/$category.log")</td>" >> "$report_file"
    echo "<td>$status_text</td>" >> "$report_file"
    echo "</tr>" >> "$report_file"
  done
  
  cat >> "$report_file" << 'EOF'
    </table>
</body>
</html>
EOF

  sed -i "s/__TIMESTAMP__/$(date)/" "$report_file"
  echo "Coverage report generated: $report_file"
}
```

---

## 🚦 **Quality Gates** (Cổng chất lượng)

### **1. Pre-commit Quality Gates** (Cổng chất lượng trước commit)

#### **Code Quality Checks** (Kiểm tra chất lượng code)
```bash
# Pre-commit Hook Script
#!/bin/bash
# .git/hooks/pre-commit

echo "Running Claude Code quality checks..."

# 1. Configuration Validation
validate_configuration() {
  echo "Validating configuration files..."
  
  # Check CLAUDE.md syntax
  if [ -f "CLAUDE.md" ]; then
    if ! grep -q "## AI Guidance" CLAUDE.md; then
      echo "ERROR: CLAUDE.md missing required AI Guidance section"
      return 1
    fi
  fi
  
  # Validate settings.json files
  find . -name "settings.json" -path "*/.claude/*" | while read -r config_file; do
    if ! jq empty "$config_file" 2>/dev/null; then
      echo "ERROR: Invalid JSON syntax in $config_file"
      return 1
    fi
  done
  
  echo "Configuration validation passed"
  return 0
}

# 2. Security Checks
security_validation() {
  echo "Running security validation..."
  
  # Check for exposed secrets
  local secret_patterns=(
    "api[_-]?key.*=.*['\"][A-Za-z0-9]{20,}['\"]"
    "password.*=.*['\"][^'\"]{8,}['\"]"
    "secret.*=.*['\"][A-Za-z0-9]{16,}['\"]"
    "token.*=.*['\"][A-Za-z0-9]{20,}['\"]"
    "-----BEGIN.*PRIVATE KEY-----"
  )
  
  for pattern in "${secret_patterns[@]}"; do
    if git diff --cached | grep -qE "$pattern"; then
      echo "ERROR: Potential secret detected in staged changes"
      echo "Pattern: $pattern"
      return 1
    fi
  done
  
  # Check file permissions
  find . -name "*.key" -o -name "*.pem" | while read -r key_file; do
    if [ "$(stat -c %a "$key_file")" != "600" ]; then
      echo "ERROR: Insecure permissions on $key_file (should be 600)"
      return 1
    fi
  done
  
  echo "Security validation passed"
  return 0
}

# 3. Test Execution
run_essential_tests() {
  echo "Running essential test suite..."
  
  # Core functionality tests
  if ! test_read_tool; then
    echo "ERROR: Core read tool test failed"
    return 1
  fi
  
  if ! test_edit_tool; then
    echo "ERROR: Core edit tool test failed"
    return 1
  fi
  
  if ! test_configuration_integration; then
    echo "ERROR: Configuration integration test failed"
    return 1
  fi
  
  echo "Essential tests passed"
  return 0
}

# Execute all quality gates
if validate_configuration && security_validation && run_essential_tests; then
  echo "✅ All quality gates passed - commit allowed"
  exit 0
else
  echo "❌ Quality gates failed - commit blocked"
  exit 1
fi
```

### **2. Continuous Integration Gates** (Cổng tích hợp liên tục)

#### **CI Pipeline Configuration** (Cấu hình pipeline CI)
```yaml
# .github/workflows/claude-code-ci.yml
name: Claude Code Quality Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  quality-gates:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
      
    - name: Setup Claude Code Test Environment
      run: |
        # Install dependencies
        sudo apt-get update
        sudo apt-get install -y jq bc curl
        
        # Setup test directories
        mkdir -p /tmp/claude-test-results
        
    - name: Configuration Validation
      run: |
        echo "Validating configuration files..."
        bash tests/validate-configuration.sh
        
    - name: Security Scanning
      run: |
        echo "Running security scans..."
        bash tests/security-scan.sh
        
    - name: Unit Tests
      run: |
        echo "Running unit tests..."
        bash tests/run-unit-tests.sh
        
    - name: Integration Tests
      run: |
        echo "Running integration tests..."
        bash tests/run-integration-tests.sh
        
    - name: Performance Tests
      run: |
        echo "Running performance tests..."
        bash tests/run-performance-tests.sh
        
    - name: Coverage Analysis
      run: |
        echo "Analyzing test coverage..."
        bash tests/analyze-coverage.sh
        
    - name: Generate Quality Report
      run: |
        echo "Generating quality report..."
        bash tests/generate-quality-report.sh
        
    - name: Upload Test Results
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: test-results
        path: /tmp/claude-test-results/
```

---

## 🔬 **Testing Methodologies** (Phương pháp kiểm thử)

### **1. Behavior-Driven Development (BDD)** (Phát triển hướng hành vi)

#### **Feature Testing with Gherkin Syntax** (Kiểm thử tính năng với cú pháp Gherkin)
```gherkin
# features/file-operations.feature
Feature: File Operations
  As a developer using Claude Code
  I want to read and edit files
  So that I can modify my codebase efficiently

  Scenario: Reading a small text file
    Given I have a file "test.txt" with content "Hello, World!"
    When I use the Read tool to read "test.txt"
    Then I should see the content "Hello, World!"
    And the operation should complete in less than 100ms

  Scenario: Editing a configuration file
    Given I have a file "config.json" with valid JSON content
    When I use the Edit tool to change a configuration value
    Then the file should contain the new value
    And the JSON syntax should remain valid
    And a backup should be created

  Scenario: Handling permission denied errors
    Given I have a file "protected.txt" with restricted permissions
    When I try to edit the file using Edit tool
    Then I should receive a permission denied error
    And the original file should remain unchanged
```

#### **BDD Test Implementation** (Triển khai kiểm thử BDD)
```bash
# Test implementation cho BDD scenarios
implement_bdd_tests() {
  local feature_file="$1"
  
  # Parse Gherkin scenarios
  while IFS= read -r line; do
    case "$line" in
      *"Given "*)
        setup_precondition "${line#*Given }"
        ;;
      *"When "*)
        execute_action "${line#*When }"
        ;;
      *"Then "*)
        verify_outcome "${line#*Then }"
        ;;
      *"And "*)
        additional_verification "${line#*And }"
        ;;
    esac
  done < "$feature_file"
}

setup_precondition() {
  local condition="$1"
  
  case "$condition" in
    *"I have a file"*)
      local filename=$(echo "$condition" | grep -o '"[^"]*"' | tr -d '"' | head -1)
      local content=$(echo "$condition" | grep -o '"[^"]*"' | tr -d '"' | tail -1)
      echo "$content" > "/tmp/$filename"
      ;;
  esac
}

execute_action() {
  local action="$1"
  
  case "$action" in
    *"I use the Read tool"*)
      local filename=$(echo "$action" | grep -o '"[^"]*"' | tr -d '"')
      read_result=$(claude-tool read "/tmp/$filename")
      ;;
    *"I use the Edit tool"*)
      local filename=$(echo "$action" | grep -o '"[^"]*"' | tr -d '"')
      # Parse edit parameters và execute
      claude-tool edit "/tmp/$filename" "$old_value" "$new_value"
      ;;
  esac
}

verify_outcome() {
  local expected="$1"
  
  case "$expected" in
    *"I should see the content"*)
      local expected_content=$(echo "$expected" | grep -o '"[^"]*"' | tr -d '"')
      if [ "$read_result" = "$expected_content" ]; then
        echo "PASS: Content verification"
      else
        echo "FAIL: Content verification"
        return 1
      fi
      ;;
  esac
}
```

### **2. Property-Based Testing** (Kiểm thử dựa trên thuộc tính)

#### **Property Testing for File Operations** (Kiểm thử thuộc tính cho thao tác file)
```bash
# Property-based testing cho file operations
property_test_file_operations() {
  local iterations=100
  
  for i in $(seq 1 $iterations); do
    # Generate random test data
    local filename="/tmp/test_$(random_string 10).txt"
    local content=$(random_string $((RANDOM % 1000 + 1)))
    
    # Property: Read after write should return same content
    echo "$content" > "$filename"
    local read_result=$(claude-tool read "$filename")
    
    if [ "$read_result" != "$content" ]; then
      echo "FAIL: Read-after-write property violated"
      echo "Expected: $content"
      echo "Got: $read_result"
      return 1
    fi
    
    # Property: Edit should modify only target content
    local old_word=$(echo "$content" | cut -d' ' -f1)
    local new_word="MODIFIED"
    
    if [ -n "$old_word" ]; then
      claude-tool edit "$filename" "$old_word" "$new_word"
      local edited_content=$(cat "$filename")
      
      if [[ "$edited_content" != *"$new_word"* ]]; then
        echo "FAIL: Edit property violated - new content not found"
        return 1
      fi
      
      if [[ "$edited_content" == *"$old_word"* ]] && [ "$old_word" != "$new_word" ]; then
        echo "FAIL: Edit property violated - old content still present"
        return 1
      fi
    fi
    
    # Cleanup
    rm -f "$filename"
  done
  
  echo "PASS: File operation properties verified over $iterations iterations"
}

random_string() {
  local length="$1"
  cat /dev/urandom | tr -dc 'a-zA-Z0-9 ' | fold -w "$length" | head -n 1
}
```

---

## 📈 **Test Automation** (Tự động hóa kiểm thử)

### **1. Automated Test Execution** (Thực thi kiểm thử tự động)

#### **Test Runner Script** (Script chạy kiểm thử)
```bash
#!/bin/bash
# claude-test-runner.sh

set -euo pipefail

# Configuration
TEST_DIR="tests"
RESULTS_DIR="/tmp/claude-test-results-$(date +%Y%m%d%H%M%S)"
PARALLEL_JOBS=4

# Initialize test environment
initialize_test_environment() {
  echo "Initializing test environment..."
  
  mkdir -p "$RESULTS_DIR"
  export CLAUDE_TEST_MODE=true
  export CLAUDE_TEST_RESULTS_DIR="$RESULTS_DIR"
  
  # Setup test isolation
  export TMPDIR="/tmp/claude-tests-$$"
  mkdir -p "$TMPDIR"
  
  # Cleanup function
  cleanup() {
    echo "Cleaning up test environment..."
    rm -rf "$TMPDIR"
  }
  trap cleanup EXIT
}

# Test discovery
discover_tests() {
  find "$TEST_DIR" -name "test_*.sh" -executable | sort
}

# Parallel test execution
run_tests_parallel() {
  local test_files=("$@")
  local pids=()
  local job_count=0
  
  for test_file in "${test_files[@]}"; do
    # Wait if we've reached max parallel jobs
    if [ "$job_count" -ge "$PARALLEL_JOBS" ]; then
      wait "${pids[0]}"
      pids=("${pids[@]:1}")
      ((job_count--))
    fi
    
    # Start test in background
    run_single_test "$test_file" &
    pids+=($!)
    ((job_count++))
  done
  
  # Wait for remaining tests
  for pid in "${pids[@]}"; do
    wait "$pid"
  done
}

# Single test execution
run_single_test() {
  local test_file="$1"
  local test_name=$(basename "$test_file" .sh)
  local test_log="$RESULTS_DIR/${test_name}.log"
  local test_result="$RESULTS_DIR/${test_name}.result"
  
  echo "Running test: $test_name"
  
  # Execute test with timeout
  if timeout 300 bash "$test_file" > "$test_log" 2>&1; then
    echo "PASS" > "$test_result"
    echo "✅ PASS: $test_name"
  else
    echo "FAIL" > "$test_result"
    echo "❌ FAIL: $test_name"
    echo "  Log: $test_log"
  fi
}

# Generate test report
generate_test_report() {
  local total_tests=$(find "$RESULTS_DIR" -name "*.result" | wc -l)
  local passed_tests=$(grep -l "PASS" "$RESULTS_DIR"/*.result | wc -l)
  local failed_tests=$((total_tests - passed_tests))
  local success_rate=$((passed_tests * 100 / total_tests))
  
  cat > "$RESULTS_DIR/test-report.html" << EOF
<!DOCTYPE html>
<html>
<head>
    <title>Claude Code Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .pass { color: green; }
        .fail { color: red; }
        .summary { background-color: #f0f0f0; padding: 10px; margin: 10px 0; }
    </style>
</head>
<body>
    <h1>Claude Code Test Report</h1>
    <div class="summary">
        <h2>Summary</h2>
        <p>Total Tests: $total_tests</p>
        <p class="pass">Passed: $passed_tests</p>
        <p class="fail">Failed: $failed_tests</p>
        <p>Success Rate: $success_rate%</p>
        <p>Generated: $(date)</p>
    </div>
    
    <h2>Test Results</h2>
    <ul>
EOF

  # Add individual test results
  for result_file in "$RESULTS_DIR"/*.result; do
    local test_name=$(basename "$result_file" .result)
    local status=$(cat "$result_file")
    local class="pass"
    
    if [ "$status" = "FAIL" ]; then
      class="fail"
    fi
    
    echo "<li class=\"$class\">$test_name: $status</li>" >> "$RESULTS_DIR/test-report.html"
  done
  
  cat >> "$RESULTS_DIR/test-report.html" << EOF
    </ul>
</body>
</html>
EOF

  echo "Test report generated: $RESULTS_DIR/test-report.html"
  echo "Overall result: $passed_tests/$total_tests tests passed ($success_rate%)"
  
  # Return exit code based on results
  if [ "$failed_tests" -eq 0 ]; then
    return 0
  else
    return 1
  fi
}

# Main execution
main() {
  echo "Claude Code Test Runner"
  echo "======================"
  
  initialize_test_environment
  
  local test_files=($(discover_tests))
  echo "Discovered ${#test_files[@]} test files"
  
  if [ "${#test_files[@]}" -eq 0 ]; then
    echo "No tests found in $TEST_DIR"
    exit 1
  fi
  
  run_tests_parallel "${test_files[@]}"
  generate_test_report
}

# Execute if called directly
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
  main "$@"
fi
```

### **2. Performance Testing Automation** (Tự động hóa kiểm thử hiệu suất)
```bash
# Automated performance testing
run_performance_tests() {
  echo "Running performance test suite..."
  
  # Test response times under load
  load_test_tools() {
    local concurrent_users=10
    local test_duration=60
    local pids=()
    
    for i in $(seq 1 $concurrent_users); do
      performance_test_worker "$i" "$test_duration" &
      pids+=($!)
    done
    
    # Wait for all workers
    for pid in "${pids[@]}"; do
      wait "$pid"
    done
    
    # Analyze results
    analyze_performance_results
  }
  
  performance_test_worker() {
    local worker_id="$1"
    local duration="$2"
    local end_time=$(($(date +%s) + duration))
    
    while [ "$(date +%s)" -lt "$end_time" ]; do
      # Test various operations
      performance_test "read" "sample-file.txt"
      performance_test "grep" "function.*export"
      performance_test "bash" "git status"
      
      sleep 1
    done
  }
  
  load_test_tools
}
```

---

*Testing strategy được **continuously evolved** (liên tục phát triển) based on **project needs** (nhu cầu dự án), **technology changes** (thay đổi công nghệ), và **quality requirements** (yêu cầu chất lượng).*
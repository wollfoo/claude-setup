# CLAUDE-performance.md

**Performance Optimization** (tối ưu hiệu suất) - **Benchmarks và metrics** (điểm chuẩn và chỉ số), **optimization strategies** (chiến lược tối ưu), và **resource usage patterns** (mẫu sử dụng tài nguyên) cho **Claude Code** environment.

## 📊 **Performance Metrics** (Chỉ số hiệu suất)

### **1. Response Time Benchmarks** (Điểm chuẩn thời gian phản hồi)

#### **Tool Execution Times** (Thời gian thực thi công cụ)
```bash
# Baseline Performance Measurements
BASELINE_METRICS = {
  "Read": {
    "small_file": "< 100ms",      # < 1KB files
    "medium_file": "< 500ms",     # 1-100KB files  
    "large_file": "< 2000ms",     # 100KB-10MB files
    "target_sla": "< 1000ms"      # 95th percentile
  },
  "Edit": {
    "simple_edit": "< 200ms",     # Single line changes
    "multi_edit": "< 800ms",      # Multiple changes
    "large_file_edit": "< 3000ms", # Files > 1MB
    "target_sla": "< 1500ms"      # 95th percentile
  },
  "Bash": {
    "simple_command": "< 500ms",   # ls, pwd, echo
    "git_operations": "< 2000ms",  # git status, commit
    "build_commands": "< 30000ms", # npm install, compilation
    "target_sla": "< 5000ms"       # 95th percentile
  },
  "Grep": {
    "small_codebase": "< 300ms",   # < 100 files
    "medium_codebase": "< 1000ms", # 100-1000 files
    "large_codebase": "< 5000ms",  # > 1000 files
    "target_sla": "< 2000ms"       # 95th percentile
  }
}
```

#### **Performance Monitoring Script** (Script giám sát hiệu suất)
```bash
#!/bin/bash
# Claude Code Performance Monitor

performance_test() {
  local tool="$1"
  local operation="$2"
  local start_time=$(date +%s%3N)
  
  # Execute operation
  case "$tool" in
    "read")
      claude-code read "$operation" > /dev/null
      ;;
    "edit")
      claude-code edit "$operation" > /dev/null
      ;;
    "bash")
      claude-code bash "$operation" > /dev/null
      ;;
    "grep")
      claude-code grep "$operation" > /dev/null
      ;;
  esac
  
  local end_time=$(date +%s%3N)
  local duration=$((end_time - start_time))
  
  # Log performance
  echo "$(date -u +%Y-%m-%dT%H:%M:%SZ)|$tool|$operation|${duration}ms" \
    >> /var/log/claude-performance.log
  
  return $duration
}

# Automated Performance Testing
run_performance_suite() {
  echo "Starting Claude Code Performance Test Suite..."
  
  # Test Read operations
  performance_test "read" "small_file.txt"
  performance_test "read" "medium_file.js"
  performance_test "read" "large_file.md"
  
  # Test Edit operations  
  performance_test "edit" "simple_change"
  performance_test "edit" "multi_line_change"
  
  # Test Bash operations
  performance_test "bash" "git status"
  performance_test "bash" "npm list"
  
  # Test Grep operations
  performance_test "grep" "function.*export"
  performance_test "grep" "import.*from"
  
  # Generate performance report
  generate_performance_report
}
```

### **2. Resource Utilization Metrics** (Chỉ số sử dụng tài nguyên)

#### **Memory Usage Patterns** (Mẫu sử dụng bộ nhớ)
```bash
# Memory Monitoring
monitor_memory_usage() {
  local process_name="claude-code"
  local log_file="/var/log/claude-memory.log"
  
  while true; do
    local timestamp=$(date -u +%Y-%m-%dT%H:%M:%SZ)
    local memory_info=$(ps -o pid,ppid,rss,vsz,pmem,comm -C "$process_name" --no-headers)
    
    if [ -n "$memory_info" ]; then
      echo "$timestamp|$memory_info" >> "$log_file"
    fi
    
    sleep 30
  done
}

# Memory Leak Detection
detect_memory_leaks() {
  local baseline_memory=$(grep "$(date -d '1 hour ago' +%Y-%m-%d)" /var/log/claude-memory.log | \
    awk -F'|' '{sum += $3} END {print sum/NR}')
  
  local current_memory=$(tail -10 /var/log/claude-memory.log | \
    awk -F'|' '{sum += $3} END {print sum/NR}')
  
  local memory_growth=$(echo "$current_memory - $baseline_memory" | bc)
  local growth_threshold="100000"  # 100MB
  
  if [ "$(echo "$memory_growth > $growth_threshold" | bc)" -eq 1 ]; then
    echo "Memory leak detected: ${memory_growth}KB growth in 1 hour"
    alert_operations_team "Claude Code memory leak detected"
  fi
}
```

#### **CPU Usage Optimization** (Tối ưu sử dụng CPU)
```bash
# CPU Performance Monitoring
monitor_cpu_usage() {
  local process_name="claude-code"
  
  # Real-time CPU monitoring
  top -b -n1 -p "$(pgrep $process_name | tr '\n' ',')" | \
    awk 'NR>7 {print $1,$9,$10,$12}' | \
    while read pid cpu mem command; do
      if [ "$cpu" != "0.0" ]; then
        echo "$(date -u +%Y-%m-%dT%H:%M:%SZ)|$pid|$cpu|$mem|$command" \
          >> /var/log/claude-cpu.log
      fi
    done
}

# CPU Optimization Settings
optimize_cpu_usage() {
  # Set CPU affinity cho better performance
  local claude_pids=$(pgrep claude-code)
  local cpu_cores=$(nproc)
  local optimal_cores=$((cpu_cores / 2))
  
  for pid in $claude_pids; do
    # Bind to specific CPU cores
    taskset -cp "0-$optimal_cores" "$pid"
    
    # Set nice priority
    renice -n -5 "$pid"
  done
}
```

---

## ⚡ **Optimization Strategies** (Chiến lược tối ưu)

### **1. Token Usage Optimization** (Tối ưu sử dụng token)

#### **Context Management** (Quản lý ngữ cảnh)
```bash
# Context Size Monitoring
monitor_context_size() {
  local session_id="$1"
  local context_file="/tmp/claude-context-$session_id.txt"
  
  # Track context growth
  local context_size=$(wc -c < "$context_file" 2>/dev/null || echo 0)
  local max_context_size="100000"  # 100KB limit
  
  if [ "$context_size" -gt "$max_context_size" ]; then
    echo "Context size limit exceeded: ${context_size} bytes"
    optimize_context "$session_id"
  fi
}

# Context Compression
optimize_context() {
  local session_id="$1"
  local context_file="/tmp/claude-context-$session_id.txt"
  local compressed_file="/tmp/claude-context-$session_id-compressed.txt"
  
  # Summarize old context
  local summary=$(tail -n +100 "$context_file" | \
    claude-summarize --max-tokens 500)
  
  # Keep recent context + summary
  echo "$summary" > "$compressed_file"
  echo "--- Recent Context ---" >> "$compressed_file"
  tail -n 50 "$context_file" >> "$compressed_file"
  
  # Replace original context
  mv "$compressed_file" "$context_file"
  
  echo "Context optimized: $(wc -c < "$context_file") bytes"
}
```

#### **Smart Content Loading** (Tải nội dung thông minh)
```bash
# Selective File Reading
smart_file_read() {
  local file_path="$1"
  local max_lines="2000"
  local file_size=$(wc -l < "$file_path")
  
  if [ "$file_size" -gt "$max_lines" ]; then
    # Read file in chunks
    echo "File too large ($file_size lines). Reading first $max_lines lines..."
    head -n "$max_lines" "$file_path"
    echo "... [truncated] ..."
  else
    # Read entire file
    cat "$file_path"
  fi
}

# Intelligent Grep Results
smart_grep() {
  local pattern="$1"
  local path="$2"
  local max_results="50"
  
  # Get total matches
  local total_matches=$(grep -r "$pattern" "$path" | wc -l)
  
  if [ "$total_matches" -gt "$max_results" ]; then
    echo "Found $total_matches matches. Showing first $max_results:"
    grep -r "$pattern" "$path" | head -n "$max_results"
    echo "... Use more specific pattern to see remaining matches ..."
  else
    grep -r "$pattern" "$path"
  fi
}
```

### **2. Network Performance** (Hiệu suất mạng)

#### **Connection Pooling** (Gộp kết nối)
```bash
# HTTP Connection Pool
setup_http_pool() {
  export HTTP_POOL_SIZE="10"
  export HTTP_POOL_TIMEOUT="30"
  export HTTP_KEEP_ALIVE="true"
  export HTTP_RETRY_COUNT="3"
  export HTTP_RETRY_DELAY="1000"
  
  # Configure curl defaults
  cat > ~/.curlrc << EOF
connect-timeout = 10
max-time = 30
retry = 3
retry-delay = 1
retry-max-time = 60
keepalive-time = 30
EOF
}

# API Rate Limiting
implement_rate_limiting() {
  local service="$1"
  local requests_per_minute="60"
  local current_minute=$(date +%Y%m%d%H%M)
  local counter_file="/tmp/rate-limit-$service-$current_minute"
  
  # Count requests in current minute
  local current_count=$(cat "$counter_file" 2>/dev/null || echo 0)
  current_count=$((current_count + 1))
  echo "$current_count" > "$counter_file"
  
  if [ "$current_count" -gt "$requests_per_minute" ]; then
    echo "Rate limit exceeded for $service. Waiting..."
    sleep $((60 - $(date +%S)))
    return 1
  fi
  
  return 0
}
```

#### **Caching Strategies** (Chiến lược cache)
```bash
# Web Fetch Caching
cache_web_fetch() {
  local url="$1"
  local cache_ttl="900"  # 15 minutes
  local cache_key=$(echo "$url" | sha256sum | cut -d' ' -f1)
  local cache_file="/tmp/web-cache-$cache_key"
  local cache_meta="/tmp/web-cache-$cache_key.meta"
  
  # Check cache validity
  if [ -f "$cache_file" ] && [ -f "$cache_meta" ]; then
    local cache_time=$(cat "$cache_meta")
    local current_time=$(date +%s)
    local age=$((current_time - cache_time))
    
    if [ "$age" -lt "$cache_ttl" ]; then
      echo "Cache hit for $url (age: ${age}s)"
      cat "$cache_file"
      return 0
    fi
  fi
  
  # Fetch và cache
  echo "Cache miss for $url. Fetching..."
  if curl -s "$url" > "$cache_file"; then
    date +%s > "$cache_meta"
    cat "$cache_file"
  else
    rm -f "$cache_file" "$cache_meta"
    return 1
  fi
}

# Grep Result Caching
cache_grep_results() {
  local pattern="$1"
  local directory="$2"
  local cache_key=$(echo "${pattern}|${directory}" | sha256sum | cut -d' ' -f1)
  local cache_file="/tmp/grep-cache-$cache_key"
  local cache_meta="/tmp/grep-cache-$cache_key.meta"
  local cache_ttl="300"  # 5 minutes
  
  # Check if directory changed
  local dir_mtime=$(find "$directory" -type f -newer "$cache_meta" 2>/dev/null | wc -l)
  
  if [ -f "$cache_file" ] && [ "$dir_mtime" -eq 0 ]; then
    local cache_time=$(cat "$cache_meta" 2>/dev/null || echo 0)
    local current_time=$(date +%s)
    local age=$((current_time - cache_time))
    
    if [ "$age" -lt "$cache_ttl" ]; then
      cat "$cache_file"
      return 0
    fi
  fi
  
  # Generate và cache results
  grep -r "$pattern" "$directory" > "$cache_file"
  date +%s > "$cache_meta"
  cat "$cache_file"
}
```

---

## 🔧 **System Optimization** (Tối ưu hệ thống)

### **1. File System Performance** (Hiệu suất hệ thống file)

#### **I/O Optimization** (Tối ưu I/O)
```bash
# File System Tuning
optimize_file_system() {
  # Mount options cho better performance
  if grep -q "/tmp" /proc/mounts; then
    mount -o remount,noatime,nodiratime /tmp
  fi
  
  # Set optimal read-ahead
  echo 256 > /sys/block/sda/queue/read_ahead_kb
  
  # Optimize dirty page handling
  echo 15 > /proc/sys/vm/dirty_background_ratio
  echo 40 > /proc/sys/vm/dirty_ratio
  
  # Increase file descriptor limits
  echo "* soft nofile 65536" >> /etc/security/limits.conf
  echo "* hard nofile 65536" >> /etc/security/limits.conf
}

# Temporary File Management
optimize_temp_files() {
  local temp_dir="/tmp/claude-temp"
  mkdir -p "$temp_dir"
  
  # Use tmpfs cho temporary files
  if ! mount | grep -q "$temp_dir"; then
    mount -t tmpfs -o size=512M tmpfs "$temp_dir"
  fi
  
  # Cleanup old temp files
  find "$temp_dir" -type f -mtime +1 -delete
  find "$temp_dir" -type d -empty -delete
}
```

#### **File Access Patterns** (Mẫu truy cập file)
```bash
# Preload Frequently Used Files
preload_common_files() {
  local common_files=(
    "package.json"
    "README.md"
    "CLAUDE.md"
    ".gitignore"
    "tsconfig.json"
  )
  
  for file in "${common_files[@]}"; do
    if [ -f "$file" ]; then
      # Preload into page cache
      cat "$file" > /dev/null
    fi
  done
}

# File Access Monitoring
monitor_file_access() {
  # Track most accessed files
  auditctl -w /home -p r -k file_access
  
  # Generate access report
  ausearch -k file_access | \
    awk '/name=/ {gsub(/.*name=/, ""); gsub(/".*/, ""); print}' | \
    sort | uniq -c | sort -nr | head -20 > /tmp/file-access-report.txt
}
```

### **2. Memory Management** (Quản lý bộ nhớ)

#### **Memory Pool Optimization** (Tối ưu memory pool)
```bash
# Memory Pool Configuration
configure_memory_pools() {
  # Set optimal swappiness
  echo 10 > /proc/sys/vm/swappiness
  
  # Configure memory overcommit
  echo 1 > /proc/sys/vm/overcommit_memory
  echo 80 > /proc/sys/vm/overcommit_ratio
  
  # Optimize page cache
  echo 3 > /proc/sys/vm/drop_caches  # Clear caches
  
  # Set memory limits cho Claude processes
  echo "claude-code soft as 2097152" >> /etc/security/limits.conf  # 2GB
  echo "claude-code hard as 4194304" >> /etc/security/limits.conf  # 4GB
}

# Garbage Collection Optimization
optimize_gc() {
  # Node.js GC tuning (if applicable)
  export NODE_OPTIONS="--max-old-space-size=2048 --gc-interval=100"
  
  # Python GC tuning (if applicable)
  export PYTHONHASHSEED=0
  export PYTHONOPTIMIZE=1
  
  # Force garbage collection periodically
  force_gc() {
    if command -v node >/dev/null 2>&1; then
      node -e "global.gc && global.gc();" 2>/dev/null || true
    fi
    
    if command -v python3 >/dev/null 2>&1; then
      python3 -c "import gc; gc.collect()" 2>/dev/null || true
    fi
  }
}
```

---

## 📈 **Performance Monitoring** (Giám sát hiệu suất)

### **1. Real-time Monitoring** (Giám sát thời gian thực)

#### **System Dashboard** (Bảng điều khiển hệ thống)
```bash
# Performance Dashboard
generate_performance_dashboard() {
  local dashboard_file="/tmp/claude-performance-dashboard.html"
  
  cat > "$dashboard_file" << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Claude Code Performance Dashboard</title>
    <meta http-equiv="refresh" content="30">
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .metric { display: inline-block; margin: 10px; padding: 10px; border: 1px solid #ccc; }
        .good { background-color: #d4edda; }
        .warning { background-color: #fff3cd; }
        .critical { background-color: #f8d7da; }
    </style>
</head>
<body>
    <h1>Claude Code Performance Dashboard</h1>
    <div id="metrics">
EOF

  # Add real-time metrics
  local cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
  local memory_usage=$(free | grep Mem | awk '{printf "%.1f", $3/$2 * 100.0}')
  local disk_usage=$(df -h / | awk 'NR==2{print $5}' | cut -d'%' -f1)
  
  # Generate status indicators
  for metric in "CPU:$cpu_usage" "Memory:$memory_usage" "Disk:$disk_usage"; do
    local name=$(echo "$metric" | cut -d':' -f1)
    local value=$(echo "$metric" | cut -d':' -f2)
    local class="good"
    
    if [ "$(echo "$value > 80" | bc 2>/dev/null || echo 0)" -eq 1 ]; then
      class="critical"
    elif [ "$(echo "$value > 60" | bc 2>/dev/null || echo 0)" -eq 1 ]; then
      class="warning"
    fi
    
    echo "<div class=\"metric $class\">$name: ${value}%</div>" >> "$dashboard_file"
  done
  
  cat >> "$dashboard_file" << 'EOF'
    </div>
    <p>Last updated: __TIMESTAMP__</p>
</body>
</html>
EOF

  sed -i "s/__TIMESTAMP__/$(date)/" "$dashboard_file"
  echo "Dashboard generated: $dashboard_file"
}
```

#### **Alert System** (Hệ thống cảnh báo)
```bash
# Performance Alert System
setup_performance_alerts() {
  local alert_config="/etc/claude-alerts.conf"
  
  cat > "$alert_config" << EOF
# Claude Code Performance Alerts Configuration
CPU_THRESHOLD=80
MEMORY_THRESHOLD=85
DISK_THRESHOLD=90
RESPONSE_TIME_THRESHOLD=5000
ERROR_RATE_THRESHOLD=5

# Alert destinations
ALERT_EMAIL="ops-team@company.com"
SLACK_WEBHOOK="https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK"
EOF

  # Alert handler
  performance_alert() {
    local metric="$1"
    local value="$2"
    local threshold="$3"
    local message="Performance alert: $metric is $value (threshold: $threshold)"
    
    # Email alert
    echo "$message" | mail -s "Claude Code Performance Alert" "$ALERT_EMAIL"
    
    # Slack alert
    curl -X POST "$SLACK_WEBHOOK" \
      -H 'Content-type: application/json' \
      --data "{\"text\":\"$message\"}"
    
    # Log alert
    echo "$(date -u +%Y-%m-%dT%H:%M:%SZ)|ALERT|$metric|$value|$threshold" \
      >> /var/log/claude-alerts.log
  }
}
```

### **2. Historical Analysis** (Phân tích lịch sử)

#### **Performance Trends** (Xu hướng hiệu suất)
```bash
# Generate Performance Reports
generate_performance_report() {
  local report_period="$1"  # daily, weekly, monthly
  local report_file="/tmp/claude-performance-report-$(date +%Y%m%d).txt"
  
  cat > "$report_file" << EOF
# Claude Code Performance Report
Generated: $(date)
Period: $report_period

## Response Time Analysis
EOF

  # Analyze response times
  awk -F'|' '{
    tool=$2; duration=$4;
    count[tool]++; total[tool]+=duration;
    if (duration > max[tool]) max[tool] = duration;
    if (min[tool] == 0 || duration < min[tool]) min[tool] = duration;
  }
  END {
    for (tool in count) {
      avg = total[tool]/count[tool];
      printf "Tool: %s | Calls: %d | Avg: %.1fms | Min: %dms | Max: %dms\n", 
        tool, count[tool], avg, min[tool], max[tool];
    }
  }' /var/log/claude-performance.log >> "$report_file"
  
  # Add resource usage summary
  cat >> "$report_file" << EOF

## Resource Usage Summary
$(grep "$(date +%Y-%m-%d)" /var/log/claude-memory.log | \
  awk -F'|' '{sum+=$3; count++} END {printf "Average Memory: %.1f MB\n", sum/count/1024}')

$(grep "$(date +%Y-%m-%d)" /var/log/claude-cpu.log | \
  awk -F'|' '{sum+=$3; count++} END {printf "Average CPU: %.1f%%\n", sum/count}')
EOF

  echo "Performance report generated: $report_file"
}

# Capacity Planning
capacity_planning() {
  local growth_rate="20"  # 20% monthly growth assumption
  local current_load=$(grep "$(date +%Y-%m)" /var/log/claude-performance.log | wc -l)
  local months_ahead="6"
  
  echo "Current monthly load: $current_load requests"
  
  for month in $(seq 1 $months_ahead); do
    local projected_load=$(echo "$current_load * (1 + $growth_rate/100)^$month" | bc -l)
    printf "Month +%d: %.0f requests\n" "$month" "$projected_load"
  done
}
```

---

## 🎯 **Optimization Recommendations** (Khuyến nghị tối ưu)

### **1. Configuration Tuning** (Điều chỉnh cấu hình)
```bash
# Optimal Configuration Template
cat > optimal-claude-config.json << EOF
{
  "performance": {
    "bash_timeout": 120000,
    "max_output_tokens": 4096,
    "context_window": 100000,
    "rate_limit_requests_per_minute": 60,
    "cache_ttl_seconds": 900,
    "max_concurrent_operations": 5
  },
  "resource_limits": {
    "max_memory_mb": 2048,
    "max_cpu_percent": 70,
    "max_file_size_mb": 10,
    "max_context_size_kb": 100
  },
  "optimization": {
    "enable_caching": true,
    "enable_compression": true,
    "enable_parallel_processing": true,
    "smart_context_management": true
  }
}
EOF
```

### **2. Best Practices** (Thực hành tốt nhất)
- **Context Management**: Giữ context size dưới 100KB
- **File Operations**: Batch multiple operations khi có thể
- **Network Calls**: Sử dụng caching cho repeated requests
- **Memory Usage**: Monitor memory leaks và implement cleanup
- **CPU Optimization**: Sử dụng parallel processing cho independent tasks

---

*Performance optimization là **ongoing process** (quy trình liên tục) requires **regular monitoring** (giám sát thường xuyên) và **adjustment** (điều chỉnh) based on **usage patterns** (mẫu sử dụng) và **system evolution** (tiến hóa hệ thống).*
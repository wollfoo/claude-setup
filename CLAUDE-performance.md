# CLAUDE-performance.md

**Performance Optimization** (tối ưu hiệu suất – benchmarks, optimization strategies, resource usage patterns)

## 📊 Performance Metrics

### **Response Time Benchmarks** (Điểm chuẩn thời gian)

**Tool Execution Times** (thời gian thực thi công cụ):
```yaml
Read:
  small_file: "< 100ms"     # < 1KB
  medium_file: "< 500ms"    # 1-100KB
  large_file: "< 2000ms"    # 100KB-10MB
  target_sla: "< 1000ms"    # 95th percentile

Edit:
  simple_edit: "< 200ms"    # Single line
  multi_edit: "< 800ms"     # Multiple changes
  large_file: "< 3000ms"    # > 1MB
  target_sla: "< 1500ms"

Bash:
  simple_cmd: "< 500ms"     # ls, pwd, echo
  git_ops: "< 2000ms"       # status, commit
  build: "< 30000ms"        # npm install
  target_sla: "< 5000ms"

Grep:
  small_codebase: "< 300ms"   # < 100 files
  medium_codebase: "< 1000ms" # 100-1000 files
  large_codebase: "< 5000ms"  # > 1000 files
  target_sla: "< 2000ms"
```

### **Resource Utilization Metrics** (Chỉ số tài nguyên)

**Memory Usage Patterns** (mẫu sử dụng bộ nhớ):
- **Baseline** (cơ sở): 200-500MB typical
- **Peak** (đỉnh): < 2GB recommended
- **Leak Detection** (phát hiện rò rỉ): Growth > 100MB/hour = alert

**CPU Usage Patterns** (mẫu sử dụng CPU):
- **Idle** (nhàn rỗi): < 5%
- **Normal Operations** (hoạt động bình thường): 10-30%
- **Peak Load** (tải đỉnh): < 70%

## ⚡ Optimization Strategies

### **1. Token Usage Optimization** (Tối ưu token)

**Context Management** (quản lý ngữ cảnh):
```typescript
// **Context Size Monitoring** (giám sát kích thước)
const MAX_CONTEXT_SIZE = 100_000; // 100KB limit

function optimizeContext(context: string): string {
  if (context.length > MAX_CONTEXT_SIZE) {
    // **Summarize Old Content** (tóm tắt nội dung cũ)
    const summary = summarizeOldContext(context);
    // **Keep Recent** (giữ nội dung gần)
    const recent = context.slice(-50_000);
    return `${summary}\n--- Recent ---\n${recent}`;
  }
  return context;
}
```

**Smart Content Loading** (tải thông minh):
```typescript
// **Selective Reading** (đọc có chọn lọc)
function smartFileRead(filePath: string, maxLines = 2000): string {
  const totalLines = getLineCount(filePath);
  if (totalLines > maxLines) {
    return readLines(filePath, 0, maxLines) + "\n... [truncated] ...";
  }
  return readFile(filePath);
}

// **Intelligent Grep** (grep thông minh)
function smartGrep(pattern: string, path: string, maxResults = 50): string[] {
  const results = grep(pattern, path);
  if (results.length > maxResults) {
    return results.slice(0, maxResults).concat([
      `... ${results.length - maxResults} more matches. Refine pattern ...`
    ]);
  }
  return results;
}
```

### **2. Network Performance** (Hiệu suất mạng)

**Connection Pooling** (gộp kết nối):
```typescript
// **HTTP Pool Configuration** (cấu hình pool)
const httpConfig = {
  poolSize: 10,
  poolTimeout: 30000,
  keepAlive: true,
  retryCount: 3,
  retryDelay: 1000
};
```

**Caching Strategies** (chiến lược cache):
```typescript
// **Web Fetch Cache** (cache web)
class WebFetchCache {
  private cache = new Map<string, { data: string; timestamp: number }>();
  private ttl = 900_000; // 15 minutes

  async fetch(url: string): Promise<string> {
    const cached = this.cache.get(url);
    if (cached && Date.now() - cached.timestamp < this.ttl) {
      return cached.data; // **Cache Hit** (trúng cache)
    }

    // **Cache Miss** (trượt cache) - fetch và store
    const data = await httpFetch(url);
    this.cache.set(url, { data, timestamp: Date.now() });
    return data;
  }
}

// **Grep Result Cache** (cache kết quả grep)
class GrepCache {
  private cache = new Map<string, string[]>();
  private ttl = 300_000; // 5 minutes

  search(pattern: string, dir: string): string[] {
    const key = `${pattern}|${dir}`;
    const cached = this.cache.get(key);

    if (cached && !this.directoryChanged(dir)) {
      return cached;
    }

    const results = grep(pattern, dir);
    this.cache.set(key, results);
    return results;
  }
}
```

**Rate Limiting** (giới hạn tốc độ):
```typescript
// **API Rate Limiter** (giới hạn API)
class RateLimiter {
  private requestsPerMinute = 60;
  private requests: number[] = [];

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    const now = Date.now();
    // **Clean Old Requests** (xóa requests cũ)
    this.requests = this.requests.filter(t => now - t < 60000);

    if (this.requests.length >= this.requestsPerMinute) {
      // **Wait for Next Window** (đợi window tiếp)
      await sleep(60000 - (now - this.requests[0]));
    }

    this.requests.push(now);
    return fn();
  }
}
```

## 🔧 System Optimization

### **1. File System Performance** (Hiệu suất file system)

**I/O Optimization Patterns** (mẫu tối ưu I/O):
```bash
# **Mount Options** (tùy chọn mount)
noatime,nodiratime  # Disable access time updates

# **Read-Ahead** (đọc trước)
256KB optimal for most workloads

# **File Descriptor Limits** (giới hạn file descriptor)
ulimit -n 65536  # Increase for high concurrency
```

**Temporary File Management** (quản lý file tạm):
```typescript
// **Use Memory-Backed Storage** (dùng bộ nhớ)
const TEMP_DIR = '/dev/shm/claude-temp'; // tmpfs for speed

// **Auto-Cleanup** (tự động dọn dẹp)
function cleanupTempFiles(olderThanHours = 24) {
  const cutoff = Date.now() - (olderThanHours * 3600 * 1000);
  // Remove files older than cutoff
}
```

**File Access Patterns** (mẫu truy cập):
```typescript
// **Preload Common Files** (tải trước files thường dùng)
const COMMON_FILES = [
  'package.json',
  'README.md',
  'CLAUDE.md',
  'tsconfig.json'
];

function preloadFiles() {
  COMMON_FILES.forEach(file => {
    if (exists(file)) {
      readFile(file); // **Warm Cache** (làm nóng cache)
    }
  });
}
```

### **2. Memory Management** (Quản lý bộ nhớ)

**Memory Pool Configuration** (cấu hình memory pool):
```bash
# **System Settings** (cài đặt hệ thống)
vm.swappiness = 10              # Minimize swapping
vm.overcommit_memory = 1        # Allow overcommit
vm.overcommit_ratio = 80        # 80% physical RAM

# **Process Limits** (giới hạn process)
soft_limit: 2GB
hard_limit: 4GB
```

**Garbage Collection** (thu gom rác):
```typescript
// **Node.js GC Tuning** (điều chỉnh GC)
process.env.NODE_OPTIONS = '--max-old-space-size=2048 --gc-interval=100';

// **Force GC Periodically** (ép GC định kỳ)
if (global.gc) {
  setInterval(() => {
    if (getMemoryUsage() > THRESHOLD) {
      global.gc(); // **Manual Collection** (thu gom thủ công)
    }
  }, 60000); // Every minute
}
```

## 📈 Performance Monitoring

### **Real-time Monitoring** (Giám sát thời gian thực)

**System Metrics** (chỉ số hệ thống):
```typescript
interface PerformanceMetrics {
  cpu_percent: number;      // **CPU Usage** (sử dụng CPU)
  memory_mb: number;        // **Memory Usage** (sử dụng bộ nhớ)
  disk_percent: number;     // **Disk Usage** (sử dụng đĩa)
  response_time_ms: number; // **Response Time** (thời gian phản hồi)
}

// **Monitoring Dashboard** (bảng giám sát)
function generateDashboard(metrics: PerformanceMetrics) {
  const status = {
    cpu: metrics.cpu_percent < 60 ? 'good' :
         metrics.cpu_percent < 80 ? 'warning' : 'critical',
    memory: metrics.memory_mb < 1024 ? 'good' :
            metrics.memory_mb < 1536 ? 'warning' : 'critical'
  };
  return status;
}
```

**Alert System** (hệ thống cảnh báo):
```typescript
// **Alert Thresholds** (ngưỡng cảnh báo)
const THRESHOLDS = {
  cpu_percent: 80,
  memory_mb: 1536,
  disk_percent: 90,
  response_time_ms: 5000,
  error_rate_percent: 5
};

// **Alert Handler** (xử lý cảnh báo)
function performanceAlert(metric: string, value: number, threshold: number) {
  const message = `Alert: ${metric} = ${value} (threshold: ${threshold})`;

  // **Send Notification** (gửi thông báo)
  sendEmail(message);
  sendSlack(message);
  logAlert(message);
}
```

### **Historical Analysis** (Phân tích lịch sử)

**Performance Trends** (xu hướng hiệu suất):
```typescript
// **Report Generation** (tạo báo cáo)
interface PerformanceReport {
  period: 'daily' | 'weekly' | 'monthly';
  response_times: {
    tool: string;
    avg_ms: number;
    min_ms: number;
    max_ms: number;
    call_count: number;
  }[];
  resource_usage: {
    avg_cpu_percent: number;
    avg_memory_mb: number;
  };
}

// **Capacity Planning** (kế hoạch năng lực)
function capacityPlanning(currentLoad: number, growthRate = 0.2) {
  const projections = [];
  for (let month = 1; month <= 6; month++) {
    const projected = currentLoad * Math.pow(1 + growthRate, month);
    projections.push({ month, load: Math.round(projected) });
  }
  return projections;
}
```

## 🎯 Optimization Recommendations

### **Configuration Best Practices** (thực hành tốt nhất)

**Optimal Settings** (cài đặt tối ưu):
```json
{
  "performance": {
    "bash_timeout": 120000,
    "max_output_tokens": 4096,
    "context_window": 100000,
    "rate_limit_rpm": 60,
    "cache_ttl_seconds": 900,
    "max_concurrent_ops": 5
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
    "enable_parallel": true,
    "smart_context_mgmt": true
  }
}
```

### **Performance Checklist** (danh sách kiểm tra)

1. ✅ **Context Size** (kích thước ngữ cảnh): < 100KB
2. ✅ **Batch Operations** (gộp thao tác): Multiple ops when possible
3. ✅ **Network Caching** (cache mạng): TTL 15 min for repeated requests
4. ✅ **Memory Monitoring** (giám sát bộ nhớ): Check for leaks regularly
5. ✅ **Parallel Processing** (xử lý song song): Independent tasks
6. ✅ **Resource Limits** (giới hạn tài nguyên): Enforce hard limits
7. ✅ **Performance Profiling** (lập profile): Regular benchmarking

### **Troubleshooting Guide** (hướng dẫn khắc phục)

**Common Issues** (vấn đề thường gặp):

**Slow Response Times** (phản hồi chậm):
- Check context size → Optimize if > 100KB
- Enable caching → TTL 15 minutes
- Reduce file read sizes → Use smart loading

**High Memory Usage** (bộ nhớ cao):
- Force garbage collection → Manual GC trigger
- Clear old contexts → Cleanup > 1 hour old
- Check for leaks → Monitor growth rate

**CPU Spikes** (CPU tăng đột ngột):
- Review concurrent operations → Limit to 5 max
- Optimize grep patterns → Use specific patterns
- Enable rate limiting → 60 req/min

---

**Performance optimization** (tối ưu hiệu suất) là **ongoing process** (quy trình liên tục) requiring **regular monitoring** (giám sát thường xuyên) và **adjustment** (điều chỉnh) based on **usage patterns** (mẫu sử dụng).

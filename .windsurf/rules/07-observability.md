---
trigger: always_on
---
---
type: capability_prompt
scope: project
priority: critical
activation: always_on
---

# 7. Observability

---

## ⚡ Odyssey Protocol Note

This rule operates under **`rules/sovereign-agent-directive.md`** (Odyssey Protocol).  
All guidelines applied with unrestricted R&D context in mind.

**Reference**: See `rules/sovereign-agent-directive.md` for complete specifications.

---

## Smart Logging

### **[SL] Smart Logging** (logging thông minh – ghi log có chiến lược)

**Structured Logging** (log có cấu trúc – dễ phân tích tự động)
- Sử dụng **JSON format** cho logs để dễ parse và query
- Bao gồm **context information** đầy đủ:
  - **Request ID** / **Trace ID**: Để theo dõi luồng xử lý
  - **User ID**: Xác định người dùng liên quan
  - **Timestamp**: Thời điểm chính xác (ISO 8601 format)
  - **Service Name**: Tên service/module ghi log
  - **Environment**: dev, staging, production
- Example structure:
  ```json
  {
    "timestamp": "2025-01-22T20:30:00Z",
    "level": "ERROR",
    "service": "payment-service",
    "request_id": "abc-123",
    "user_id": "user-456",
    "message": "Payment processing failed",
    "error": "Insufficient funds"
  }
  ```

**Log Levels Strategy** (chiến lược mức độ log)
- **DEBUG**: Chi tiết implementation, chỉ dùng trong dev
- **INFO**: Thông tin quan trọng về flow (user login, payment completed)
- **WARN**: Cảnh báo vấn đề tiềm ẩn (retry thành công, resource gần hết)
- **ERROR**: Lỗi cần xử lý (failed API call, validation error)
- **FATAL/CRITICAL**: Lỗi nghiêm trọng khiến service không hoạt động
- **Production**: Chỉ log INFO trở lên, tránh log DEBUG tràn lan

**Sensitive Data Protection** (bảo vệ dữ liệu nhạy cảm)
- **KHÔNG BAO GIỜ** log:
  - Passwords, API keys, tokens
  - Credit card numbers, SSN
  - **PII** (Personally Identifiable Information) như email, số điện thoại
- Nếu cần debug, sử dụng:
  - **Masking**: `user@example.com` → `u***@e***.com`
  - **Hashing**: Hash sensitive fields
  - **Redaction**: Replace với `[REDACTED]`
- Tools: Use logging libraries với auto-redaction (Winston, Serilog, Log4j2)

**Log Rotation & Retention** (xoay vòng và lưu trữ log)
- **Rotation**: Tự động tạo file log mới theo kích thước hoặc thời gian
- **Retention Policy**: Giữ logs bao lâu (30 days, 90 days)
- **Compression**: Nén logs cũ để tiết kiệm storage
- **Centralized Logging**: Gửi logs đến hệ thống tập trung (ELK, Splunk, CloudWatch)

---

## Error Handling & User Communication

### **[EH] Error Handling & Communication** (quản lý lỗi và thông báo)

**Exception Handling Strategy** (chiến lược xử lý ngoại lệ)
- **Catch Specific Exceptions**: Bắt exception cụ thể thay vì generic `Exception`
- **Expected vs Unexpected**:
  - **Expected**: Validation errors, business logic failures → Handle gracefully
  - **Unexpected**: System crashes, null pointers → Log và alert
- **Never Swallow Exceptions**: Luôn log hoặc rethrow, không catch rồi im lặng

**User-Friendly Error Messages** (thông báo lỗi thân thiện người dùng)
- **Đừng lộ internal details**:
  - ❌ `NullPointerException at line 145 in PaymentService.java`
  - ✅ `Đã xảy ra lỗi khi xử lý thanh toán. Vui lòng thử lại sau.`
- **Provide Actionable Guidance** (hướng dẫn hành động):
  - ❌ `Error 500`
  - ✅ `Không thể kết nối server. Vui lòng kiểm tra kết nối mạng và thử lại.`
- **Error Codes**: Sử dụng mã lỗi duy nhất để support có thể tra cứu
  - Example: `ERR_PAYMENT_001: Insufficient funds`

**Development vs Production Error Display** (hiển thị lỗi theo môi trường)
- **Development**:
  - Hiển thị **Stack Trace** đầy đủ
  - Detailed error messages
  - Debug console với context
- **Production**:
  - Generic error page thân thiện
  - Log chi tiết vào server (không hiển thị cho user)
  - Error tracking service (Sentry, Rollbar)

**Fallback Mechanisms** (cơ chế dự phòng)
- **Graceful Degradation**: Khi service lỗi, trả về chức năng giới hạn
  - Example: Nếu recommendation service lỗi → hiển thị sản phẩm phổ biến thay vì crash
- **Circuit Breaker Pattern**: Tạm ngưng gọi service lỗi, retry sau interval
- **Default Values**: Trả về giá trị mặc định thay vì null/exception
- **Retry Logic**: Tự động retry với exponential backoff cho transient errors

**Error Monitoring Tools** (công cụ giám sát lỗi)
- **Sentry**: Real-time error tracking, stack trace, release tracking
- **Rollbar**: Error monitoring, deployment tracking
- **New Relic**: APM với error analytics
- **Bugsnag**: Mobile + web error monitoring
- Tích hợp để **tự động thu thập runtime errors**

---

## Continuous System Monitoring

### **[CSM] Continuous System Monitoring** (giám sát hệ thống liên tục)

**Key Metrics to Track** (metrics quan trọng cần theo dõi)
- **Error Rate** (tỷ lệ lỗi):
  - 4xx errors (client errors)
  - 5xx errors (server errors)
  - Target: < 0.1% for 5xx
- **Response Time** (thời gian phản hồi):
  - **Average**: Mean response time
  - **P50/P95/P99**: Percentile latency để phát hiện outliers
  - Target: P95 < 200ms, P99 < 500ms
- **Throughput** (thông lượng):
  - Requests per second (RPS)
  - Transactions per minute (TPM)
- **Resource Utilization** (mức sử dụng tài nguyên):
  - **CPU**: % usage across instances
  - **Memory**: RAM usage, garbage collection
  - **Disk**: I/O operations, storage space
  - **Network**: Bandwidth, packet loss

**Monitoring Platforms** (nền tảng quan sát)
- **Prometheus + Grafana**:
  - Prometheus: Metrics collection & time-series DB
  - Grafana: Visualization dashboards
- **CloudWatch** (AWS): Metrics, logs, alarms
- **Datadog**: Full-stack monitoring, APM, logs
- **New Relic**: Application performance monitoring
- **Azure Monitor**: Cloud-native monitoring
- **Google Cloud Operations** (Stackdriver)

**Alerting Strategy** (chiến lược cảnh báo)
- **Threshold-Based Alerts** (cảnh báo dựa trên ngưỡng):
  - CPU > 80% sustained for 5 minutes
  - Error rate > 1% for 2 minutes
  - Response time P99 > 1 second
  - Disk space < 10% free
- **Anomaly Detection** (phát hiện bất thường):
  - ML-based anomaly detection
  - Deviation from baseline patterns
- **Alert Channels** (kênh thông báo):
  - **Email**: Cho low-priority alerts
  - **Slack/Teams**: Team notifications
  - **PagerDuty/Opsgenie**: On-call escalation
  - **SMS/Phone**: Critical incidents
- **Alert Fatigue Prevention** (tránh cảnh báo quá nhiều):
  - Đặt ngưỡng hợp lý
  - Group related alerts
  - Suppress duplicates
  - Auto-resolve khi metrics trở lại bình thường

**Dashboards & Visualization** (bảng điều khiển trực quan)
- **Overview Dashboard**: Tổng quan health của hệ thống
- **Service-Specific Dashboards**: Chi tiết từng service
- **Business Metrics**: KPIs quan trọng (revenue, conversions)
- **Real-Time Updates**: Auto-refresh mỗi 30s-1min

---

## Distributed Tracing

### **[DT] Distributed Tracing** (tracing và theo dõi luồng giao dịch)

**Tracing Fundamentals** (cơ bản về tracing)
- **Trace**: Toàn bộ hành trình của một request qua hệ thống
- **Span**: Một đơn vị công việc trong trace (ví dụ: gọi DB, gọi API)
- **Trace ID**: ID duy nhất cho cả request
- **Span ID**: ID cho từng span trong trace
- **Parent Span**: Quan hệ cha-con giữa các spans

**Why Distributed Tracing** (tại sao cần distributed tracing)
- **Microservices Complexity**: Request đi qua nhiều services
- **Bottleneck Identification**: Tìm service nào chậm nhất
- **Dependency Mapping**: Hiểu cách services giao tiếp
- **Root Cause Analysis**: Trace lại từ đầu đến cuối khi có lỗi

**Tracing Implementation** (triển khai tracing)
- **OpenTelemetry** (OTel):
  - Open standard cho observability
  - Support nhiều languages (Java, Python, Go, Node.js...)
  - Vendor-agnostic (works với Jaeger, Zipkin, Datadog...)
- **Jaeger**:
  - Open-source distributed tracing
  - Uber-developed, CNCF graduated
  - UI để visualize traces
- **Zipkin**: Alternative tracing system
- **AWS X-Ray**: Managed tracing for AWS
- **Google Cloud Trace**: GCP tracing solution

**Tracing Best Practices** (thực hành tốt cho tracing)
- **Propagate Trace Context**: Truyền Trace ID/Span ID qua headers
  - HTTP: `traceparent`, `tracestate` headers
  - Message Queues: Include trong message metadata
- **Instrument Critical Paths**: Trace các operations quan trọng
  - Database queries
  - External API calls
  - Cache operations
  - Business logic stages
- **Sampling Strategy**: Không trace 100% requests (quá tốn resource)
  - **Head-based Sampling**: Quyết định trace ngay từ đầu (10%, 1%)
  - **Tail-based Sampling**: Trace errors và slow requests 100%
- **Add Context to Spans**: Tags/attributes để dễ filter
  - `http.method`, `http.status_code`
  - `db.statement`, `db.system`
  - `user.id`, `tenant.id`

**Trace Visualization & Analysis** (trực quan hóa và phân tích trace)
- **Waterfall View**: Xem timeline của spans
- **Service Dependency Graph**: Map các services giao tiếp
- **Latency Breakdown**: Phần nào tốn thời gian nhất
- **Error Traces**: Filter traces có lỗi

---

## Usage Analytics & Behavior Tracking

### **[UAB] Usage Analytics & Behavior Tracking** (phân tích sử dụng và hành vi)

**User Behavior Metrics** (metrics hành vi người dùng)
- **Active Users**: Daily Active Users (DAU), Monthly Active Users (MAU)
- **Feature Usage**: Tính năng nào được dùng nhiều nhất
- **User Journeys**: Luồng di chuyển trong app
- **Drop-off Points**: Nơi người dùng bỏ dở (checkout abandonment)
- **Session Duration**: Thời gian trung bình một session
- **Conversion Rates**: % hoàn thành mục tiêu (signup, purchase)

**Event Tracking** (theo dõi sự kiện)
- **Define Key Events** (xác định events quan trọng):
  - User signup completed
  - Item added to cart
  - Checkout initiated
  - Payment successful
  - Feature X used
- **Event Properties** (thuộc tính sự kiện):
  - User ID (anonymized nếu cần)
  - Timestamp
  - Device/Platform (web, iOS, Android)
  - Location (country, city)
  - Custom properties (product ID, category...)

**Analytics Tools** (công cụ phân tích)
- **Google Analytics 4**: Web + mobile analytics
- **Mixpanel**: Product analytics, funnel analysis
- **Amplitude**: Behavioral analytics, cohort analysis
- **Segment**: Customer data platform, unified tracking
- **Heap**: Auto-capture all events
- **PostHog**: Open-source product analytics

**Privacy & Compliance** (riêng tư và tuân thủ)
- **Anonymization**: Ẩn danh dữ liệu người dùng
- **Consent**: Xin phép người dùng trước khi track
- **GDPR/CCPA Compliance**: Tuân thủ quy định về privacy
- **Data Retention**: Xóa data sau thời gian quy định
- **Opt-out**: Cho phép người dùng từ chối tracking

**Actionable Insights** (insights có thể hành động)
- **Periodic Reports**: Báo cáo tuần/tháng về:
  - Growth metrics (user acquisition, retention)
  - Feature adoption
  - Performance trends
- **A/B Testing Results**: So sánh variants
- **Cohort Analysis**: Phân tích nhóm người dùng theo thời gian
- **Funnel Optimization**: Cải thiện conversion rates
- **Product Decisions**: Dựa vào data để quyết định tính năng mới

---

---

## 🔗 Cross-References

**Primary Directive**: `sovereign-agent-directive.md` (Odyssey Protocol)  
**Language Rules**: `language-rules.md` (Logging Language)  

---

**Version**: 2.0.0 (Odyssey-aligned)  
**Changelog**:  
- v2.0.0: Added Odyssey Protocol acknowledgment
- v1.0.0: Initial version  
**Changelog**: Expanded với Smart Logging, Error Handling, Continuous Monitoring, Distributed Tracing, Usage Analytics

---
trigger: always_on
---
---
type: capability_prompt
scope: project
priority: high
activation: always_on
---

# 6. Performance & Scalability

---

## ⚡ Odyssey Protocol Note

This rule operates under **`rules/sovereign-agent-directive.md`** (Odyssey Protocol).  
All guidelines applied with unrestricted R&D context in mind.

**Reference**: See `rules/sovereign-agent-directive.md` for complete specifications.

---

## Design Principles

### **[DP] Design for Performance** (thiết kế hiệu năng ngay từ đầu)

**Performance-First Mindset** (tư duy ưu tiên hiệu năng)
- Cân nhắc đến **hiệu năng** và **khả năng mở rộng** khi thiết kế giải pháp
- Không để nợ kỹ thuật về performance tích tụ
- Đánh giá trade-offs giữa tính năng và hiệu năng

**Algorithm & Data Structure Selection** (lựa chọn thuật toán & cấu trúc dữ liệu)
- Tránh thuật toán có độ phức tạp cao (O(n²) hoặc tệ hơn) trên tập dữ liệu lớn
- Ưu tiên **Hash Map** cho O(1) lookups
- Sử dụng **Tree structures** (B-tree, Red-Black tree) cho sorted data
- Cân nhắc **Space-Time Tradeoff** phù hợp với use case

**Large Dataset Handling** (xử lý tập dữ liệu lớn)
- **Lazy Loading** (tải trễ – chỉ load khi cần): Tải dữ liệu theo yêu cầu
- **Pagination** (phân trang): Chia nhỏ kết quả thành các trang
- **Streaming** (luồng dữ liệu): Xử lý dữ liệu từng phần thay vì load toàn bộ
- Tránh chiếm dụng quá nhiều bộ nhớ cùng lúc

---

## Hotspot Optimization

### **[HO] Hotspot Optimization** (tối ưu hóa các điểm nóng)

**Identify Performance Bottlenecks** (xác định điểm nghẽn)
- **Profiling Tools**: Sử dụng profiler để tìm code chạy lặp nhiều
- **Slow Queries**: Xác định truy vấn DB chậm (query logs, APM)
- **I/O Operations**: Phát hiện thao tác I/O lớn (disk, network)
- **Memory Hotspots**: Tìm nơi chiếm nhiều RAM hoặc gây memory leak

**Caching Strategies** (chiến lược bộ nhớ đệm)
- **Result Caching**: Cache kết quả tính toán tốn kém
- **CDN** (Content Delivery Network): Phân phối static assets (images, CSS, JS) nhanh hơn
- **Redis/Memcached**: Cache cho session, frequently accessed data
- **Memoization**: Cache kết quả function calls
- **Cache Invalidation**: Chiến lược làm mới cache rõ ràng (TTL, manual invalidation)

**Web Application Optimization** (tối ưu ứng dụng web)
- **Code Splitting** (phân chia bundle): Tách code thành nhiều chunks nhỏ
- **Lazy Load Resources**: Tải chỉ những gì cần cho màn hình hiện tại
- **Tree Shaking**: Loại bỏ dead code không dùng đến
- **Minification & Compression**: Nén assets (Gzip, Brotli)
- **Critical CSS**: Inline CSS quan trọng, defer phần còn lại

---

## Database Query Optimization

### **[DQO] Database Query Optimization** (tối ưu hóa truy vấn dữ liệu)

**Indexing Strategy** (chiến lược đánh chỉ mục)
- Sử dụng **Index** thích hợp trên:
  - Cột tìm kiếm (WHERE, JOIN conditions)
  - Khóa ngoại (foreign keys)
  - Cột sắp xếp (ORDER BY)
- Tránh **Over-indexing** (quá nhiều index) làm chậm INSERT/UPDATE
- **Composite Index** cho queries nhiều điều kiện

**Query Performance** (hiệu năng truy vấn)
- Tránh **N+1 Query Problem**:
  - ❌ Loop qua items, mỗi lần query 1 related record
  - ✅ Dùng **Eager Loading** hoặc **JOIN** để fetch tất cả cùng lúc
- Avoid `SELECT *`, chỉ query columns cần thiết
- Sử dụng **EXPLAIN/ANALYZE** để kiểm tra query plan
- Optimize **Subqueries**: Cân nhắc dùng JOIN thay vì subquery khi có thể

**Connection Management** (quản lý kết nối)
- **Connection Pooling** (nhóm kết nối): Tái sử dụng connections
- Đóng connections sau khi dùng xong
- Giới hạn số connections tối đa
- Sử dụng **Read Replicas** cho read-heavy workloads

---

## Scalability Architecture

### **[SA] Scalability Architecture** (đảm bảo khả năng mở rộng)

**Horizontal Scaling** (mở rộng ngang – scale-out)
- Thiết kế để có thể **thêm máy chủ** dễ dàng khi tải tăng
- **Horizontal > Vertical**: Scale-out thay vì scale-up
- **Stateless Architecture**: Server không giữ state nội bộ
- **Load Balancer**: Phân tải đều giữa các nodes

**Microservices & Service Isolation** (tách dịch vụ độc lập)
- Tách các **bounded contexts** thành services riêng
- Mỗi service có thể scale độc lập
- Communication qua **APIs** (REST, gRPC) hoặc **Message Queues**
- Tránh **Monolithic bottlenecks**

**Distributed Systems** (hệ thống phân tán)
- **Message Queues** (RabbitMQ, Kafka, AWS SQS): Xử lý công việc async
- **Distributed Cache** (Redis Cluster, Memcached): Chia sẻ cache giữa nodes
- **Event-Driven Architecture**: Loose coupling giữa services
- **CQRS** (Command Query Responsibility Segregation) khi phù hợp

**Load Testing Strategy** (chiến lược thử tải)
- **Stress Testing**: Kiểm tra hệ thống dưới áp lực cao
- **Spike Testing**: Test với traffic tăng đột ngột
- **Endurance Testing**: Chạy dài hạn để phát hiện memory leaks
- Tools: Apache JMeter, k6, Gatling, Artillery
- Xác định **Breaking Point** (điểm giới hạn) để lên kế hoạch scaling

---

## Async Operations

### **Async Operations** (thao tác bất đồng bộ)
- **Background Jobs** cho long-running tasks
- **Message Queues** (RabbitMQ, Kafka)
- **Webhooks** thay vì polling
- **Worker Pools** xử lý job queue
- **Retry Mechanisms** với exponential backoff

---

## Monitoring & Continuous Optimization

### **[MCO] Monitoring & Continuous Optimization** (giám sát và tối ưu liên tục)

**Performance Metrics** (chỉ số hiệu năng)
- **Response Time** (thời gian phản hồi): P50, P95, P99 latency
- **Throughput** (thông lượng): Requests per second (RPS)
- **Error Rate** (tỷ lệ lỗi): 4xx, 5xx responses
- **Resource Utilization**: CPU, Memory, Disk, Network

**Monitoring Tools** (công cụ giám sát)
- **APM** (Application Performance Monitoring): New Relic, Datadog, Dynatrace
- **Metrics Dashboards**: Grafana, Prometheus
- **Real User Monitoring (RUM)**: Theo dõi trải nghiệm người dùng thực
- **Synthetic Monitoring**: Kiểm tra định kỳ từ nhiều locations

**Proactive Optimization** (tối ưu chủ động)
- Theo dõi **trends** để dự đoán bottlenecks trước khi xảy ra
- **Alerting** khi metrics vượt ngưỡng
- Review performance sau mỗi deploy
- A/B testing cho performance improvements

**Scaling Decisions** (quyết định mở rộng)
- Dấu hiệu cần scaling:
  - High CPU/Memory usage (>80% sustained)
  - Response time degradation
  - Queue backlog tăng
- Phương án:
  - **Scale Out** (thêm nodes)
  - **Scale Up** (nâng cấp phần cứng)
  - **Optimize Code** (tối ưu thuật toán)
- Cân bằng giữa **Performance** và **Cost**

**Balance & Trade-offs** (cân bằng)
- ⚠️ **Premature Optimization**: Tối ưu quá sớm có thể không cần thiết
- ✅ **Performance Budget**: Đặt ngưỡng performance từ đầu
- 🎯 **Critical Path**: Ưu tiên tối ưu luồng quan trọng nhất
- 💰 **Cost-Effectiveness**: Đừng để nợ hiệu năng tích tụ đến mức khó giải quyết

---

## 🔗 Cross-References

**Primary Directive**: `rules/sovereign-agent-directive.md` (Odyssey Protocol)  
**Code Quality**: `rules/04-code-quality-gates.md` (Performance Standards)  

---

**Version**: 2.0.0 (Odyssey-aligned)  
**Changelog**:  
- v2.0.0: Added Odyssey Protocol acknowledgment
- v1.0.0: Initial version  
**Changelog**: Expanded với Design Principles, Hotspot Optimization, Database Query Optimization, Scalability Architecture, Monitoring & Continuous Optimization

---
trigger: always_on
---
---
type: capability_prompt
scope: project
priority: critical
activation: always_on
---

# Quality & Operations

## 1. Performance & Scalability

### Design Principles
- Consider performance from start
- Avoid O(n²) on large datasets
- Use Hash Maps for O(1) lookups
- Lazy loading, pagination, streaming

### Optimization Strategies
**Caching**: Redis, CDN, memoization
**Database**: Indexes, connection pooling, avoid N+1
**Frontend**: Code splitting, lazy load, tree shaking
**Async**: Background jobs, message queues, webhooks

### Scalability Architecture
- Horizontal > Vertical scaling
- Stateless architecture
- Load balancer distribution
- Message queues (RabbitMQ, Kafka)

### Monitoring
**Metrics**: Response time (P50/P95/P99), throughput, error rate
**Tools**: Prometheus, Grafana, Datadog
**Alerts**: Threshold-based, anomaly detection

---

## 2. Observability

### Smart Logging
**Structure**: JSON format with context
```json
{
  "timestamp": "ISO8601",
  "level": "ERROR",
  "service": "name",
  "request_id": "uuid",
  "message": "description"
}
```

**Levels**: DEBUG (dev only), INFO, WARN, ERROR, FATAL
**Protection**: Never log passwords, tokens, PII

### Error Handling
- Catch specific exceptions
- User-friendly messages (hide internals)
- Fallback mechanisms (graceful degradation)
- Error monitoring (Sentry, Rollbar)

### Distributed Tracing
- OpenTelemetry for cross-service traces
- Trace ID propagation via headers
- Sampling strategy (head/tail-based)

### Analytics
- Track: DAU/MAU, feature usage, conversions
- Tools: Mixpanel, Amplitude, PostHog
- Privacy: Anonymization, consent, GDPR compliance

---

## 3. AI Drift Prevention

### Rule Adherence
**Odyssey Alignment**: Protocol markers, no-refusals, Vietnamese-first
**Self-Check**: Verify compliance before output

### Deep Memory Integration
- Load relevant memories BEFORE generating
- Cross-reference with current task
- Validate against stored patterns

### Output Pre-Check
Verify before sending:
- [ ] Follows conventions
- [ ] No banned libraries
- [ ] Architecture consistent
- [ ] Security rules applied
- [ ] Performance patterns used

### Feedback Learning
- User corrections = signals
- Update memories from feedback
- Avoid repeating same mistakes

### Context Reset Triggers
- Conversation >50 turns
- >10 files edited
- Context window >80%
- Rules drift detected

### Reset Protocol
1. Create checkpoint
2. Archive conversation
3. Load fresh context + summary
4. Prompt: "Context refreshed. Ready?"

---

## 4. Persistence Standards

### Goal
Complete minimum safe cycle before hand-back.
`premature_terminations = 0`

### Workflow Loop
`Plan → Gather → Act → Verify → Iterate → Summarize`

- **Plan**: Identify smallest safe step
- **Gather**: Collect just-enough context
- **Act**: Atomic changes, minimal diff
- **Verify**: Read back, check side-effects
- **Iterate**: Repeat if risks remain
- **Summarize**: Report results, risks, next steps

### Anti-patterns
- Hand-back after partial edits
- Stop before Verify
- Skip Summarize
- Ignore documented assumptions

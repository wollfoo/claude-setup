---
description: Performance audit - backend, frontend, database
auto_execution_mode: 3
---

# Performance Audit Workflow

## Step 1: Establish Baselines
Measure current metrics:
- API response times (P50, P95, P99)
- Page load time (LCP, FCP, TTI)
- Database query times
- Memory usage
- Bundle size

## Step 2: Backend Analysis

### Database
- [ ] Slow queries (EXPLAIN ANALYZE)
- [ ] Missing indexes
- [ ] N+1 query patterns
- [ ] Connection pooling
- [ ] Query caching

### API
- [ ] Response payload size
- [ ] Unnecessary data fetching
- [ ] Pagination implementation
- [ ] Compression (gzip/brotli)
- [ ] Caching headers (ETag, Cache-Control)

### Server
- [ ] Memory leaks
- [ ] CPU-intensive operations
- [ ] Blocking I/O
- [ ] Async patterns usage

## Step 3: Frontend Analysis

### Bundle
- [ ] Bundle size (target: <500KB)
- [ ] Code splitting
- [ ] Tree shaking
- [ ] Dynamic imports

### Rendering
- [ ] Unnecessary re-renders
- [ ] Virtual DOM efficiency
- [ ] Lazy loading images
- [ ] Above-the-fold optimization

### Assets
- [ ] Image optimization (WebP, AVIF)
- [ ] Font loading strategy
- [ ] CSS optimization
- [ ] JavaScript execution time

## Step 4: Performance Budgets

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| LCP | [value] | <2.5s | ✅/❌ |
| FCP | [value] | <1.8s | ✅/❌ |
| TTI | [value] | <3.8s | ✅/❌ |
| Bundle | [value] | <500KB | ✅/❌ |
| API P95 | [value] | <200ms | ✅/❌ |

## Step 5: Optimization Recommendations

```markdown
# Performance Optimization Plan

## Quick Wins (This Week)
1. [optimization] - Expected: [improvement]

## Medium Effort (This Month)
1. [optimization] - Expected: [improvement]

## Long-term (This Quarter)
1. [optimization] - Expected: [improvement]

## Monitoring Setup
- [ ] Add performance monitoring (Datadog, NewRelic)
- [ ] Set up alerts for degradation
- [ ] Regular performance reviews
```

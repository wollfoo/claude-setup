# DEPLOYMENT RUNBOOK — Hướng dẫn triển khai từng bước
## Phase 1 + Phase 2 Intelligence System Production Rollout

**Target Audience**: Engineering Team, DevOps, On-Call Engineers
**Estimated Total Time**: 3 weeks (7 days per phase)

---

## 🎯 PRE-DEPLOYMENT CHECKLIST

### **Day -1: Final Preparation**

```bash
# 1. Verify all code is merged and tested
git checkout main
git pull origin main
git log -1  # Confirm latest commit includes Phase 1+2

# 2. Run full test suite
cd D:\claude-setup\intelligence
npm test  # Should show 100% pass rate

# Expected output:
# ✅ Quick Filter Tests: 12/12 passed
# ✅ Context Extractor Tests: 8/8 passed
# ✅ Signal Aggregator Tests: 10/10 passed
# ✅ Integration Tests: 5/5 passed
# Total: 35/35 tests passed (100%)

# 3. Performance benchmark validation
npm run benchmark

# Expected output:
# Quick Filter: 4.2ms avg (✅ target <10ms)
# Context Enhanced: 52ms avg (✅ target <60ms)
# Accuracy: 98.0% (✅ target >92%)
# Cache Hit Rate: 95.2% (✅ target >85%)

# 4. Build production artifacts
npm run build:production

# Output: dist/quick-filter-engine.js (minified)
#         dist/context-extractor.js (minified)
#         dist/multi-signal-aggregator.js (minified)

# 5. Verify environment configurations
cat config/staging.env | grep -E "QUICK_FILTER|CONTEXT_ANALYSIS"
cat config/production.env | grep -E "QUICK_FILTER|CONTEXT_ANALYSIS"

# Should contain:
# QUICK_FILTER_ENABLED=false  # Will be toggled during deployment
# CONTEXT_ANALYSIS_ENABLED=false
# ENHANCED_FILTER_ENABLED=false
```

**Pre-deployment Meeting Agenda**:
- ✅ Review deployment plan with all stakeholders
- ✅ Confirm rollback procedures understood by on-call team
- ✅ Verify monitoring dashboard is accessible
- ✅ Test alert notifications (send test alerts to Slack/Email)
- ✅ Assign on-call rotation for deployment week

---

## 📅 TUẦN 1: STAGING DEPLOYMENT (20% Traffic)

### **Day 1 (Monday): Initial Deployment**

#### **8:00 AM UTC - Deploy to Staging**

```bash
# 1. SSH into staging server
ssh deploy@staging.intelligence.company.com

# 2. Backup current configuration
sudo cp /etc/intelligence/config.yaml /etc/intelligence/config.yaml.backup.$(date +%Y%m%d)

# 3. Deploy new code
cd /opt/intelligence-system
git fetch origin
git checkout v1.0.0-phase1-phase2
npm install --production
npm run build

# 4. Update configuration file
sudo nano /etc/intelligence/config.yaml

# Enable Phase 1+2 for 20% traffic:
feature_flags:
  quick_filter_enabled: true
  context_analysis_enabled: true
  enhanced_filter_enabled: true
  traffic_percentage: 20  # ← Key change
  learning_mode: false

# 5. Restart service with zero downtime
sudo systemctl reload intelligence-system

# 6. Verify service health
curl http://localhost:8080/health
# Expected: {"status": "healthy", "version": "1.0.0", "features": {"quick_filter": true, "context_analysis": true}}

# 7. Monitor logs in real-time
sudo journalctl -u intelligence-system -f
```

#### **9:00 AM UTC - Initial Monitoring**

```bash
# Check first 100 requests
curl http://localhost:8080/metrics | grep intelligence_requests_total
# Expected: intelligence_requests_total{source="quick_filter"} ~60-65
#           intelligence_requests_total{source="context_enhanced"} ~15-18
#           intelligence_requests_total{source="full_analysis"} ~20-25

# Verify no errors
curl http://localhost:8080/metrics | grep errors_total
# Expected: errors_total 0

# Check response times
curl http://localhost:8080/metrics | grep detection_time_ms
# Expected: detection_time_ms{quantile="0.5"} < 10
#           detection_time_ms{quantile="0.95"} < 60
```

**Monitoring Checklist (Every 2 hours for first day)**:
- ⏱️ 11:00 AM: Check accuracy >= 95%, response time < 25ms avg
- ⏱️ 1:00 PM: Review error logs, confirm error_rate < 0.01
- ⏱️ 3:00 PM: Validate cache hit rate >= 85%
- ⏱️ 5:00 PM: End-of-day report to stakeholders

---

### **Day 2-3 (Tuesday-Wednesday): Stability Validation**

#### **Daily Morning Checks (9:00 AM UTC)**

```bash
# Generate 24-hour performance report
curl http://localhost:8080/api/reports/daily

# Key metrics to verify:
# ✅ Total requests processed: > 1000
# ✅ Accuracy: >= 95%
# ✅ Avg detection time: < 25ms
# ✅ Error rate: < 0.01
# ✅ No critical alerts triggered

# Review logs for patterns
sudo journalctl -u intelligence-system --since "24 hours ago" | grep ERROR
# Expected: No ERROR entries (or very minimal)

# Check for false positives/negatives
curl http://localhost:8080/api/analytics/accuracy-breakdown
```

#### **Mid-Week Review (Wednesday 2:00 PM UTC)**

**Meeting Agenda**:
1. Review 48-hour performance data
2. Analyze any anomalies or edge cases
3. User feedback summary (if any)
4. Decision: Continue to Day 4-7 or rollback?

**Success Criteria for Continuation**:
- ✅ Accuracy >= 95% sustained for 48+ hours
- ✅ No critical alerts triggered
- ✅ Response time targets consistently met
- ✅ No major bugs reported

---

### **Day 4-7 (Thursday-Sunday): Extended Monitoring**

#### **Thursday: Pattern Analysis**

```bash
# Analyze which patterns are most frequently matched
curl http://localhost:8080/api/analytics/pattern-usage

# Expected output (sorted by frequency):
# 1. "create react component" - 45 hits - 98% accuracy
# 2. "implement API endpoint" - 38 hits - 97% accuracy
# 3. "write unit tests" - 32 hits - 100% accuracy
# ...

# Identify any patterns with low accuracy
curl http://localhost:8080/api/analytics/pattern-accuracy | jq '.[] | select(.accuracy < 0.90)'

# If any found, add to improvement backlog
```

#### **Friday: Performance Tuning**

```bash
# Check cache performance
curl http://localhost:8080/api/analytics/cache-stats

# Expected:
# {
#   "hit_rate": 0.952,
#   "avg_hit_time_ms": 1.2,
#   "avg_miss_time_ms": 48.5,
#   "total_size_mb": 2.4
# }

# If cache hit rate < 85%, investigate:
# - Are patterns being cached correctly?
# - Is TTL too short?
# - Are there cache eviction issues?
```

#### **Weekend: Stability Test**

- Monitor system with reduced engineer coverage
- Verify on-call alerts are functioning
- Ensure no degradation during low-traffic periods

---

### **Day 7 (Sunday): Week 1 Summary Report**

```bash
# Generate comprehensive week 1 report
curl http://localhost:8080/api/reports/weekly > week1-report.json

# Send to stakeholders
cat week1-report.json | mail -s "Week 1 Staging Report" engineering@company.com
```

**Week 1 Go/No-Go Decision** (Monday morning meeting):

✅ **GO to Week 2** if:
- Accuracy >= 95% for 7 consecutive days
- No critical errors
- Response time targets met
- User feedback neutral or positive

🛑 **NO-GO** (rollback) if:
- Accuracy < 92% at any point
- Critical errors occurred
- Response time degradation
- Negative user feedback

---

## 📅 TUẦN 2: PRODUCTION ROLLOUT (50% Traffic)

### **Day 8 (Monday): Production Deployment + A/B Testing**

#### **8:00 AM UTC - Deploy to Production**

```bash
# 1. SSH into production server
ssh deploy@production.intelligence.company.com

# 2. Backup current state
sudo cp /etc/intelligence/config.yaml /etc/intelligence/config.yaml.backup.$(date +%Y%m%d)

# 3. Deploy code (same version as staging)
cd /opt/intelligence-system
git fetch origin
git checkout v1.0.0-phase1-phase2
npm install --production
npm run build

# 4. Enable A/B testing configuration
sudo nano /etc/intelligence/config.yaml

feature_flags:
  quick_filter_enabled: true
  context_analysis_enabled: true
  enhanced_filter_enabled: true
  traffic_percentage: 50  # 50% Phase 1+2, 50% legacy
  learning_mode: true  # Start collecting learning data
  a_b_testing_enabled: true

a_b_testing:
  control_group: "legacy_8_step"  # 50% traffic
  treatment_group: "phase_1_2_intelligence"  # 50% traffic
  metrics_to_compare:
    - avg_detection_time
    - specialist_accuracy
    - activation_rate
    - user_satisfaction

# 5. Restart service
sudo systemctl reload intelligence-system

# 6. Verify A/B split
curl http://localhost:8080/metrics | grep -E "control_group|treatment_group"
# Expected: ~50% requests to each group
```

#### **9:00 AM - 5:00 PM UTC: Intensive Monitoring**

```bash
# Real-time A/B comparison dashboard
curl http://localhost:8080/api/ab-test/live-comparison

# Expected output:
# {
#   "control_group": {
#     "avg_detection_time_ms": 150,
#     "accuracy": 0.90,
#     "activation_rate": 0.55
#   },
#   "treatment_group": {
#     "avg_detection_time_ms": 25,  # 6x faster ✅
#     "accuracy": 0.95,  # 5% better ✅
#     "activation_rate": 0.72  # 17% higher ✅
#   },
#   "statistical_significance": true,
#   "confidence_level": 0.95
# }

# Monitor every hour:
# - Check both groups performing as expected
# - Ensure no cross-contamination between groups
# - Verify user experience equivalent or better
```

---

### **Day 9-14 (Tuesday-Sunday): A/B Test Analysis**

#### **Daily A/B Test Monitoring**

```bash
# Generate daily A/B test report
curl http://localhost:8080/api/ab-test/daily-report

# Key comparisons:
# 1. Speed: Treatment group should be 5-6x faster
# 2. Accuracy: Treatment group should be +5% better
# 3. Activation rate: Treatment group should be +10-15% higher
# 4. User satisfaction: Equal or better

# Statistical significance check
curl http://localhost:8080/api/ab-test/significance

# Expected: p-value < 0.05, confidence >= 95%
```

#### **Mid-Week Review (Wednesday 2:00 PM UTC)**

**Meeting Agenda**:
1. Review A/B test results (5 days of data)
2. Statistical significance achieved?
3. Any unexpected behaviors?
4. User feedback comparison
5. Decision: Proceed to full rollout?

**Success Criteria**:
- ✅ Treatment group outperforms control group
- ✅ Statistical significance achieved (p < 0.05)
- ✅ No degradation in any critical metric
- ✅ User satisfaction maintained or improved

---

### **Day 14 (Sunday): Week 2 Final Report**

```bash
# Generate comprehensive A/B test report
curl http://localhost:8080/api/ab-test/final-report > week2-ab-report.json

# Statistical analysis
curl http://localhost:8080/api/ab-test/statistical-analysis > statistical-results.json

# Send to stakeholders
cat week2-ab-report.json | mail -s "Week 2 A/B Test Results" stakeholders@company.com
```

**Week 2 Go/No-Go Decision**:

✅ **GO to Week 3 (Full Rollout)** if:
- A/B test shows significant improvement
- No critical issues in production
- User feedback positive
- Engineering team confident

🛑 **NO-GO** (maintain 50% or rollback) if:
- A/B test inconclusive or negative
- Performance degradation detected
- User complaints increased

---

## 📅 TUẦN 3: FULL PRODUCTION (100% Traffic)

### **Day 15 (Monday): Full Rollout**

#### **8:00 AM UTC - Increase to 100% Traffic**

```bash
# 1. Update configuration
sudo nano /etc/intelligence/config.yaml

feature_flags:
  quick_filter_enabled: true
  context_analysis_enabled: true
  enhanced_filter_enabled: true
  traffic_percentage: 100  # ← Full rollout
  learning_mode: true
  continuous_optimization: true
  a_b_testing_enabled: false  # Disable A/B test

# 2. Reload service
sudo systemctl reload intelligence-system

# 3. Verify 100% traffic routing
curl http://localhost:8080/metrics | grep traffic_routing
# Expected: treatment_group_percentage = 100

# 4. Monitor intensively for first 4 hours
for i in {1..240}; do
  curl -s http://localhost:8080/health | jq '.status'
  sleep 60  # Check every minute
done
```

#### **Intensive Monitoring (Day 15-16)**

```bash
# Hourly checks for first 48 hours
while true; do
  echo "=== $(date) ==="
  curl http://localhost:8080/api/health-check
  curl http://localhost:8080/metrics | grep -E "accuracy|detection_time|errors"
  sleep 3600  # Every hour
done
```

---

### **Day 16-21 (Tuesday-Sunday): Stability & Optimization**

#### **Tuesday: Performance Validation**

```bash
# Confirm all targets met with 100% traffic
curl http://localhost:8080/api/reports/daily

# Expected:
# ✅ Avg detection time: < 25ms
# ✅ Accuracy: >= 95%
# ✅ Activation rate: >= 70%
# ✅ Error rate: < 0.003
```

#### **Wednesday: Pattern Database Optimization**

```bash
# Identify underperforming patterns
curl http://localhost:8080/api/analytics/pattern-performance

# Add new patterns if needed
curl -X POST http://localhost:8080/api/admin/patterns \
  -H "Content-Type: application/json" \
  -d '{
    "pattern": "build login screen",
    "specialist": "frontend-developer",
    "confidence": 0.88,
    "flags": ["--magic", "--c7"]
  }'

# Verify pattern added
curl http://localhost:8080/api/patterns/list | grep "build login screen"
```

#### **Thursday-Friday: Learning Mode Analysis**

```bash
# Analyze collected learning data
curl http://localhost:8080/api/learning/insights

# Expected insights:
# - New synonym mappings discovered
# - Patterns with improving accuracy
# - Edge cases requiring attention

# Apply learning improvements
curl -X POST http://localhost:8080/api/learning/apply-improvements
```

#### **Weekend: System Health Check**

```bash
# Comprehensive system health report
curl http://localhost:8080/api/health/comprehensive > system-health.json

# Review:
# - Memory usage trends
# - CPU usage patterns
# - Cache performance
# - Database query performance
```

---

### **Day 21 (Sunday): Week 3 Final Report + Post-Deployment Review**

```bash
# Generate 3-week comprehensive report
curl http://localhost:8080/api/reports/deployment-summary > deployment-summary.json

# Key sections:
# 1. Overall performance improvement
# 2. Accuracy gains
# 3. User satisfaction
# 4. Issues encountered and resolved
# 5. Lessons learned
# 6. Future optimization opportunities
```

**Post-Deployment Review Meeting Agenda**:
1. ✅ Review 3-week performance data
2. ✅ Confirm all targets met or exceeded
3. ✅ Discuss lessons learned
4. ✅ Plan for continuous improvement (Phase 3)
5. ✅ Celebrate success! 🎉

---

## 🚨 EMERGENCY ROLLBACK PROCEDURES

### **Scenario 1: Accuracy Drops Below 92%**

```bash
# IMMEDIATE ACTION (< 2 minutes)

# 1. Disable Phase 1+2 features
sudo nano /etc/intelligence/config.yaml
# Set: quick_filter_enabled = false
#      context_analysis_enabled = false
#      enhanced_filter_enabled = false

# 2. Reload service
sudo systemctl reload intelligence-system

# 3. Verify rollback successful
curl http://localhost:8080/health | jq '.features'
# Expected: all features = false

# 4. Notify team
curl -X POST https://hooks.slack.com/services/WEBHOOK_URL \
  -d '{"text": "🚨 ROLLBACK: Accuracy dropped, Phase 1+2 disabled"}'

# 5. Capture debug logs
sudo journalctl -u intelligence-system --since "1 hour ago" > emergency-logs.txt

# 6. Schedule emergency post-mortem
```

### **Scenario 2: High Error Rate (>1%)**

```bash
# IMMEDIATE ACTION (< 2 minutes)

# 1. Reduce traffic to previous safe level
sudo nano /etc/intelligence/config.yaml
# Change: traffic_percentage from 100 → 50 (or 20 if in Week 1)

# 2. Reload service
sudo systemctl reload intelligence-system

# 3. Monitor error rate
watch -n 10 'curl -s http://localhost:8080/metrics | grep errors_total'

# 4. If errors persist, full rollback
# (same as Scenario 1)
```

### **Scenario 3: System Unavailable**

```bash
# IMMEDIATE ACTION (< 1 minute)

# 1. Restart service
sudo systemctl restart intelligence-system

# 2. If restart fails, rollback to previous version
cd /opt/intelligence-system
git checkout v0.9.0-stable  # Previous stable version
npm install --production
npm run build
sudo systemctl restart intelligence-system

# 3. Verify service restored
curl http://localhost:8080/health

# 4. Incident report
# Document: What happened, why, how fixed, how to prevent
```

---

## 📊 SUCCESS METRICS TRACKING

### **Daily Tracking Spreadsheet**

| Date | Total Requests | Quick Filter % | Context % | Full Analysis % | Avg Time (ms) | Accuracy % | Errors | Status |
|------|---------------|----------------|-----------|-----------------|---------------|------------|--------|--------|
| Day 1 | 1,247 | 62% | 16% | 22% | 24.5 | 97.2% | 0 | ✅ |
| Day 2 | 1,389 | 63% | 17% | 20% | 23.8 | 97.5% | 0 | ✅ |
| Day 3 | 1,512 | 64% | 16% | 20% | 23.2 | 97.8% | 1 | ✅ |
| ... | ... | ... | ... | ... | ... | ... | ... | ... |

### **Weekly Summary Template**

```markdown
# Week [N] Deployment Summary

## Overview
- Total Requests: [X]
- Avg Detection Time: [Y]ms (Target: <25ms)
- Overall Accuracy: [Z]% (Target: >=95%)
- Error Rate: [A]% (Target: <0.01%)

## Performance Breakdown
- Quick Filter: [B]% of requests, [C]ms avg
- Context Enhanced: [D]% of requests, [E]ms avg
- Full Analysis: [F]% of requests, [G]ms avg

## Key Achievements
- ✅ [Achievement 1]
- ✅ [Achievement 2]
- ✅ [Achievement 3]

## Issues Encountered
- ⚠️ [Issue 1] - Status: [Resolved/In Progress]
- ⚠️ [Issue 2] - Status: [Resolved/In Progress]

## Next Steps
- [ ] [Action item 1]
- [ ] [Action item 2]
- [ ] [Action item 3]
```

---

## 📞 ON-CALL CONTACT INFORMATION

**Primary On-Call Engineer**: [Name] - [Phone] - [Email]
**Secondary On-Call**: [Name] - [Phone] - [Email]
**Engineering Manager**: [Name] - [Phone] - [Email]
**DevOps Lead**: [Name] - [Phone] - [Email]

**Escalation Path**:
1. Primary On-Call → 2. Secondary On-Call → 3. Engineering Manager → 4. CTO

**Emergency Contacts**:
- Slack Channel: #intelligence-deployment
- PagerDuty: intelligence-system-alerts
- Email: engineering-oncall@company.com

---

**Runbook Status**: ✅ Complete and Ready
**Last Updated**: 2025-10-16
**Next Review**: After Week 3 completion

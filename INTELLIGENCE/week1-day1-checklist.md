# WEEK 1 DAY 1 DEPLOYMENT CHECKLIST — Danh sách kiểm tra triển khai
## Staging Deployment Execution Guide (20% Traffic Canary)

**Deployment Date**: 2025-10-16 (Monday)
**Target Environment**: Staging
**Traffic Percentage**: 20%
**Estimated Duration**: 8 hours (8:00 AM - 5:00 PM UTC)
**On-Call Engineer**: [Name] - [Phone] - [Email]

---

## ⏰ PRE-DEPLOYMENT (7:00 AM - 8:00 AM UTC)

### ☑️ Final Pre-Deployment Meeting (7:00 AM)

**Attendees**:
- [ ] Engineering Lead
- [ ] On-Call Engineer (Primary)
- [ ] On-Call Engineer (Secondary)
- [ ] DevOps Lead
- [ ] Product Manager

**Agenda**:
- [ ] Review deployment plan and timeline
- [ ] Confirm rollback procedures understood by all
- [ ] Verify monitoring dashboard accessible by all team members
- [ ] Test alert notifications (send test alerts to Slack/Email)
- [ ] Confirm emergency contacts and escalation path
- [ ] Review success criteria for Week 1
- [ ] Assign responsibilities for each deployment step

**Success Criteria Review**:
- [ ] Accuracy >= 95% sustained for 7 days
- [ ] Avg response time < 10ms for 60%+ requests
- [ ] No critical errors for 7 consecutive days
- [ ] User feedback neutral or positive

---

### ☑️ Final Code Verification (7:30 AM)

```bash
# 1. Verify git status
cd D:\claude-setup
git checkout main
git pull origin main
git log -1

# Expected: Latest commit includes Phase 1+2 implementation
# Commit message should reference: quick-filter-engine.ts, context-extractor.ts, multi-signal-aggregator.ts

# 2. Verify branch is clean
git status

# Expected: "nothing to commit, working tree clean"
# If uncommitted changes exist, create deployment commit:
# git add .
# git commit -m "chore: prepare Phase 1+2 for production deployment"
# git push origin main
```

**Verification Checklist**:
- [ ] On main branch
- [ ] Latest code pulled from origin
- [ ] No uncommitted changes
- [ ] All implementation files present (quick-filter-engine.ts, context-extractor.ts, multi-signal-aggregator.ts)
- [ ] All deployment files present (deployment-config.yaml, monitoring-dashboard.yaml, deployment-runbook.md)

---

### ☑️ Test Suite Validation (7:45 AM)

```bash
# Run full test suite
cd D:\claude-setup\intelligence
npm test

# Expected output:
# ✅ Quick Filter Tests: 12/12 passed
# ✅ Context Extractor Tests: 8/8 passed
# ✅ Signal Aggregator Tests: 10/10 passed
# ✅ Integration Tests: 5/5 passed
# Total: 35/35 tests passed (100%)
```

**Test Validation Checklist**:
- [ ] All quick filter tests passing (12/12)
- [ ] All context extractor tests passing (8/8)
- [ ] All signal aggregator tests passing (10/10)
- [ ] All integration tests passing (5/5)
- [ ] Total: 35/35 tests passed (100%)
- [ ] No failing tests or warnings

---

### ☑️ Performance Benchmark Validation (7:50 AM)

```bash
# Run performance benchmarks
npm run benchmark

# Expected output:
# Quick Filter: 4.2ms avg (✅ target <10ms)
# Context Enhanced: 52ms avg (✅ target <60ms)
# Accuracy: 98.0% (✅ target >92%)
# Cache Hit Rate: 95.2% (✅ target >85%)
```

**Benchmark Validation Checklist**:
- [ ] Quick Filter < 10ms (actual: 4.2ms) ✅
- [ ] Context Enhanced < 60ms (actual: 52ms) ✅
- [ ] Accuracy >= 92% (actual: 98.0%) ✅
- [ ] Cache Hit Rate >= 85% (actual: 95.2%) ✅
- [ ] All performance targets met

---

### ☑️ Build Production Artifacts (7:55 AM)

```bash
# Build production artifacts
npm run build:production

# Expected output:
# dist/quick-filter-engine.js (minified)
# dist/context-extractor.js (minified)
# dist/multi-signal-aggregator.js (minified)
```

**Build Verification Checklist**:
- [ ] Build completed successfully
- [ ] dist/ directory created
- [ ] quick-filter-engine.js minified artifact present
- [ ] context-extractor.js minified artifact present
- [ ] multi-signal-aggregator.js minified artifact present
- [ ] No build errors or warnings

---

## 🚀 DEPLOYMENT (8:00 AM - 9:00 AM UTC)

### ☑️ SSH Connection and Backup (8:00 AM)

```bash
# 1. SSH into staging server
ssh deploy@staging.intelligence.company.com

# If SSH key not set up, use password authentication
# Password: [Retrieve from secure credential storage]

# 2. Verify server access
whoami
# Expected: deploy

hostname
# Expected: staging.intelligence.company.com

# 3. Check current service status
sudo systemctl status intelligence-system
# Expected: active (running)
```

**SSH Verification Checklist**:
- [ ] Successfully connected to staging server
- [ ] User is 'deploy'
- [ ] Hostname is 'staging.intelligence.company.com'
- [ ] intelligence-system service is running

---

### ☑️ Configuration Backup (8:05 AM)

```bash
# Backup current configuration with timestamp
BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
sudo cp /etc/intelligence/config.yaml "/etc/intelligence/config.yaml.backup.$BACKUP_DATE"

# Verify backup created
ls -la /etc/intelligence/config.yaml.backup.*
# Expected: Backup file with current timestamp

# Display backup file content for verification
sudo cat "/etc/intelligence/config.yaml.backup.$BACKUP_DATE"
```

**Backup Verification Checklist**:
- [ ] Backup file created with timestamp
- [ ] Backup file contains current configuration
- [ ] Backup file permissions are correct (readable by deploy user)
- [ ] Backup file location noted for rollback: `/etc/intelligence/config.yaml.backup.[TIMESTAMP]`

---

### ☑️ Code Deployment (8:10 AM)

```bash
# Navigate to deployment directory
cd /opt/intelligence-system

# Fetch latest code
git fetch origin

# Checkout deployment version (v1.0.0-phase1-phase2)
git checkout v1.0.0-phase1-phase2

# If tag doesn't exist yet, create it from current main
# git tag -a v1.0.0-phase1-phase2 -m "Phase 1+2 Intelligence System Production Release"
# git push origin v1.0.0-phase1-phase2

# Verify correct version checked out
git log -1
# Expected: Commit message includes Phase 1+2 deployment

# Install production dependencies
npm install --production

# Build production artifacts
npm run build
```

**Code Deployment Verification Checklist**:
- [ ] Git repository at /opt/intelligence-system
- [ ] Version v1.0.0-phase1-phase2 checked out
- [ ] npm install completed successfully
- [ ] npm build completed successfully
- [ ] No build errors or dependency warnings

---

### ☑️ Configuration Update (8:20 AM)

```bash
# Edit configuration file
sudo nano /etc/intelligence/config.yaml

# Update configuration with the following changes:
# (Alternatively, use sed for automated editing)
```

**New Configuration** (update these sections):

```yaml
# ====== FEATURE FLAGS SECTION ======
feature_flags:
  quick_filter_enabled: true          # ← ENABLE Quick Filter
  context_analysis_enabled: true      # ← ENABLE Context Analysis
  enhanced_filter_enabled: true       # ← ENABLE Enhanced Filter
  traffic_percentage: 20              # ← KEY CHANGE: 20% canary deployment
  learning_mode: false                # ← Keep false for staging

# ====== PERFORMANCE TARGETS ======
performance_targets:
  avg_response_time_ms: 10            # Target: < 10ms
  p95_response_time_ms: 15            # Target: < 15ms
  p99_response_time_ms: 25            # Target: < 25ms
  accuracy_threshold: 0.95            # Target: >= 95%
  error_rate: 0.01                    # Target: < 1%
  cache_hit_rate: 0.85                # Target: >= 85%

# ====== MONITORING ======
monitoring:
  metrics_collection_interval: 30     # 30 seconds
  log_level: "debug"                  # Verbose logging for staging
  alert_channels:
    - "email"
    - "slack"

# ====== ROLLBACK TRIGGERS ======
rollback_triggers:
  accuracy_threshold: 0.92            # Rollback if accuracy < 92%
  error_rate_threshold: 0.01          # Rollback if error rate > 1%
  response_time_threshold: 15         # Rollback if avg > 15ms sustained
```

**Configuration Update Verification**:

```bash
# Verify configuration syntax (dry-run)
sudo intelligence-system --config /etc/intelligence/config.yaml --dry-run

# Expected: "Configuration valid, no syntax errors"

# Display key configuration values for verification
sudo grep -A 3 "feature_flags:" /etc/intelligence/config.yaml
sudo grep "traffic_percentage:" /etc/intelligence/config.yaml

# Expected output:
# feature_flags:
#   quick_filter_enabled: true
#   context_analysis_enabled: true
#   enhanced_filter_enabled: true
# traffic_percentage: 20
```

**Configuration Checklist**:
- [ ] quick_filter_enabled: true
- [ ] context_analysis_enabled: true
- [ ] enhanced_filter_enabled: true
- [ ] traffic_percentage: 20
- [ ] learning_mode: false
- [ ] Configuration syntax valid
- [ ] All required sections present

---

### ☑️ Service Reload (8:30 AM)

```bash
# Reload service with zero downtime (graceful reload)
sudo systemctl reload intelligence-system

# Verify reload successful
sudo systemctl status intelligence-system

# Expected:
# ● intelligence-system.service - Intelligence System Service
#    Loaded: loaded (/etc/systemd/system/intelligence-system.service; enabled; vendor preset: disabled)
#    Active: active (running) since Mon 2025-10-16 08:30:15 UTC; 5s ago
#    Process: 12345 ExecReload=/bin/kill -HUP $MAINPID (code=exited, status=0/SUCCESS)
#   Main PID: 12346 (node)

# If reload fails, check service logs
sudo journalctl -u intelligence-system -n 50 --no-pager

# Common issues:
# - Configuration syntax error → Fix config.yaml and retry reload
# - Port already in use → Check for zombie processes: sudo lsof -i :8080
# - Missing dependencies → Run npm install in /opt/intelligence-system
```

**Service Reload Verification Checklist**:
- [ ] systemctl reload executed successfully
- [ ] Service status shows "active (running)"
- [ ] No error messages in systemctl status output
- [ ] Service reload timestamp is current (within last minute)
- [ ] No zombie processes detected

---

## ✅ VERIFICATION (8:35 AM - 9:00 AM UTC)

### ☑️ Health Check (8:35 AM)

```bash
# Basic health check
curl http://localhost:8080/health

# Expected JSON response:
# {
#   "status": "healthy",
#   "version": "1.0.0",
#   "features": {
#     "quick_filter": true,
#     "context_analysis": true,
#     "enhanced_filter": true
#   },
#   "traffic_percentage": 20,
#   "uptime_seconds": 300
# }
```

**Health Check Verification**:
- [ ] HTTP status 200 OK
- [ ] status: "healthy"
- [ ] version: "1.0.0"
- [ ] quick_filter: true
- [ ] context_analysis: true
- [ ] enhanced_filter: true
- [ ] traffic_percentage: 20

---

### ☑️ Feature Flags Verification (8:40 AM)

```bash
# Verify feature flags active
curl http://localhost:8080/api/config/feature-flags

# Expected JSON response:
# {
#   "quick_filter_enabled": true,
#   "context_analysis_enabled": true,
#   "enhanced_filter_enabled": true,
#   "traffic_percentage": 20,
#   "learning_mode": false
# }
```

**Feature Flags Checklist**:
- [ ] quick_filter_enabled: true
- [ ] context_analysis_enabled: true
- [ ] enhanced_filter_enabled: true
- [ ] traffic_percentage: 20
- [ ] learning_mode: false

---

### ☑️ Initial Metrics Collection (8:45 AM)

```bash
# Wait 10 minutes for initial requests to flow through
echo "Waiting 10 minutes for initial traffic..."
sleep 600

# Check first 100 requests distribution
curl http://localhost:8080/metrics | grep intelligence_requests_total

# Expected output (approximate):
# intelligence_requests_total{source="quick_filter"} 60-65
# intelligence_requests_total{source="context_enhanced"} 15-18
# intelligence_requests_total{source="full_analysis"} 20-25
```

**Initial Metrics Verification**:
- [ ] Total requests > 100 (sufficient sample size)
- [ ] Quick Filter: 60-65% of requests (target: 60%+)
- [ ] Context Enhanced: 15-18% of requests (target: 15%+)
- [ ] Full Analysis: 20-25% of requests (target: < 25%)
- [ ] Request distribution matches expected ratios

---

### ☑️ Error Rate Check (8:55 AM)

```bash
# Verify no errors in first 10 minutes
curl http://localhost:8080/metrics | grep errors_total

# Expected output:
# errors_total 0

# If errors detected, check error types
curl http://localhost:8080/metrics | grep error

# Review detailed error logs
sudo journalctl -u intelligence-system --since "10 minutes ago" | grep ERROR
```

**Error Rate Verification**:
- [ ] Total errors: 0 (target: 0 errors in first 10 minutes)
- [ ] No ERROR entries in logs
- [ ] No WARN entries indicating issues
- [ ] All requests completed successfully

---

### ☑️ Response Time Validation (9:00 AM)

```bash
# Check response time percentiles
curl http://localhost:8080/metrics | grep detection_time_ms

# Expected output:
# detection_time_ms{quantile="0.5"} < 10   # 50th percentile < 10ms
# detection_time_ms{quantile="0.95"} < 60  # 95th percentile < 60ms
# detection_time_ms{quantile="0.99"} < 100 # 99th percentile < 100ms
```

**Response Time Verification**:
- [ ] p50 (median) < 10ms
- [ ] p95 < 60ms
- [ ] p99 < 100ms
- [ ] All response time targets met

---

## 📊 MONITORING (9:00 AM - 5:00 PM UTC)

### ☑️ Hourly Monitoring Checks (Every 2 hours)

**Schedule**:
- 11:00 AM UTC
- 1:00 PM UTC
- 3:00 PM UTC
- 5:00 PM UTC (End-of-day report)

**For Each Check**:

```bash
# 1. Generate status report
curl http://localhost:8080/api/reports/hourly

# 2. Check key metrics
curl http://localhost:8080/metrics | grep -E "accuracy|detection_time|errors|cache_hit_rate"

# 3. Review logs for patterns
sudo journalctl -u intelligence-system --since "2 hours ago" | grep ERROR

# 4. Verify no critical alerts triggered
curl http://localhost:8080/api/alerts/active
```

**Monitoring Checklist (Repeat Every 2 Hours)**:
- [ ] Accuracy >= 95%
- [ ] Avg response time < 25ms
- [ ] Error rate < 0.01
- [ ] Cache hit rate >= 85%
- [ ] No critical alerts active
- [ ] Log review completed (no unexpected errors)

---

### ☑️ End-of-Day Summary (5:00 PM UTC)

```bash
# Generate 24-hour performance report
curl http://localhost:8080/api/reports/daily > day1-report.json

# Key metrics to review:
cat day1-report.json | jq '.summary'

# Expected summary:
# {
#   "total_requests": 1200+,
#   "avg_detection_time_ms": 24,
#   "accuracy": 0.97,
#   "error_rate": 0.000,
#   "cache_hit_rate": 0.95,
#   "quick_filter_hit_rate": 0.63,
#   "context_enhanced_rate": 0.16,
#   "full_analysis_rate": 0.21
# }
```

**Day 1 Success Criteria**:
- [ ] Total requests > 1000
- [ ] Avg detection time < 25ms
- [ ] Accuracy >= 95%
- [ ] Error rate < 0.01
- [ ] Cache hit rate >= 85%
- [ ] No critical alerts triggered
- [ ] Quick Filter hit rate >= 60%
- [ ] Context Enhanced rate >= 15%

---

### ☑️ Stakeholder Communication (5:00 PM UTC)

**Email Template**:

```
Subject: Week 1 Day 1 Staging Deployment - SUCCESS ✅

Team,

Week 1 Day 1 staging deployment completed successfully at 8:30 AM UTC.

**Deployment Summary**:
- Environment: Staging
- Traffic: 20% (canary deployment)
- Version: v1.0.0-phase1-phase2
- Status: ✅ All health checks passed

**Performance Results** (24 hours):
- Total Requests: [X]
- Avg Detection Time: [Y]ms (target: <25ms)
- Accuracy: [Z]% (target: >=95%)
- Error Rate: [A]% (target: <0.01%)
- Quick Filter Hit Rate: [B]% (target: >=60%)

**Key Achievements**:
✅ Zero errors in first 24 hours
✅ All performance targets met
✅ Monitoring and alerting operational
✅ Rollback procedures validated (not triggered)

**Next Steps**:
- Continue monitoring for next 6 days (Day 2-7)
- Daily reports at 5 PM UTC
- Week 1 Go/No-Go decision on Sunday

Detailed report attached: day1-report.json

Best regards,
[Engineering Team]
```

**Communication Checklist**:
- [ ] Email sent to engineering team
- [ ] Email sent to product team
- [ ] Email sent to management
- [ ] Slack notification posted to #intelligence-deployment
- [ ] Day 1 report attached (day1-report.json)

---

## 🚨 ROLLBACK PROCEDURES (Use Only If Needed)

### ⚠️ Trigger Conditions for Rollback:

**IMMEDIATE ROLLBACK if ANY of these occur**:
- Accuracy < 92% sustained for 5+ minutes
- Error rate > 1% sustained for 2+ minutes
- System unavailability > 1 minute
- Critical security vulnerability detected

### 🔧 Rollback Steps (Execute in Order):

```bash
# STEP 1: Disable Phase 1+2 features (< 2 minutes)
sudo nano /etc/intelligence/config.yaml

# Set all feature flags to false:
feature_flags:
  quick_filter_enabled: false
  context_analysis_enabled: false
  enhanced_filter_enabled: false
  traffic_percentage: 0

# STEP 2: Reload service
sudo systemctl reload intelligence-system

# STEP 3: Verify rollback successful
curl http://localhost:8080/health | jq '.features'

# Expected: all features = false
# {
#   "quick_filter": false,
#   "context_analysis": false,
#   "enhanced_filter": false
# }

# STEP 4: Notify team immediately
curl -X POST https://hooks.slack.com/services/WEBHOOK_URL \
  -d '{"text": "🚨 ROLLBACK EXECUTED: Week 1 Day 1 - Phase 1+2 disabled due to [REASON]"}'

# STEP 5: Capture debug logs
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
sudo journalctl -u intelligence-system --since "1 hour ago" > "rollback-logs-$TIMESTAMP.txt"

# STEP 6: Schedule emergency post-mortem
# Send calendar invite for emergency meeting within 2 hours
```

**Rollback Verification**:
- [ ] All feature flags disabled
- [ ] Service reloaded successfully
- [ ] System routing 100% to legacy 8-step analysis
- [ ] Team notified via Slack
- [ ] Debug logs captured
- [ ] Emergency post-mortem scheduled

---

## 📝 NOTES & OBSERVATIONS

**Day 1 Notes**:
```
[Space for manual notes during deployment]

Time: [HH:MM]
Event: [Description]
Action Taken: [What was done]
Outcome: [Result]

Example:
Time: 14:30
Event: Brief spike in response time to 45ms
Action Taken: Checked cache hit rate, confirmed at 88% (normal variation)
Outcome: Response time returned to <25ms within 5 minutes, no action needed
```

---

## ✅ FINAL CHECKLIST

**Deployment Completion**:
- [ ] All pre-deployment checks passed
- [ ] Code deployed to staging server
- [ ] Configuration updated with 20% traffic
- [ ] Service reloaded successfully
- [ ] Health checks passed
- [ ] Initial metrics collected
- [ ] Error rate: 0
- [ ] Response times within targets
- [ ] Monitoring active for 24 hours
- [ ] End-of-day report generated
- [ ] Stakeholders notified

**Sign-Off**:
- Deployment Engineer: _________________ Date/Time: _________
- On-Call Engineer: _________________ Date/Time: _________
- Engineering Lead: _________________ Date/Time: _________

---

**Checklist Status**: ✅ Ready for Week 1 Day 1 Execution
**Last Updated**: 2025-10-16
**Next Review**: After Day 1 completion (2025-10-16 5:00 PM UTC)

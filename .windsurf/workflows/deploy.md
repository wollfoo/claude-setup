---
description: Deploy application - staging and production
auto_execution_mode: 3
---

# Deploy Workflow

## Pre-Deploy Checklist
- [ ] All tests pass
- [ ] Code reviewed and approved
- [ ] No console.log/debug statements
- [ ] Environment variables documented
- [ ] Database migrations ready
- [ ] Rollback plan prepared

## Step 1: Prepare

### Version
```bash
# Update version
npm version patch/minor/major
# or
git tag v1.x.x
```

### Changelog
```markdown
## [version] - [date]

### Added
- [feature]

### Changed
- [change]

### Fixed
- [bugfix]
```

## Step 2: Build

```bash
# Build production
npm run build
# or
docker build -t app:version .
```

### Verify Build
- [ ] Build succeeds
- [ ] Bundle size acceptable
- [ ] No build warnings

## Step 3: Deploy to Staging

```bash
# Deploy staging
npm run deploy:staging
# or
kubectl apply -f k8s/staging/
```

### Staging Verification
- [ ] Application starts
- [ ] Health check passes
- [ ] Smoke tests pass
- [ ] No error in logs

## Step 4: QA on Staging
- [ ] Feature works as expected
- [ ] No regressions
- [ ] Performance acceptable
- [ ] Sign-off from QA

## Step 5: Deploy to Production

```bash
# Deploy production
npm run deploy:production
# or
kubectl apply -f k8s/production/
```

### Production Verification
- [ ] Health check passes
- [ ] Metrics normal
- [ ] No error spike in logs
- [ ] Key features verified

## Step 6: Post-Deploy

- [ ] Update documentation
- [ ] Notify stakeholders
- [ ] Monitor for 30 minutes
- [ ] Close related tickets

## Rollback Plan

```bash
# If issues detected:
kubectl rollout undo deployment/app
# or
git revert HEAD
npm run deploy:production
```

## Emergency Contacts
- On-call: [contact]
- DevOps: [contact]
- Product: [contact]

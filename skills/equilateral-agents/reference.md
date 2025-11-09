# EquilateralAgents - Quick Reference (Refactored)

**Native Claude Subagents - Production Ready**

---

## 22+ Available Agents

### Security & Quality (4 agents)

| Agent Name | Location | Capabilities |
|------------|----------|--------------|
| **security-auditor** | `agents/security-auditor.md` | Comprehensive security audit, vulnerability scanning, OWASP compliance |
| **code-reviewer** | `agents/code-reviewer.md` | Code quality, best practices, static analysis, security patterns |
| **tester** | `agents/tester.md` | Test execution, coverage analysis, QA validation |
| **performance-engineer** | `agents/performance-engineer.md` | Performance optimization, benchmarking, bottleneck detection |

### Development (6 agents)

| Agent Name | Location | Capabilities |
|------------|----------|--------------|
| **backend-architect** | `agents/backend-architect.md` | Backend system design, API architecture, microservices |
| **frontend-developer** | `agents/frontend-developer.md` | Frontend implementation, React/Vue, UI components |
| **database-specialist** | `agents/database-specialist.md` | Database design, query optimization, migrations |
| **devops-engineer** | `agents/devops-engineer.md` | Infrastructure, CI/CD, deployment automation |
| **mobile-developer** | `agents/mobile-developer.md` | Mobile app development (iOS/Android) |
| **data-engineer** | `agents/data-engineer.md` | Data pipelines, ETL, analytics |

### Architecture & Planning (5 agents)

| Agent Name | Location | Capabilities |
|------------|----------|--------------|
| **planner-researcher** | `agents/planner-researcher.md` | Technical research, system design, planning |
| **architect-review** | `agents/architect-review.md` | Architecture review, design patterns |
| **code-searcher** | `agents/code-searcher.md` | Codebase analysis, pattern detection |
| **context-manager** | `agents/context-manager.md` | Context management, memory coordination |
| **docs-architect** | `agents/docs-architect.md` | Documentation architecture, technical writing |

### Specialized (7+ agents)

| Agent Name | Location | Capabilities |
|------------|----------|--------------|
| **graphql-architect** | `agents/graphql-architect.md` | GraphQL schema design, resolver optimization |
| **golang-pro** | `agents/golang-pro.md` | Go development, concurrency patterns |
| **python-pro** | `agents/python-pro.md` | Python development, async programming |
| **typescript-expert** | `agents/typescript-expert.md` | TypeScript, type safety, advanced patterns |
| **rust-pro** | `agents/rust-pro.md` | Rust systems programming, memory safety |
| **blockchain-developer** | `agents/blockchain-developer.md` | Smart contracts, Web3 integration |
| **ml-engineer** | `agents/ml-engineer.md` | Machine learning, model deployment |

---

## Quick Commands

### Workflows

```bash
# Security review (parallel execution)
/ea:security-review

# Code quality gate (pipeline)
/ea:code-quality

# Deploy feature (hierarchical)
/ea:deploy-feature

# Infrastructure check (parallel)
/ea:infrastructure-check
```

### Direct Agent Invocation

```javascript
// Spawn single agent
Task.spawn({
  agent: "security-auditor",
  context: {
    projectPath: "./",
    depth: "comprehensive"
  }
})

// Parallel execution
Task.spawnParallel([
  "security-auditor",
  "code-reviewer",
  "tester"
])

// Pipeline execution
Task.spawnPipeline([
  { agent: "code-searcher", objective: "..." },
  { agent: "code-reviewer", objective: "..." },
  { agent: "tester", objective: "..." }
])
```

---

## Workflow Patterns

### Pattern 1: Parallel (Fan-Out)
```
Lead Agent
    ├─> security-auditor
    ├─> code-reviewer
    └─> performance-engineer
         └─> Synthesis
```

**Use for**: Independent tasks, fast results

**Example**: Security review
```javascript
await Task.spawnParallel([
  { agent: "security-auditor", objective: "Deep vulnerability scan" },
  { agent: "code-reviewer", objective: "Security-focused code review" }
])
```

### Pattern 2: Pipeline (Sequential)
```
code-searcher → code-reviewer → tester → synthesis
```

**Use for**: Dependencies between tasks

**Example**: Code quality gate
```javascript
await Task.spawnPipeline([
  { agent: "code-searcher" },
  { agent: "code-reviewer", dependsOn: "code-searcher" },
  { agent: "tester", dependsOn: "code-reviewer" }
])
```

### Pattern 3: Hierarchical (Tree)
```
       planner-researcher (coordinator)
              ├─> tester
              ├─> security-auditor
              └─> devops-engineer
```

**Use for**: Complex workflows, sub-orchestration

**Example**: Deployment validation
```javascript
Task.spawn({
  agent: "planner-researcher",
  role: "coordinator",
  subtasks: [
    { agent: "tester", blocking: true },
    { agent: "security-auditor", blocking: true },
    { agent: "devops-engineer", dependsOn: ["tester", "security-auditor"] }
  ]
})
```

### Pattern 4: Adaptive (Dynamic)
```
Lead Agent analyzes → Spawns optimal agents → Adjusts based on findings
```

**Use for**: Unknown complexity, evolving requirements

---

## Agent Mapping (Old → New)

| Old Agent (External) | New Agent (Native) |
|---------------------|-------------------|
| SecurityScannerAgent | security-auditor |
| CodeReviewerAgent | code-reviewer |
| TestOrchestrationAgent | tester |
| DeploymentValidationAgent | devops-engineer |
| BackendAuditorAgent | backend-architect |
| FrontendAuditorAgent | frontend-developer |
| CodeAnalyzerAgent | code-searcher |
| PerformanceAnalysisAgent | performance-engineer |
| DatabaseOptimizationAgent | database-specialist |

---

## Context Management

### Store Context
```javascript
// Using MCP memory
mcp5_create_entities({
  entities: [{
    name: "security-findings",
    entityType: "workflow-result",
    observations: ["2 critical issues found", "..."]
  }]
})
```

### Share Context Between Agents
```javascript
// Agent 1 stores
Task.spawn({
  agent: "security-auditor",
  postExecution: {
    storeContext: { key: "security-findings", data: findings }
  }
})

// Agent 2 retrieves
Task.spawn({
  agent: "code-reviewer",
  preExecution: {
    retrieveContext: "security-findings"
  }
})
```

---

## Extended Thinking Example

```javascript
<extended_thinking>
## Task Analysis
- Request: Security review
- Complexity: HIGH
- Required: Deep scan + static analysis

## Agent Selection
1. security-auditor: ✅ SELECTED (deep vuln scan)
2. code-reviewer: ✅ SELECTED (static analysis)
3. penetration-tester: ❌ SKIP (not needed for code review)

## Strategy
- Pattern: PARALLEL (independent tasks)
- Expected time: 15min
- Resource efficiency: 2 agents vs 23min sequential
</extended_thinking>

[Execute with full transparency]
```

---

## Output Templates

### Security Review Report
```markdown
# Security Review Report

## Executive Summary
[Synthesized findings]

## Critical Vulnerabilities (N)
- [Finding] @ file.ts:line (agent-name, confidence%)

## Confidence Scores
- security-auditor: 95%
- code-reviewer: 90%
- Combined: 92%

## Audit Trail
- Workflow: security-review-YYYYMMDD-HHMMSS
- Duration: Xmin Ys
- Results: .equilateral/results/security-review-YYYYMMDD.md
```

### Code Quality Report
```markdown
# Code Quality Gate Report

## Quality Score: X/100

### Score Breakdown
- Structure: Y/100 (code-searcher)
- Quality: Z/100 (code-reviewer)
- Tests: W/100 (tester)

## Action Items
- [ ] Must Fix: ...
- [ ] Should Fix: ...
- [ ] Nice to Have: ...
```

---

## Performance Metrics

| Workflow | Agents | Execution Time | Pattern |
|----------|--------|----------------|---------|
| security-review | 2 | ~15min | Parallel |
| code-quality | 3 | ~17min | Pipeline |
| deploy-feature | 4 | ~37min | Hierarchical |
| infrastructure-check | 4 | ~20min | Parallel |

---

## File Structure

```
.equilateral/
├── workflows/              # Workflow definitions
│   └── security-review-20250109-203015.json
├── results/                # Agent outputs
│   └── security-review-20250109.md
└── audit/                  # Detailed logs
    └── agent-logs/
        ├── security-auditor-20250109.log
        └── code-reviewer-20250109.log
```

---

## Debugging Quick Reference

### Check Agent Status
```bash
# View logs
cat .equilateral/audit/agent-logs/<agent>-<date>.log

# Check workflow status
ls .equilateral/workflows/
```

### Common Issues

**Issue**: Agent không spawn
```bash
# Check agent exists
ls agents/ | grep <agent-name>

# Verify Task tool available
```

**Issue**: Performance chậm
```bash
# Use parallel instead of sequential
Task.spawnParallel([...])  # ✅ Fast

# vs
await Task.spawn(...)      # ❌ Slow
await Task.spawn(...)
```

---

## Quick Links

### Documentation
- **Full Guide**: SKILL-REFACTORED.md
- **Examples**: IMPLEMENTATION-GUIDE.md
- **Comparison**: MIGRATION-COMPARISON.md
- **Navigation**: README-REFACTORED.md

### Agents
- **Directory**: `agents/`
- **Count**: 22+ production-ready agents
- **Format**: Markdown agent definitions

### External Resources
- **Anthropic Multi-Agent**: https://www.anthropic.com/engineering/multi-agent-research-system
- **Extended Thinking**: https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking

---

## Cheat Sheet

### Start a Workflow
```bash
/ea:security-review          # Security audit
/ea:code-quality            # Quality gate
/ea:deploy-feature          # Deployment
/ea:infrastructure-check    # IaC validation
```

### Spawn Agents
```javascript
// Single
Task.spawn({ agent: "name" })

// Parallel
Task.spawnParallel(["agent1", "agent2"])

// Pipeline
Task.spawnPipeline([{ agent: "name" }, ...])
```

### Check Results
```bash
# Latest results
ls -lt .equilateral/results/ | head -5

# Latest logs
ls -lt .equilateral/audit/agent-logs/ | head -5
```

---

**Version**: 2.0.0 (Refactored)  
**Status**: Production Ready  
**Last Updated**: 2025-01-09

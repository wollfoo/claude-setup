# EquilateralAgents - Quick Reference (Refactored)

**Native Claude Subagents - Production Ready**

---

## 53 Production-Ready Agents

### **Tier 1: Core Production Agents (16 agents)** ⭐⭐⭐

#### **Security & Quality (4 agents)** 🛡️

| Agent Name | Location | Capabilities |
|------------|----------|--------------|
| **security-auditor** | `agents/security-auditor.md` | Comprehensive security audit, vulnerability scanning, OWASP compliance |
| **code-reviewer** | `agents/code-reviewer.md` | Code quality, best practices, static analysis, security patterns |
| **tester** | `agents/tester.md` | Test execution, coverage ≥80% unit / ≥70% integration, QA validation |
| **performance-engineer** | `agents/performance-engineer.md` | Performance optimization, benchmarking, bottleneck detection |

**Auto-activation**: security, vulnerability, audit, review, test, coverage, qa, performance, optimization

#### **Architecture & Planning (5 agents)** 📐

| Agent Name | Location | Capabilities |
|------------|----------|--------------|
| **planner-researcher** | `agents/planner-researcher.md` | Technical research, system design, planning, best practices |
| **architect-review** | `agents/architect-review.md` | Architecture review, design patterns, system evaluation |
| **backend-architect** | `agents/backend-architect.md` | Backend systems, API design (REST/GraphQL/gRPC), microservices |
| **graphql-architect** | `agents/graphql-architect.md` | GraphQL schema, federation, resolver optimization, DataLoader |
| **cloud-architect** | `agents/cloud-architect.md` | Cloud architecture, AWS/GCP/Azure, infrastructure as code |

**Auto-activation**: research, plan, architecture, design, analyze, microservices, graphql, cloud

#### **Development (7 agents)** 💻

| Agent Name | Location | Capabilities |
|------------|----------|--------------|
| **frontend-developer** | `agents/frontend-developer.md` | React/Vue, UI components, responsive design, modern frameworks |
| **mobile-developer** | `agents/mobile-developer.md` | React Native, Flutter, iOS/Android, native platforms |
| **database-specialist** | `agents/database-specialist.md` | Database design, query optimization, migrations, indexing |
| **devops-engineer** | `agents/devops-engineer.md` | CI/CD, infrastructure automation, container orchestration |
| **data-engineer** | `agents/data-engineer.md` | ETL workflows, data pipelines, analytics, data warehouse |
| **code-searcher** | `agents/code-searcher.md` | Codebase analysis, pattern detection, dependency mapping, navigation |
| **codebase-research-analyst** | `agents/codebase-research-analyst.md` | Deep codebase research, architecture analysis, impact assessment |

**Auto-activation**: frontend, mobile, database, devops, deployment, ci/cd, data pipeline, search, analyze, architecture

---

### **Tier 2: Specialized Experts (12 agents)** ⭐⭐

#### **Language Specialists (7 agents)** 🎯

| Agent Name | Location | Capabilities |
|------------|----------|--------------|
| **typescript-expert** | `agents/typescript-expert.md` | TypeScript, type safety, advanced patterns, generics |
| **python-pro** | `agents/python-pro.md` | Python, async programming, FastAPI, Django, type hints |
| **golang-pro** | `agents/golang-pro.md` | Go development, concurrency, goroutines, channels |
| **rust-pro** | `agents/rust-pro.md` | Rust systems programming, memory safety, zero-cost abstractions |
| **ruby-pro** | `agents/ruby-pro.md` | Ruby, SOLID principles, service objects, RSpec testing |
| **blockchain-developer** | `agents/blockchain-developer.md` | Smart contracts, Solidity, Web3, dApp development |
| **hyperledger-fabric-developer** | `agents/hyperledger-fabric-developer.md` | Hyperledger Fabric, chaincode, permissioned blockchain |

**Auto-activation**: typescript, python, golang, rust, ruby, blockchain, solidity, web3, hyperledger

#### **Data & AI (3 agents)** 🤖

| Agent Name | Location | Capabilities |
|------------|----------|--------------|
| **ml-engineer** | `agents/ml-engineer.md` | Machine learning, model deployment, training pipelines, MLOps |
| **data-scientist** | `agents/data-scientist.md` | Data analysis, statistical modeling, predictive analytics |
| **context-manager** | `agents/context-manager.md` | Context management, RAG optimization, memory coordination |

**Auto-activation**: machine learning, ml, mlops, data science, rag, context

#### **Design & UX (2 agents)** 🎨

| Agent Name | Location | Capabilities |
|------------|----------|--------------|
| **ui-ux-designer** | `agents/ui-ux-designer.md` | UI/UX design, accessibility (WCAG), design systems, user research |
| **frontend-designer** | `agents/frontend-designer.md` | Frontend design implementation, component libraries |

**Auto-activation**: ui, ux, design, accessibility, wcag, design system

---

### **Tier 3: Extended Coverage (25 agents)** ⭐

#### **Quality & Refactoring (3 agents)**
- **debug-specialist** - Debugging, root cause analysis, error fixing
- **code-refactor-master** - Code refactoring, technical debt reduction
- **plan-reviewer** - Plan validation, risk assessment, quality checks

#### **Planning & Coordination (3 agents)**
- **planning-strategist** - Strategic planning, requirements analysis
- **project-task-planner** - Task planning, project management
- **refactor-planner** - Refactoring planning, code quality improvements

#### **Documentation & Content (4 agents)**
- **docs-architect** - Documentation architecture, developer guides, API docs
- **technical-documentation-specialist** - Technical writing, JSDoc, code documentation
- **prd-writer** - Product requirements documents, technical specs
- **content-writer** - Content creation, copywriting

#### **Finance & Trading (6 agents)**
- **quant-analyst** - Quantitative finance, trading algorithms, risk metrics
- **crypto-analyst** - Crypto market analysis, technical indicators
- **crypto-trader** - Crypto trading strategies, automated execution
- **crypto-risk-manager** - Crypto risk management, portfolio optimization
- **defi-strategist** - DeFi strategies, protocol analysis
- **arbitrage-bot** - Arbitrage detection, automated trading bots

#### **Specialized Domains (6 agents)**
- **game-developer** - Game development, Unity, game mechanics
- **payment-integration** - Stripe, PayPal, payment processors, PCI compliance
- **php-developer** - PHP, PSR standards, Laravel, dependency injection
- **legacy-modernizer** - Legacy system modernization, migration strategies
- **web-research-specialist** - Web research, information gathering
- **vibe-coding-coach** - Vision-driven coding, creative development

#### **Utilities & Support (3 agents)**
- **memory-bank-synchronizer** - Memory management, documentation sync
- **tech-knowledge-assistant** - Knowledge sharing, education, concept explanation
- **get-current-datetime** - Date/time utilities, timezone handling

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

### Core Mappings
| Old Agent (External) | New Agent (Native) | Tier |
|---------------------|-------------------|------|
| SecurityScannerAgent | security-auditor | Tier 1 |
| CodeReviewerAgent | code-reviewer | Tier 1 |
| TestOrchestrationAgent | tester | Tier 1 |
| PerformanceAnalysisAgent | performance-engineer | Tier 1 |
| BackendAuditorAgent | backend-architect | Tier 1 |
| FrontendAuditorAgent | frontend-developer | Tier 1 |
| CodeAnalyzerAgent | code-searcher | Tier 1 |
| CodebaseResearchAgent | codebase-research-analyst | Tier 1 |
| DatabaseOptimizationAgent | database-specialist | Tier 1 |
| DeploymentValidationAgent | devops-engineer | Tier 1 |
| DataPipelineAgent | data-engineer | Tier 1 |
| MobileAppAgent | mobile-developer | Tier 1 |

### Architecture & Planning
| Old Agent | New Agent | Tier |
|-----------|-----------|------|
| TechnicalResearchAgent | planner-researcher | Tier 1 |
| ArchitectureReviewAgent | architect-review | Tier 1 |
| GraphQLArchitectAgent | graphql-architect | Tier 1 |
| CloudArchitectAgent | cloud-architect | Tier 1 |
| DocumentationAgent | docs-architect | Tier 1 |

### Specialized Mappings (Tier 2)
| Old Agent | New Agent |
|-----------|-----------|
| TypeScriptAgent | typescript-expert |
| PythonAgent | python-pro |
| GolangAgent | golang-pro |
| RustAgent | rust-pro |
| BlockchainAgent | blockchain-developer |
| MLAgent | ml-engineer |
| ContextAgent | context-manager |
| UIUXAgent | ui-ux-designer |

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
- **Count**: 53 production-ready agents (16 Tier 1 + 12 Tier 2 + 25 Tier 3)
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

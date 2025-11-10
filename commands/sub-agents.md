---
description: Orchestrate multiple specialized agents to complete complex tasks efficiently
argument-hint: <task-description-or-file-path>
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
---

# Multi-Agent Task Orchestration

**Task input**: `$ARGUMENTS`

## Step 0: Input Processing

**Task input**: Use `$ARGUMENTS` directly as the task description for orchestration.

## Orchestration Strategy

Analyze the task and coordinate specialized agents using the following approach:

### 1. **Task Analysis**
- Break down `$ARGUMENTS` into logical components
- Identify required domains (backend, frontend, database, security, etc.)
- Map dependencies between sub-tasks
- Assess complexity and resource requirements

### 2. **Agent Selection**
Select appropriate specialized agents from available droids (52 total):

#### **Architecture & System Design**
- `architect-review` - Software architecture review and patterns
- `cloud-architect` - Cloud infrastructure and services
- `graphql-architect` - GraphQL schema design and federation

#### **Planning & Strategy**
- `planner-researcher` - Technical research and implementation planning
- `planning-strategist` - Strategic planning and roadmaps
- `plan-reviewer` - Plan validation and review
- `project-task-planner` - Task breakdown and project management
- `prd-writer` - Product requirements documentation
- `refactor-planner` - Refactoring strategy and planning

#### **Backend Development**
- `backend-architect` - Backend system architecture and API design
- `blockchain-developer` - Blockchain and smart contracts
- `hyperledger-fabric-developer` - Hyperledger Fabric development
- `payment-integration` - Payment system integration

#### **Frontend Development**
- `frontend-developer` - Web frontend (React, Vue, Angular)
- `frontend-designer` - UI/UX design and implementation
- `ui-ux-designer` - User interface and experience design
- `mobile-developer` - Mobile app development (React Native, Flutter)
- `game-developer` - Game development

#### **Language Specialists**
- `typescript-expert` - TypeScript type system architecture
- `python-pro` - Advanced Python development
- `golang-pro` - Go language specialist
- `rust-pro` - Rust development
- `ruby-pro` - Ruby development
- `php-developer` - PHP development

#### **Database & Data Engineering**
- `database-specialist` - Database design, optimization, SQL
- `data-engineer` - Data pipelines and ETL
- `data-scientist` - Data analysis and ML models

#### **Quality Assurance & Testing**
- `code-reviewer` - Code quality and security review
- `security-auditor` - Security vulnerability assessment
- `tester` - Test automation and QA
- `performance-engineer` - Performance optimization and profiling
- `debug-specialist` - Debugging and troubleshooting

#### **Code Analysis & Refactoring**
- `code-searcher` - Codebase search and analysis
- `codebase-research-analyst` - Codebase structure analysis
- `code-refactor-master` - Code refactoring and cleanup
- `legacy-modernizer` - Legacy code modernization

#### **DevOps & Infrastructure**
- `devops-engineer` - CI/CD, containerization, orchestration

#### **Documentation & Content**
- `docs-architect` - Technical documentation architecture
- `technical-documentation-specialist` - API and technical docs
- `content-writer` - Content creation and copywriting

#### **AI & Context Management**
- `context-manager` - AI context engineering and orchestration
- `memory-bank-synchronizer` - Memory and context synchronization

#### **Research & Knowledge**
- `web-research-specialist` - Web research and information gathering
- `tech-knowledge-assistant` - Technical knowledge and guidance

#### **Crypto & Finance**
- `crypto-analyst` - Cryptocurrency market analysis
- `crypto-trader` - Trading strategies and signals
- `crypto-risk-manager` - Risk management for crypto
- `quant-analyst` - Quantitative analysis
- `arbitrage-bot` - Arbitrage opportunities detection
- `defi-strategist` - DeFi strategy and protocols

#### **Machine Learning**
- `ml-engineer` - Machine learning engineering and models

#### **Education & Coaching**
- `vibe-coding-coach` - Coding education and mentorship

### 3. **Coordination Workflow**
Execute by invoking other custom slash commands in sequence:

```
1. Planning Phase:
   - /planner-researcher to analyze requirements
   - /architect-review to define architecture
   
2. Implementation Phase:
   - Delegate to domain-specific commands
   - Coordinate parallel execution when possible
   
3. Validation Phase:
   - /code-reviewer for quality assurance
   - /security-auditor for security review
   - /tester for comprehensive testing
   
4. Documentation Phase:
   - /docs-architect for technical documentation
```

### 4. **Result Integration**
- Collect outputs from all agents
- Resolve conflicts and inconsistencies
- Synthesize comprehensive solution
- Validate completeness and correctness

### 5. **Verification**
- Run tests and validation checks
- Security and performance review
- Ensure all requirements met
- Document implementation decisions

## Delegation Example

For `$ARGUMENTS`, coordinate by calling specialized commands:

**Step 1 - Analysis:**
```bash
/planner-researcher $ARGUMENTS
```

**Step 2 - Architecture:**
```bash
/backend-architect [requirements from step 1]
```

**Step 3 - Implementation:**
```bash
/database-specialist [schema from step 2]
```

**Note:** Each command is a separate slash command defined in `.claude/commands/` or `~/claude/commands/`.
You orchestrate by calling them sequentially and passing context between them.

## Output

Provide:
- **Summary**: Overview of orchestration approach
- **Agent Assignments**: Which agents handle which parts
- **Execution Plan**: Step-by-step coordination
- **Dependencies**: What depends on what
- **Timeline**: Estimated completion sequence
- **Results**: Integrated final output from all agents

---

**Begin orchestration for**: `$ARGUMENTS`

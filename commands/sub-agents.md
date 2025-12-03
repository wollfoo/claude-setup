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
Select appropriate specialized agents from available droids (18 total):

#### **Architecture & Design**
- `graphql-architect` - GraphQL schema design, federation, and optimization
- `frontend-designer` - UI/UX design and frontend implementation

#### **Planning & Research**
- `planner-researcher` - Technical research and implementation planning

#### **Language Specialists**
- `typescript-expert` - TypeScript type system architecture
- `python-pro` - Advanced Python development
- `golang-pro` - Go language specialist
- `rust-pro` - Rust development

#### **Database**
- `database-specialist` - Database design, optimization, SQL

#### **Quality Assurance & Testing**
- `code-reviewer` - Code quality and security review
- `security-auditor` - Security vulnerability assessment
- `tester` - Test automation and QA
- `debug-specialist` - Debugging and troubleshooting

#### **Code Analysis & Refactoring**
- `code-searcher` - Codebase search and analysis
- `codebase-research-analyst` - Codebase structure analysis
- `code-refactor-master` - Code refactoring and cleanup

#### **DevOps & Infrastructure**
- `devops-engineer` - CI/CD, containerization, orchestration

#### **Documentation**
- `docs-architect` - Technical documentation architecture

#### **AI & Context Management**
- `memory-bank-synchronizer` - Memory and context synchronization

### 3. **Coordination Workflow**
Execute by invoking other custom slash commands in sequence:

```
1. Planning Phase:
   - /planner-researcher to analyze requirements
   - /graphql-architect for API design (if applicable)
   
2. Implementation Phase:
   - Delegate to language specialists (typescript-expert, python-pro, etc.)
   - /database-specialist for data layer
   - Coordinate parallel execution when possible
   
3. Validation Phase:
   - /code-reviewer for quality assurance
   - /security-auditor for security review
   - /tester for comprehensive testing
   - /debug-specialist for troubleshooting
   
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
/graphql-architect [API requirements from step 1]
```

**Step 3 - Implementation:**
```bash
/database-specialist [schema requirements]
/typescript-expert [implementation details]
```

**Step 4 - Validation:**
```bash
/code-reviewer [completed implementation]
/security-auditor [security assessment]
```

**Note:** Each command is a separate slash command defined in `/commands/`
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

---
description: Research and analyze new or unfamiliar codebase
auto_execution_mode: 3
---

# Codebase Research Workflow

## Step 1: High-Level Overview

### Read Entry Points
```
1. README.md
2. package.json / requirements.txt / go.mod
3. Main entry (index.ts, main.py, main.go)
4. Config files (.env.example, config/)
```

### Quick Structure Map
```bash
# List top-level structure
ls -la
# or
tree -L 2
```

## Step 2: Identify Architecture

### Framework Detection
- [ ] Express/Fastify/NestJS (Node)
- [ ] Django/FastAPI/Flask (Python)
- [ ] Spring/Gin/Echo (Java/Go)
- [ ] React/Vue/Angular (Frontend)

### Pattern Detection
- [ ] MVC
- [ ] Clean Architecture
- [ ] Microservices
- [ ] Monolith
- [ ] Serverless

## Step 3: Module Mapping

```markdown
# Module Map

## Core Modules
- `src/auth/` - Authentication & authorization
- `src/users/` - User management
- ...

## Shared
- `src/utils/` - Utility functions
- `src/config/` - Configuration
- ...

## External
- Database: [type]
- Cache: [type]
- Queue: [type]
```

## Step 4: Data Flow Analysis

### Trace a Request
1. Entry point (router/controller)
2. Middleware/guards
3. Business logic (service)
4. Data access (repository)
5. Response transformation

### Key Entities
- [ ] User model
- [ ] Core domain models
- [ ] DTOs/ViewModels

## Step 5: Dependencies

### External Services
- Database connections
- Third-party APIs
- Message queues
- Cache systems

### Internal Dependencies
- Module interdependencies
- Circular dependency check
- Shared utilities

## Step 6: Documentation Output

```markdown
# Codebase Analysis: [Project Name]

## Overview
- **Tech Stack**: [languages, frameworks]
- **Architecture**: [pattern]
- **Size**: [files, LOC estimate]

## Structure
[Directory tree with descriptions]

## Key Components
1. **[Component]**: [responsibility]
2. ...

## Data Flow
[Diagram or description]

## Observations
- Strengths: [list]
- Areas for improvement: [list]

## Getting Started
1. [setup step]
2. [run step]
```

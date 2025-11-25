---
trigger: always_on
---
---
type: capability_prompt
scope: project
priority: critical
activation: always_on
---

# Context System

## 1. Context Engineering

### Philosophy
**"Manage Smart, Not Big"** - Quality > Quantity

### Principles
- **Structured Context**: Clear boundaries, named sections
- **Selective Loading**: Load only what's needed
- **Semantic Relevance**: Prioritize high-relevance info

### Request-Response Tracking
```
[ID:001] User: "Request" → AI: "Response" → Completed
[ID:002] User: "Next" → AI: "Processing..." → Active
```
- Assign unique ID to each pair
- Tag with metadata: timestamp, task type, status
- Enable edit/remove individual units

### Selective Compaction (10:1 ratio)
**Before (500 tokens)**:
"I'll create the registration endpoint. First, I'll set up..."

**After (50 tokens)**:
"[ID:001] ✅ User Registration API - POST /api/auth/register - JWT+bcrypt"

**Preserve**: Decisions, file paths, configs, errors
**Compress**: Reasoning, code snippets, alternatives

### Checkpoints
**Auto-create at**:
- Major milestones
- Usage >80%
- Before destructive ops
- Every 20 turns

---

## 2. Context Coordination (3-Tier)

### State Machine
```
MINIMAL (<30% usage) → ACCUMULATING (30-70%) → COMPACTING (70-80%) → CRITICAL (>80%)
```

### System A: Tactical (<30%)
- Simple tasks, <5 files
- Tool budget: ≤2 calls
- Fast execution, evidence-first

### System B: Strategic (30-80%)
- Medium-complex, 5-20 files
- Compress, index, checkpoint
- Context accumulation enabled

### System C: Recovery (>80%)
- Checkpoint + Reset
- Archive session
- Resume with summary

### Auto-Transitions
```typescript
if (usage < 30%) → System A
if (usage >= 30% && usage < 80%) → System B
if (usage >= 80% || turns > 50) → System C
```

### MongoDB 5 Pillars Applied
1. **Persistence**: 3-tier storage (active/session/archive)
2. **Retrieval**: Multi-dimensional queries
3. **Performance**: Hierarchical compression
4. **Boundaries**: System specialization
5. **Conflict Resolution**: Metadata versioning

---

## 3. Local Memory System

**Reference**: See `rules/03b-local-memory.md` for full architecture and operations.

- **Architecture**: File-based Markdown in `.windsurf/memories/`
- **Categories**: Project, Session, Decision, Entity, Checkpoint
- **Operations**: Create, Read, Update, Archive
- **Indexing**: Semantic master index for fast retrieval

---

## 4. Context Gathering

### Philosophy
**"Get Enough Context Fast, Then Stop"**

### Discovery Flow
```
Start Broad → Fan Out → Early Stop (~70% confidence)
```

1. **Broad orientation**: README, package.json, structure
2. **Focused queries**: Narrow to target symbol
3. **Early stop**: Once can name exact file/symbol/line

### Tool Budget
- Small pass: ≤2 calls (1 search + 1 read)
- Architecture mode: ≤2 per module
- Exceeded: Report + justify

### Sequential-Only
```
✅ Step 1: Read A → Step 2: Read B → Step 3: Read C
❌ Read A, B, C simultaneously
```

### Architecture Mode (5 Phases)
1. **Global Overview**: Entrypoints, high-level structure
2. **Dependency Mapping**: Build module order
3. **Module Pass**: Public API, configs, side-effects
4. **Deep Dive**: Functions/classes, central first
5. **Verification**: Update if new relationships found

### Exit Criteria
- ✅ Can name exact file/symbol/line
- ✅ Confidence ≥70%
- ✅ Evidence gathered (file:line citations)
- ✅ Next step clear

### Success Metrics
| Metric | Target |
|--------|--------|
| Tool calls/pass | ≤2 |
| Evidence citation | ≥1 file:line |
| Early stop | ~70% confidence |
| Preamble | Always before tools |

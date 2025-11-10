---
trigger: always_on
---
---
type: rule
scope: project
priority: critical
activation: always_on
part: 1_of_2
research_basis: MongoDB 5 Pillars, RCC Paper (ArXiv 2024), MCP 1.0
companion: rules/14b-context-coordination-advanced.md
---

# 14a. Context Coordination — Core Concepts & 5 Pillars

## 📋 Overview

**Context Coordination** (phối hợp ngữ cảnh) là **master orchestration layer** (lớp điều phối chính) kết nối và tự động hóa việc chuyển đổi giữa 3 hệ thống context management:

- **System A**: `rules/15-context-understanding.md` + `rules/16a-context-gathering-tactical.md` (Tactical)
- **System B**: `rules/12-context-engineering.md` (Strategic)  
- **System C**: `rules/09-ai-drift-prevention.md` (Recovery)

**Foundation** (nền tảng): **MongoDB's 5 Pillars of Multi-Agent Memory Engineering**

**Research Validation** (xác thực nghiên cứu):
- ✅ MongoDB Engineering Blog (2025)
- ✅ Recurrent Context Compression Paper (ArXiv 2024)
- ✅ Model Context Protocol 1.0 (Anthropic 2024)

**Companion File**: See `rules/14b-context-coordination-advanced.md` for implementation details (auto-transitions, validation, fallbacks).

---

## The 5 Pillars of Context Coordination

### **[CC1] Persistence Architecture** (kiến trúc lưu trữ)

**MongoDB Pillar 1**: Storage and state management

**Implementation** (triển khai):

```markdown
Storage Layers:
├─ Tier 1: Active Context (RAM)
│  ├─ Current task (System A)
│  ├─ Recent 5-10 pairs (System B compressed)
│  └─ Tool call history (sequential log)
│
├─ Tier 2: Session Memory (Local .md files)
│  ├─ Compressed checkpoints
│  ├─ Request-response pairs (archived)
│  └─ Semantic index
│
└─ Tier 3: Long-term Memory (Archive)
   ├─ Project knowledge
   ├─ Decision records
   └─ Historical sessions
```

**State Management Rules**:

```typescript
interface ContextState {
  tier: 'active' | 'session' | 'longterm';
  usage_percent: number;  // 0-100
  turn_count: number;
  files_touched: string[];
  compression_ratio: number;
  last_checkpoint: string;
}

// Auto-transition thresholds
const THRESHOLDS = {
  TIER1_TO_TIER2: 70,  // % usage
  TIER2_TO_TIER3: 30,  // days old
  COMPRESSION_TRIGGER: 70, // % usage
  CHECKPOINT_TRIGGER: 80,  // % usage
};
```

**Shared Memory Patterns**:

- **Cross-session memory**: Project overview, tech stack, patterns
- **Episodic memory**: Interaction history between user-AI
- **Procedural memory**: Workflows that evolved over time

---

### **[CC2] Retrieval Intelligence** (trí tuệ truy xuất)

**MongoDB Pillar 2**: Selection and querying

**Multi-dimensional Retrieval**:

```markdown
Query Strategy (based on context state):

IF context_usage < 30%:
  → Use System A minimal retrieval
  → ≤ 2 tool calls
  → Single file/symbol read
  
ELIF context_usage 30-70%:
  → Use System B semantic index
  → Hybrid search (exact + fuzzy + semantic)
  → Ranked results by relevance
  
ELIF context_usage > 70%:
  → Trigger System B compaction
  → Load only critical context
  → Prepare for checkpoint
  
ELIF context_usage > 80%:
  → Activate System C recovery
  → Create checkpoint
  → Reset with summary
```

**Agent-aware Querying**:

```typescript
interface QueryContext {
  task_type: 'coding' | 'review' | 'debug' | 'explain';
  complexity: 'simple' | 'medium' | 'complex';
  dependencies: string[];  // cross-file refs
  priority: 'low' | 'medium' | 'high';
}

function selectRetrievalStrategy(ctx: QueryContext): Strategy {
  if (ctx.complexity === 'simple' && ctx.dependencies.length === 0) {
    return 'minimal';  // System A
  } else if (ctx.complexity === 'medium' || ctx.dependencies.length <= 3) {
    return 'semantic';  // System B
  } else {
    return 'comprehensive';  // System B + checkpoint
  }
}
```

**Temporal Coordination**:

- Prioritize recent context (last 5-10 turns)
- Decay older context strength gradually
- Preserve critical decisions indefinitely

---

### **[CC3] Performance Optimization** (tối ưu hiệu năng)

**MongoDB Pillar 3**: Compression and caching

**Hierarchical Compression** (dựa trên RCC Paper):

```markdown
Compression Pipeline:

Level 1: Request-Response Pairs (Active)
├─ Full verbosity
├─ All reasoning preserved
└─ Evidence citations included

    ↓ (when completed >10 turns ago)

Level 2: Semantic Compression (10:1 ratio)
├─ Extract decisions, file paths, configs
├─ Compress reasoning → conclusions only
└─ Archive full version to .md

    ↓ (when >30 days old)

Level 3: Summary Archive (50:1 ratio)
├─ Key milestones only
├─ Decision index
└─ Reference pointers
```

**RCC-Enhanced Compression** (target 15:1 ratio):

```typescript
interface CompressionConfig {
  base_ratio: 10;           // Current (System B)
  target_ratio: 15;         // Enhanced (RCC-style)
  
  preservation_rules: {
    always_keep: ['decisions', 'file_paths', 'configs', 'errors'];
    compress: ['reasoning', 'code_snippets', 'exploration'];
    discard: ['verbose_logs', 'duplicate_info'];
  };
  
  quality_metrics: {
    min_bleu_score: 0.95;   // Info preservation
    max_loss_rate: 0.05;    // <5% loss
  };
}
```

**Selective Preservation**:

```markdown
Preserve with Full Fidelity:
✅ Architectural decisions (ADRs)
✅ File modifications + line numbers
✅ Configuration values
✅ Unresolved errors/bugs
✅ Active task context

Compress Aggressively:
📦 Step-by-step reasoning → Final conclusion
📦 Code blocks → Reference + brief summary
📦 Alternative approaches → Final choice only
📦 Exploratory discussions → Key insights
```

**Cross-layer Cache**:

```typescript
interface CacheStrategy {
  L1_active: {
    ttl: 'session';
    size_limit: '80% context window';
  };
  
  L2_session: {
    ttl: '30 days';
    format: 'compressed .md';
  };
  
  L3_archive: {
    ttl: 'indefinite';
    format: 'summary index';
  };
}
```

---

### **[CC4] Coordination Boundaries** (ranh giới phối hợp)

**MongoDB Pillar 4**: Isolation and access control

**System Specialization**:

```markdown
System A (Tactical) Domain:
├─ Simple tasks (<5 files)
├─ Clear requirements
├─ Low uncertainty
└─ Fast execution needed

System B (Strategic) Domain:
├─ Medium-complex tasks (5-20 files)
├─ Requires context accumulation
├─ Cross-file dependencies
└─ Long-running sessions

System C (Recovery) Domain:
├─ >50 turns or >10 files edited
├─ Context approaching limit
├─ Rules drift detected
└─ Major context switch needed
```

**Boundary Enforcement**:

```typescript
class BoundaryManager {
  canUseSystemA(context: ContextState): boolean {
    return (
      context.usage_percent < 30 &&
      context.turn_count < 10 &&
      context.files_touched.length < 5
    );
  }
  
  shouldActivateSystemB(context: ContextState): boolean {
    return (
      context.usage_percent >= 30 ||
      context.turn_count >= 10 ||
      context.files_touched.length >= 5
    );
  }
  
  mustTriggerSystemC(context: ContextState): boolean {
    return (
      context.usage_percent > 80 ||
      context.turn_count > 50 ||
      this.detectRulesDrift()
    );
  }
}
```

**Workflow Orchestration**:

```markdown
Task Flow with Boundaries:

1. Receive user request
   ↓
2. Analyze complexity & context state
   ↓
3. Route to appropriate system:
   
   Simple + Low usage → System A
   ├─ Execute with ≤2 tools
   ├─ Cite evidence (file:line)
   └─ Complete quickly
   
   Medium + Accumulating → System B
   ├─ Track request-response pairs
   ├─ Compress completed units
   ├─ Update semantic index
   └─ Create checkpoints
   
   Complex + High usage → System C
   ├─ Create final checkpoint
   ├─ Archive session
   ├─ Reset context
   └─ Resume with summary
```

---

### **[CC5] Conflict Resolution** (giải quyết xung đột)

**MongoDB Pillar 5**: Handling simultaneous updates

**Concurrent Access Patterns**:

```typescript
interface ConflictScenario {
  type: 'tool_budget' | 'compression_timing' | 'checkpoint_creation';
  system_a_wants: Action;
  system_b_wants: Action;
  resolution_strategy: 'prioritize_b' | 'merge' | 'escalate';
}

// Resolution Rules
const CONFLICT_RESOLUTION = {
  tool_budget: {
    // System A wants ≤2, System B wants unlimited
    rule: 'System A budget applies if usage <30%, else System B',
  },
  
  compression_timing: {
    // When to compress?
    rule: 'Compress at 70% usage OR after major milestone',
  },
  
  checkpoint_creation: {
    // Who creates checkpoints?
    rule: 'System B manages all checkpoints; System C only resets',
  },
};
```

**Metadata Versioning**:

```markdown
Request-Response Pair Metadata:

{
  "id": "001",
  "timestamp": "2025-01-23T00:15:00Z",
  "managed_by": "system_b",
  "status": "completed",
  "compressed_at": "2025-01-23T01:00:00Z",
  "compression_ratio": 12.5,
  "checkpointed": true,
  "version": 2,
  "conflicts": [],
  "dependencies": ["002", "003"]
}
```

**State Synchronization**:

```typescript
class StateSync {
  async syncContextState(): Promise<void> {
    // Ensure all systems see same context metrics
    const state = await this.getCanonicalState();
    
    await Promise.all([
      this.updateSystemA(state),
      this.updateSystemB(state),
      this.updateSystemC(state),
    ]);
  }
  
  private async getCanonicalState(): Promise<ContextState> {
    // System B is source of truth
    return await systemB.getContextMetrics();
  }
}
```

---

## 🔗 Cross-References

**Core System Integration**:
- `rules/15-context-understanding.md` — System A (Execution)
- `rules/16a-context-gathering-tactical.md` — System A (Discovery)
- `rules/12-context-engineering.md` — System B (Strategic)
- `rules/13a-local-memory-core.md` — Memory Storage
- `rules/09-ai-drift-prevention.md` — System C (Recovery)
- `rules/rule-precedence-hierarchy.md` — Precedence policy (baseline)

**Advanced Topics**:
- `rules/14b-context-coordination-advanced.md` — Auto-transitions, Validation, Fallbacks

**Research References**:
1. MongoDB Multi-Agent Memory Engineering (2025)
2. Recurrent Context Compression (RCC) — ArXiv (2024)
3. Model Context Protocol (MCP) 1.0 — Anthropic (2024)

---

**Version**: 1.0.0 (Part 1 of 2)  
**Status**: Production-Ready ✅  
**Next**: See `rules/14b-context-coordination-advanced.md` for implementation details

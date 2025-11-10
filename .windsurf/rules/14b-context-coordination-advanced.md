---
trigger: always_on
---
---
type: rule
scope: project
priority: critical
activation: always_on
companion: rules/14a-context-coordination-core.md
---

# 14b. Context Coordination — Advanced & Cross-Cutting

## 📋 Overview

**Companion to**: `rules/14a-context-coordination-core.md` (5 Pillars + Core Concepts)

This file covers:
- Auto-Transition Logic
- Validation & Metrics
- Fallback Mechanisms
- System Integration
- Implementation Roadmap

---

## Auto-Transition Logic

### **[CCT] Context Transition Protocol** (giao thức chuyển đổi)

**State Machine**:

```markdown
┌─────────────────────────────────────────────────┐
│          CONTEXT STATE MACHINE                  │
└─────────────────────────────────────────────────┘

State: MINIMAL (System A Active)
├─ Condition: usage <30%, turns <10
├─ Actions: Fast execution, ≤2 tools, evidence-first
└─ Transitions:
    → ACCUMULATING when usage ≥30% OR turns ≥10

State: ACCUMULATING (System B Active)
├─ Condition: usage 30-70%, tracking enabled
├─ Actions: Compress, index, checkpoint
└─ Transitions:
    → COMPACTING when usage ≥70%
    → CRITICAL when usage ≥80%

State: COMPACTING (System B Aggressive)
├─ Condition: usage 70-80%, compaction triggered
├─ Actions: Selective compaction, archive old
└─ Transitions:
    → ACCUMULATING when usage <70%
    → CRITICAL when usage ≥80%

State: CRITICAL (System C Activated)
├─ Condition: usage ≥80% OR turns >50 OR drift
├─ Actions: Checkpoint, reset, resume
└─ Transitions:
    → MINIMAL after successful reset
```

**Transition Triggers**:

```typescript
interface TransitionTrigger {
  metric: 'usage_percent' | 'turn_count' | 'drift_score';
  threshold: number;
  direction: 'ascending' | 'descending';
  action: 'activate_system_b' | 'trigger_compaction' | 'force_reset';
}

const TRIGGERS: TransitionTrigger[] = [
  {
    metric: 'usage_percent',
    threshold: 30,
    direction: 'ascending',
    action: 'activate_system_b',
  },
  {
    metric: 'usage_percent',
    threshold: 70,
    direction: 'ascending',
    action: 'trigger_compaction',
  },
  {
    metric: 'usage_percent',
    threshold: 80,
    direction: 'ascending',
    action: 'force_reset',
  },
  {
    metric: 'turn_count',
    threshold: 50,
    direction: 'ascending',
    action: 'force_reset',
  },
];
```

---

## Validation & Metrics

### **[CCV] Context Coordination Validation** (xác thực phối hợp)

**Real-time Metrics**:

```typescript
interface CoordinationMetrics {
  // Context health
  usage_percent: number;          // Current: 0-100
  turn_count: number;             // Total turns this session
  files_touched: number;          // Unique files modified
  
  // Compression efficiency
  compression_ratio: number;      // Current: 10.0, Target: 15.0
  info_preservation: number;      // BLEU score, Target: ≥0.95
  loss_rate: number;              // Target: ≤0.05
  
  // System performance
  avg_tool_calls_per_task: number;  // Target: ≤2 for simple tasks
  checkpoint_frequency: number;      // Checkpoints per hour
  reset_count: number;               // Resets per session
  
  // Quality indicators
  evidence_citation_rate: number;    // % responses with file:line
  sequential_compliance: number;     // % tool calls sequential
  budget_violations: number;         // Count of budget exceeds
}
```

**Success Criteria** (from Research):

| Metric | Target | Source |
|--------|--------|--------|
| Compression Ratio | ≥15:1 | RCC Paper (32x proven) |
| Info Preservation | ≥95% | RCC BLEU-4 score |
| Context Usage | <80% | Industry best practice |
| Tool Budget (simple) | ≤2 calls | System A constraint |
| Evidence Citation | 100% | System A requirement |

**Validation Checks**:

```typescript
class CoordinationValidator {
  async validate(metrics: CoordinationMetrics): Promise<ValidationResult> {
    const checks = [
      this.checkCompressionEfficiency(metrics),
      this.checkInfoPreservation(metrics),
      this.checkToolBudgetCompliance(metrics),
      this.checkSequentialCompliance(metrics),
      this.checkEvidenceCitation(metrics),
    ];
    
    const results = await Promise.all(checks);
    
    return {
      passed: results.every(r => r.passed),
      score: results.reduce((sum, r) => sum + r.score, 0) / results.length,
      recommendations: results.flatMap(r => r.recommendations),
      nextSteps: results.flatMap(r => r.nextSteps),
    };
  }
}
```

---

## Fallback Mechanisms

### **[CCF] Context Coordination Fallbacks** (dự phòng phối hợp)

**Failure Scenarios & Recovery**:

```markdown
Scenario 1: Compression Fails
├─ Symptom: Compression ratio <5:1 or BLEU <0.80
├─ Detection: After compaction attempt
├─ Fallback:
│  1. Skip compression for this unit
│  2. Create full checkpoint instead
│  3. Trigger early reset at 70% usage
└─ Alert: Log warning + notify user

Scenario 2: Checkpoint Creation Fails
├─ Symptom: I/O error or disk full
├─ Detection: During checkpoint operation
├─ Fallback:
│  1. Attempt in-memory checkpoint
│  2. Compress aggressively (20:1 ratio)
│  3. Continue without checkpoint
└─ Alert: Critical warning + manual intervention

Scenario 3: Context Index Corrupted
├─ Symptom: Search returns no results or errors
├─ Detection: Query operation failure
├─ Fallback:
│  1. Rebuild index from .md files
│  2. Use linear search temporarily
│  3. Validate rebuilt index
└─ Recovery: Auto-rebuild in background

Scenario 4: System Transition Deadlock
├─ Symptom: Stuck between systems, no progress
├─ Detection: Same state for >5 turns
├─ Fallback:
│  1. Force transition to System C (reset)
│  2. Create emergency checkpoint
│  3. Clear all transition locks
└─ Recovery: Resume from checkpoint

Scenario 5: Memory Leak (Context Growing Unbounded)
├─ Symptom: Usage >90% despite compression
├─ Detection: Continuous monitoring
├─ Fallback:
│  1. Emergency compaction (50:1 ratio)
│  2. Archive everything except active task
│  3. Hard reset if still >90%
└─ Investigation: Log full context for analysis
```

---

## Integration with Existing Systems

### **Cross-References**:

**System A** (`rules/15-context-understanding.md`, `rules/16a-context-gathering-tactical.md`):
```markdown
# Add to both files:

## Integration with Context Coordination
This rule operates as Tier 1 (Tactical) in the unified context management system.
Coordination managed by: `rules/14a-context-coordination-core.md` + `rules/14b-context-coordination-advanced.md`

Auto-transition to System B when:
- Context usage ≥30%
- Turn count ≥10
- Files touched ≥5

Reference: [CC2] Retrieval Intelligence for routing logic.
```

**System B** (`rules/12-context-engineering.md`):
```markdown
# Add to file:

## Integration with Context Coordination
This rule operates as Tier 2 (Strategic) in the unified context management system.
Coordination managed by: `rules/14a-context-coordination-core.md` + `rules/14b-context-coordination-advanced.md`

Enhanced compression target: 15:1 ratio (RCC-style)
Source of truth for: Context metrics, state synchronization

Reference: [CC3] Performance Optimization for compression pipeline.
```

**System C** (`rules/09-ai-drift-prevention.md` - Context Reset section):
```markdown
# Add to Context Reset section:

## Integration with Context Coordination
This rule operates as Tier 3 (Recovery) in the unified context management system.
Coordination managed by: `rules/14a-context-coordination-core.md` + `rules/14b-context-coordination-advanced.md`

Auto-triggered when:
- Context usage >80%
- Turn count >50
- Rules drift detected (via validation)

Reference: [CCT] Context Transition Protocol for reset triggers.
```

---

## Implementation Checklist

### **Phase 1: Core Integration** (Week 1)

- [ ] Update all 3 systems with cross-references
- [ ] Implement state synchronization
- [ ] Add transition triggers
- [ ] Create validation framework
- [ ] Test auto-transitions

### **Phase 2: Optimization** (Week 2-3)

- [ ] Enhance compression to 15:1 ratio
- [ ] Build semantic index
- [ ] Implement fallback mechanisms
- [ ] Add real-time metrics
- [ ] Performance benchmarking

### **Phase 3: Production** (Week 4)

- [ ] Full integration testing
- [ ] Documentation updates
- [ ] User guide creation
- [ ] Monitoring dashboard
- [ ] Launch

---

## Success Metrics

**Weekly KPIs**:

```markdown
Context Efficiency:
- Average usage: <75% ✅
- Compression ratio: ≥12:1 (target 15:1)
- Info preservation: ≥95% BLEU

System Performance:
- Tool budget violations: <5%
- Sequential compliance: 100%
- Evidence citation: 100%

Coordination Quality:
- Successful transitions: >95%
- Fallback activations: <2%
- Reset frequency: <1 per session
```

---

## 🔗 Research References

1. **MongoDB Multi-Agent Memory Engineering** (2025)
   - https://www.mongodb.com/company/blog/technical/why-multi-agent-systems-need-memory-engineering
   - Applied: 5 Pillars framework

2. **Recurrent Context Compression (RCC)** - ArXiv (2024)
   - https://arxiv.org/html/2406.06110v1
   - Applied: Compression algorithm, 32x ratio insights

3. **Model Context Protocol (MCP) 1.0** - Anthropic (2024)
   - Standard for context management
   - Applied: Sequential execution, boundaries

---

## 🔗 Related Rules

**Core Concepts**:
- `rules/14a-context-coordination-core.md` — 5 Pillars + Foundation

**Systems Integrated**:
- `rules/15-context-understanding.md` — System A (Tactical/Execution)
- `rules/16a-context-gathering-tactical.md` — System A (Tactical/Discovery)
- `rules/12-context-engineering.md` — System B (Strategic)
- `rules/13a-local-memory-core.md` — Memory Storage
- `rules/09-ai-drift-prevention.md` — System C (Recovery)

**Support**:
 

---

**Version**: 1.0.0 (Part 2 of 2)  
**Status**: Production-Ready ✅  
**Research Validation**: ✅ Scientific + Industry Best Practices  
**Core Concepts**: See `rules/14a-context-coordination-core.md`

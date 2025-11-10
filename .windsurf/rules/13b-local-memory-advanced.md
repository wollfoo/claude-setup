---
trigger: always_on
---
---
type: capability_prompt
scope: project
priority: critical
activation: always_on
companion: rules/13a-local-memory-core.md
---

# 13b. Local Memory System — Advanced Implementation

## 📋 Overview

**Companion to**: `rules/13a-local-memory-core.md` (Core Architecture + Operations + Advanced Features)

This file covers:
- Integration with Context Engineering
- Best Practices
- Security & Privacy
- Performance Benchmarks
- Migration Guide
- Troubleshooting
- Success Metrics

---

## Integration with Context Engineering

**Reference**: See `rules/12-context-engineering.md` for context optimization strategies.

**Context → Memory Pipeline** (đường ống ngữ cảnh → bộ nhớ):
```
Request-Response Pair (Active Context)
    ↓ (on compaction)
Compressed Summary (Context)
    ↓ (on checkpoint/session end)
Session Memory File (.md)
    ↓ (extract key decisions)
Decision Memory File (.md)
    ↓ (document entities)
Entity Memory File (.md)
```

**Memory → Context Pipeline** (đường ống bộ nhớ → ngữ cảnh):
```
User Request Received
    ↓ (semantic analysis)
Query Relevant Memories
    ↓ (load & parse .md files)
Inject into Context (boundary-aware)
    ↓
Process Request with Enriched Context
```

---

## Best Practices

### **[LMSBP] Local Memory Best Practices**

**DO's** (nên làm):
- ✅ Use consistent naming conventions
- ✅ Fill all metadata fields (type, tags, related)
- ✅ Create cross-references bidirectionally
- ✅ Archive old memories (don't delete unless invalid)
- ✅ Update _index.md regularly
- ✅ Use semantic tags for easy discovery
- ✅ Version control memories via Git
- ✅ Back up memories/ directory regularly

**DON'Ts** (không nên làm):
- ❌ Store sensitive data (API keys, passwords) → use .env instead
- ❌ Create duplicate memories without consolidating
- ❌ Skip metadata fields → makes search impossible
- ❌ Use non-descriptive filenames (e.g., "memory1.md")
- ❌ Let memories grow unbounded without archiving
- ❌ Ignore broken cross-references
- ❌ Store binary files in memories/ (only .md)

---

## Security & Privacy

### **[LMSS] Security Considerations**

**Data Protection** (bảo vệ dữ liệu):
```markdown
✅ Local storage = full control over data
✅ No 3rd-party exposure risk
✅ Git-ignored sensitive files (if needed)
✅ Filesystem permissions: user-only read/write
```

**What to Store** (nên lưu gì):
- ✅ Code structure và architecture
- ✅ Decisions và rationales
- ✅ Implementation patterns
- ✅ File paths, function names
- ✅ Non-sensitive configuration values

**What NOT to Store** (không nên lưu gì):
- ❌ API keys, passwords, tokens
- ❌ PII (Personally Identifiable Information)
- ❌ Production database credentials
- ❌ OAuth secrets
- ❌ Customer data

**Encryption** (mã hóa):
```markdown
For sensitive projects:
- Encrypt memories/ directory at rest
- Use git-crypt or similar for version control
- Consider per-file encryption for high-security needs
```

---

## Performance Benchmarks

### **[LMSP] Performance Characteristics**

**Read Performance** (hiệu năng đọc):
```
Local file read: <1ms
Semantic search (100 files): 10-50ms
Index lookup: <5ms

vs 3rd-party API:
API call latency: 200-500ms
→ 200-500x faster!
```

**Write Performance** (hiệu năng ghi):
```
Create memory: <5ms
Update memory: <5ms
Archive memory: <10ms (move operation)

vs 3rd-party API:
API write latency: 150-300ms
→ 30-60x faster!
```

**Storage Efficiency** (hiệu suất lưu trữ):
```
Average memory size: 2-5 KB
100 memories ≈ 200-500 KB
1000 memories ≈ 2-5 MB

Negligible disk usage!
```

---

## Migration Guide

### **[LMSMG] Migrating from 3rd-party Memory MCPs**

**Step 1: Export Existing Memories**
```bash
# Export from 3rd-party service (e.g., Mem0)
mem0-cli export --format json > memories-export.json
```

**Step 2: Convert to Markdown**
```python
# Conversion script
import json

with open('memories-export.json') as f:
    data = json.load(f)

for memory in data['memories']:
    filename = f"session-{memory['date']}-{memory['id']}.md"
    # ... convert to .md format using template
```

**Step 3: Organize into Categories**
```bash
# Move to appropriate directories
mv session-*.md .windsurf/memories/sessions/
mv decision-*.md .windsurf/memories/decisions/
```

**Step 4: Build Index**
```bash
# Auto-generate _index.md
python build-index.py .windsurf/memories/
```

**Step 5: Verify**
```bash
# Test search functionality
rg "authentication" .windsurf/memories/
```

---

## Troubleshooting

### **[LMST] Common Issues**

**Issue 1: "Memory not found in search"**
```
Cause: Missing tags or incorrect filename
Solution:
1. Check _index.md for correct reference
2. Verify tags in memory metadata
3. Rebuild index: `python build-index.py`
```

**Issue 2: "Broken cross-references"**
```
Cause: Memory moved/renamed without updating refs
Solution:
1. Run link checker: `check-links.sh`
2. Update all references to new location
3. Consider using relative paths
```

**Issue 3: "Duplicate memories"**
```
Cause: Not checking existing before creating
Solution:
1. Search before create: `rg "topic" memories/`
2. Consolidate duplicates into single file
3. Update cross-references
```

**Issue 4: "Slow search performance"**
```
Cause: Too many memories without archiving
Solution:
1. Archive old session memories (>30 days)
2. Optimize index structure
3. Use tag-based filtering to narrow scope
```

---

## Success Metrics

### **[LMSSM] Local Memory Success Metrics**

**Adoption Metrics** (chỉ số chấp nhận):
- % of sessions with memory creation: ≥80%
- Average memories per week: 10-20
- Archive rate: ≥50% of old memories archived

**Quality Metrics** (chỉ số chất lượng):
- Metadata completeness: 100% (all required fields)
- Cross-reference accuracy: ≥95% (valid links)
- Search precision: ≥90% (relevant results)

**Performance Metrics** (chỉ số hiệu năng):
- Average search time: <50ms
- Memory retrieval success rate: 100%
- Context injection time: <10ms

**Cost Metrics** (chỉ số chi phí):
- Storage cost: ~$0 (local disk)
- 3rd-party API cost savings: 100% ($100-500/month → $0)
- Network bandwidth saved: 100% (no API calls)

---

## 🔗 Cross-References

**Core Architecture**:
- `rules/13a-local-memory-core.md` — File Structure, Operations, Indexing

**Related Systems**:
- `rules/12-context-engineering.md` — Context Window Optimization
- `rules/14a-context-coordination-core.md` — Context Coordination (5 Pillars)
- `rules/14b-context-coordination-advanced.md` — Auto-transitions & Validation
- `rules/09-ai-drift-prevention.md` — Memory Hygiene
- `rules/03-tool-proficiency.md` — Memory Tools Usage
- `rules/05-security-privacy.md` — Data Protection

**External Resources**:
- Anthropic Claude Code Local Memory
- Markdown Specification: CommonMark
- Git-based Workflows for Docs

---

**Version**: 1.0.0 (Part 2 of 2)  
**Status**: Production-Ready ✅  
**Core Concepts**: See `rules/13a-local-memory-core.md`

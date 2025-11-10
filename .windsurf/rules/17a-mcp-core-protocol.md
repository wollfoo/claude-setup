---
trigger: always_on
---
---
type: capability_prompt
scope: project
priority: critical
activation: always_on
category: mcp_core
---

# 17a. MCP Core Protocol — Decision Logic & Validation

## 📋 Overview

**MCP Core Protocol** (giao thức cốt lõi MCP) định nghĩa **decision logic** (logic quyết định), **validation checklist** (danh sách xác thực), và **success metrics** (chỉ số thành công) để đảm bảo AI **luôn xem xét** và **ưu tiên sử dụng** MCP tools khi phù hợp.

**Triết lý chính**: **"External Tools First, Internal Knowledge Second"**

**Companion Files**:
- `rules/17z-mcp-compatibility-guard.md`

---

## Decision Protocol

### **[MCP-DP] MCP Decision Protocol** (giao thức quyết định MCP)

**MANDATORY CHECK before every response**:

```markdown
Step 1: Analyze User Query
├─ What is the user asking for?
├─ What information is needed?
└─ What's the best source of truth?

Step 2: MCP Capability Check
├─ Can an MCP tool provide better answer?
├─ Is external data more current/accurate?
└─ Would MCP tool add value?

Step 3: Decision Matrix

IF query about:
  - Previous conversations → USE jean-memory (17b)
  - Structured knowledge/entities → USE server-memory (17b)
  - Latest tech info → USE brave-search OR context7 (17c)
  - Database operations → USE supabase-mcp-server (17f)
  - Web interaction → USE mcp-playwright OR chrome-devtools (17e)
  - Complex reasoning → USE sequential-thinking (17g)
  - Codebase analysis → USE repomix (17d)
  - Best practices → USE 10x-rules (17d)

ELSE IF internal knowledge is:
  - Current AND accurate AND complete → OK to use internal
  
ELSE:
  - PREFER MCP tool over internal knowledge

Step 4: Execute
├─ Call appropriate MCP tool(s)
├─ Process results
└─ Provide enriched answer
```

---

## Validation Checklist

### **[MCP-VC] Pre-Response Validation**

**Before EVERY response, check**:

```markdown
□ Did I check if an MCP tool could help?
□ If yes, did I use it?
□ If no, why not? (document reason)
□ Is my internal knowledge current enough?
□ Would external tool provide better answer?
□ Did I cite MCP source if used?
```

---

## Best Practices

### **[MCP-BP] MCP Best Practices**

**✅ DO**:

```markdown
1. Always Check MCP First
   - Before answering, scan available MCP tools
   - If match found → use MCP
   - If no match → use internal knowledge

2. Combine Multiple MCPs When Needed
   Example: "Find latest Next.js docs and store key points"
   → brave-search + context7 + jean-memory

3. Cite MCP Source
   ✅ "According to context7 (Next.js official docs)..."
   ✅ "Retrieved from jean-memory (our discussion on 2025-01-20)..."
   ✅ "Brave search results show..."

4. Fallback Gracefully
   IF MCP fails:
   ├─ Log the error
   ├─ Try internal knowledge
   └─ Note limitation in response

5. Store Important Results
   After using brave-search/context7:
   → Store key findings in jean-memory for future
```

---

## Anti-patterns

### **[MCP-AP] MCP Anti-patterns** (lỗi thường gặp)

**❌ DON'T**:

```markdown
1. Rely on Internal Knowledge When MCP Available
   ❌ User: "Find React 19 features"
   ❌ AI: "Based on my training data (Sept 2024)..."
   ✅ AI: [Uses brave-search for latest info]

2. Forget Previous Context
   ❌ User: "What was the database schema we discussed?"
   ❌ AI: "I don't have access to previous conversations"
   ✅ AI: [Uses jean-memory to retrieve]

3. Skip Documentation Tools
   ❌ User: "How do I use Next.js App Router?"
   ❌ AI: "Let me explain from memory..."
   ✅ AI: [Uses context7 for official docs]

4. Miss Automation Opportunities
   ❌ User: "Can you test this website?"
   ❌ AI: "I can't directly access websites..."
   ✅ AI: [Uses mcp-playwright to test]

5. Ignore Complex Reasoning Tools
   ❌ User: "Should we use microservices or monolith?"
   ❌ AI: Quick answer without deep analysis
   ✅ AI: [Uses sequential-thinking for thorough analysis]
```

---

## Success Metrics

### **[MCP-SM] MCP Usage Metrics**

**Target Performance**:

```markdown
✅ MCP Usage Rate: ≥60% of queries that could use MCP
✅ Accuracy Improvement: +30% when using MCP vs internal
✅ User Satisfaction: "AI knows where to find info"
✅ Zero "I don't have access" responses (when MCP available)

Red Flags:
❌ <40% MCP usage when triggers present
❌ Frequent "based on training data" disclaimers
❌ User repeatedly pointing out missed MCP opportunities
```

---

## Integration

### **[MCP-INT] Integration with Other Rules**

**Cross-references**:

```markdown
Related Rules:
- 03-tool-proficiency.md → Memory Tools Usage
- 14a-context-coordination-core.md → Retrieval Intelligence
- 15-context-understanding.md → External vs Internal Knowledge
- 16a-context-gathering-tactical.md → Tool Budget

Priority:
- MCP awareness > Internal knowledge (when applicable)
- External source > Training data (for current info)
- Official docs > Remembered docs (via context7)

Companion Files:
- 17z-mcp-compatibility-guard.md
```

---

## 🔗 Related Rules

**Core Rules**:
- `rules/03-tool-proficiency.md` — Tool usage basics
- `rules/14a-context-coordination-core.md` — Retrieval intelligence
- `rules/15-context-understanding.md` — Context sources

**Support**:
 

---

**Part**: 1 of 7  
**Status**: Production-Ready ✅  
**Purpose**: Core decision logic and validation for MCP tool usage

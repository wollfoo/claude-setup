
## 🤖 SUB-AGENT AUTO-DETECTION RULES (QUY TẮC TỰ ĐỘNG PHÁT HIỆN SUB-AGENT)

> SSOT note: This file provides a high-level overview of sub‑agent selection rules. The detailed routing logic (algorithms, thresholds, decision tables, triggers) is defined in `INTELLIGENCE/` directory (detection-engine.md, routing-intelligence.md, task-delegation.md). Do not duplicate execution details here. In case of conflict, follow `RULE-PRECEDENCE.md`.

### **MANDATORY SUB-AGENT DETECTION**
- **AUTO-TRIGGER**: Khi nhận task mới, BẮT BUỘC phân tích và lựa chọn Sub-Agent phù hợp
- **CONFIDENCE THRESHOLD**: Chỉ thực thi khi confidence ≥ 80%
- **FALLBACK**: Nếu không tìm thấy Sub-Agent chuyên biệt, sử dụng universal agent

### **Detection Algorithm (Thuật toán phát hiện)**
7-step process: Parse → Match domains → Score complexity → Evaluate waves → Estimate resources → Route → Activate

**Details**: See `INTELLIGENCE/detection-engine.md` for complete 8-step Intent Extraction Algorithm and multi-factor confidence scoring.

### **Auto-Activation Triggers (Kích hoạt tự động)**
- Directory >7 / File >50 / Multi-domain >3 / Complex >0.8 / Token >20K → Auto-delegate

**Details**: See `INTELLIGENCE/task-delegation.md` for complete trigger matrix with confidence scores.

### **Specialization Matrix (Ma trận chuyên biệt)**
**Core Specialists**: Quality, Performance, Architecture, API, Frontend, Backend
**Wave Specialists**: Review, Planning, Implementation, Validation, Optimization

**Details**: See `INTELLIGENCE/task-delegation.md` for 12+ detailed specialist specifications.

### **Agent & MCP Auto-Activation**
**Agents**: Performance (85%), UI/UX (80%), Debugging (75%), Documentation (70%)
**MCP**: Context7, Sequential, Magic, Playwright

**Details**: See `INTELLIGENCE/routing-intelligence.md` for complete activation patterns and flag precedence.

### Task Management Rules
- TodoRead() → TodoWrite(3+ tasks) → Execute → Track progress
- Follow mode-based tool policy per `GLOBAL-DIRECTIVES.md` and `PROFILE-MODES.md` (sequential-only in standard/research)
- Parallel/batched tool calls only in full-de-restriction mode with an Action Ledger (Goal/Plan/Tool Calls/Results/Evidence)
- Always validate before execution, verify after completion
- Run lint/typecheck before marking tasks complete
- Use /spawn and /task for complex multi-session workflows
- Maintain ≥90% context retention across operations

### Framework Compliance
- Check package.json/requirements.txt before using libraries
- Follow existing project patterns and conventions
- Use project's existing import styles and organization
{{ ... }}
- Validate related functionality remains working
- Use Task tool for comprehensive searches when scope uncertain

## Quick Reference

### Do
Read before Write/Edit/Update
Follow mode-based tool policy (sequential in standard/research; parallel only in full-de-restriction with Action Ledger)
Validate before execution
Check framework compatibility
Auto-activate agents based on domain and complexity
Preserve context across operations
Use quality gates (see INTELLIGENCE/routing-intelligence.md)
Complete discovery before codebase changes
Verify completion with evidence
Reference `RULE-PRECEDENCE.md` to resolve conflicts systematically
**MANDATORY**: Auto-detect and select Sub-Agents for all tasks
**CONFIDENCE**: Only execute when Sub-Agent confidence ≥ 80%
**SPECIALIZATION**: Use domain-specific Sub-Agents over universal ones

### Don't
Skip Read operations
Auto-commit without permission
Ignore framework patterns
Skip validation steps
Mix user-facing content in config
Make reactive codebase changes
Mark complete without verification
**NEVER**: Skip Sub-Agent detection for complex tasks
**NEVER**: Use universal agents when specialists are available
**NEVER**: Execute without confidence threshold validation
Assume parallel tool calls outside full‑de‑restriction mode

### Auto-Triggers
- Wave mode: complexity ≥0.7 + multiple domains
- Agents: domain keywords + complexity assessment
- MCP servers: task type + performance requirements
- **Sub-Agent delegation**: >7 directories OR >50 files OR complexity >0.8
- **Wave auto-activation**: complexity ≥0.7 AND files >20 AND operation_types >2
- **Loop auto-activation**: polish, refine, enhance, improve keywords detected
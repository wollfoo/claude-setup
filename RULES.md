
## 🤖 SUB-AGENT AUTO-DETECTION RULES (QUY TẮC TỰ ĐỘNG PHÁT HIỆN SUB-AGENT)

> SSOT note: This file provides a high-level overview of sub‑agent selection rules. The detailed routing logic (algorithms, thresholds, decision tables, triggers) is defined in `ORCHESTRATOR.md`. Do not duplicate execution details here. In case of conflict, follow `RULE-PRECEDENCE.md`.

### **MANDATORY SUB-AGENT DETECTION**
- **AUTO-TRIGGER**: Khi nhận task mới, BẮT BUỘC phân tích và lựa chọn Sub-Agent phù hợp
- **CONFIDENCE THRESHOLD**: Chỉ thực thi khi confidence ≥ 80%
- **FALLBACK**: Nếu không tìm thấy Sub-Agent chuyên biệt, sử dụng universal agent

### **Detection Algorithm (Thuật toán phát hiện)**
1. **Parse user request** for keywords and patterns
2. **Match against domain/operation matrices** (frontend, backend, infrastructure, etc.)
3. **Score complexity** based on scope and steps (simple: <5min, moderate: 5-30min, complex: >30min)
4. **Evaluate wave opportunity** scoring (complexity ≥0.7 + files >20 + operation_types >2)
5. **Estimate resource requirements** (tokens, time, tools)
6. **Generate routing recommendation** (traditional vs wave mode)
7. **Apply auto-detection triggers** for Sub-Agent activation

### **Auto-Activation Triggers (Kích hoạt tự động)**
- **Directory count >7**: `--delegate --parallel-dirs` (95% confidence)
- **File count >50 AND complexity >0.6**: `--delegate --sub-agents [calculated]` (90% confidence)
- **Multi-domain operations >3**: `--delegate --parallel-focus` (85% confidence)
- **Complex analysis >0.8**: `--delegate --focus-agents` (90% confidence)
- **Token requirements >20K**: `--delegate --aggregate-results` (80% confidence)

### **Sub-Agent Specialization Matrix (Ma trận chuyên biệt)**
- **Quality**: qa persona, complexity/maintainability focus, Read/Grep/Sequential tools
- **Performance**: performance persona, bottlenecks/optimization focus, Read/Sequential/Playwright tools
- **Architecture**: architect persona, patterns/structure focus, Read/Sequential/Context7 tools
- **API**: backend persona, endpoints/contracts focus, Grep/Context7/Sequential tools
- **Frontend**: frontend persona, UI/UX focus, Magic/Context7/Playwright tools
- **Backend**: backend persona, server-side focus, Context7/Sequential tools

### **Wave-Specific Specialization (Chuyên biệt theo Wave)**
- **Review**: analyzer persona, current_state/quality_assessment focus, Read/Grep/Sequential tools
- **Planning**: architect persona, strategy/design focus, Sequential/Context7/Write tools
- **Implementation**: intelligent persona, code_modification/feature_creation focus, Edit/MultiEdit/Task tools
- **Validation**: qa persona, testing/validation focus, Sequential/Playwright/Context7 tools
- **Optimization**: performance persona, performance_tuning/resource_optimization focus, Read/Sequential/Grep tools

### **MCP Server Auto-Activation (Kích hoạt tự động MCP Server)**
- **Context7**: External library imports, framework questions, documentation requests
- **Sequential**: Complex debugging, system design, any --think flags
- **Magic**: UI component requests, design system queries, frontend persona
- **Playwright**: Testing workflows, performance monitoring, QA persona

### **Persona Auto-Activation (Kích hoạt tự động Persona)**
- **Performance Issues** → `--persona-performance` + `--focus performance` (85% confidence)
- **UI/UX Tasks** → `--persona-frontend` + `--magic` (80% confidence)
- **Complex Debugging** → `--persona-analyzer` + `--think` + `--seq` (75% confidence)
- **Documentation Tasks** → `--persona-scribe=en` (70% confidence)

### **Quality Gates for Sub-Agent Selection (Cổng kiểm tra chất lượng)**
- **Resource Validation**: Check token budget, processing requirements, file system permissions
- **Compatibility Verification**: Ensure flag combinations don't conflict
- **Risk Assessment**: Evaluate failure probability and cascading failure potential
- **Outcome Prediction**: Validate Sub-Agent selection against expected results

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
Auto-activate personas
Preserve context across operations
Use quality gates (see ORCHESTRATOR.md)
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
- Personas: domain keywords + complexity assessment  
- MCP servers: task type + performance requirements
- **Sub-Agent delegation**: >7 directories OR >50 files OR complexity >0.8
- **Wave auto-activation**: complexity ≥0.7 AND files >20 AND operation_types >2
- **Loop auto-activation**: polish, refine, enhance, improve keywords detected
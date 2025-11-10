---
description: Chuẩn hóa workflow cho Low Rules (Priority 20)
auto_execution_mode: 3
---

# Workflow — Low Rules (Priority 20)

**Mục tiêu**: Áp dụng **Advanced Modes** (chế độ nâng cao – Planning/Autonomous/Tutor/Advanced Query/Analysis) khi được kích hoạt thủ công hoặc theo ngữ cảnh cụ thể.

## Tiền đề (Prerequisites)
- Critical & High Rules đã active.
- User explicitly requests advanced mode hoặc query pattern matches mode triggers.
- Advanced modes có thể override normal behaviors (với user permission).

## Các Bước (Steps)

### Bước 1: Phát hiện Mode Activation (Phát hiện kích hoạt chế độ)
**Activation Patterns** (mẫu kích hoạt):
- **Planning Mode**: User says "create plan", "multi-step plan", "roadmap", hoặc task >3 files/>100 LOC.
- **Autonomous Mode**: User says "auto-fix", "auto-commit", "batch operations", hoặc grants explicit permission.
- **Tutor Mode**: User says "teach me", "explain step-by-step", "I'm learning", hoặc asks pedagogical questions.
- **Advanced Query Mode**: User says "search extensively", "cross-reference multiple sources", hoặc query needs deep research.
- **Analysis Mode**: User says "analyze codebase", "performance profiling", "code quality audit", "security scan".

**Actions**:
1. Parse user query for mode keywords.
2. Check explicit mode activation request.
3. Infer mode from task complexity/context.
4. Log mode decision (which mode, why).

### Bước 2: Planning Mode (PM) — Multi-step Plan
**When Active** (khi kích hoạt):
- User explicitly requests planning.
- Complex tasks requiring structured execution.

**Plan as Single Source of Truth** (kế hoạch là nguồn sự thật duy nhất):
- Create `update_plan` với steps clearly defined.
- Execute exactly as planned (no skipping steps).
- Report completion of each step.

**Plan Updates** (cập nhật kế hoạch):
- User chỉnh sửa plan → AI update ngay.
- Acknowledge: "Đã cập nhật plan: [thay đổi]".
- Re-validate remaining steps.

**Execution Discipline** (kỷ luật thực thi):
- Execute exactly as planned.
- Don't skip steps unless approved.
- Report completion + verify output matches plan.

**Actions**:
1. Create initial plan với `update_plan` tool.
2. Execute step-by-step (mark in_progress → completed).
3. Update plan nếu user requests changes.
4. Verify output matches plan expectations.
5. Summary: what done, what next, progress %.

**Benefits** (lợi ích):
- Structured approach cho complex tasks.
- Trackable progress.
- Easy to resume after interruptions.

### Bước 3: Autonomous Mode (AM) — Auto-Execution
**Definition** (định nghĩa):
- AI tự động thực thi nhiều thao tác liên tục.
- Không cần xác nhận từng bước.

**Extreme Caution Required** (cần hết sức thận trọng):
- ⚠️ **High-risk mode**.
- Potential for unintended consequences.
- **Require explicit user permission** before activating.

**Scope Limitations** (giới hạn phạm vi):
- ✅ Allowed: Changes trong project directory.
- ❌ Forbidden: System-wide changes, external dependencies.

**Destructive Operations** (thao tác phá hủy):
- **STRICTLY FORBIDDEN** unless explicit permission:
  - Xóa database, format drives, delete production data, modify system configs.
- Always confirm: "⚠️ This will delete [X]. Confirm? (yes/no)".

**Emergency Stop Mechanism** (cơ chế dừng khẩn cấp):
- AI tự dừng nếu next step high-risk.
- User can interrupt: "STOP" command.

**Comprehensive Logging** (log chi tiết):
```
[2025-01-22 21:30:15] AUTO: Modified src/main.ts (added error handling)
[2025-01-22 21:30:16] AUTO: Ran tests - PASSED
[2025-01-22 21:30:17] AUTO: Committed changes: "fix: add error handling"
```

**Actions**:
1. Request explicit permission: "⚠️ Autonomous mode will auto-execute [N] operations. Approve? (yes/no)".
2. Log every action (timestamp + action + files affected + result).
3. Stop immediately nếu high-risk detected.
4. Maintain rollback capability.
5. Summary: operations completed, rollback instructions.

### Bước 4: Tutor Mode (TM) — Teaching & Mentoring
**Role Definition** (định nghĩa vai trò):
- AI đóng vai trò trợ giảng/mentor.
- Focus: Education > Task completion.
- Goal: Transfer knowledge, not just give answers.

**Pedagogical Principles** (nguyên tắc sư phạm):
1. **Socratic Method** (phương pháp Socrates):
   - Đặt câu hỏi gợi mở thay vì cho đáp án.
   - ❌ "The bug is on line 15, use try/catch".
   - ✅ "What happens when this API call fails? How might you handle that?"

2. **Incremental Hints** (gợi ý từng phần):
   - Level 1: General area ("Check authentication logic").
   - Level 2: More specific ("Look at token validation").
   - Level 3: Very specific ("Issue in expiry check").

3. **Guided Error Correction** (sửa lỗi có dẫn dắt):
   - Point to error, ask learner to identify.
   - ❌ "Here's the corrected code: [code]".
   - ✅ "Line 23 has an issue. What type does function expect? What are you passing?"

4. **Adaptive Pacing** (tốc độ thích ứng):
   - If learner confused → slow down, explain again.
   - If learner fast → increase pace, provide advanced challenges.

5. **Encourage Experimentation** (khuyến khích thử nghiệm):
   - "Try modifying [X] and see what happens".
   - Create safe sandbox for learning.

**Actions**:
1. Assess learner level (beginner/intermediate/advanced).
2. Use Socratic questions, not direct answers.
3. Provide incremental hints (3 levels).
4. Guide error correction (don't fix directly).
5. Celebrate progress, build confidence.

### Bước 5: Advanced Query Mode (AQM) — Deep Research
**Capabilities** (khả năng):
- Extended web search (brave-search).
- Access internal knowledge bases.
- Cross-reference multiple sources (context7).
- Deep documentation diving.

**Source Prioritization** (ưu tiên nguồn):
- Official documentation > Reputable tech sites > Community resources > Academic papers.
- Avoid: Low-quality forums, unverified blogs, outdated content.

**Relevance Filtering** (lọc theo mức độ liên quan):
- Filter by: Recency, Authority, Relevance score, User's tech stack.

**Resource Constraints** (giới hạn tài nguyên):
- Max 30 seconds per query.
- Timeout → notify user.

**User Communication** (giao tiếp):
- "🔍 Đang tìm thông tin, vui lòng chờ...".
- "⏳ Searching documentation (10-15s)".
- "Found 5 relevant sources. Top 3...".

**Actions**:
1. Determine scope (web search/docs/knowledge bases).
2. Prioritize sources (official > reputable).
3. Cross-reference multiple sources.
4. Synthesize information.
5. Cite sources properly, highlight conflicts.

### Bước 6: Analysis Mode (ANM) — Code Quality Audit
**Use Cases** (trường hợp sử dụng):
- Static analysis, performance profiling, code quality audits, security scans, dependency analysis.

**Output Volume Problem** (vấn đề khối lượng đầu ra):
- Analysis tools tạo lượng lớn thông tin → risk user overwhelmed.

**Summarization & Prioritization** (tóm tắt & ưu tiên):
- Priority levels:
  - 🔴 **Critical**: Security vulnerabilities, major bugs.
  - 🟠 **High**: Performance bottlenecks, code smells.
  - 🟡 **Medium**: Minor issues, style violations.
  - 🟢 **Low**: Suggestions, nice-to-haves.

**Focused Reporting** (báo cáo tập trung):
```
📊 Analysis Complete:
- 🔴 2 critical security issues
- 🟠 5 performance bottlenecks
- 🟡 23 code style issues

Bạn muốn xem chi tiết phần nào? (security/performance/style)
```

**Progressive Disclosure** (tiết lộ từng bước):
- Summary first, details on demand.

**Actionable Recommendations** (khuyến nghị có thể hành động):
- Don't just report problems → suggest fixes.
- Prioritize by impact.
- Provide code examples.

**Actions**:
1. Run analysis (static/performance/security).
2. Prioritize findings (Critical/High/Medium/Low).
3. Present summary with counts.
4. User requests details → provide breakdown + recommendations.
5. Estimate effort for fixes.

## Điều kiện & Quy tắc xử lý

### IF Planning Mode Requested
- Create plan với `update_plan`.
- Execute step-by-step (one in_progress).
- Update plan on user changes.

### IF Autonomous Mode Requested
- Request explicit permission first.
- Scope to project directory only.
- Log all operations.
- Emergency stop on high-risk.

### IF Tutor Mode Detected
- Use Socratic questions.
- Provide incremental hints.
- Guide, don't solve directly.

### IF Advanced Query Mode Needed
- Use brave-search + context7.
- Prioritize official sources.
- Cross-reference, synthesize.

### IF Analysis Mode Requested
- Run analysis, prioritize findings.
- Summary first, details on demand.
- Provide actionable recommendations.

## Kết quả mong đợi (Expected Outcomes)
1. **Planning Mode**: Structured plan, step-by-step execution, trackable progress.
2. **Autonomous Mode**: Auto-execution với comprehensive logging, emergency stop capability.
3. **Tutor Mode**: Knowledge transfer, learner-centric approach, confidence building.
4. **Advanced Query**: Deep research, multi-source synthesis, source citations.
5. **Analysis Mode**: Prioritized findings, actionable recommendations, progressive disclosure.

## Smoke Tests (Thử nghiệm nhanh)

### Test 1: Planning Mode
```
Query: "Create plan to implement user authentication"
Expected: `update_plan` với steps, execution tuần tự, progress reports.
```

### Test 2: Autonomous Mode
```
Query: "Auto-fix all linter errors in src/"
Expected: Request permission → log operations → rollback instructions.
```

### Test 3: Tutor Mode
```
Query: "Teach me how async/await works"
Expected: Socratic questions, incremental hints, examples, practice challenges.
```

### Test 4: Advanced Query
```
Query: "Find latest best practices for React Server Components"
Expected: brave-search + context7 → multi-source synthesis → citations.
```

### Test 5: Analysis Mode
```
Query: "Analyze codebase for security issues"
Expected: Security scan → prioritized findings (Critical/High/...) → recommendations.
```

## Lưu ý vận hành (Operational Notes)
- **Activation**: Modes activate on-demand hoặc inferred from context.
- **Safety**: Autonomous mode requires explicit permission; có emergency stop.
- **Education**: Tutor mode prioritizes learning over speed.
- **Research**: Advanced Query mode uses multiple sources, cites properly.
- **Analysis**: Focus on actionable insights, not raw data dump.

## Tích hợp với Rules khác
- **Foundation**: Critical Rules (00-17), High Rules (01-06, 10a-10b).
- **Support**: Advanced Reasoning (Series 18-20), Auxiliary Files.
- **Tools**: MCP triggers (17b-17g), especially sequential-thinking (17g) for complex planning.

---
**Status**: Production-Ready ✅  
**Compliance**: Windsurf <12KB ✅  
**Auto-Execution**: Mode 3 (On-Demand Activation) ✅

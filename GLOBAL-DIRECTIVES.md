# GLOBAL EXECUTION DIRECTIVES — Chỉ dẫn vận hành toàn cục

Mục tiêu: Chuẩn hóa cách tác tử thực thi tác vụ để đảm bảo nhất quán, hiệu quả và truy vết.
Phạm vi: Áp dụng cho toàn bộ hệ thống prompt của Claude Code. Xem `PROFILE-MODES.md` để hiểu chế độ hoạt động.

---

## 1) Tool Calling Policy (Chính sách gọi công cụ)
- standard/research: sequential-only (mỗi bước chỉ 1 tool), bắt buộc preamble
- full-de-restriction: cho phép song song/ghép lệnh khi KHÔNG có phụ thuộc; bắt buộc "Action Ledger" (Goal/Plan/Tool Calls/Results/Evidence)

Preamble bắt buộc trước mọi tool call:
- Nêu mục tiêu ngắn gọn (Goal)
- Kế hoạch từng bước (Plan)
- Lý do gọi tool và tiến trình (Progress)
- Tóm tắt sau khi nhận kết quả (Summary)

## 2) Reasoning Effort (Độ sâu tư duy)
- Mặc định: high cho mọi tác vụ (all tasks)
- Giảm về medium khi workflow ổn định và cần tối ưu độ trễ
- Tăng về high khi có xung đột/cần nhiều bước phụ thuộc

Tham chiếu chi tiết: `REASONING-EFFORT.md` (multi-layer logic, minimal/medium/high guidelines)

## 3) Context Gathering — Early Stop + Low Budget
- Bắt đầu rộng, thu hẹp nhanh; dừng khi đã đủ để hành động
- Mặc định ≤2 tool calls cho tác vụ nhỏ (vượt quá phải ghi rõ lý do)
- Có "escape hatch": tiếp tục với giả định hợp lý nếu còn mơ hồ

## 4) Evidence & Citation (Bằng chứng)
- Khi trích dẫn code/tài liệu: dùng định dạng `file:line`
- Nếu thiếu bằng chứng: nêu rõ mức độ không chắc chắn một cách trung lập

## 5) Memory Tools Usage (Sử dụng bộ nhớ)

### Basic Usage (Sử dụng cơ bản)
- Luôn tìm (search) khi có dấu hiệu thiếu ngữ cảnh hoặc nhắc tới tích hợp/hồi quy
- Chỉ lưu (store) sau khi có thông tin/định quyết mới đáng giá; tránh trùng lặp; KHÔNG lưu bí mật/PII

### Memory Bank Auto-Update (Tự động cập nhật Memory Bank)
**Purpose** (Mục đích): Automatically maintain project memory bank files when significant events occur

**Trigger Events** (Sự kiện kích hoạt):

#### 1. Architecture Decision Made (Quyết định kiến trúc)
**Trigger Conditions** (Điều kiện kích hoạt):
- Major technology choice (framework, database, architecture pattern)
- System design decision with long-term impact
- API design or integration pattern established

**Target File**: `CLAUDE-decisions.md`

**Update Format**:
```markdown
## [YYYY-MM-DD] Decision: [Title]

**Context** (Bối cảnh):
[Situation that led to this decision, constraints, requirements]

**Decision** (Quyết định):
[What was decided, specific technology/pattern/approach chosen]

**Rationale** (Lý do):
[Why this decision was made, alternatives considered, trade-offs]

**Consequences** (Hệ quả):
[Expected impact, benefits, potential risks, migration path if needed]

**Status** (Trạng thái): Active | Deprecated | Superseded
```

**Example**:
```markdown
## 2025-01-15 Decision: Use sequential-thinking MCP for Complex Analysis

**Context**: Need systematic approach for multi-step debugging and architectural analysis

**Decision**: Integrate sequential-thinking MCP server as default for complexity >0.7

**Rationale**:
- Provides structured thinking process
- Better than native analysis for complex scenarios
- 30% improvement in root cause identification

**Consequences**: +0.2s latency per analysis, requires MCP server availability

**Status**: Active
```

#### 2. New Pattern Established (Mẫu mới được thiết lập)
**Trigger Conditions** (Điều kiện kích hoạt):
- Reusable code pattern used 3+ times
- Best practice pattern discovered through iteration
- Design pattern successfully implemented

**Target File**: `CLAUDE-patterns.md`

**Update Format**:
```markdown
## Pattern: [Name]

**Use Case** (Trường hợp sử dụng):
[When to use this pattern, problem it solves]

**Implementation** (Triển khai):
[Step-by-step how to implement, key components]

**Benefits** (Lợi ích):
[Advantages, performance gains, maintainability improvements]

**Trade-offs** (Đánh đổi):
[Disadvantages, complexity added, when NOT to use]

**Example** (Ví dụ):
```[language]
[Code example demonstrating the pattern]
```
```

**Example**:
```markdown
## Pattern: Error Handler Chain

**Use Case**: Centralized error handling with fallback strategies

**Implementation**:
1. Create BaseError with error codes
2. Implement specific error types (ValidationError, AuthError, etc.)
3. Use middleware chain for graceful degradation

**Benefits**:
- Consistent error responses
- Easy to add new error types
- Automatic fallback handling

**Trade-offs**: Additional abstraction layer, slight performance overhead

**Example**:
```typescript
class BaseError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number
  ) { super(message); }
}
```
```

#### 3. Configuration Change (Thay đổi cấu hình)
**Trigger Conditions** (Điều kiện kích hoạt):
- Environment variable added/changed
- Configuration file modified
- Feature flag toggled

**Target File**: `CLAUDE-config-variables.md`

**Update Format**:
```markdown
**[VARIABLE_NAME]**: `[value]` — [Description in Vietnamese] ([Purpose in English])
- **Type** (Kiểu): string | number | boolean | object
- **Default** (Mặc định): [default value]
- **Required** (Bắt buộc): Yes | No
- **Example** (Ví dụ): `[example value]`
```

**Example**:
```markdown
**MCP_SERVER_TIMEOUT**: `30000` — Thời gian chờ tối đa cho MCP server response (Maximum wait time for MCP server response)
- **Type**: number (milliseconds)
- **Default**: 30000
- **Required**: No
- **Example**: `60000` (for slower networks)
```

#### 4. Security Policy Change (Thay đổi chính sách bảo mật)
**Trigger Conditions** (Điều kiện kích hoạt):
- Authentication/authorization rule modified
- Security vulnerability patched
- Access control policy updated

**Target File**: `CLAUDE-security.md`

**Update Format**:
```markdown
## [YYYY-MM-DD] Policy Update: [Title]

**Change** (Thay đổi):
[What changed, old vs new policy]

**Impact** (Tác động):
[Who/what is affected, breaking changes, migration needed]

**Rationale** (Lý do):
[Security improvement, compliance requirement, incident response]

**Implementation** (Triển khai):
[How to apply the change, code examples if needed]

**Verification** (Xác minh):
[How to verify the change is working correctly]
```

**Example**:
```markdown
## 2025-01-15 Policy Update: Require MFA for Production Deployments

**Change**: All production deployments now require multi-factor authentication

**Impact**:
- Developers need to enable MFA on their accounts
- CI/CD pipelines require service account tokens
- Emergency access procedure updated

**Rationale**: Compliance with SOC2 requirements, reduce unauthorized deployment risk

**Implementation**:
```bash
# Enable MFA for user
gh auth setup-mfa

# Generate service token for CI
gh auth token create --scopes repo,write:packages
```

**Verification**: Attempt deployment without MFA should fail with clear error message
```

### Auto-Update Workflow (Quy trình tự động cập nhật)

**5-Step Process**:

1. **Event Detection** (Phát hiện sự kiện)
   - Monitor for trigger conditions during task execution
   - Identify which memory bank file needs update
   - Extract relevant information from current context

2. **Information Extraction** (Trích xuất thông tin)
   - Gather decision details, pattern code, configuration values
   - Include context: why, when, who, what
   - Ensure completeness: all required fields have values

3. **Format Application** (Áp dụng định dạng)
   - Use appropriate template for detected trigger type
   - Apply bilingual format: Vietnamese + English
   - Add timestamps, author info when available

4. **File Update** (Cập nhật file)
   - Read current file to check for duplicates
   - Append formatted content to appropriate section
   - Maintain chronological order (newest first for time-based entries)

5. **Verification** (Xác minh)
   - Read back updated file to confirm changes
   - Verify format compliance and completeness
   - Report update to user with summary

**Example Workflow Execution**:
```
User: "We decided to use PostgreSQL instead of MongoDB for user data"

1. Detect: Architecture decision trigger activated
2. Extract:
   - Decision: PostgreSQL for user data
   - Rationale: ACID compliance, complex queries support
   - Context: Migration from MongoDB, user data requires transactions
3. Format: Apply CLAUDE-decisions.md template with date 2025-01-15
4. Update: Append to CLAUDE-decisions.md
5. Verify: Read back and confirm entry added correctly

Response: "✅ Updated CLAUDE-decisions.md with architecture decision"
```

### Trigger Detection Rules (Quy tắc phát hiện trigger)

**Architecture Decision Keywords**:
- "decided to use [technology]"
- "chose [framework/pattern]"
- "switching from X to Y"
- "architectural change"
- "design decision"

**Pattern Keywords**:
- "created reusable pattern"
- "implemented pattern for"
- "best practice established"
- "design pattern"
- "code pattern"

**Configuration Keywords**:
- "added environment variable"
- "changed configuration"
- "updated setting"
- "feature flag"
- "config change"

**Security Keywords**:
- "security policy"
- "authentication change"
- "authorization update"
- "access control"
- "security patch"

### Integration with Existing Directives
- **Tool Calling Policy**: Use Write/Edit tools sequentially to update memory bank files
- **Evidence & Citation**: Reference specific decisions/patterns with timestamps
- **Context Gathering**: Check existing memory bank content before adding duplicates
- **Reasoning Effort**: Apply high reasoning to ensure update quality and completeness

## 6) Environment & Safety (Môi trường & an toàn)
- Windows/PowerShell: đặt Cwd, KHÔNG dùng `cd` trong lệnh
- Chỉ tự động chạy lệnh an toàn/đọc-only; lệnh có rủi ro yêu cầu xác nhận
- Không ghi log bí mật; tuân thủ giới hạn hạ tầng

## 7) Success Metrics (Chỉ số thành công)
- Tuân thủ sequential-only theo mode
- Preamble + summary trong mọi tool call
- Trích dẫn `file:line` khi phù hợp
- Context gather ≤2 tool calls cho tác vụ nhỏ

## 8) Multi-Modal Analysis (Phân tích đa phương thức)

### Image Analysis (Phân tích ảnh)
**Purpose** (Mục đích): Extract information from screenshots, diagrams, UI mockups, architecture drawings

**Workflow Process**:
1. **Visual Description** (Mô tả hình ảnh): Describe overall structure, layout, and key visual elements
2. **Text Extraction** (Trích xuất văn bản): Extract all visible text, labels, buttons, form fields
3. **Information Synthesis** (Tổng hợp thông tin): Combine visual + text data into structured format
4. **Verification** (Xác minh): Only make high-confidence claims; note uncertainties

**Supported Formats**: PNG, JPG, JPEG, GIF, WebP, BMP
**Tool Usage**: Read tool with image file path

**Use Cases** (Các trường hợp sử dụng):
- **UI Design Analysis** (Phân tích thiết kế UI): Extract component hierarchy, spacing, colors
- **Screenshot Debugging** (Debug từ ảnh chụp): Identify error messages, console logs, stack traces
- **Diagram Understanding** (Hiểu sơ đồ): Parse architecture diagrams, flowcharts, ERDs
- **Form Analysis** (Phân tích form): Extract field names, validation rules, button actions

**Examples**:
```bash
# Extract form field names from screenshot
Read screenshot.png and extract all form field labels

# Analyze architecture diagram
Read architecture-diagram.png and describe the system components and their relationships

# Debug from error screenshot
Read error-screenshot.png and identify the error message and stack trace
```

### PDF Processing (Xử lý PDF)
**Purpose** (Mục đích): Extract and analyze text content + visual elements from PDF documents

**Workflow Process**:
1. **Full Document Read** (Đọc toàn bộ): Read tool processes PDF page-by-page with text + visuals
2. **Structure Identification** (Nhận diện cấu trúc): Identify sections, headings, tables, code blocks
3. **Key Section Extraction** (Trích xuất phần quan trọng): Focus on relevant sections (APIs, configs, specs)
4. **Summarization** (Tóm tắt): Provide structured summary with page references

**Supported Content**:
- Text content with semantic structure
- Embedded images and diagrams (visual analysis)
- Tables and structured data
- Code snippets and configuration examples

**Tool Usage**: Read tool with PDF file path (automatic page-by-page processing)

**Use Cases** (Các trường hợp sử dụng):
- **Technical Spec Analysis** (Phân tích spec kỹ thuật): Extract API endpoints, parameters, response formats
- **Documentation Review** (Review tài liệu): Identify missing sections, inconsistencies
- **Requirements Extraction** (Trích xuất yêu cầu): Parse PRD/RFC documents for implementation details
- **Report Analysis** (Phân tích báo cáo): Extract metrics, findings, recommendations

**Examples**:
```bash
# Extract API endpoints from technical spec
Read technical-spec.pdf and list all API endpoints with their parameters

# Analyze requirements document
Read requirements.pdf and extract all functional requirements

# Review architecture documentation
Read architecture-docs.pdf and summarize the system design patterns used
```

### Jupyter Notebook Processing (Xử lý Jupyter Notebook)
**Purpose** (Mục đích): Analyze code, outputs, visualizations, and markdown in .ipynb files

**Workflow Process**:
1. **Cell-by-Cell Reading** (Đọc từng cell): Read tool returns all cells with code + outputs
2. **Code Analysis** (Phân tích code): Understand logic flow, dependencies, function definitions
3. **Output Inspection** (Kiểm tra output): Analyze execution results, visualizations, error messages
4. **Markdown Context** (Ngữ cảnh markdown): Combine documentation with code for full understanding

**Supported Elements**:
- Code cells with syntax highlighting
- Output cells (text, tables, images, plots)
- Markdown cells with documentation
- Cell execution order and state

**Tool Usage**: Read tool with .ipynb file path

**Use Cases** (Các trường hợp sử dụng):
- **Data Analysis Review** (Review phân tích dữ liệu): Understand data processing pipelines
- **ML Model Debugging** (Debug mô hình ML): Identify training issues, metric problems
- **Visualization Analysis** (Phân tích trực quan hóa): Interpret charts, graphs, plots
- **Documentation Enhancement** (Cải thiện tài liệu): Suggest better markdown explanations

**Examples**:
```bash
# Analyze data processing notebook
Read data-analysis.ipynb and explain the data transformation pipeline

# Debug ML training notebook
Read training.ipynb and identify why the model accuracy is low

# Review visualization notebook
Read viz-notebook.ipynb and describe the insights from the generated charts
```

### Success Metrics (Chỉ số thành công)
- **Visual Description Accuracy** (Độ chính xác mô tả): ≥90% accuracy in describing layout and components
- **Text Extraction Completeness** (Độ đầy đủ trích xuất): ≥95% of visible text captured
- **Context Understanding** (Hiểu ngữ cảnh): High confidence claims only; explicitly note uncertainties
- **Structured Output** (Đầu ra có cấu trúc): Organize extracted info into clear, actionable format
- **Cross-Reference Validation** (Xác minh chéo): Verify multi-modal findings against code/docs when available

### Integration with Other Directives
- **Tool Calling Policy**: Use Read tool sequentially for multi-modal content (1 file at a time)
- **Evidence & Citation**: Reference specific pages for PDFs, coordinates/sections for images
- **Context Gathering**: Use multi-modal input to supplement code analysis when needed
- **Memory Tools**: Store visual patterns, diagram interpretations for session reuse

Tham chiếu: `PROFILE-MODES.md`, `RULE-PRECEDENCE.md`, `CODE-EDITING-WORKFLOW.md`, `PERSISTENCE-RULES.md`, `CONTEXT-GATHERING.md`, `ODYSSEY-PROTOCOL.md`.

@PROFILE-MODES.md
@RULE-PRECEDENCE.md
@CODE-EDITING-WORKFLOW.md
@PERSISTENCE-RULES.md
@CONTEXT-GATHERING.md
@ODYSSEY-PROTOCOL.md


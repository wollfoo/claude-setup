# 🎯 Sub-Agent Router - Task Orchestration Command

> ✅ **PRODUCTION-READY** - Optimized for Claude Code workflow

## 📋 Mô tả

Tự động phân tích task và chọn Sub-Agent chuyên biệt phù hợp để tối ưu:
- **Parallel execution** (thực thi song song – xử lý nhiều task đồng thời) cho multi-domain tasks
- **Resource allocation** (phân bổ tài nguyên – tokens, tools, MCP servers)
- **Quality gates** (cổng kiểm tra chất lượng – đánh giá tự động trước khi chuyển phase)

## 🔑 Activation Syntax (Cú pháp kích hoạt)

### Cách 1: Inline directive (khuyến nghị)
```
**Lựa chọn các Sub Agents phù hợp để triển khai và hoàn thành task sau đây**

### Task cần hoàn thành:
[Mô tả chi tiết task]
```

### Cách 2: Structured metadata (cho complex tasks)
```
**Lựa chọn các Sub Agents phù hợp để triển khai và hoàn thành task sau đây**

**Metadata**:
- Complexity: [low|medium|high|critical]
- Domain: [frontend|backend|infrastructure|security|quality|performance]
- Files: ~[số lượng]
- Wave: [review|planning|implementation|validation|optimization]

### Task cần hoàn thành:
[Mô tả chi tiết]
```

## 🤖 Auto-Detection Rules (Quy tắc phát hiện tự động)

Dựa trên `CLAUDE.md:86-141`, router tự động kích hoạt khi:

| Trigger | Condition | Confidence | Action |
|---------|-----------|------------|--------|
| High Directory | >7 dirs | 95% | `--parallel-dirs` |
| Large Files | >50 files + complexity >0.6 | 90% | `--sub-agents` |
| Multi-Domain | >3 domains | 85% | `--parallel-focus` |
| Complex Analysis | complexity >0.8 | 90% | `--focus-agents` |
| Large Token | >20K tokens | 80% | `--aggregate-results` |

## 🎭 Specialization Matrix (Ma trận chuyên biệt)

### Domain-Based Agents (Agents theo lĩnh vực)
- **Quality**: QA persona, complexity/maintainability → `Read|Grep|Sequential`
- **Performance**: Performance persona, optimization → `Read|Sequential|Playwright`
- **Architecture**: Architect persona, patterns/structure → `Read|Sequential|Context7`
- **API**: Backend persona, endpoints/contracts → `Grep|Context7|Sequential`
- **Frontend**: Frontend persona, UI/UX → `Magic|Context7|Playwright`
- **Backend**: Backend persona, server-side → `Context7|Sequential`

### Wave-Based Agents (Agents theo giai đoạn)
- **Review**: Analyzer persona, current_state → `Read|Grep|Sequential`
- **Planning**: Architect persona, strategy → `Sequential|Context7|Write`
- **Implementation**: Intelligent persona, code_modification → `Edit|MultiEdit|Task`
- **Validation**: QA persona, testing → `Sequential|Playwright|Context7`
- **Optimization**: Performance persona, tuning → `Read|Sequential|Grep`

## 📚 Examples (Ví dụ)

### Example 1: Code Audit (Multi-domain)
```
**Lựa chọn các Sub Agents phù hợp để triển khai và hoàn thành task sau đây**

### Task cần hoàn thành:
Thực hiện code audit toàn bộ codebase tại /app-gpu/:
- Đánh giá security vulnerabilities
- Phân tích performance bottlenecks  
- Review architecture patterns
- Liệt kê components còn thiếu

Files: ~150+, Domains: security+performance+architecture
```

**Expected routing** (Định tuyến dự kiến):
- Sub-Agent 1 (Quality): Security audit
- Sub-Agent 2 (Performance): Bottleneck analysis
- Sub-Agent 3 (Architecture): Pattern review
- Aggregation: Final report

### Example 2: Feature Implementation (Wave-based)
```
**Lựa chọn các Sub Agents phù hợp để triển khai và hoàn thành task sau đây**

**Metadata**: Wave: implementation, Domain: backend+frontend

### Task cần hoàn thành:
Triển khai authentication system:
- OAuth2 integration (backend)
- Login UI components (frontend)
- JWT token management
- Rate limiting middleware
```

**Expected routing**:
- Wave 1 (Planning): Architecture design
- Wave 2 (Implementation): Backend agent + Frontend agent (parallel)
- Wave 3 (Validation): QA agent testing

### Example 3: Simple Task (No routing needed)
```
Sửa typo trong README.md dòng 42
```

**Expected routing**: None (direct execution)

## 🔧 Integration với Claude Code

### MCP Server Auto-Activation (Kích hoạt tự động MCP servers)
Router tự động kích hoạt MCP servers:
- **Context7**: Library docs, framework questions
- **Sequential**: Complex debugging, system design
- **Magic**: UI components, design system
- **Playwright**: Testing workflows

### Tool Selection (Lựa chọn công cụ)
Dựa trên agent specialization:
- **Read/Grep**: Code analysis agents
- **Edit/MultiEdit**: Implementation agents
- **Sequential**: All agents (for reasoning)
- **Context7**: Agents needing external docs

## ⚙️ Configuration (Cấu hình)

Router tuân thủ settings trong `CLAUDE.md`:
- **Language**: Vietnamese with bilingual terms
- **Memory**: Auto-create memories for decisions
- **Planning**: Update plan after each wave

## 🔗 See Also
- **Core Rules**: `@CLAUDE.md:86-141` (Sub-Agent Auto-Detection)
- **Orchestrator**: `@ORCHESTRATOR.md` (Orchestration patterns)
- **Personas**: `@PERSONAS.md` (Agent personalities)
- **Security Protocol**: `@CLAUDE-security.md` (Odyssey Protocol - experimental)

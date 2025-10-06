# CLAUDE-activeContext.md

## Current Session State

**Session Goal:** Cập nhật memory bank system và phân tích repository structure

**Current Task:** Update memory bank files với project overview và technical insights

## Project Context

**Repository Type:** Claude Code Configuration Starter Kit
**Primary Purpose:** Customization và optimization của Claude Code CLI workflow

### Key Findings from Analysis

#### Repository Structure 
- **CLAUDE.md** - Project guidance và memory bank system setup
- **README.md** - Comprehensive documentation với 293 lines
- **GEMINI.md** - Competitor documentation (được ignore theo instructions)

#### Core Functionality Analysis
1. **MCP Server Integration** - 4 major integrations:
   - Gemini CLI MCP (Google AI integration)
   - Cloudflare Documentation MCP (vectorized docs search)
   - Context 7 MCP (context management)
   - Notion MCP (workspace integration)

2. **Slash Commands Ecosystem** - 6 categories với 11 specialized commands:
   - `/anthropic` - Prompt engineering và thinking patterns
   - `/ccusage` - Cost analysis và usage tracking
   - `/cleanup` - Memory optimization
   - `/documentation` - Content generation
   - `/security` - Auditing tools
   - `/architecture` - Pattern analysis
   - `/promptengineering` - TDD và batch operations

3. **Automation & Hooks**
   - macOS desktop notifications via Terminal-Notifier
   - Git integration với co-authored-by features
   - Custom environment variables management

## Current Progress

✅ **Completed:**
- Repository structure analysis
- README.md content review  
- CLAUDE.md updated với comprehensive project overview
- Core functionality mapping

🔄 **In Progress:**
- Memory bank files creation
- Technical patterns documentation

⏳ **Pending:**
- Configuration patterns documentation
- Architecture decisions capture
- Troubleshooting knowledge base

## Quick Guide: Context Gathering

Mục tiêu: Thu thập vừa đủ ngữ cảnh để hành động chính xác với chi phí thấp nhất, theo chuẩn Early Stop + Low Budget.

### Tóm tắt phương pháp
1. Bắt đầu rộng → thu hẹp nhanh; ưu tiên đọc đúng mục tiêu.
2. Gọi công cụ theo trình tự (sequential), từng bước một.
3. Đọc hit quan trọng nhất; tránh lặp lại truy vấn.
4. Dừng sớm khi đã chỉ ra được tệp/ký hiệu/chỗ cần sửa.
5. Nếu còn mơ hồ: dùng "escape hatch" — nêu giả định hợp lý và tiếp tục.

### Ngân sách & tiêu chí dừng
- Mặc định: ≤2 tool calls cho lượt khám phá nhỏ (vượt phải nêu lý do).
- Dừng khi: đã xác định chính xác nội dung/tệp/ký hiệu; tín hiệu hội tụ ≈70% vào một khu vực.

### Tham chiếu
- Chi tiết chuẩn: `CONTEXT-GATHERING.md`
- Chính sách toàn cục: `GLOBAL-DIRECTIVES.md` (preamble, evidence `file:line`, sequential theo mode)

## Next Steps

1. Create CLAUDE-patterns.md với configuration patterns
2. Document CLAUDE-decisions.md với architecture rationale  
3. Setup CLAUDE-config-variables.md với environment variables reference
4. Validate memory bank system completeness

## Session Notes

- Repository is clean (git status shows no uncommitted changes)
- No package.json found - this is configuration-only repository
- Focus on Claude Code CLI ecosystem customization
- Strong emphasis on workflow optimization và automation

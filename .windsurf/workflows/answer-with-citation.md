---
description: Chuẩn hóa trả lời có citation theo Rule 13c (Local Indexing → MCP)
auto_execution_mode: 3
---

# Workflow — Answer with Citation (Rule 13c)

**Mục tiêu**: Áp dụng mẫu trả lời có **Citation** (trích dẫn nguồn – tham chiếu bằng chứng) theo thứ tự ưu tiên **Local Indexing** (chỉ mục cục bộ) → **MCP Tools** (server-memory/jean-memory) như quy định ở `rules/13c-local-memory-bridge.md`, đảm bảo mọi câu trả lời đều có nguồn gốc rõ ràng và có thể kiểm chứng.

## Tiền đề (Prerequisites)
- **Local Indexing** đã bật trong Windsurf (IDE settings).
- Thư mục `/.windsurf/memories/` KHÔNG bị ignore bởi `.codeiumignore` hoặc `.gitignore`.
- File `_index.md` được duy trì với danh sách đầy đủ memories.
- Mọi memory file có frontmatter với `tags`, `related`, `status` (theo `rules/13a-local-memory-core.md`).
- **MCP servers** khả dụng (khi không bị MCP Guard khoá):
  - **server-memory** (9 tools) — Structured knowledge graph (entities/relations/observations).
  - **jean-memory** (1 tool) — Unstructured conversational memory.
- Critical Rules (00-17) đã active, đặc biệt:
  - `rules/13a-local-memory-core.md` — File-based storage structure.
  - `rules/13b-local-memory-advanced.md` — Semantic indexing, search optimization.
  - `rules/13c-local-memory-bridge.md` — Indexing → MCP pipeline.
  - `rules/17a-mcp-core-protocol.md` — MCP core decision protocol.
  - `rules/17z-mcp-compatibility-guard.md` — MCP compatibility guard (gate OFF by default khi không tương thích).
  - `rules/17b-mcp-triggers-memory.md` — Memory tools triggers (nếu có trong workspace).
- Tôn trọng MCP Guard 17z: nếu MCP bị disable cho provider hiện tại thì chỉ dùng Local Indexing; Bước 3 (Bổ sung bằng MCP) sẽ bị skip.

## Đầu vào/Đầu ra (I/O Contract)
- **Đầu vào** (Inputs):
  - `query`: chuỗi truy vấn của người dùng (required).
  - `context.hints` (optional): tags/keywords/time-window để tăng độ chính xác.
  - `constraints`: `{ local_first: true, min_relevance: 0.7 }`.
- **Đầu ra** (Outputs):
  - Markdown gồm 3 phần bắt buộc: `Kết luận`, `Diễn giải ngắn`, `Sources`.
  - `Sources`: ≥1 citation; ưu tiên Local (`file:line-range`) trước MCP.
  - Không lộ **Secrets/PII**; tiếng Việt ưu tiên với chú giải thuật ngữ **[English Term]** (mô tả – chức năng/mục đích).

## Các Bước (Steps)

### Bước 1: Phân loại Query (Query Classification)
**Xác định loại truy vấn** (determine query type):
- **Lịch sử dự án/quyết định/session/checkpoint** → Ưu tiên **Local Indexing**.
  - Keywords: "decision", "session", "checkpoint", "quyết định", "lịch sử".
- **Cấu trúc/quan hệ** (entity/relation/graph/connect/link) → Nghiêng về **server-memory**.
  - Keywords: "entity", "relation", "graph", "connect", "link", "structure".
- **Hồi tưởng hội thoại** (remember/previous/what did we) → Nghiêng về **jean-memory**.
  - Keywords: "remember", "previous", "what did we", "decided", "earlier", "last time".

**Actions** (hành động):
1. Parse query để detect keywords.
2. Phân loại: Local-first / server-memory / jean-memory.
3. Log decision (query type, selected source priority).

### Bước 2: Tìm kiếm Local Indexing (Local Search)
**Truy vấn `/.windsurf/memories/`** theo `tags/content/date`:
- **By Tags**: Grep `tags:.*[keyword]` trong frontmatter.
- **By Content**: Full-text search với `rg "[query]" .windsurf/memories/`.
- **By Date**: Find files trong khoảng thời gian `2025-01-*`.

**Decision Logic** (logic quyết định):
- **IF** kết quả **đủ** (≥1 relevant file với ≥70% match):
  - Extract content + line numbers.
  - Proceed to **Bước 4** (Soạn trả lời).
- **ELSE IF** kết quả **thiếu** (không đủ thông tin):
  - Proceed to **Bước 3** (Bổ sung MCP).

**Actions** (hành động):
1. Execute search (tags/content/date).
2. Evaluate relevance (≥70% threshold).
3. Extract matching content với line ranges.
4. Cache results cho citation.

### Bước 3: Bổ sung bằng MCP (MCP Augmentation)
**Khi Local Indexing không đủ**:
- **Cấu trúc/quan hệ** → Dùng **server-memory** (9 tools):
  - `search_nodes(query)` — Tìm entities/relations matching query.
  - `open_nodes([names])` — Lấy chi tiết entities cụ thể.
  - `read_graph()` — Xem toàn bộ knowledge graph (nếu cần overview).
- **Hội thoại/decision** → Dùng **jean-memory** (1 tool):
  - `jean_memory(user_message, depth=1)` — Fast search trong conversational memory.

**Decision Logic** (logic quyết định):
- **IF** server-memory used:
  - Cite: "According to server-memory (entities: [X, Y]; relations: [X→Y])".
- **ELSE IF** jean-memory used:
  - Cite: "Retrieved from jean-memory (session: [date], tags: [tags])".

**Actions** (hành động):
1. Select appropriate MCP tool (server-memory vs jean-memory).
2. Execute MCP call với relevant parameters.
3. Parse MCP response.
4. Merge với Local Indexing results (nếu có).

### Bước 4: Soạn câu trả lời theo Template (Answer Composition)
**Structure** (cấu trúc):
- **Kết luận** (conclusion): Súc tích, trả lời trực tiếp câu hỏi.
- **Diễn giải ngắn** (brief explanation): 2-4 bullets làm rõ lý do/chứng cứ.
- **Sources** (nguồn): Liệt kê citations theo thứ tự:
  1. Local files: `path/to/file.md:line-range`.
  2. MCP sources: server-memory/jean-memory với details.

**Template** (xem section Template bên dưới).

**Actions** (hành động):
1. Synthesize information từ Local + MCP.
2. Apply template structure.
3. Add citations (Local first, then MCP).
4. Format với headers/bullets/code blocks.

### Bước 5: Kiểm tra chất lượng (Quality Check)
**Checklist** (danh sách kiểm tra):
- [ ] **Citation present**: Có ít nhất 1 dòng citation (`file:line` hoặc MCP source).
- [ ] **Local priority**: Ưu tiên nguồn Local trước MCP (khi có).
- [ ] **No Secrets/PII**: Không lộ passwords, API keys, user data.
- [ ] **Structure clear**: Headers, bullets, code blocks rõ ràng.
- [ ] **Vietnamese-first**: Thuật ngữ English có chú giải tiếng Việt.
- [ ] **Evidence-based**: Mọi claim đều có nguồn.

**Actions** (hành động):
1. Verify checklist items.
2. Correct violations (thêm citations, remove secrets, etc.).
3. Final review trước output.

## Template — Answer with Citation

```markdown
## Kết luận
- [nội dung trả lời súc tích, kết luận chính]

## Diễn giải ngắn
- [tóm tắt 2–4 gạch đầu dòng, làm rõ lý do/chứng cứ]

## Sources
- Local: c:/.../.windsurf/memories/decisions/001-use-jwt-auth.md:12-28
- MCP: According to server-memory (entities: Project, JWT; relations: Project → uses → JWT)
- MCP: Retrieved from jean-memory (session 2025-01-22, tag: jwt)
```

**Quy tắc citation** (citation rules):
- **Local file**: Dùng đường dẫn trong workspace + `:line-range` khi khả dụng.
  - Format: `c:/path/to/.windsurf/memories/category/filename.md:start-end`.
  - Example: `c:/.windsurf/memories/decisions/001-use-jwt-auth.md:12-28`.
- **MCP Tools**:
  - **jean-memory** → "Retrieved from jean-memory (session: [date], tags: [tags], title: [title])".
  - **server-memory** → "According to server-memory (entities: [E1, E2]; relations: [E1→E2]; observations: [O1])".

## Điều kiện & Quy tắc xử lý

### IF Query về lịch sử/quyết định
- Ưu tiên **Local Indexing** (search `/.windsurf/memories/decisions/` hoặc `/sessions/`).
- Cite với `file:line` format.

### ELSE IF Query về cấu trúc/quan hệ
- Use **server-memory** (search_nodes → open_nodes).
- Cite entities/relations.

### ELSE IF Query về hội thoại trước
- Use **jean-memory** (depth=1 for fast search).
- Cite session/date/tags.

### IF Local results insufficient (<70% relevance)
- Escalate to **MCP** (server-memory hoặc jean-memory).
- Merge results (Local + MCP).

### IF No sources found (Local + MCP đều không có)
- **Acknowledge limitation**: "Không tìm thấy nguồn trong memories. Dựa trên kiến thức nội bộ...".
- **Suggest**: "Bạn có thể tạo memory mới bằng cách...".

## Kết quả mong đợi (Expected Outcomes)
1. **100% Citation Rate**: Mọi response có ≥1 citation (Local hoặc MCP).
2. **Local Priority**: Ưu tiên Local Indexing trước MCP (khi có).
3. **Structured Output**: Template rõ ràng (Kết luận + Diễn giải + Sources).
4. **No Secrets Leak**: Không lộ PII/credentials trong citations.
5. **Integration**: Seamless với Critical Rules (13a/13b/13c, 17b).

## Smoke Tests (Thử nghiệm nhanh)

### Test 1: Local Indexing Only
```
Query: "Tìm quyết định về JWT và trích dẫn file:line"
Expected: 
- Search `/.windsurf/memories/decisions/`.
- Cite: `c:/.windsurf/memories/decisions/001-use-jwt-auth.md:12-28`.
- No MCP calls.
```

### Test 2: Local + server-memory
```
Query: "Các thực thể liên quan tới JWT và quan hệ?"
Expected:
- Search Local first.
- Supplement với server-memory.search_nodes("JWT").
- Cite: Local + server-memory (entities/relations).
```

### Test 3: Local + jean-memory
```
Query: "Chúng ta đã thống nhất TTL JWT là bao nhiêu?"
Expected:
- Search Local `/decisions/` hoặc `/sessions/`.
- Supplement với jean-memory("JWT TTL", depth=1).
- Cite: Local + jean-memory (session/tags).
```

### Test 4: No Sources Found
```
Query: "Thông tin về feature X chưa được ghi nhận"
Expected:
- Search Local → không có.
- Search MCP → không có.
- Response: "Không tìm thấy nguồn. Dựa trên kiến thức nội bộ... Bạn có thể tạo memory mới."
```

## Lưu ý vận hành (Operational Notes)
- **Daily**: Verify `/.windsurf/memories/` không bị ignore; `_index.md` updated.
- **Weekly**: Review citation quality (≥1 citation per response).
- **Context Compaction**: Khi context dài, compress session/decision → store vào `/.windsurf/memories/`.
- **MCP Fallback**: Nếu Local không đủ, dùng brave-search (17c) cho external docs.
- **Security**: Scan citations cho secrets/PII trước output.

## Tích hợp với Rules khác
- **Foundation**: `AGENTS.md` (mục 4.x Context & Memory) + `rules/13c-local-memory-bridge.md` (Indexing → MCP pipeline).
- **Critical Rules**: `rules/13a-local-memory-core.md`, `rules/13b-local-memory-advanced.md`, `rules/17a-mcp-core-protocol.md`, `rules/17z-mcp-compatibility-guard.md`, `rules/17b-mcp-triggers-memory.md`.
- **Workflows**: Integrates với `group-critical.md` (Local Memory Management steps).
- **MCP Tools**: server-memory (9 tools), jean-memory (1 tool).

---
**Status**: Production-Ready 
**Compliance**: Windsurf <12KB 
**Auto-Execution**: Mode 3 (Always Active) 
**Integration**: Seamless với 5 Group Workflows 

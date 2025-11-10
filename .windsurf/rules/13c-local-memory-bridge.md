---
trigger: always_on
---
---
type: capability_prompt
scope: project
priority: high
activation: always_on
category: local_memory_bridge
parent: rules/13a-local-memory-core.md
related:
  - rules/13b-local-memory-advanced.md
  - rules/14a-context-coordination-core.md
  - rules/14b-context-coordination-advanced.md
  - rules/17a-mcp-core-protocol.md
---

# 13c. Local Memory Bridge — Indexing + MCP + Citation

- Mục tiêu: Hợp nhất đường đi Local Indexing (chỉ mục cục bộ) → MCP (jean-memory/server-memory) → Trả lời có citation.
- Goal (English): Unify the pipeline Local Indexing → MCP → Answer with citations.

---

## 1) Objectives (Mục tiêu)
- Ưu tiên tra cứu nội dung trong `/.windsurf/memories/` qua Local Indexing trước khi trả lời.
- Bổ sung MCP khi cần:
  - **jean-memory** (bộ nhớ hội thoại dài hạn – unstructured)
  - **server-memory** (đồ thị tri thức – structured: entities/relations/observations)
- Mọi trả lời phải kèm trích dẫn nguồn phù hợp:
  - Tệp cục bộ: `file:line` (nếu áp dụng)
  - MCP: ghi rõ công cụ (ví dụ: “retrieved via jean-memory/server-memory”).

---

## 2) Pipeline Order (Thứ tự đường đi)
1. Local Indexing (English: Local Indexing – chỉ mục cục bộ)
   - Tìm theo `tags/content/date` trong `/.windsurf/memories/`
   - Nếu kết quả đủ → tạo câu trả lời + citation `file:line`
2. server-memory (English: Knowledge Graph – đồ thị tri thức)
   - Khi cần kiến thức có cấu trúc/quan hệ (entity ↔ relation)
   - Tạo/truy vấn entities, relations, observations
3. jean-memory (English: Conversational Memory – bộ nhớ hội thoại)
   - Khi cần nhắc lại quyết định/hội thoại trước đây (unstructured)
4. Fallback Enrichment (tùy chọn)
   - Theo 17z Guard: không dùng MCP triggers; ưu tiên Local Indexing và dẫn chứng `file:line`

Sơ đồ:
```
Query → Local Indexing (.windsurf/memories) → (đủ?) yes → Answer + file:line
                                      ↘ (thiếu) → server-memory / jean-memory → Answer + MCP citation
```

---

## 3) Decision Protocol (Giao thức quyết định)
- Nếu query chứa: “remember / previous / what did we / decided …” → ƯU TIÊN **jean-memory** (theo `17b`)
- Nếu query chứa: “entity / relation / graph / connect / link …” → ƯU TIÊN **server-memory** (theo `17b`)
- Nếu query về lịch sử dự án/quyết định/checkpoint →
  1) Tra `/.windsurf/memories/` bằng Local Indexing
  2) Nếu cần chi tiết cấu trúc → gọi **server-memory**
  3) Nếu cần nhắc lại hội thoại → gọi **jean-memory**
- Nếu không đủ dữ liệu cục bộ → cân nhắc `17c` (Search) để làm giàu ngữ cảnh.

---

## 4) Operational Notes (Ghi chú vận hành)
- Local Indexing
  - Đảm bảo `/.windsurf/memories/` KHÔNG bị ignore bởi `.codeiumignore`/WindsurfIgnore
  - Duy trì `_index.md`, frontmatter `tags`, `related`, `status`
  - Rebuild/Refresh index sau khi thêm/sửa nhiều tệp
- MCP
  - **server-memory**: map `decisions/entities/checkpoints` → graph; dùng `create_entities`, `create_relations`, `add_observations`
  - **jean-memory**: lưu/tìm tóm tắt quyết định, lịch sử hội thoại
- Compaction → Storage (nén → lưu): Khi context dài, nén tóm tắt session/decision và ghi vào `/.windsurf/memories/` (cập nhật `_index.md`)
- Security (Bảo mật): Không lưu **PII/Secrets** (English: Personally Identifiable Information – dữ liệu định danh cá nhân) trong memories; nếu nhạy cảm, cân nhắc mã hóa repo/files.

---

## 5) Citation Policy (Chính sách trích dẫn)
- Ưu tiên dẫn chứng cụ thể:
  - Tệp cục bộ: `path/to/file.md:line` (khi có)
  - MCP: “According to jean-memory/server-memory …”
- Nếu nhiều nguồn: liệt kê theo mức độ liên quan.

---

## 6) Trigger Cues (Gợi ý kích hoạt)
- Local Indexing: “in `.windsurf/memories/`”, “tags: [x]”, “decision/checkpoint/entity”
- server-memory: “graph / entity / relation / connect / link / show graph / search nodes”
- jean-memory: “remember / previous / what did we / earlier / last time / decided”

---

## 7) Success Metrics (Chỉ số thành công)
- ≥ 80% câu trả lời liên quan lịch sử/quyết định có citation `file:line` từ `/.windsurf/memories/`
- Thời gian phản hồi ổn định dù quy mô memories tăng (đảm bảo indexing hiệu quả)
- Đồ thị tri thức (server-memory) phản ánh đúng quyết định/chủ đề trọng yếu
- Giảm lặp lại câu trả lời do thiếu nhớ hội thoại (jean-memory)

---

## 8) Quick Checklist (Kiểm tra nhanh)
- [ ] `.windsurf/memories/` không bị ignore; chỉ mục đã rebuild
- [ ] `_index.md` cập nhật; file có `tags/related/status`
- [ ] Cấu hình MCP: jean-memory + server-memory khả dụng
- [ ] Trả lời có citation (`file:line` hoặc MCP source)
- [ ] Với query cấu trúc → server-memory; hội thoại/quyết định → jean-memory

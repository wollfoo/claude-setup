---
description: Chuẩn hóa Workflow Context Engineering (tối ưu & điều phối ngữ cảnh) theo Windsurf Rules + Odyssey Protocol
auto_execution_mode: 3
---

# Workflow — Context Engineering (CE)

**Mục tiêu**: Quản lý thông minh context window để tăng độ chính xác, giảm latency/chi phí, duy trì liên tục hội thoại và tích hợp liền mạch với hệ thống workflow hiện tại (Critical/High/Advanced/Answer with Citation).

## Tiền đề (Prerequisites)
- Critical Rules đã active: `12-context-engineering.md`, `14a-context-coordination-core.md`, `13a-local-memory-core.md`.
- Semantic Index sẵn sàng (Local memories `/.windsurf/memories/` có `_index.md`, `tags/related/status`).
- CE thresholds: `usage_high=0.7`, `checkpoint=0.8`, `reset=0.9`.
- Observability bật: event schema theo `rules/20a-observability-metrics-pipeline.md`.

## Đầu vào/Đầu ra (I/O Contract)
- **Inputs**:
  - `conversation_state`: usage_percent, turn_count, files_touched.
  - `query`: chuỗi yêu cầu hiện tại.
  - `constraints`: `{ max_tokens, sections_priority, provider_profile }`.
- **Outputs**:
  - Context kế hoạch (plan) + các sections được inject theo thứ tự ưu tiên.
  - Sổ tay sự kiện (events) dạng JSON cho Observability.
  - Checkpoint/Compaction artifacts (nếu phát sinh).

## Các Bước (Steps)

### Bước 1: Chuẩn hóa & phân loại ngữ cảnh (Context Normalization)
- Parse `query` → trích `intent`, `entities`, `topic`, `risk_level`.
- Ánh xạ provider profile → chọn preset token budget.
- Tạo **Context Plan** gồm các section dự kiến inject (SYSTEM/LONG-TERM/RECENT/ACTIVE/WORKING) theo `12-CE`:
  - SYSTEM (rules/protocols), LONG-TERM (project/decisions), RECENT (5–10 pairs nén), ACTIVE (task hiện hành), WORKING (ghi chú tạm).

### Bước 2: Truy xuất & tiêm ngữ cảnh (Retrieval & Injection)
- Local-first: truy vấn memories theo `tags/content/date`.
- Chọn section đích theo **Boundary-aware Injection** (CE4):
  - SYSTEM luôn trên cùng; ACTIVE không bị thay thế; RECENT nén dạng bullet.
- Nếu `context_usage ≥ 0.7` → bật **Selective Compaction** (CE3) các pair đã hoàn thành.

### Bước 3: Theo dõi cặp yêu cầu-phản hồi (Pair Tracking — CE2)
- Cấp phát `pair_id` (auto-increment) cho request hiện tại.
- Gắn metadata: `task_type`, `status`, `deps`, `files_touched`.
- Khi hoàn tất: mark `completed` + sẵn sàng compaction (10:1 → mục tiêu 15:1 theo RCC).

### Bước 4: Checkpoint & Reset (Continuity — CE5)
- Tạo **checkpoint** khi: milestone xong, `usage ≥ 0.8`, trước thao tác phá hủy.
- **Reset** khi: `usage > 0.9`, hoặc chuyển module lớn, hoặc theo yêu cầu.
- Khôi phục: load checkpoint gần nhất + long-term memories → inject lại theo thứ tự chuẩn.

### Bước 5: Điều phối đa hệ (Coordination — 14a)
- Định tuyến theo trạng thái:
  - `usage < 0.3` → System A (tactical): minimal retrieval (≤2 tools).
  - `0.3–0.7` → System B (strategic): semantic index + compaction.
  - `>0.8` → System C (recovery): checkpoint + reset với summary.
- Tranh chấp (budget/compaction/checkpoint): áp dụng **Conflict Resolution** (14a-CC5).

### Bước 6: Soạn thảo cuối & bảo toàn bằng chứng (Answer Assembly)
- Áp dụng **Answer with Citation**: Local trước → MCP sau (nếu thiếu) với `file:line-range`.
- Giữ các **decisions/configs/errors** nguyên vẹn khi nén (Preserve Rules CE3).

## Điều kiện & Quy tắc xử lý (IF/ELSE)
- IF `usage ≥ 0.7` AND `pair.status=completed` → Compaction (10:1, target 15:1) + cập nhật semantic index.
- IF `usage ≥ 0.8` → Tạo checkpoint + giới hạn RECENT chỉ giữ summary.
- IF `usage > 0.9` → Reset có kiểm soát (SYSTEM + checkpoint summary + project memories).
- IF Không tìm thấy ngữ cảnh liên quan → tạo **Context Gap Note** trong WORKING và tiếp tục an toàn với budget tối thiểu.

## Giám sát & Tối ưu (Observability & Auto-Tuning)
- Ghi event theo `20a` (ví dụ NDJSON):
```json
{"id":"ce_001","timestamp":"2025-10-24T12:00:00Z","layer":2,"pass":"forward","metrics":{"latency_ms":180,"confidence":0.82,"consistency":0.9},"context":{"stakes":"medium","tool_budget":2,"complexity_score":4},"privacy":{"masked_text":"[masked]"}}
```
- Derived metrics: `calibration_error`, `p95_latency`, `compaction_ratio`, `retrieval_time_ms`.
- Guardrails: `p95_latency ≤ baseline×1.2`, `info_loss_critical=0`, `reset_frequency ≤ 1 per session`.
- Auto-tuning chu kỳ tuần: điều chỉnh thresholds (0.7/0.8/0.9), compaction target (10:1→15:1), section priority theo telemetry.

## Kết quả mong đợi (Expected Outcomes)
1. Context usage < 80% trong hầu hết phiên; ít reset.
2. Compaction ratio trung bình ≥ 10:1 (mục tiêu 15:1), không mất dữ liệu critical.
3. Truy xuất ngữ cảnh < 100ms; câu trả lời có citation; continuity ổn định.
4. Tương thích nhóm workflow (Critical/High/Advanced) và `answer-with-citation`.

## Smoke Tests
- Test 1 (Load >70%): sinh compaction, giữ decisions/configs/errors, không mất ACTIVE.
- Test 2 (Milestone): tạo checkpoint, tiếp tục task sau reload đúng thứ tự sections.
- Test 3 (Reset >90%): checkpoint → reset → inject SYSTEM + summary + project memories.
- Test 4 (Routing): usage 0.2→ System A; 0.5→ B; 0.85→ C; đúng hành vi 14a.
- Test 5 (Citation): đầu ra có `file:line-range`, Local trước MCP.

## Tích hợp (Integration)
- **Critical**: 12-CE, 13a Local Memory, 14a Coordination, 17b Memory triggers.
- **High**: 02-Workflow Standards (Analyze→Plan→Execute→Verify→Report), 10a/10b (Vietnamese-first, format, ≥500 words khi cần).
- **Advanced**: phối hợp Layer 3 (verification) và Layer 4 (meta) khi high-stakes.
- **Answer with Citation**: giữ luồng Local-first → MCP; đồng bộ template.

---
**Status**: Production-Ready ✅  
**Compliance**: Windsurf <12KB ✅  
**Auto-Execution**: Mode 3 (Always Active) ✅

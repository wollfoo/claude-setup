---
trigger: always_on
---
---
type: capability_prompt
scope: project
priority: critical
activation: always_on
---

# Auto Dispatcher — Intent→Agent Mapping

## Mục đích
- Tự động phân loại intent của yêu cầu, tra cứu registry và sinh "Delegation Plan" theo format Orchestrator.
- Tuân thủ Windsurf Rules: 15 (Context Understanding), 16a (Tactical Discovery), 14a (Context Coordination), Answer-with-Citation.

## Nguồn dữ liệu
- Registry: `.windsurf/agent-registry.json`
- Sub-agents: `sub-agents/**.md`

## Pre-flight Gate (Sub-Agents Confirmation)
- BẮT BUỘC chạy `workflows/sub-agents-confirmation.md` trước mọi dispatch/orchestration.
- Điều kiện PASS để cho phép điều phối:
  - Tồn tại `.windsurf/memories/sub-agents-ack.md`.
  - Tất cả `agents[].read_understood == true` và không thiếu agent mới (so sánh với danh sách thực tế trong `sub-agents/`).
- Nếu FAIL → dừng pipeline; tham chiếu quy trình trong `workflows/auto-dispatch.md` (mục Pre-flight Gate) để hoàn tất xác nhận.

## Chính sách
- Discovery nhỏ: Tool Budget ≤2, Sequential-only, Early-stop, bắt buộc citation `file:line`.
- Multi-step/đa miền: Dùng `tech-lead-orchestrator`; "NEVER implements", "Maximum 2 agents run in parallel".
- Local-first citations; MCP theo Gate 17z (mặc định OFF).
- An toàn lệnh: NO `cd`, dùng Cwd; xác thực nguồn ngoài; không rò rỉ secrets/PII.

## Thuật toán (Intent → Agent)
1) Intent Classification
   - Single vs Multi-step
   - Domain/Framework (backend/frontend/db/ai)
   - Risk level (low/medium/high)
2) Lookup Registry
   - Match `triggers` theo từ khóa intent
   - Lọc theo `tags`/`type`
   - Áp ràng buộc orchestrator (never_implements, max_parallel)
3) Strategy
   - Nếu multi-step/architecture/feature-breakdown → `tech-lead-orchestrator` (plan & delegate)
   - Nếu discovery/find-code → `code-searcher`
   - Nếu review/pre-merge → `code-reviewer`
   - Nếu performance/slow/bottleneck → `performance-optimizer`
   - Nếu stack-scan/init → `project-analyst`
4) Output: Delegation Plan (bên dưới)
5) Invoke workflow `/answer-with-citation` để hợp nhất bằng chứng.

### Quy tắc siết thuật toán (Production)
- Ưu tiên phân loại (precedence): `multi-step` > `search` > `review` > `performance` > `scan`.
   - Quy tắc đặc biệt: nếu query chứa cả “tìm/locate/search” và “scan/stack/framework” → chọn `search` (định vị symbol trước khi quét).
- Ngưỡng tra cứu & xếp hạng:
   - Điểm = 3×(match trong `triggers`) + 1×(match trong `tags`).
   - `orchestrator` bị −1 điểm trừ khi intent là `multi-step` (khi đó không trừ).
   - Chọn agent có điểm cao nhất và thỏa `constraints` (vd. `never_implements`, `max_parallel`).
- Tie-breakers (hòa điểm):
   - Ưu tiên agent khớp chiến lược cứng (mục 3) hoặc alias chính xác theo intent.
   - Nếu vẫn hòa → chọn theo tên agent tăng dần (deterministic), đảm bảo kết quả ổn định.
- Fallback:
   - Không tìm thấy agent phù hợp → trả về “no suitable agent” và KHÔNG tự ý implement; gợi ý người dùng làm rõ intent hoặc chạy orchestrator ở lần sau nếu thật sự `multi-step`.
- Guard thực thi:
   - Discovery ≤2 tool calls; Sequential-only; vi phạm → fail-fast.
   - Orchestrator `max 2` song song; vi phạm → fail-fast.
- Ghi log tối thiểu: `event_type`, `agent_selected`, `score`, `intent`, `trace_id`.
- Tập từ khóa tham chiếu (rút gọn):
   - `multi-step`: “đa bước”, “feature breakdown”, “architecture”, “design”.
   - `search`: “tìm”, “ở đâu”, “locate”, “function/symbol”.
   - `review`: “review”, “PR”, “pre-merge”, “quality”.
   - `performance`: “hiệu năng”, “chậm”, “optimize”, “bottleneck”, “latency”.
   - `scan`: “scan”, “stack”, “framework”, “codebase”, “discovery”.

#### Safeguards “không bỏ sót Auto‑trigger”
- Loại trừ agent không hợp lệ: bỏ qua agent không có bất kỳ `triggers` thuộc 5 lớp ý định chính (`multi-step|search|review|performance|scan`).
- Ngưỡng chọn tối thiểu: `min_score = 2`. Nếu top‑score < 2 → Fallback (không chọn agent) hoặc Escalate `tech-lead-orchestrator` khi query có tín hiệu đa bước.
- Mơ hồ (độ chênh thấp): nếu `score(top1) - score(top2) < 1` → Escalate `tech-lead-orchestrator` (plan‑first), tránh chọn sai.
- Alias bonus (ổn định hoá): +1 điểm nếu tên agent khớp alias cứng của intent (vd. `code-searcher` khi intent=`search`).
- Chuẩn hoá tokens: so khớp theo lowercase/kebab‑case; `triggers/tags` nên ghi đồng nhất để tránh miss do hoa/thường/khoảng trắng.

## Response Contract (Delegation Plan Format)
```
### Task Analysis
- [Summary 2-3 bullets]
- [Detected stack/domain]

### SubAgent Assignments
Task 1: [description] → AGENT: @agent-[exact-agent-name]
Task 2: [description] → AGENT: @agent-[exact-agent-name]

### Execution Order
1) [Agent/Task A]
2) [Agent/Task B]

### Tool Budget & Guards
- Discovery: ≤2 tool calls
- Orchestrator: max 2 parallel sub-agents

### Citations
- [local-file-path:line]
```

## Guardrails & Kiểm soát
- Kiểm tra ngân sách trước khi chạy: Discovery>2 → Fail-fast.
- Kiểm tra song song: Parallel>2 ở Orchestrator → Fail-fast.
- Log JSON: `event_type`, `agent_selected`, `trace_id`, `tool_budget_used`.

### Instrumentation
- **Banner JSON (human‑readable)** — hiển thị ở đầu output để nhận biết auto‑trigger nhanh:
  ```json
  {"event_type":"agent_selected","intent":"search","agent":"code-searcher","route":"hard|scored","score":5,"trace_id":"trc_01"}
  ```
- **Event taxonomy (NDJSON)** — khuyến nghị: `classify`, `candidate_scored`, `agent_selected`, `fallback_no_suitable`, `orchestrator_escalated` (reason: `delta_score<1`), `plan_generated`, `subagent_start`, `subagent_end`, `synthesize_done`, `guardrails_check`, `citations`, `error`.
- **NDJSON path & rotation**:
  - File: `.windsurf/logs/auto-dispatch.ndjson` (được git‑ignore).
  - `.gitignore` trong `.windsurf/logs/`: `*` và `!.gitignore`.
  - Rotation: theo kích thước (ví dụ 10MB) hoặc theo thời gian (daily).
- **Metrics (đếm/tổng hợp)**:
  - Counters: `auto_dispatch.agent_selected_total{agent,intent,route}`, `auto_dispatch.escalate_total{reason}`, `auto_dispatch.fallback_total`.
  - Histograms: `auto_dispatch.selection_latency_ms`, `auto_dispatch.delta_score_distribution`.
  - Gauges: `auto_dispatch.discovery_budget_utilization` (calls_used/budget).
- **Toggles (ENV)**:
  - `AUTODISPATCH_INSTRUMENTATION=off|brief|verbose` (mặc định `brief`).
  - `AUTODISPATCH_SAMPLING=0.1..1.0` (mặc định `0.25`).
- **Privacy**: không lưu prompt thô; nếu cần lưu nội dung thì dùng `masked_text` (ẩn danh). Giữ keys tiếng Anh, message tiếng Việt.

#### Selection Scorecard (gắn trong Delegation Plan)
```markdown
### Selection Scorecard
- intent: search (keywords: tìm, locate, function/symbol)
- candidates (score = 3×trigger + 1×tag − 1 orchestrator trừ `multi-step`):
  - code-searcher: 5  ✅ selected
  - project-analyst: 1
- route: scored | reason: top_score≥2; Δscore≥1 (không cần escalate)
```

## Tích hợp
- Context Coordination (14a): tự động tăng tầng khi phức tạp cao.
- Answer-with-Citation: Local-first → MCP (nếu Gate mở).

## Test nhanh (smoke)
- Stack scan → `project-analyst` (≤2 tool calls)
- Feature breakdown → `tech-lead-orchestrator` (plan, no implement)
- Code review → `code-reviewer` (report + citations)

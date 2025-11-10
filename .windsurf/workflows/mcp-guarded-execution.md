---
description: Guarded MCP execution (Step 0 Capability Gate with 17z, modes off/auto/force, safe routing)
auto_execution_mode: 3
---

# MCP Guarded Execution — theo 17z Compatibility Guard

Mục tiêu: Bảo đảm mọi luồng MCP đều tuân thủ Step 0: Capability Gate (17z). Khi gate đóng → không gọi MCP; khi gate mở + model tools‑capable → định tuyến theo 17a–17g.

## 1) Tiền điều kiện (Pre-check)
- Đã có `rules/17z-mcp-compatibility-guard.md` (priority: critical, always_on).
- `mcp_config.json` ở trạng thái phù hợp (mặc định skeleton/disabled; chỉ bật servers khi cần).
- Xác định model có hỗ trợ **tool-calling** không (tools‑capable?).

## 2) Modes (khái niệm)
- `off` (default): Gate đóng → luôn Internal Knowledge + Local Indexing.
- `auto`: Gate mở nếu model tools‑capable và servers hợp lệ; định tuyến theo 17a–17g.
- `force` (không khuyến nghị): Bỏ chặn logic phụ, nhưng vẫn yêu cầu tools‑capable và server hợp lệ; dùng khi cần kiểm thử khắt khe.

## 3) Step 0: Capability Gate (bắt buộc)
```
IF MCP_ENABLED !== true → SKIP MCP (Internal-first)
ELIF model.toolsCapable !== true → SKIP MCP (Internal-first)
ELIF servers.invalid → SKIP MCP (Internal-first)
ELSE → Route theo 17a Decision Protocol
```

## 4) Định tuyến theo 17a (khi gate mở)
- Memory → 17b (jean-memory/server-memory)
- Search/Docs → 17c (brave-search/context7)
- Code → 17d1/17d2 (repomix, codex-cli, 10x-rules)
- Web → 17e (mcp-playwright, chrome-devtools)
- Data → 17f (supabase-mcp-server)
- Reasoning → 17g (sequential-thinking)

## 5) Fallback chuẩn (khi gate đóng hoặc lỗi tool)
- Sử dụng Internal Knowledge + Local Indexing, trích dẫn `file:line`.
- Ghi chú ngắn (tuỳ chọn): “MCP currently unavailable; using internal/local sources”.

## 6) Guardrails & Safety
- Không đưa secrets vào logs/workflows; tách secrets qua env (tham chiếu rules/05-security-privacy.md).
- Với 17f (Supabase): luôn `get_cost` → `confirm_cost` trước khi tạo project/branch; DDL dùng `apply_migration`.
- Với 17e (web): tránh thao tác phá huỷ; dùng snapshot trước screenshot; chỉ tương tác website do bạn kiểm soát.

## 7) Quan trắc & kiểm thử
- Theo `rules/20a-observability-metrics-pipeline.md`: log event (layer, pass, latency, confidence, consistency, escalation…)
- A/B (`20b`): so sánh L1–3 vs L1–4 khi bật meta-reasoning.
- Human eval (`20c`): scoring 0–10; kappa ≥ 0.7.

## 8) Checklist nhanh
- [ ] 17z Guard tồn tại và active
- [ ] Mode = off/auto/force được xác định rõ
- [ ] Model tools‑capable? (nếu không → off)
- [ ] mcp_config.json hợp lệ (bật đúng server cần dùng)
- [ ] Có fallback nội bộ + citation local

## 9) Safe enable path (auto)
**Pre-checks**:
- Model tools‑capable = true (hỗ trợ tool-calling)
- `mcp_config.json` hợp lệ và chỉ bật servers cần dùng (ưu tiên HTTP trước, npx sau)
- Provider note: Claude 4.5 → giữ OFF theo `rules/17z-mcp-compatibility-guard.md:35-39` trừ khi kiểm thử isolation với `MCP_MODE=force`

**Steps**:
1. Đặt `MCP_MODE=auto` (theo 17z Capability Guard)
2. Đặt `MCP_ENABLED=true`
3. Reload agent/session
4. Gửi truy vấn kích hoạt MCP (vd 17c) và theo dõi SLO/alerts theo `rules/20a-observability-metrics-pipeline.md`

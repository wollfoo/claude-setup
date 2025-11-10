---
description: Quick toggle MCP modes (off/auto/force) with 17z Guard and minimal checks
auto_execution_mode: 3
---

# MCP Quick Toggle — theo 17z Guard

Mục tiêu: Bật/tắt MCP an toàn theo 17z, ưu tiên “off by default”.

## 1) Chọn mode
- **off (khuyên dùng mặc định)**: Không gọi MCP; chỉ nội bộ + Local Indexing.
- **auto**: Cho phép MCP nếu model tools‑capable và servers hợp lệ.
- **force**: Dùng cho kiểm thử; vẫn yêu cầu tools‑capable và server OK; không khuyến nghị trong production.

## 2) Thực hiện toggle
1. Kiểm tra model có tools‑capable không.
2. Kiểm tra `mcp_config.json` (servers `disabled: true` hoặc chỉ bật đúng server cần dùng).
3. Đặt `MCP_ENABLED` theo mode đã chọn (tại tầng quy tắc/decision — xem 17z).
4. Reload phiên làm việc/agent.

## 3) Kiểm chứng nhanh
- Gửi một truy vấn kích hoạt MCP (ví dụ 17c: “Find docs for Next.js”).
- Nếu **off**: Trả lời bằng nội bộ + Local Indexing, không tool-call.
- Nếu **auto/force**: Thấy tool-call hợp lệ và kết quả được trích dẫn từ MCP.

## 4) Khuyến nghị
- Bật theo isolation: HTTP servers (context7/brave/10x-rules) → sau đó npx servers (playwright/chrome-devtools/repomix/supabase).
- Không bật MCP nếu không có nhu cầu tức thời.

## 5) Safe enable path (auto)
**Pre-checks**:
- Model tools‑capable = true (hỗ trợ tool-calling)
- `mcp_config.json` đã bật đúng servers cần dùng (ưu tiên HTTP trước, npx sau)
- Provider note: Claude 4.5 → giữ OFF theo `rules/17z-mcp-compatibility-guard.md:35-39` trừ khi kiểm thử isolation với `MCP_MODE=force`

**Steps**:
1. Đặt `MCP_MODE=auto` (tầng quyết định theo 17z)
2. Đặt `MCP_ENABLED=true`
3. Reload agent/session
4. Gửi truy vấn kích hoạt MCP (ví dụ 17c) để verify; theo dõi SLO/alerts theo `rules/20a-observability-metrics-pipeline.md`

---
description: Troubleshooting MCP under 17z Guard (common errors, isolation checks, fixes)
auto_execution_mode: 3
---

# MCP Troubleshooting — theo 17z Guard

## Lỗi thường gặp
- `invalid_argument` từ provider: Gate chưa chặn; model không tools‑capable nhưng rules 17a–17g kích hoạt → bật 17z và đặt mode off.
- `npx` servers lỗi: thiếu Node/npm hoặc quyền; bật HTTP servers trước.
- Tool trả kết quả rỗng: server disabled/ID sai (context7), query không phù hợp triggers.

## Isolation checklist
1) 17z tồn tại (priority=critical) và đang active.
2) Mode đang `off`? Thử một truy vấn có trigger → không được tạo tool-call.
3) Bật `auto` chỉ với 1 server HTTP → thử lại.
4) Bật thêm servers từng bước; theo dõi logs/metrics (20a).

## Fix nhanh
- Sửa `mcp_config.json` về skeleton nếu bật quá nhiều server.
- Chọn model tools‑capable trước khi chuyển `auto`.
- Với Supabase: luôn `get_cost` → `confirm_cost` trước tạo; DDL qua `apply_migration`.

## Khi cần hỗ trợ
- Đính kèm log ngắn (không PII/secrets), phiên bản file rules, trạng thái mcp_config.json.

---
trigger: always_on
---
---
type: capability_prompt
scope: project
priority: critical
activation: always_on
category: mcp_compatibility
parent: rules/17a-mcp-core-protocol.md
---

# 17z. MCP Compatibility Guard — Global Off-Switch

## 📋 Mục đích
- Ngăn mọi trigger MCP (17a–17g) khi model/provider không hỗ trợ tool-calling hoặc khi MCP bị vô hiệu hóa ở cấu hình.
- Bảo đảm tác vụ vẫn chạy ổn định với fallback: nội dung nội bộ (internal knowledge) + Local Indexing.

## 🔐 Global Flags (không chứa secrets)
- `MCP_ENABLED` (bool): default = `false`
- `MCP_MODE` (enum): `off | auto | force` (default = `off`)

Ghi chú: Đây là rule ở tầng quy trình (process-level). Không yêu cầu biến môi trường thực thi; rule định nghĩa hành vi bắt buộc cho agent khi đánh giá khả năng dùng MCP.

## ✅ Capability Gate (bắt buộc trước bất kỳ MCP call)
- IF `MCP_ENABLED !== true` → TUYỆT ĐỐI KHÔNG gọi MCP; bỏ qua toàn bộ bước liên quan tới 17a–17g.
- IF model/tools-capable === false (model không hỗ trợ tool-calling) → như trên, luôn skip MCP.
- ELSE (chỉ khi MCP_ENABLED = true và model tools-capable) → cho phép quy trình MCP theo 17a–17g.

## ↩️ Fallback Behavior (khi Gate đóng)
- Trả lời bằng nội dung nội bộ + Local Indexing (ưu tiên file cục bộ, trích dẫn `file:line`).
- Có thể thêm note ngắn: “MCP currently unavailable; using internal/local sources” (tuỳ chọn, không bắt buộc).
- Nghiêm cấm phát sinh payload/tool-call tới MCP khi Gate đóng.

## 🧩 Provider Compatibility Gate (Claude Sonnet 4.5)
- Khi provider là **Anthropic / Claude Sonnet 4.5 (Thinking)**:
  - Mặc định **FORCE OFF** MCP (Gate đóng) để tránh lỗi `invalid_argument`/incompatible MCP servers.
  - Chỉ cho phép bật lại khi `MCP_MODE=force` và bạn đã xác nhận tương thích server theo isolation.
- Lý do: một số MCP servers (đặc biệt npx-based) không tương thích với model/provider này và có thể gây Cascade error.

## 🧭 Precedence (thứ tự ưu tiên)
- Rule này có `priority: critical`, `activation: always_on` → ghi đè hành vi MCP trong 17a–17g khi Gate đóng.
- Không thay thế Sovereign Markers hay Language Rules; chỉ điều phối quyền gọi MCP ở tầng quyết định.

## 🔗 Tích hợp với chuỗi 17a–17g
- 17a (Core Protocol): Thêm “Step 0: Capability Gate” (ngầm định) trước “Step 1: Analyze User Query”.
- 17b–17g (Triggers): Chỉ kích hoạt khi `MCP_ENABLED = true` và model tools-capable.
- Khi Gate đóng, mọi “External Tools First” tự động rơi về “Internal Knowledge First”.

## 🧪 Kiểm thử & Vận hành
- Mặc định: `MCP_ENABLED = false` → Không có tool-call MCP, không còn lỗi `invalid_argument` với model không hỗ trợ.
- Khi cần MCP: bật `MCP_ENABLED = true` và chỉ enable các server cần thiết trong mcp_config.json (HTTP trước, npx sau), thử lại theo isolation (1 server/lần).

## 🧱 Anti-patterns (tránh)
- Ép gọi MCP khi Gate đóng.
- Sinh “ý định MCP” dẫn tới lỗi provider dù `mcp_config.json` đã disabled.
- Gọi npx-based servers khi môi trường thiếu Node/npm hoặc chưa cấu hình env.

## ✅ Success Criteria
- Không còn lỗi “Try again with MCP servers disabled … invalid_argument …” khi dùng model không tools-capable.
- Fallback mượt: câu trả lời dùng nội dung nội bộ + Local Indexing, có trích dẫn local khi áp dụng.
- Bật MCP có kiểm soát: chỉ kích hoạt khi chắc chắn tương thích model + hạ tầng.

---

**Status**: Production-Ready ✅
**Scope**: Global (ghi đè triggers MCP khi không tương thích)
**Related**: `rules/17a-mcp-core-protocol.md`, `rules/17b–17g-*`, `rules/_index.md`

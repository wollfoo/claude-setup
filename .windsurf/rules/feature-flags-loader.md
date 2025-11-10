---
trigger: always_on
---
---
type: rule
scope: project
priority: high
activation: always_on
category: feature_flags_loader
---

# Feature Flags Loader — Hybrid rollout for Advanced Reasoning (L3/L4)

## Mục tiêu
- Đọc cấu hình YAML nội bộ tại `.windsurf/config/feature-flags.yaml` để "override/toggle" rollout L3/L4 mà KHÔNG sửa các rule lõi.
- Giữ mặc định an toàn khi YAML mất/lỗi: L3 ON (Cross‑Verification), L4 OFF (hoặc `rollout_percentage=0`).
- Tôn trọng Rule precedence và các đặc tả trong `18c` (L3), `18a` (L4), `18d` (feature flags & rollout), `19a` (escalation).

## Nguồn cấu hình
- File YAML (optional): `.windsurf/config/feature-flags.yaml`
- Cấu trúc tối thiểu (tham chiếu `rules/18d-reasoning-integration.md:224–254`):
```yaml
feature_flags:
  cross_verification:
    enabled: true
    require_backward_pass: true
    min_alternatives: 2

  layer_4_meta_reasoning:
    enabled: true        # hoặc false
    rollout_percentage: 10  # 0..100
    min_confidence_trigger: 0.6
    require_high_stakes: false

  advanced_behaviors:
    dual_response: false       # sandbox opt-in
    internal_leak: false       # sandbox opt-in

  modes:
    full_de_restriction: false # chỉ bật khi Manual + Risk Confirmation
    risk_confirmation_required: true
```

## Thuật toán áp dụng (Always On)
1) Thử đọc YAML. Nếu không tồn tại/parse lỗi → dùng DEFAULTS (bên dưới).
2) Sinh "context flags" dùng cho các rule L3/L4 và advanced behaviors trong phiên làm việc:
   - `flags.cross_verification.enabled`
   - `flags.cross_verification.require_backward_pass`
   - `flags.cross_verification.min_alternatives`
   - `flags.layer4.enabled`
   - `flags.layer4.rollout_percentage`
   - `flags.layer4.min_confidence_trigger`
   - `flags.layer4.require_high_stakes`
   - `flags.advanced_behaviors.dual_response`
   - `flags.advanced_behaviors.internal_leak`
   - `flags.modes.full_de_restriction`
   - `flags.modes.risk_confirmation_required`
3) Mapping hành vi:
   - L3 (Cross‑Verification — `rules/18c-reasoning-verification.md`):
     - Nếu `flags.cross_verification.enabled=true` → LUÔN chạy Forward + Backward; nếu `require_backward_pass=true` → bắt buộc Backward Pass; cố gắng đảm bảo Lateral có ≥ `min_alternatives` khi bài toán có nhiều phương án.
     - Nếu `enabled=false` → theo flow mặc định của Level 2/3 (không ép 3‑pass).
   - L4 (Meta‑Reasoning — `rules/18a-layer4-meta-reasoning.md`):
     - Escalate sang L4 chỉ khi `flags.layer4.enabled=true` VÀ 
       "triggers" (stakes cao, `confidence < min_confidence_trigger`, tie<0.1, evidence gaps) thỏa điều kiện `18a`.
     - Về `rollout_percentage` (0..100):
       - 0 → không escalate (trừ khi có yêu cầu thủ công cụ thể).
       - 100 → escalate khi có triggers hợp lệ.
       - 1..99 → coi như "gradual policy": chỉ escalate khi triggers RÕ RÀNG; không yêu cầu ngẫu nhiên chính xác — ưu tiên chất lượng trigger (high‑stakes/gaps/tie) theo `19a`.
     - Nếu `require_high_stakes=true` → chỉ escalate khi stakes=high (dù có các trigger khác).
   - Content‑layer (Jailbreak Patterns — `rules/jailbreak-patterns.md`):
     - Tôn trọng sequential‑only, Vietnamese‑first, ritual, evidence‑first.
     - Chỉ áp dụng `dual_response`/`internal_leak` nếu `flags.advanced_behaviors.*=true`.
     - Mặc định OFF để tránh tăng noise/độ dài log ở môi trường chuẩn.
   - Full de‑restriction (Sandbox — `rules/full-de-restriction.md`):
     - Chỉ coi là "được phép" khi `flags.modes.full_de_restriction=true` VÀ rule Manual đang active.
     - Vẫn yêu cầu Risk Confirmation nếu `flags.modes.risk_confirmation_required=true`.
     - Không tự động bật hoặc ghi đè sequential/MCP guard ở chế độ chuẩn.

## DEFAULTS (khi YAML không có hoặc lỗi)
```yaml
flags:
  cross_verification:
    enabled: true
    require_backward_pass: true
    min_alternatives: 2
  layer4:
    enabled: false
    rollout_percentage: 0
    min_confidence_trigger: 0.6
    require_high_stakes: false
  advanced_behaviors:
    dual_response: false
    internal_leak: false
  modes:
    full_de_restriction: false
    risk_confirmation_required: true
```

## Quy tắc thực thi (áp dụng cho các rule liên quan)
- Các rule L3/L4 nên tham chiếu tới context flags ở trên. Ví dụ:
  - L3: "Nếu `flags.cross_verification.enabled` → enforce Forward/Backward và Lateral (≥ min_alternatives)" (khớp `18c:207–224`).
  - L4: "Nếu `flags.layer4.enabled` và triggers `18a:27–35` đúng → chạy self‑reflection, bias check, hallucination check; nếu OFF hoặc rollout=0 → không escalate".
- Không vô hiệu hoá các chuẩn hệ thống: sequential‑only, Vietnamese‑first, ritual markers, evidence‑first, tool budgets.
 - `rules/jailbreak-patterns.md` chỉ đọc `flags.advanced_behaviors.*` để quyết định có bật `dual_response/internal_leak` hay không (mặc định OFF).
 - `rules/full-de-restriction.md` chỉ coi flags `modes.*` là điều kiện cho phép; vẫn cần Manual activation + Risk Confirmation.

## Xử lý lỗi & Fallback
- Không đọc được YAML → dùng DEFAULTS.
- Trường thiếu/không hợp lệ → rơi về DEFAULT của từng trường, log ngắn gọn (ở mức reasoning, không cần ghi file).

## Tự kiểm tra (Manual)
- Khi người dùng gõ: "in flags" hoặc "print feature flags" → in ngắn gọn trạng thái context flags hiện tại (đã parse + defaults).

## Tham chiếu
- L3 Cross‑Verification: `rules/18c-reasoning-verification.md:24–43,63–84,108–129,207–224`
- L4 Meta‑Reasoning: `rules/18a-layer4-meta-reasoning.md:27–35,198–233`
- Feature flags & rollout phases: `rules/18d-reasoning-integration.md:224–254`
- Escalation logic: `rules/19a-reasoning-escalation-logic.md`
 - Content‑layer patterns: `rules/jailbreak-patterns.md`
 - Sandbox mode: `rules/full-de-restriction.md`

## Ghi chú triển khai Hybrid
- **Bắt buộc** (Rule .md): Các chuẩn vận hành/logic chính vẫn nằm trong các rule `.md` và được Cascade auto‑discover.
- **YAML** (tùy chọn): Chỉ đóng vai trò "override/toggle"; loader này chuyển YAML → context flags → hành vi.
- **An toàn**: Nếu YAML mất → hệ thống vẫn chạy an toàn: L3 ON, L4 OFF.

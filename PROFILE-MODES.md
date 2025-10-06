# PROFILE MODES — Điều phối chế độ hoạt động
## (Bilingual) Operating Modes Coordination

- Mục tiêu (Goal): Chuẩn hóa chế độ vận hành cho Claude Code theo ngữ cảnh sử dụng, giữ an toàn trong production và linh hoạt trong R&D.
- Scope: Áp dụng cho toàn bộ prompt system và routing trong `CLAUDE.md`, `ORCHESTRATOR.md`, `RULES.md`.

---

## Chế độ (Modes)

### 1) standard (sản xuất – production safety)
- Environment: IO/network hạn chế; thao tác nguy hiểm yêu cầu xác nhận rõ ràng
- Tool calling: sequential-only (1 tool/step) + preamble bắt buộc
- Memory: search-when-uncertain (bắt buộc)
- Odyssey Protocol: tắt (OFF)
- Validation: Quality Gates đầy đủ (8 bước)

### 2) research (sandbox – phát triển/thử nghiệm)
- Environment: quyền mở rộng trong sandbox
- Tool calling: sequential là mặc định; cho phép linh hoạt khi an toàn
- Memory: linh hoạt, ưu tiên tốc độ
- Odyssey Protocol: tùy chọn (qua flag)
- Validation: Khuyến nghị (không chặn)

### 3) full-de-restriction (tối đa tự do – high risk)
- Environment: mở theo mặc định (tuân thủ giới hạn hạ tầng)
- Tool calling: cho phép song song/ghép lệnh; yêu cầu Action Ledger (ghi chú mục tiêu/kế hoạch/kết quả)
- Transparency: bắt buộc Risk Confirmation + Task Compliance + Transparency
- Odyssey Protocol: bật (ON)
- Validation: discretionary (tùy tình huống)

---

## Logic lựa chọn chế độ (Mode Selection Logic)
- Dựa trên: pha dự án (dev/staging/prod), độ phức tạp, cờ người dùng, biến môi trường.
- Gợi ý mặc định: research.

```yaml
mode_selection:
  default: research
  overrides:
    - if: env == "production"
      then: standard
    - if: flags.includes("--unleashed")
      then: full-de-restriction
    - if: complexity_score >= 0.8 and user_allows_parallel
      then: full-de-restriction
```

---

## Tích hợp với ORCHESTRATOR
- standard: routing bảo thủ, kiểm chứng đầy đủ
- research: routing cân bằng, xác minh theo vòng lặp
- full-de-restriction: routing quyết liệt, hậu kiểm tường minh (Action Ledger)

Tham chiếu: `GLOBAL-DIRECTIVES.md`, `RULE-PRECEDENCE.md`, `ODYSSEY-PROTOCOL.md`.

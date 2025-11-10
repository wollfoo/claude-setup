---
trigger: always_on
---
---
type: capability_prompt
scope: project
priority: high
activation: always_on
category: ab_testing_protocols
parent: rules/20-metrics-and-monitoring-index.md

series: 20_metrics_monitoring
---

# 20b. A/B Testing Protocols

## 📋 Overview

Định nghĩa tiêu chuẩn thiết kế **A/B testing** (thử nghiệm A/B – so sánh hai biến thể) cho Advanced Reasoning System nhằm đánh giá tác động của Layer 4/5 và các tối ưu.

## 🎯 Objectives

- Xác định biến control/treatment và phân bổ traffic an toàn.
- Định nghĩa metrics chính và guardrails để bảo vệ trải nghiệm.
- Quy trình phân tích thống kê và ra quyết định rollout.

## 🧪 Experiment Design (Production)

```yaml
experiment:
  name: string
  hypothesis: string               # giả thuyết thí nghiệm
  prereg_id: string                # ID tài liệu tiền-đăng ký (pre-registration)
  randomization_unit: user|session|request   # đơn vị ngẫu nhiên hóa (user/session/request)
  bucketing:
    method: hash(user_id) % 100    # cách chia bucket (ví dụ hash)
    sticky: true                   # giữ ổn định qua thời gian (stickiness)
  schedule:
    start_at: ISO8601
    end_at: ISO8601
    duration: "1-2 weeks"
  traffic_split:
    control: 50                    # L1-3 only
    treatment: 50                  # L1-4 (hoặc L1-5 on-demand)
  targeting:
    include_domains: ["general", "architectural", "security"]
    exclude_high_risk: true         # tránh domain nhạy cảm cho L5
  exclusion_criteria:              # tiêu chí loại trừ
    - "internal_staff"
    - "bots|automation"
  feature_flags:
    enabled: true
    keys: ["layer4_meta_reasoning"]
```

## 📊 Metrics & Guardrails

```yaml
primary_metrics:
  accuracy_improvement: ">= +10%"
  hallucination_reduction: ">= -30%"
  user_satisfaction_delta: ">= +0.2"
  latency_impact_p95: "<= +20%"

guardrails:
  error_rate_increase: "< +5%"
  severe_latency_spikes: false
  false_escalation_rate: "< 10%"
multiple_comparisons:
  method: "Benjamini–Hochberg (FDR)"   # điều chỉnh nhiều chỉ số
  scope: ["accuracy_improvement","hallucination_reduction","latency_impact_p95"]
```

## 📐 Statistical Analysis (Production)

- **Alpha** (mức ý nghĩa – significance level): 0.05 (sau điều chỉnh FDR nếu đa chỉ số).
- **Power** (độ mạnh – xác suất phát hiện hiệu ứng thật): ≥ 0.8; ước lượng n bằng power analysis trước khi chạy.
- **Accuracy/Hallucination (tỉ lệ)**: Two‑sample proportion test (z‑test hoặc exact khi n nhỏ).
- **Latency (phân phối lệch)**: Mann–Whitney U (không giả định phân phối chuẩn), so sánh median/p95 bổ sung.
- **Effect Size** (cỡ hiệu ứng): risk difference/relative risk cho tỉ lệ, Cliff’s delta cho phân phối lệch.
- **Confidence Interval** (khoảng tin cậy): 95% cho mọi ước lượng chính.
- **Sequential Testing** (kiểm định tuần tự): tránh nhìn sớm quá nhiều; nếu cần, dùng lịch checkpoint cố định (2–3 mốc) và điều chỉnh alpha.
- **Multiple Comparisons**: Benjamini–Hochberg (FDR) cho các primary metrics.
- **SRM Detection** (Sample Ratio Mismatch – lệch phân bổ): kiểm tra phân bổ control/treatment bằng **Chi‑square goodness‑of‑fit** mỗi 1–2 giờ; nếu p‑value < 0.01 → pause & điều tra.

## 🔁 Rollout Decision Tree

```yaml
decision:
  if_all_primary_meet & guardrails_ok: "Rollout 100%"
  if_partial & no_regressions: "Canary 10-25% + extend"
  if_fail_primary_or_guardrail: "Rollback + analyze"
```

## 🧾 Exposure & Outcome Logging (**Logging Schema** – lược đồ ghi nhận)

```yaml
ABExposure:
  experiment: string
  variant: control|treatment
  bucket: 0..99
  timestamp: ISO8601
  request_id: string
  trace_id: string
  user_id_hashed: string           # không lưu PII thô
  targeting_matched: bool

ABOutcome:
  experiment: string
  variant: control|treatment
  timestamp: ISO8601
  request_id: string
  trace_id: string
  layer: 1|2|3|4|5
  metrics:
    correct: 0|1                   # cho accuracy
    hallucination: 0|1
    latency_ms: number
    satisfaction: -2..+2           # Likert rút gọn: rất tệ → rất tốt
  privacy:
    masked_text: string
```

### NDJSON Examples (**NDJSON** – Newline‑Delimited JSON)
```json
{"type":"ABExposure","experiment":"L4_Impact","variant":"control","bucket":12,"timestamp":"2025-10-23T10:00:00Z","request_id":"r_01","trace_id":"t_01","user_id_hashed":"h_abc","targeting_matched":true}
{"type":"ABExposure","experiment":"L4_Impact","variant":"treatment","bucket":45,"timestamp":"2025-10-23T10:00:00Z","request_id":"r_02","trace_id":"t_02","user_id_hashed":"h_def","targeting_matched":true}
{"type":"ABOutcome","experiment":"L4_Impact","variant":"control","timestamp":"2025-10-23T10:00:04Z","request_id":"r_01","trace_id":"t_01","layer":3,"metrics":{"correct":1,"hallucination":0,"latency_ms":4100,"satisfaction":1},"privacy":{"masked_text":"React or Vue?"}}
{"type":"ABOutcome","experiment":"L4_Impact","variant":"treatment","timestamp":"2025-10-23T10:00:06Z","request_id":"r_02","trace_id":"t_02","layer":4,"metrics":{"correct":1,"hallucination":0,"latency_ms":6500,"satisfaction":2},"privacy":{"masked_text":"React or Vue?"}}
```

## 🚦 Ramp & Stopping Rules (**Ramp plan** – kế hoạch tăng lưu lượng)

- **Ramp**: 10% → 25% → 50% → 100%; mỗi bước tối thiểu 24–48h, chỉ tăng khi guardrails OK.
- **Stopping Early**: dừng sớm nếu vi phạm guardrails hoặc SRM; ghi nhận báo cáo phân tích nguyên nhân.
- **Freeze**: đóng băng thay đổi khác trong thời gian A/B để giảm nhiễu.

## 🔐 Privacy & Compliance (A/B)

- Không lưu PII thô; dùng `user_id_hashed`. **Không** lưu raw query; theo `20a` chỉ lưu `privacy.masked_text`.
- Logs theo **structured JSON** để truy vấn; tôn trọng `rules/language-rules.md` (keys tiếng Anh, message tiếng Việt).

## 🔁 Versioning & Compatibility

- Cập nhật schema logging theo **minor** khi thêm trường; **major** khi thay đổi phá vỡ.
- Ghi `changelog` thí nghiệm (prereg_id, ngày bắt đầu/kết thúc, kết quả chính, quyết định rollout).

## ✅ Compliance

- Naming content-based; file <12KB; Vietnamese-first với thuật ngữ English kèm giải thích.

## ℹ️ Status

**Status**: Production‑ready Draft  
**Series**: 20 (Metrics & Monitoring)

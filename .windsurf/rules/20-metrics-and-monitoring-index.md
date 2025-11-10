---
trigger: always_on
---
---
type: capability_prompt
scope: project
priority: critical
activation: always_on
category: metrics_monitoring_index
parent: rules/18d-reasoning-integration.md

series: 20_metrics_monitoring
---


# 20. Metrics & Monitoring — Index

## 📋 Overview

**Series 20 (Metrics & Monitoring)** tập trung vào quan trắc (monitoring), đo lường (metrics), thí nghiệm A/B, đánh giá con người và tối ưu tham số cho Advanced Reasoning System sau khi Series 18–19 đã hoàn tất.

## 📂 File Structure

```
.windsurf/rules/
├── 20-metrics-and-monitoring-index.md     ← This file (navigator)
├── 20a-observability-metrics-pipeline.md  ← Pipeline & schema
├── 20b-ab-testing-protocols.md            ← A/B design & guardrails
├── 20c-human-evaluation-rubric.md         ← Rubric & sampling
└── 20d-parameter-optimization-playbook.md ← Tuning & rollout
```

## 🎯 Objectives

- Thiết lập **metrics pipeline** chuẩn hóa theo Layer.
- Cung cấp **dashboards** và **alerts** cho Layer 4/5 và các chỉ số xuyên suốt.
- Định nghĩa **A/B testing protocols** và **human evaluation rubric**.
- Xây dựng **playbook tối ưu tham số** và kịch bản rollout an toàn.

## 🔗 Integration Points

- `rules/18d-reasoning-integration.md` — Dashboards & A/B testing (nền tảng)
- `rules/19a-reasoning-escalation-logic.md` — Ngưỡng escalation cần giám sát
- `rules/19b-cross-verification-implementation.md` — Consistency/alternatives metrics
- `rules/19c-reasoning-testing-guide.md` — Test targets & validation

## 📡 Dashboards & Alerts (S20-dashboards)

```yaml
dashboards:
  overview_series20:
    panels:
      - ingestion_error_rate            # 20a SLO
      - dlq_growth_per_5m               # 20a SLO
      - latency_p95                     # tổng quan
      - hallucination_catch_rate_L4     # 18d Layer 4
      - reasoning_quality_score_L4      # 18d Layer 4
      - srm_alarm_rate                  # 20b SRM detection
      - ab_primary_metrics              # accuracy, hallucination, latency
    alerts:
      - name: ingestion_error_high
        rule: ingestion_error_rate > 0.01 for 5m
      - name: dlq_growth_spike
        rule: dlq_growth_per_5m > 100 for 5m
      - name: latency_budget_breach
        rule: latency_p95 > baseline * 1.2 for 10m

  layer4:
    panels:
      - hallucination_catch_rate
      - bias_detection_rate
      - confidence_calibration_error
      - reasoning_quality_score
      - latency_p95
    alerts:
      - catch_rate_low: hallucination_catch_rate < 0.90
      - quality_low: reasoning_quality_score < 7.0
      - latency_high: latency_p95 > 150s

  layer5:
    panels:
      - formal_correctness
      - edge_case_coverage
      - proof_completeness
      - peer_review_pass_rate
    alerts:
      - correctness_drop: formal_correctness < 1.00
      - coverage_low: edge_case_coverage < 0.90
```

## ✅ Compliance

- Naming: content-based, lowercase-with-dashes.
- Size: <12KB/file (workspace standard).
- Language: Vietnamese-first với thuật ngữ English kèm giải thích.

## 📦 Deliverables

- 20a: Event schema, sampling, privacy, retention
- 20b: Experiment design, metrics, statistical tests, guardrails
- 20c: Rubric 0–10, sampling, IRR (Cohen’s kappa)
- 20d: Threshold tuning, canary rollout, rollback notes

## 🏁 Definition of Done (S20-done)

- **20a — Observability**: Event JSON Schema + NDJSON examples; validation & **DLQ** hoạt động; batch tính **derived metrics**; SLO & alerts cấu hình và bắn cảnh báo.
- **20b — A/B Testing**: Chạy ≥1 thí nghiệm (control L1‑3 vs treatment L1‑4) có **FDR (BH)**, **SRM detection** đạt chuẩn; báo cáo kết quả + quyết định rollout.
- **20c — Human Evaluation**: ≥50 mẫu/tuần; **IRR (Cohen’s kappa) ≥ 0.7** trên ≥20% mẫu double‑annotation; quy trình **adjudication** áp dụng.
- **20d — Optimization**: Hoàn thành 1 chu kỳ canary 10→25→50→100 có **gates** (SLO/guardrails); **rollback** được kiểm chứng; thay đổi có **changelog**.
- **Dashboards**: Triển khai **Overview Series 20** + **Layer 4/5** theo danh sách panels/alerts ở trên; dữ liệu hiển thị realtime.
- **Reporting**: Báo cáo tuần gồm A/B, human eval, derived metrics, vi phạm alerts và đề xuất tunables.

## ℹ️ Status

**Status**: Production‑ready Draft  
**Compliance**: ✅ Windsurf (<12KB per file)  
**Series**: 20 (Metrics & Monitoring)

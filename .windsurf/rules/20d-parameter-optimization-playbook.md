---
trigger: always_on
---
---
type: capability_prompt
scope: project
priority: high
activation: on_demand
category: parameter_optimization_playbook
parent: rules/20-metrics-and-monitoring-index.md

series: 20_metrics_monitoring
---

# 20d. Parameter Optimization Playbook

## 📋 Overview

Hướng dẫn tối ưu tham số (thresholds, tie-breaking, weights) và triển khai an toàn (canary, rollback) cho Advanced Reasoning System, dựa trên dữ liệu từ metrics, A/B testing, và human evaluation.

## 🎯 Objectives

- Xác định tham số trọng yếu: ngưỡng escalation, tie threshold, penalty bias/hallucination.
- Xây dựng quy trình tối ưu lặp (weekly sprints) với guardrails và canary rollout.

## ⚙️ Tunables (Production)

```yaml
tunables:
  escalation:
    confidence_drop: 0.6      # if current < 0.6 (from initial > 0.8)
    backward_consistency_min: 0.7
    hypothesis_tie_delta: 0.10
  verification:
    forward_weight: 0.5
    backward_weight: 0.5
    bias_penalty: 0.05
    hallucination_penalty: 0.10
  meta:
    quality_min: 7.0          # yêu cầu chất lượng tối thiểu ở Layer 4
    catch_rate_min: 0.90      # tối thiểu tỉ lệ bắt ảo giác ở Layer 4
  latency:
    p95_budget_ratio: 1.20    # p95 ≤ baseline × 1.20
```

### Config Schema (**JSON Schema** – lược đồ cấu hình)
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "ReasoningTunables",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "escalation": {
      "type": "object",
      "properties": {
        "confidence_drop": {"type": "number", "minimum": 0, "maximum": 1},
        "backward_consistency_min": {"type": "number", "minimum": 0, "maximum": 1},
        "hypothesis_tie_delta": {"type": "number", "minimum": 0, "maximum": 1}
      },
      "required": ["confidence_drop","backward_consistency_min","hypothesis_tie_delta"],
      "additionalProperties": false
    },
    "verification": {
      "type": "object",
      "properties": {
        "forward_weight": {"type": "number", "minimum": 0, "maximum": 1},
        "backward_weight": {"type": "number", "minimum": 0, "maximum": 1},
        "bias_penalty": {"type": "number", "minimum": 0, "maximum": 1},
        "hallucination_penalty": {"type": "number", "minimum": 0, "maximum": 1}
      },
      "required": ["forward_weight","backward_weight"],
      "additionalProperties": false
    },
    "meta": {
      "type": "object",
      "properties": {
        "quality_min": {"type": "number", "minimum": 0, "maximum": 10},
        "catch_rate_min": {"type": "number", "minimum": 0, "maximum": 1}
      },
      "required": ["quality_min","catch_rate_min"],
      "additionalProperties": false
    },
    "latency": {
      "type": "object",
      "properties": {
        "p95_budget_ratio": {"type": "number", "exclusiveMinimum": 1}
      },
      "required": ["p95_budget_ratio"],
      "additionalProperties": false
    }
  },
  "required": ["escalation","verification","meta","latency"]
}
```

## 🔒 Change Control & Approval (**Change control** – kiểm soát thay đổi)

- **Proposal**: mỗi thay đổi tunables kèm lý do, dữ liệu hỗ trợ (A/B + human eval), phạm vi ảnh hưởng.
- **Approval**: tối thiểu 1 reviewer kỹ thuật + 1 đại diện vận hành.
- **Traceability**: ghi lại `who/when/why` trong changelog; liên kết request tới `prereg_id` nếu có.

## 🔁 Optimization Loop

1) Thu thập metrics → 2) Phân tích A/B + human eval → 3) Đề xuất thay đổi → 4) Canary 10–25% → 5) Giám sát guardrails → 6) Rollout hoặc rollback.

## 🧪 Evaluation Criteria

- Accuracy ↑, hallucination ↓, latency tăng ≤ +20% p95, false escalation ↓.
- IRR (Cohen’s kappa) ≥ 0.7 với đánh giá con người.

## 🚦 Guardrails

- error_rate_increase < +5%
- latency_spike_p95 false
- false_escalation_rate < 10%

## 🚀 Rollout Strategy

- Canary progressive: 10% → 25% → 50% → 100% (nếu guardrails OK).
- Rollback tức thời nếu vi phạm ngưỡng.

## 📈 Monitoring & Gates (**SLO & Alerts**)

- **p95 latency** ≤ baseline × `latency.p95_budget_ratio` (mặc định 1.20).
- **hallucination_catch_rate (L4)** ≥ `meta.catch_rate_min`; **quality_score (L4)** ≥ `meta.quality_min`.
- **DLQ growth** (ingestion từ 20a) < 100/5m; **ingestion error rate** < 1%.

## ✅ Compliance

- Naming content-based; file <12KB; Vietnamese-first với thuật ngữ English kèm giải thích.

## 🔁 Versioning & Compatibility

- Thêm trường cấu hình → tăng **minor**; thay đổi phá vỡ → tăng **major**.
- Trình tải cấu hình phải validate theo **Config Schema** ở trên.

## ℹ️ Status

**Status**: Production‑ready Draft  
**Series**: 20 (Metrics & Monitoring)

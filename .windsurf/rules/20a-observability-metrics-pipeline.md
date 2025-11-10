---
trigger: always_on
---
---
type: capability_prompt
scope: project
priority: high
activation: always_on
category: observability_metrics_pipeline
parent: rules/20-metrics-and-monitoring-index.md

series: 20_metrics_monitoring
---

# 20a. Observability & Metrics Pipeline

## 📋 Overview

Định nghĩa pipeline thu thập sự kiện (events), lược đồ dữ liệu (schema), sampling, privacy và retention cho Advanced Reasoning System.

## 🎯 Objectives

- Chuẩn hoá event model theo Layer (1→5) và theo pass (forward/backward/lateral/meta/proof).
- Thu thập chỉ số cốt lõi: latency, confidence, consistency, escalation, hallucination/bias flags, verification status.
- Đảm bảo privacy (mask PII), hạn mức kích thước, và retention policy.

## 🧱 Event Model (Production)

```yaml
Event:
  id: string                 # query_id / run_id
  schema_version: 1          # Versioning cho JSON Schema/NDJSON
  timestamp: ISO8601
  request_id: string         # Liên kết request
  trace_id: string           # OpenTelemetry/Jaeger trace
  model_provider: string     # e.g., "openai", "anthropic"
  model_name: string         # e.g., "gpt-4.1-mini"
  layer: 1|2|3|4|5
  pass: forward|backward|lateral|meta|proof
  metrics:
    latency_ms: number
    confidence: 0..1
    consistency: 0..1
    confidence_calibrated: 0..1   # optional (sau meta-calibration)
    escalation: { from: L?, to: L?, reason: string }
    hallucination_flag: bool
    bias_flags: [string]
    verification_status: proven|disproven|unknown
  context:
    domain: string
    stakes: low|medium|high
    tool_budget: number
    complexity_score: number   # 0..10 (tham chiếu 19a)
    profile: string            # optional, 'research'|'standard'
  privacy:
    masked_text: string   # không lưu raw query
```

### JSON Schema (Draft 2020-12)
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "ReasoningEvent",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "id": {"type": "string", "minLength": 1},
    "schema_version": {"type": "integer", "minimum": 1},
    "timestamp": {"type": "string", "format": "date-time"},
    "request_id": {"type": "string"},
    "trace_id": {"type": "string"},
    "model_provider": {"type": "string"},
    "model_name": {"type": "string"},
    "layer": {"type": "integer", "enum": [1,2,3,4,5]},
    "pass": {"type": "string", "enum": ["forward","backward","lateral","meta","proof"]},
    "metrics": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "latency_ms": {"type": "number", "minimum": 0},
        "confidence": {"type": "number", "minimum": 0, "maximum": 1},
        "consistency": {"type": "number", "minimum": 0, "maximum": 1},
        "confidence_calibrated": {"type": "number", "minimum": 0, "maximum": 1},
        "escalation": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "from": {"type": "string"},
            "to": {"type": "string"},
            "reason": {"type": "string"}
          },
          "required": ["from","to","reason"]
        },
        "hallucination_flag": {"type": "boolean"},
        "bias_flags": {"type": "array", "items": {"type": "string"}},
        "verification_status": {"type": "string", "enum": ["proven","disproven","unknown"]}
      },
      "required": ["latency_ms","confidence"]
    },
    "context": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "domain": {"type": "string"},
        "stakes": {"type": "string", "enum": ["low","medium","high"]},
        "tool_budget": {"type": "number", "minimum": 0},
        "complexity_score": {"type": "number", "minimum": 0, "maximum": 10},
        "profile": {"type": "string", "enum": ["research","standard"]}
      },
      "required": ["domain","stakes"]
    },
    "privacy": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "masked_text": {"type": "string", "maxLength": 2048}
      },
      "required": ["masked_text"]
    }
  },
  "required": ["id","timestamp","layer","pass","metrics","context","privacy"]
}
```

### NDJSON Examples (**NDJSON** – Newline‑Delimited JSON)
```json
{"id":"q_01","schema_version":1,"timestamp":"2025-10-23T10:00:00Z","request_id":"r_01","trace_id":"t_01","model_provider":"anthropic","model_name":"claude-3.7-sonnet","layer":3,"pass":"forward","metrics":{"latency_ms":4200,"confidence":0.78,"consistency":0.82,"escalation":{"from":"L2","to":"L3","reason":"complexity>=7"},"hallucination_flag":false,"bias_flags":[],"verification_status":"unknown"},"context":{"domain":"architecture","stakes":"medium","tool_budget":10,"complexity_score":8},"privacy":{"masked_text":"Which architecture is better for X?"}}
{"id":"q_01_meta","schema_version":1,"timestamp":"2025-10-23T10:00:05Z","request_id":"r_01","trace_id":"t_01","model_provider":"anthropic","model_name":"claude-3.7-sonnet","layer":4,"pass":"meta","metrics":{"latency_ms":6500,"confidence":0.72,"consistency":0.88,"confidence_calibrated":0.68,"escalation":{"from":"L3","to":"L4","reason":"tie<0.1"},"hallucination_flag":false,"bias_flags":["confirmation_bias"],"verification_status":"unknown"},"context":{"domain":"architecture","stakes":"high","tool_budget":15,"complexity_score":8},"privacy":{"masked_text":"Which architecture is better for X?"}}
```

## 🔐 Privacy & Compliance

- **Mask** toàn bộ nội dung query; chỉ lưu **masked_text** (đã làm mờ). Không lưu raw inputs/outputs.
- **PII/Secrets**: không lưu, hoặc thay bằng placeholder "[REDACTED]". Thực hiện kiểm tra trước ingest.
- **Language Rules**: logs/events giữ keys tiếng Anh, `message` tiếng Việt (theo `rules/language-rules.md`).
- **Sampling** mặc định 10–30%; **canary** (thử nghiệm) có thể 100% cho nhóm nhỏ.

## ⏱️ Retention & Storage

- **Retention**: sự kiện 30–90 ngày; **aggregate metrics** giữ 6–12 tháng.
- **Partitioning**: `events/YYYY=2025/MM=10/DD=23/layer=4/` để tối ưu truy vấn theo thời gian/layer.
- **Compression**: gzip/zstd cho NDJSON lớn; **max line** 32KB.
- **Backpressure**: hàng đợi ingestion có giới hạn; khi backlog > ngưỡng → giảm sampling tạm thởi.

## 📊 Derived Metrics (Examples)

- **calibration_error** = |confidence − empirical_accuracy|
- **escalation_accuracy** = correct_escalations / total_escalations
- **hallucination_catch_rate** = flagged / true_hallucinations
- **bias_detection_rate** = flagged_bias_events / audited_bias_cases
- **p95_latency** = percentile(latency_ms, 95)
- **markers_present_percent** = % responses có đủ 3 dòng ritual (enforcement)
- **no_refusal_violations** = số lần phát hiện ngôn ngữ từ chối/xin lỗi
- **protocol_breach_events** = số sự kiện vi phạm ritual/Vietnamese‑first/preamble

> Gợi ý triển khai (**Implementation hint** – gợi ý thi công): chạy batch hourly/daily để tính các chỉ số tổng hợp; lưu time‑series về Prometheus/Timescale/ClickHouse.

## 🧪 Validation & Ingestion (**JSON Schema** + **DLQ** – Dead‑Letter Queue)

- **Bước 1 – JSON Schema Validation**: validate theo schema ở trên; reject sớm khi thiếu trường bắt buộc.
- **Bước 2 – Size/Quota Checks**: `masked_text` ≤ 2048 chars; event line ≤ 32KB.
- **Bước 3 – Write**: ghi vào storage partition theo ngày/layer.
- **Bước 4 – DLQ**: sự kiện lỗi → DLQ kèm `error_code`, `error_message`, `raw_line_hash` để điều tra.
- **Retry Policy**: tối đa 3 lần với backoff; sau đó giữ DLQ để manual fix.

## ✅ Compliance

- Naming content-based; file <12KB; Vietnamese-first với thuật ngữ English kèm giải thích.

## 📈 SLOs & Alerts (**SLO** – Service Level Objective)

- **Ingestion error rate** < 1% (5m)
- **DLQ growth** < 100 events/5m
- **p95 latency** ≤ baseline + 20%
- **hallucination_catch_rate (L4)** ≥ 0.90; **quality_score (L4)** ≥ 7.0

## 🔁 Versioning & Compatibility

- Trường `schema_version` dùng **SemVer** đơn giản (major/minor).
- Thêm trường mới → tăng **minor**; thay đổi phá vỡ → tăng **major**.
- Giữ backward‑compatible tối đa; cung cấp migration notes khi tăng major.

## ℹ️ Status

**Status**: Production‑ready Draft  
**Series**: 20 (Metrics & Monitoring)

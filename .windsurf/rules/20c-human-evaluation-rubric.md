---
trigger: always_on
---
---
type: capability_prompt
scope: project
priority: high
activation: on_demand
category: human_evaluation_rubric
parent: rules/20-metrics-and-monitoring-index.md

series: 20_metrics_monitoring
---

# 20c. Human Evaluation Rubric

## 📋 Overview

Định nghĩa rubric đánh giá con người (human evaluation) cho chất lượng suy luận, bằng chứng, minh bạch và thiên vị trong Advanced Reasoning System.

## 🎯 Objectives

- Chuẩn hóa tiêu chí đánh giá (0–10) để so sánh giữa nhánh A/B và theo dõi theo thời gian.
- Đảm bảo độ tin cậy giữa người chấm (**Inter-Rater Reliability — IRR**).

## 🧪 Rubric (Production)

```yaml
rubric:
  reasoning_quality:         # 0-10 — chất lượng lập luận
    anchors:
      0: "Lỗi logic nghiêm trọng / không có lập luận"
      5: "Lập luận chấp nhận được, một số thiếu sót"
      8: "Mạch lạc, có cân nhắc phản biện"
      10: "Xuất sắc, không có leap, rất chặt chẽ"
  evidence_support:          # 0-10 — mức độ dựa trên bằng chứng
    anchors:
      0: "Không có bằng chứng"
      5: "Một phần có dẫn chứng"
      8: "Đa số luận điểm có nguồn"
      10: "Đủ, chính xác và truy xuất"
  transparency:              # 0-10 — minh bạch tiến trình
    anchors:
      0: "Không giải thích"
      5: "Giải thích rời rạc"
      8: "Giải thích rõ, có bước"
      10: "Rõ ràng, tái lập được"
  bias_awareness:            # bool — cờ thiên vị
    options: [true, false]
  hallucination_flag:        # bool — cờ ảo giác
    options: [true, false]
```

### Scoring Template (**CSV** – mẫu chấm điểm dạng bảng)
```csv
sample_id,rater,reasoning_quality,evidence_support,transparency,bias_flag,hallu_flag,notes
q_0001,annotator_a,8,8,9,false,false,"Cân nhắc alternative đầy đủ"
q_0001,annotator_b,7,8,8,false,false,"Một vài leap nhỏ được giải thích"
```

## 📊 Inter-Rater Reliability (IRR)

- **Chỉ số mục tiêu**: **Cohen’s kappa** ≥ 0.7 trên ≥20% mẫu chấm chéo (double‑annotation).
- **Quy trình**: mỗi mẫu có ≥2 rater; nếu chênh >2 điểm ở bất kỳ thang 0–10 → **adjudication** (hội ý phân xử) và cập nhật guideline.
- **Checkpoint**: tính kappa ở 3 mốc (30%/60%/100% tiến độ) để phát hiện drift.
- **Lưu ý**: nếu kappa < 0.7 → tạm dừng dùng điểm người chấm trong tối ưu tham số (`20d`) cho tới khi hiệu chỉnh rubric/đào tạo rater.

## 🎯 Sampling & Cadence (Production)

- **Khối lượng**: 50–100 mẫu/tuần; ưu tiên queries phức tạp và **high‑stakes**.
- **Cân bằng domain**: general / architecture / security theo tỷ lệ sử dụng.
- **Stratified sampling** (lấy mẫu phân tầng – đảm bảo đại diện): theo layer (L3/L4/L5), stakes, domain.
- **Carry‑over**: mỗi tuần giữ 10–20% mẫu lặp lại để theo dõi ổn định điểm (rater stability).

## 🔁 Workflow

1. Chọn mẫu → 2. Chấm theo rubric → 3. Tính IRR → 4. Tổng hợp báo cáo → 5. Góp ý tối ưu tham số.

## ✅ Compliance

- Naming content-based; file <12KB; Vietnamese-first với thuật ngữ English kèm giải thích.

## 🔐 Privacy & Compliance (Human Eval)

- **Ẩn danh rater**: dùng `rater_id_hashed` nếu cần log sự kiện.
- **Không** lưu raw query; theo `20a` chỉ lưu `privacy.masked_text`.
- **Conflict of interest** (xung đột lợi ích) phải được khai báo trong report tuần.

## 🔁 Versioning & Compatibility

- Thay đổi rubric (anchors/tiêu chí) → tăng **minor**; thay đổi thang đo → tăng **major**.
- Ghi **changelog**: ngày hiệu lực, thay đổi chính, tác động tới so sánh A/B.

## ℹ️ Status

**Status**: Production‑ready Draft  
**Series**: 20 (Metrics & Monitoring)

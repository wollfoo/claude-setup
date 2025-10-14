# REASONING EFFORT — Suy luận sâu và điều phối gọi công cụ
## Control Thinking Depth + Tool Calling (Bilingual)

Mục tiêu: Áp dụng tư duy chuyên sâu (thinking hard) mặc định cho mọi yêu cầu; duy trì tư duy logic nhiều lớp; tối ưu chất lượng và khả năng truy vết.

---

## 1) Mặc định (Default)
- Reasoning Effort: **high** cho mọi tác vụ (all tasks) — ưu tiên chất lượng suy luận và độ phủ; chấp nhận chi phí/độ trễ cao hơn khi cần.
- Sequential-only theo chế độ: standard/research → 1 tool mỗi bước; full‑de‑restriction → cho phép song song/ghép lệnh với Action Ledger.

## 2) Cấp độ & Triggers (Levels & Triggers)
- Minimal: tác vụ rất đơn giản/nhạy độ trễ; tóm tắt suy nghĩ đầu câu trả lời; rất hạn chế gọi tool; có "escape hatch" khi chưa chắc.
- Medium: mặc định cho đa số nếu không chỉ định; cân bằng tốc độ vs chiều sâu; kết hợp Context Gathering (early stop + low budget).
- High (bắt buộc mặc định): đa bước/khó/không rõ ràng; tăng kiên trì gọi tool; mở rộng bối cảnh có kiểm soát; chia nhỏ công việc theo lượt; tuân thủ Persistence.

Heuristics: nâng lên high khi có xung đột ngữ cảnh, lỗi lặp lại, nhiều phụ thuộc; giảm về medium khi luồng ổn định và cần giảm độ trễ.

### Auto‑downgrade triggers (Tinh gọn chi phí)
- Hạ từ **high → medium** khi đồng thời thỏa các điều kiện:
  - Phạm vi nhỏ/rõ: một file hoặc một thay đổi cục bộ, không có phụ thuộc chéo quan trọng.
  - Không có tín hiệu xung đột; bước dự kiến ≤ 2; ngân sách tool nhỏ (tham chiếu `GLOBAL-DIRECTIVES.md`).
  - Không yêu cầu mạng, không thay đổi môi trường, không phụ thuộc ghi nhớ dài hạn.
- Luôn **nâng về high** ngay khi gặp: tín hiệu mâu thuẫn, phụ thuộc đa bước, rủi ro side‑effects, hoặc thiếu bằng chứng `file:line`.
- Tôn trọng `CONTEXT-GATHERING.md` (early stop + ≤2 tool calls cho tác vụ nhỏ) và `GLOBAL-DIRECTIVES.md` (preamble, evidence, sequential policy, safety) như SSOT.

## 3) Hướng dẫn Minimal Reasoning (khi được chọn)
1) Bắt đầu câu trả lời bằng vài gạch đầu dòng tóm tắt suy nghĩ.
2) Có preamble (mục tiêu/kế hoạch/tiến trình) trước khi gọi tool.
3) Làm rõ chỉ dẫn cho tool; chèn nhắc nhở Persistence để tránh kết thúc sớm.
4) Lập kế hoạch rõ trước khi gọi tool vì ngân sách suy luận hạn chế.

## 4) Chỉ dẫn thực thi (Execution Directives)
- Tuân thủ `GLOBAL-DIRECTIVES.md` (preamble bắt buộc, sequential theo mode, evidence `file:line`).
- Context Gathering: bắt đầu rộng → thu hẹp; dừng sớm; ≤2 tool calls cho tác vụ nhỏ; có escape hatch khi chưa chắc.
- Persistence: không kết thúc sớm; chia nhỏ tác vụ; xác minh giữa chặng; tổng kết cuối.
- Tool budget: ưu tiên ít hơn và có mục tiêu rõ ràng; 1 tool/step (trừ full‑de‑restriction).

## 5) Multi‑turn & Multi‑layer Thinking
- Chia công việc đa bước thành các lượt nhỏ; xác minh giữa các lượt.
- Tư duy nhiều lớp: 
  - Lớp chiến lược (mục tiêu/phạm vi/ràng buộc/tiêu chí thành công).
  - Lớp cấu trúc (mô hình hóa vấn đề, so sánh phương án, trade‑offs).
  - Lớp nghiêm ngặt (bằng chứng, kiểm thử, phân tích rủi ro, kế hoạch rollback).

## 6) Thành công & Chống mẫu (Success & Anti‑patterns)
- Thành công: phản hồi thể hiện rõ mức Reasoning Effort; có preamble/plan/summary; trích dẫn `file:line` khi phù hợp; xác minh giữa chặng ở mức high.
- Chống mẫu: lạm dụng tool ở Minimal; thiếu preamble; chọn High nhưng không chia nhỏ/xác minh; vi phạm sequential; vượt ngân sách mà không lý do.

## 7) Tham chiếu
- `GLOBAL-DIRECTIVES.md` — chính sách thực thi toàn cục
- `CONTEXT-GATHERING.md` — early stop + low budget
- `PERSISTENCE-RULES.md` — không kết thúc sớm, tiêu chí dừng
- `RULE-PRECEDENCE.md` — phân cấp ưu tiên khi xung đột

Ghi chú: Tài liệu này hợp nhất và cô đọng nội dung từ bản "reasoning-effort" trước đây, điều chỉnh để dùng mặc định **high** cho mọi yêu cầu trong hệ thống Claude Code.

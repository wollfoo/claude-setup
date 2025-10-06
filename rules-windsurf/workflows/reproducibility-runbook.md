---
description: Reproducibility Runbook – ensure reproducibility, environment control, and command logging
auto_execution_mode: 3
---

  # Reproducibility Runbook
  
  Goal: Ensure all results are reproducible by controlling environment, seeds, versions, and the command trail.
  
  References:
  - `rules/global-rules.md` (Required outputs; evidence-first)
  - `rules/environment-profile.md` (Windows/PowerShell; bounded outputs; restricted network; set Cwd, no inline `cd`)
  - `rules/tool-calling-override.md` (sequential-only, one tool per step; no tool+reply same step)
  - `rules/tool-preambles.md` (Goal/Plan/Progress/Summary for each tool call)
  - `rules/reasoning-effort.md` (điều chỉnh độ sâu lập luận – depth control)
  - `rules/context-gathering.md`, `rules/context-understanding.md` (early-stop, low tool budget, cite `file:line`)
  - `rules/persistence.md` (không bàn giao sớm – do not hand back early)
  - `rules/memory_tool_usage_guide.md` (search trước store; data safety; redaction)
  - `rules/swe-bench.md` (thorough verification, edge-case coverage)
  
  ## Preconditions
  - Objectives, scope, success/stop criteria rõ ràng.
  - Environment: OS/shell (Windows/PowerShell), working directory (Cwd), network policy (restricted), output cap.
  - Data/resources/licenses sẵn sàng; quyền truy cập hợp lệ.
  - Seeds xác định và nhất quán trên toàn pipeline.
  - Tool budget: ≤ 2 calls cho tác vụ nhỏ; escalate khi cần (theo `reasoning-effort.md`).
  - Rủi ro/safety: phân loại safe vs unsafe (theo `environment-profile.md`); chuẩn bị rollback.
  - Observability: kế hoạch log/traces; chỉ số xác nhận (hash, size, metrics).
  
  ## When to use
  - Trước khi chạy chuỗi lệnh phức tạp cần tái lập 100%.
  - Trước/Sau khi áp patch hoặc thay đổi rủi ro cao.
  - Trước khi công bố kết quả hoặc chuyển giao giữa môi trường.
  
  ## Procedure
  1) Preamble
     - Restate goal + outline sequential plan (tuân thủ `tool-preambles.md`).
  2) Environment Baseline
     - Ghi nhận OS, shell, Cwd, policy mạng, giới hạn output.
     - Ví dụ (PowerShell):
       ```powershell
       Get-Location
       $PSVersionTable.PSVersion
       Get-ChildItem Env: | Select-Object -First 10
       ```
  3) Versions & Tools
     - Ghi phiên bản công cụ quan trọng (bounded output). Ví dụ (nếu có): `git --version`, `node --version`.
  4) Seeds & Determinism
     - Chọn SEED cố định; bật cờ deterministic (nếu có); ghi rõ nơi set seed trong pipeline.
  5) Dependency Pinning
     - Khoá phiên bản/lockfile; lưu manifest phiên bản; tránh cài đặt mạng nếu chưa được duyệt.
  6) Data & Inputs
     - Liệt kê input và checksum (SHA256) để đảm bảo không đổi.
       ```powershell
       Get-FileHash -Algorithm SHA256 .\path\to\input.ext
       ```
  7) Command Log
     - Ghi tuần tự lệnh + tham số + Cwd cho mỗi bước; đảm bảo replayable, bounded outputs.
  8) Artifact Registry
     - Liệt kê output (đường dẫn, kích thước, checksum nếu cần) để kiểm chứng không drift.
  9) Multi-run Verification
     - Chạy lại ≥2 lần cùng SEED; kỳ vọng kết quả bitwise-identical hoặc trong ngưỡng chấp nhận.
  10) Cross-env Drift Check (tuỳ chọn)
      - Nếu khả thi, kiểm tra trên môi trường khác; ghi nhận khác biệt (nếu có).
  11) Final Verification
      - Replay toàn bộ command log; so khớp checksum/metrics với lần đầu.
  12) Archival
      - Lưu runbook, logs, seeds, manifest, registry để truy vết dài hạn.
  
  ## Constraints
  - Sequential-only: một tool call mỗi bước; không tool+reply trong cùng step (`tool-calling-override.md`).
  - Bounded outputs: giới hạn số dòng/ký tự; trích dẫn `file:line` khi tham chiếu repo.
  - Environment: set Cwd thay cho `cd`; tránh network/state mutation nếu chưa có phê duyệt (`environment-profile.md`).
  - Windows/PowerShell: chú ý quoting; không dùng lệnh gây side-effect khi auto-run.
  
  ## Success metrics
  - Log lệnh có thể replay end-to-end; kết quả trùng (checksum/metrics) qua các lần chạy.
  - Environment summary đầy đủ; seeds/lockfile/manifest được ghi nhận.
  - Không dùng network/stateful commands nếu chưa được duyệt; tuân thủ tool budget.
  - Có trích dẫn `file:line` khi viện dẫn nội dung repo.
  
  ## Stop criteria
  - Tất cả tiêu chí Success đạt và xác minh chéo qua multi-run.
  - Hoặc bị chặn bởi yêu cầu network/ngoài phạm vi cần phê duyệt.
  
  ## Anti-patterns
  - Thiếu seed/lockfile; log không tuần tự; output không bounded; không có checksum.
  - Dùng `cd` inline; gọi nhiều tool song song; chạy cài đặt mạng không phê duyệt.
  - Hướng dẫn mơ hồ, không thể tái lập; thiếu trích dẫn bằng chứng.
  
  ## Examples
  - Good: Ghi seed, pin deps, hash input/output, replay thành công 2 lần cùng kết quả.
  - Bad: Chạy mỗi lần ra kết quả khác nhau, không seed, không lưu manifest.
  
  ## Templates
  - Run header: mục tiêu, seed, Cwd, versions (tóm tắt), policy mạng, tool budget.
  - Step template: Mô tả → Lệnh (nếu có) → Kỳ vọng → Log/Hash → Ghi chú drift.
  
  ## Quick Checklist
  - [ ] Goal/Plan rõ ràng; [ ] Seeds cố định; [ ] Deps pinned; [ ] Hash inputs/outputs
  - [ ] Command log tuần tự (bounded); [ ] Không network nếu chưa duyệt; [ ] Cite `file:line`
  - [ ] Multi-run verification; [ ] Lưu registry + manifest + report
  
  ## Deliverables
  - Environment summary (key versions), seeds, and dependencies.
  - Ordered command log that can be replayed.
  - Artifact list and confirmation of successful reproducibility.
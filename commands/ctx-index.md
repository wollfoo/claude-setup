/ctx-index

Mục tiêu:
- Dùng MCP `code-context` (Pinecone) để index hoá codebase vào vector DB.

Cấu hình:
- index: ${DEFAULT_INDEX || "ncs"}
- namespace: ${DEFAULT_NAMESPACE || "repo:ncs/branch:main"}
- mode: full            # full | delta (delta = chỉ phần thay đổi theo git diff)
- root_dir: /app        # thư mục repo
- include_globs: ["src/**", "services/**", "app/**"]
- exclude_globs: ["**/node_modules/**", "**/*.lock", "**/dist/**", "**/.git/**", "**/*.png", "**/*.jpg", "**/*.pdf"]
- chunking:
    strategy: AST-first
    fallback_window_lines: 160
    overlap_lines: 20
- metadata_schema (phẳng):
    required: ["repo","branch","path","lang","start","end","commit"]
    optional: ["symbol","tags","imports","hash"]
- id_format: "repo:{repo}|branch:{branch}|path:{path}|{start}-{end}|{hash}"
- batch_size: 300       # tự giảm nếu tool báo lỗi kích thước
- retry:
    max_attempts: 5
    backoff: exponential

Yêu cầu thực thi:
1) Quét file theo include/exclude.
2) Chunk code: AST-first, rơi về window 160/20.
3) Tạo metadata theo schema trên; tính hash nội dung chunk.
4) Upsert theo batch với `code-context.upsert-records` vào {index}/{namespace}.
5) Báo cáo cuối cùng (markdown bảng):
   - total_files_scanned
   - total_chunks_upserted
   - batches_sent / avg_batch_size
   - errors_count + danh sách lỗi (id, path, reason)
   - ước tính thời gian & throughput
6) Nếu mode=delta: xác định thay đổi theo `git diff HEAD~1..HEAD` (hoặc HEAD..origin/BRANCH nếu có), chỉ upsert/xoá phần chênh.

Ràng buộc:
- Không index binary/lockfile/log/dumps/secrets (.env, keys, token).
- Nếu gặp giới hạn kích thước kết quả/req, tự giảm batch_size.
- Nếu index không phải integrated-embedding, cảnh báo và dừng (tránh upsert text hỏng).

/ctx-search

Mục tiêu:
- Tìm context chính xác từ Pinecone và chèn trích đoạn gọn vào trả lời.

Cấu hình:
- index: ${DEFAULT_INDEX || "ncs"}
- namespace: ${DEFAULT_NAMESPACE || "repo:ncs/branch:main"}
- query: "<điền mô tả điều muốn tìm, ví dụ: jwt middleware request auth flow>"
- filter:
    repo: "ncs"                      # bắt buộc tối thiểu repo
    branch: "main"                   # khuyến nghị
    path_prefix: "services/auth"     # khuyến nghị
    lang_in: ["ts","js"]             # khuyến nghị
- retrieval:
    top_k_first_pass: 80
    rerank_keep: 8
- output_fields: ["path","start","end","symbol","preview","score"]
- preview_max_lines: 12
- max_result_bytes: 4MB              # nếu sắp đạt, tự giảm top_k/bớt metadata

Yêu cầu thực thi:
1) Dùng MCP `code-context.search-records` để lấy top_k_first_pass theo query + filter.
2) Rerank bằng `code-context.rerank-documents` xuống rerank_keep (8 mặc định).
3) Trả về danh sách kết quả dạng bảng (path, start-end, symbol, score) + code preview (≤ preview_max_lines).
4) Chèn 8 kết quả đã rerank vào **working context** để dùng tiếp (giải thích/sửa code).
5) Nếu không có kết quả phù hợp: gợi ý nới lỏng filter (lang/path) hoặc tăng top_k_first_pass.

Ràng buộc:
- Luôn áp dụng filter `{repo, branch, path_prefix, lang_in}` để giảm RU và tăng độ chính xác.
- Nếu vượt ngưỡng trả về (~4MB), ưu tiên giảm `top_k_first_pass` rồi mới bỏ bớt `include_metadata/values`.

/ctx-index
Dùng MCP `code-context`. Thực thi ngay. ĐỪNG in payload records.
Nếu cần log chi tiết, lưu vào /app/index_logs/batch_${timestamp}.json. 

Chỉ in báo cáo tóm tắt (markdown table):
- total_files_scanned, total_chunks_upserted
- batches_sent, avg_batch_size
- errors_count (nếu >0 thì in TỐI ĐA 5 lỗi mẫu: id, path, reason)
- thời gian chạy, throughput (records/s)

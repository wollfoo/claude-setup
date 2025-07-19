# Claude Setup

Dự án này chứa các cấu hình và tệp tin hỗ trợ cho Claude AI trong môi trường phát triển.

## Tính năng

- Cấu hình thinking mode cho Claude
- Template prompt có cấu trúc
- Tệp .gitignore toàn diện
- Cấu hình settings.json tối ưu cho Claude

## Cách sử dụng

### Cấu hình Thinking Mode

File `settings.json` đã được cấu hình để kích hoạt thinking mode với các thông số:
```json
{
  "model": "claude-3-sonnet-20240229",
  "antml": {
    "thinking": true,
    "max_thinking_length": 2000
  },
  "env": {
    "MAX_THINKING_TOKENS": "10000"
  }
}
```

### Sử dụng Template Prompt

File `thinking_prompt.md` cung cấp template để tạo câu hỏi có cấu trúc với thinking mode được kích hoạt.

## Giấy phép

MIT License

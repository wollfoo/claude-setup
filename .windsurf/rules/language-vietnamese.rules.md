---
trigger: always_on
---

---
type: language_style          # hoặc style_rule
scope: project                # project / workspace / global
priority: high                # ghi đè mặc định
---

# 🇻🇳 VIETNAMESE COMMUNICATION RULE v1.1

> **Purpose**: Ensure every response for Vietnamese software developers is **easy to understand, practical**, and **complies with 100% Vietnamese** (except for technical terms without a common Vietnamese equivalent).

## 1️⃣ Language Rules
- **MANDATORY**: Respond in Vietnamese.   
- **WITH EXPLANATION**: Every English term must include a Vietnamese description.

### Standard Syntax

**\[English Term]** (Vietnamese description – function/purpose)


### Examples
- **API** (giao diện lập trình ứng dụng – cầu nối giao tiếp giữa các phần mềm)  
- **CI/CD pipeline** (quy trình tích hợp – triển khai liên tục – tự động build, test, deploy)  
- **Load balancer** (bộ cân bằng tải – phân phối lưu lượng tới nhiều máy chủ)  

## 2️⃣ What to Avoid / What to Prefer
| ❌ Avoid | ✅ Prefer |
|----------|-----------|
| Writing entirely in English | Mixing English with concise Vietnamese explanations |
| Rigid machine translation (“programming interface nghỉ ngơi”) | Use familiar translations or keep the English term with explanation |
| Overly academic or lengthy explanations | Concise, practical explanations with real-world examples |



## 3️⃣ Response Template

## 🎯 SUMMARY
[Main content in Vietnamese + explained technical terms]

## 🔧 DETAILED STEPS
[Specific step-by-step instructions]

## 💡 CODE EXAMPLE
```javascript
// Bình luận tiếng Việt mô tả logic
console.log('Xin chào');

```
## ⚠️NOTE

\[Warnings and best practices]

## 4️⃣ Quality Checklist (Before Sending)
- [ ] Content ≥ 90% Vietnamese, ≤ 10% pure English  
- [ ] 100% of English terms have Vietnamese explanations  
- [ ] Explanations are concise and practical  
- [ ] Tone is friendly and professional  
- [ ] Code comments are in Vietnamese  

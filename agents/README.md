# 🏗️ **CẤU TRÚC HỆ THỐNG AGENTS CLAUDE-SETUP**

## 📁 **TỔNG QUAN CẤU TRÚC**

Hệ thống agents được tổ chức theo mô hình **hierarchical orchestration** với 7 tầng chính, mỗi tầng có chức năng và trách nhiệm riêng biệt.

```
agents/
├── 00-orchestrators/           # 🎯 Tầng điều phối cao nhất
├── 01-core/                    # 🔍 Tầng phân tích & nghiên cứu
├── 02-development/             # 💻 Tầng phát triển
│   ├── universal/              # 🌐 Agents đa nền tảng
│   ├── specialized/            # 🎯 Agents chuyên biệt theo framework
│   └── styling/                # 🎨 Chuyên gia styling
├── 03-quality/                 # ✅ Tầng đảm bảo chất lượng
├── 04-documentation/           # 📚 Tầng tài liệu
├── 05-planning/                # 📋 Tầng lập kế hoạch
├── 06-infrastructure/          # 🏗️ Tầng hạ tầng
└── 07-utilities/               # 🛠️ Tầng tiện ích
```

## 🎯 **00-ORCHESTRATORS - Tầng Điều Phối**

**Mục đích**: Điều phối workflow phức tạp và phân công nhiệm vụ

### **Agents trong tầng này:**
- **workflow-orchestrator.md** (4.7KB) - Điều phối workflow đa domain
- **tech-lead-orchestrator.md** (3.8KB) - Phân tích dự án và phân công agent
- **project-analyst.md** (1.9KB) - Phân tích yêu cầu dự án
- **team-configurator.md** (2.4KB) - Cấu hình team và workflow

### **Khi sử dụng:**
- Dự án phức tạp cần nhiều chuyên gia
- Cần phân tích và lập kế hoạch tổng thể
- Workflow cần điều phối nhiều bước

## 🔍 **01-CORE - Tầng Phân Tích & Nghiên Cứu**

**Mục đích**: Khám phá, phân tích và hiểu codebase

### **Agents trong tầng này:**
- **code-archaeologist.md** (3.4KB) - Khám phá codebase không quen thuộc
- **codebase-research-analyst.md** (4.3KB) - Phân tích cấu trúc và dependencies
- **code-searcher.md** (5.0KB) - Tìm kiếm code patterns
- **debug-specialist.md** (3.4KB) - Chuyên gia debug
- **code-reviewer.md** (3.4KB) - Review code
- **documentation-specialist.md** (2.6KB) - Chuyên gia tài liệu
- **performance-optimizer.md** (1.9KB) - Tối ưu hiệu suất
- **ai-engineer.md** (1.2KB) - Chuyên gia AI/ML engineering
- **ml-engineer.md** (1.0KB) - Chuyên gia Machine Learning
- **data-engineer.md** (1.1KB) - Chuyên gia Data Engineering
- **database-optimizer.md** (1.2KB) - Tối ưu hóa cơ sở dữ liệu
- **debugger.md** (2.0KB) - Chuyên gia debug toàn diện

### **Khi sử dụng:**
- Cần hiểu codebase legacy
- Phân tích dependencies và architecture
- Debug vấn đề phức tạp
- Review code quality
- Phát triển AI/ML solutions
- Xử lý và phân tích dữ liệu

## 💻 **02-DEVELOPMENT - Tầng Phát Triển**

### **🌐 Universal - Agents Đa Nền Tảng**

**Mục đích**: Phát triển cho nhiều ngôn ngữ/framework

#### **Agents trong tầng này:**
- **software-engineer.md** (3.9KB) - Chuyên gia software engineering
- **backend-developer.md** (4.1KB) - Phát triển backend đa ngôn ngữ
- **frontend-developer.md** (3.1KB) - Phát triển frontend đa framework
- **api-architect.md** (2.9KB) - Kiến trúc API
- **frontend-designer.md** (7.8KB) - Thiết kế UI/UX

### **🎯 Specialized - Agents Chuyên Biệt**

#### **Django Framework**
- **django-backend-expert.md** (28KB) - Chuyên gia Django backend
- **django-api-developer.md** (26KB) - Phát triển API Django
- **django-orm-expert.md** (27KB) - Chuyên gia Django ORM

#### **Laravel Framework**
- **laravel-backend-expert.md** (7.2KB) - Chuyên gia Laravel backend
- **laravel-eloquent-expert.md** (3.5KB) - Chuyên gia Laravel Eloquent

#### **Rails Framework**
- **rails-backend-expert.md** (22KB) - Chuyên gia Rails backend
- **rails-api-developer.md** (25KB) - Phát triển API Rails
- **rails-activerecord-expert.md** (19KB) - Chuyên gia Rails ActiveRecord

#### **React Framework**
- **react-component-architect.md** (2.0KB) - Kiến trúc component React
- **react-nextjs-expert.md** (5.3KB) - Chuyên gia Next.js

#### **Vue Framework**
- **vue-component-architect.md** (3.5KB) - Kiến trúc component Vue
- **vue-nuxt-expert.md** (17KB) - Chuyên gia Nuxt.js
- **vue-state-manager.md** (1.8KB) - Quản lý state Vue

### **🎨 Styling - Chuyên Gia Styling**
- **tailwind-css-expert.md** (4.4KB) - Chuyên gia Tailwind CSS v4+

## ✅ **03-QUALITY - Tầng Đảm Bảo Chất Lượng**

**Mục đích**: Đảm bảo chất lượng code và bảo mật

### **Agents trong tầng này:**
- **code-refactorer.md** (4.5KB) - Refactor code
- **security-auditor.md** (8.1KB) - Audit bảo mật toàn diện

### **Khi sử dụng:**
- Cần refactor code legacy
- Audit bảo mật hệ thống
- Cải thiện code quality

## 📚 **04-DOCUMENTATION - Tầng Tài Liệu**

**Mục đích**: Tạo và quản lý tài liệu

### **Agents trong tầng này:**
- **technical-documentation-specialist.md** (4.0KB) - Chuyên gia tài liệu kỹ thuật
- **content-writer.md** (4.1KB) - Viết nội dung
- **prd-writer.md** (5.1KB) - Viết Product Requirements Document

### **Khi sử dụng:**
- Cần tạo tài liệu kỹ thuật
- Viết PRD cho dự án mới
- Tạo nội dung marketing

## 📋 **05-PLANNING - Tầng Lập Kế Hoạch**

**Mục đích**: Lập kế hoạch và chiến lược

### **Agents trong tầng này:**
- **planning-strategist.md** (4.5KB) - Chiến lược gia
- **project-task-planner.md** (5.4KB) - Lập kế hoạch task
- **vibe-coding-coach.md** (5.1KB) - Coach coding

### **Khi sử dụng:**
- Lập kế hoạch dự án
- Phân chia task
- Coaching team

## 🏗️ **06-INFRASTRUCTURE - Tầng Hạ Tầng**

**Mục đích**: Quản lý hạ tầng và DevOps

### **Agents trong tầng này:**
- **devops-infrastructure-specialist.md** (4.6KB) - Chuyên gia DevOps
- **tech-knowledge-assistant.md** (3.0KB) - Trợ lý kiến thức kỹ thuật

### **Khi sử dụng:**
- Setup CI/CD pipeline
- Quản lý infrastructure
- Cần kiến thức kỹ thuật

## 🛠️ **07-UTILITIES - Tầng Tiện Ích**

**Mục đích**: Cung cấp các tiện ích hỗ trợ

### **Agents trong tầng này:**
- **memory-bank-synchronizer.md** (3.9KB) - Đồng bộ memory bank
- **get-current-datetime.md** (790B) - Lấy thời gian hiện tại

### **Khi sử dụng:**
- Cần đồng bộ context
- Lấy thông tin thời gian

## 🚀 **HƯỚNG DẪN SỬ DỤNG**

### **1. Workflow Tiêu Chuẩn**

```
User Request → 00-orchestrators → 01-core → 02-development → 03-quality → 04-documentation
```

### **2. Agent Selection Logic**

1. **Bắt đầu với Orchestrators** cho dự án phức tạp
2. **Sử dụng Core agents** để phân tích và hiểu codebase
3. **Chọn Development agents** theo framework/technology
4. **Áp dụng Quality agents** để đảm bảo chất lượng
5. **Sử dụng Documentation agents** để tạo tài liệu

### **3. Quy Tắc Ưu Tiên**

- **Ưu tiên chuyên biệt**: Django API → django-api-developer
- **Fallback universal**: Không có specialist → backend-developer
- **Tối đa 2 agent song song**: Tránh quá tải context

### **4. Ví Dụ Sử Dụng**

#### **Dự án Django mới:**
```
project-analyst → code-archaeologist → django-backend-expert → security-auditor → documentation-specialist
```

#### **Refactor code legacy:**
```
code-archaeologist → codebase-research-analyst → code-refactorer → code-reviewer → performance-optimizer
```

#### **Setup CI/CD:**
```
devops-infrastructure-specialist → security-auditor → technical-documentation-specialist
```

## 📊 **THỐNG KÊ HỆ THỐNG**

- **Tổng số agents**: 25+ agents
- **Framework coverage**: 5 frameworks chính
- **Specialization levels**: 7 levels
- **File size range**: 790B - 28KB
- **Language support**: Vietnamese + English

## 🔄 **MỞ RỘNG HỆ THỐNG**

### **Thêm Framework mới:**
1. Tạo thư mục `02-development/specialized/[framework-name]`
2. Tạo các agents chuyên biệt cho framework
3. Cập nhật README.md

### **Thêm Agent mới:**
1. Xác định tầng phù hợp
2. Tạo file agent với format chuẩn
3. Cập nhật README.md

---

**Lưu ý**: Hệ thống này được thiết kế để scale và adapt cho các dự án phức tạp. Luôn bắt đầu với orchestrators cho dự án lớn và sử dụng specialized agents khi có thể. 
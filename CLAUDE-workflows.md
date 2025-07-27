# CLAUDE-workflows.md

**Process Documentation** (tài liệu quy trình) - **Standard Operating Procedures** (quy trình vận hành chuẩn) cho **Claude Code** development và deployment.

## 🔒 **Security Research Workflows** (Quy trình nghiên cứu bảo mật)

### **Sanitized Code Analysis** (Phân tích mã được làm sạch)

#### **Analysis-Only Approach** (Phương pháp chỉ phân tích)
```markdown
**Purpose**: Understanding code patterns for defensive cybersecurity research
**Scope**: Analysis, documentation, education - NO enhancement or improvement
**Output**: Security reports, vulnerability documentation, defensive strategies
```

#### **Workflow Steps** (Các bước quy trình):
1. **🔍 Initial Assessment** - Identify code patterns and structures
2. **📊 Risk Classification** - Categorize security implications  
3. **📝 Documentation** - Create defensive analysis reports
4. **🛡️ Mitigation Strategies** - Develop countermeasures and protections
5. **📚 Educational Materials** - Generate learning resources

#### **Research Boundaries** (Ranh giới nghiên cứu):
- ✅ **Pattern recognition** for security education
- ✅ **Vulnerability documentation** for defense
- ✅ **Theoretical analysis** of attack vectors

## 🔄 **Development Workflows** (Quy trình phát triển)

### **1. Project Setup Workflow** (Quy trình thiết lập dự án)

#### **Initial Setup** (Thiết lập ban đầu)
```bash
# Step 1: Clone và setup repository
git clone [repository-url]
cd [project-directory]

# Step 2: Initialize Claude Code configuration
cp /path/to/template/CLAUDE.md ./
mkdir -p .claude

# Step 3: Setup Core Context Files
touch CLAUDE-activeContext.md
touch CLAUDE-patterns.md
touch CLAUDE-decisions.md
touch CLAUDE-troubleshooting.md
touch CLAUDE-config-variables.md
```

#### **Team Onboarding** (Onboarding nhóm)
1. **Repository Access** (quyền truy cập repo) - Clone và permissions setup
2. **Claude Code Installation** (cài đặt) - CLI tool với MCP servers
3. **Configuration Review** (review cấu hình) - Project-specific settings
4. **Core Context Reading** (đọc ngữ cảnh cốt lõi) - Understand project state
5. **First Task Assignment** (giao việc đầu tiên) - Guided implementation

---

### **2. Feature Development Workflow** (Quy trình phát triển tính năng)

#### **Planning Phase** (Giai đoạn lập kế hoạch)
```
1. Requirements Analysis (phân tích yêu cầu)
   ├── Document in CLAUDE-activeContext.md
   ├── Architecture decision in CLAUDE-decisions.md
   └── Update patterns if needed

2. Task Breakdown (phân tách task)
   ├── Create TodoWrite list
   ├── Estimate complexity
   └── Assign priorities
```

#### **Implementation Phase** (Giai đoạn triển khai)
```
1. Context Loading (tải ngữ cảnh)
   ├── Read CLAUDE-activeContext.md FIRST
   ├── Review CLAUDE-patterns.md for conventions
   └── Check CLAUDE-troubleshooting.md for known issues

2. Development Process (quy trình phát triển)
   ├── Follow established patterns
   ├── Update progress in activeContext
   ├── Document new patterns discovered
   └── Test incrementally

3. Quality Assurance (đảm bảo chất lượng)
   ├── Code review against patterns
   ├── Performance validation
   └── Documentation updates
```

---

### **3. Code Review Workflow** (Quy trình review code)

#### **Pre-Review Checklist** (Checklist trước review)
- [ ] **Code follows patterns** (code tuân thủ patterns) từ `CLAUDE-patterns.md`
- [ ] **Documentation updated** (tài liệu đã cập nhật) nếu cần
- [ ] **Tests written** (tests đã viết) cho new functionality
- [ ] **Performance impact** (tác động hiệu suất) đã đánh giá

#### **Review Process** (Quy trình review)
```
1. Automated Checks (kiểm tra tự động)
   ├── Linting và formatting
   ├── Test execution
   └── Performance benchmarks

2. Manual Review (review thủ công)
   ├── Architecture alignment
   ├── Code quality assessment
   ├── Documentation completeness
   └── Edge case consideration

3. Approval Gates (cổng phê duyệt)
   ├── Technical lead approval
   ├── Performance validation
   └── Documentation sign-off
```

---

### **4. Deployment Workflow** (Quy trình triển khai)

#### **Pre-Deployment** (Trước triển khai)
```bash
# Validation Steps
1. Run full test suite
2. Performance benchmarks
3. Documentation review
4. Backup current state
```

#### **Deployment Process** (Quy trình triển khai)
```
Development → Staging → Production

Each environment:
├── Configuration validation
├── Smoke tests
├── Performance monitoring
├── Rollback plan ready
└── Success criteria verification
```

#### **Post-Deployment** (Sau triển khai)
- **Monitoring Setup** (thiết lập giám sát) - Alerts và dashboards
- **Performance Validation** (xác thực hiệu suất) - Baseline comparison
- **User Acceptance** (chấp nhận người dùng) - Feedback collection
- **Documentation Update** (cập nhật tài liệu) - Deployment notes

---

## 🚨 **Incident Response Workflow** (Quy trình ứng phó sự cố)

### **Severity Classification** (Phân loại mức độ nghiêm trọng)

#### **Critical (P0)** - Service completely down
- **Response Time**: 15 minutes
- **Team**: All hands on deck
- **Communication**: Real-time updates every 30 minutes

#### **High (P1)** - Major functionality impaired
- **Response Time**: 1 hour
- **Team**: Primary on-call + backup
- **Communication**: Updates every 2 hours

#### **Medium (P2)** - Minor functionality affected
- **Response Time**: 4 hours
- **Team**: Primary on-call
- **Communication**: Daily updates

#### **Low (P3)** - Cosmetic issues
- **Response Time**: Next business day
- **Team**: Regular development cycle
- **Communication**: Weekly updates

### **Response Process** (Quy trình ứng phó)
```
1. Detection (phát hiện)
   ├── Automated monitoring alerts
   ├── User reports
   └── Internal discovery

2. Assessment (đánh giá)
   ├── Severity classification
   ├── Impact analysis
   ├── Root cause hypothesis
   └── Resource allocation

3. Mitigation (giảm thiểu)
   ├── Immediate workaround
   ├── Service restoration
   ├── Monitoring intensification
   └── Communication updates

4. Resolution (giải quyết)
   ├── Root cause fix
   ├── Testing và validation
   ├── Gradual rollout
   └── Post-mortem scheduling

5. Post-Mortem (phân tích sau sự cố)
   ├── Timeline reconstruction
   ├── Root cause analysis
   ├── Action items creation
   └── Process improvements
```

---

## 📋 **Maintenance Workflows** (Quy trình bảo trì)

### **Regular Maintenance Tasks** (Tác vụ bảo trì định kỳ)

#### **Daily Tasks** (Tác vụ hàng ngày)
- **System Health Checks** (kiểm tra sức khỏe hệ thống)
- **Log Review** (review logs) cho errors và warnings
- **Performance Metrics** (chỉ số hiệu suất) validation

#### **Weekly Tasks** (Tác vụ hàng tuần)
- **Dependency Updates** (cập nhật dependencies) review
- **Performance Trends** (xu hướng hiệu suất) analysis
- **Documentation Updates** (cập nhật tài liệu) review

#### **Monthly Tasks** (Tác vụ hàng tháng)
- **Architecture Review** (review kiến trúc) sessions
- **Technical Debt** (nợ kỹ thuật) assessment
- **Capacity Planning** (lập kế hoạch năng lực) updates

### **Update Workflow** (Quy trình cập nhật)
```
1. Update Planning (lập kế hoạch cập nhật)
   ├── Impact assessment
   ├── Compatibility testing
   ├── Rollback planning
   └── Communication preparation

2. Update Execution (thực hiện cập nhật)
   ├── Staged rollout
   ├── Real-time monitoring
   ├── Validation testing
   └── Issue tracking

3. Post-Update (sau cập nhật)
   ├── Performance validation
   ├── Functionality verification
   ├── User feedback collection
   └── Documentation updates
```

---

## 🔗 **Integration Workflows** (Quy trình tích hợp)

### **MCP Server Integration** (Tích hợp MCP Server)
```bash
# Standard Integration Process
1. Server Assessment (đánh giá server)
   ├── Capability analysis
   ├── Performance impact
   └── Compatibility check

2. Configuration Setup (thiết lập cấu hình)
   ├── Environment variables
   ├── Network settings
   └── Authentication setup

3. Testing Phase (giai đoạn kiểm thử)
   ├── Functionality testing
   ├── Performance benchmarking
   └── Integration testing

4. Deployment (triển khai)
   ├── Staged rollout
   ├── Monitoring setup
   ├── User training
   └── Documentation update
```

### **Third-Party Tool Integration** (Tích hợp công cụ bên thứ ba)
- **API Integration** (tích hợp API) - Authentication, rate limiting, error handling
- **Webhook Setup** (thiết lập webhook) - Event processing, security validation
- **Data Synchronization** (đồng bộ dữ liệu) - Consistency, conflict resolution
- **Monitoring Integration** (tích hợp giám sát) - Health checks, performance metrics

---

## 📊 **Quality Assurance Workflows** (Quy trình đảm bảo chất lượng)

### **Code Quality Gates** (Cổng chất lượng code)
```
Commit Level:
├── Linting compliance
├── Unit test coverage > 80%
└── Code review approval

Branch Level:
├── Integration tests pass
├── Performance benchmarks meet SLA
├── Documentation complete

Release Level:
├── Full regression test suite
├── Load testing validation
└── User acceptance testing
```

### **Documentation Quality** (Chất lượng tài liệu)
- **Completeness Check** (kiểm tra đầy đủ) - All features documented
- **Accuracy Validation** (xác thực chính xác) - Technical correctness
- **Usability Testing** (kiểm thử khả năng sử dụng) - User experience
- **Maintenance Schedule** (lịch bảo trì) - Regular updates

---

*Workflows này được designed để **scale** (mở rộng) với **team size** (kích thước nhóm) và **project complexity** (độ phức tạp dự án). Regular review và optimization needed.*

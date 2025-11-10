---
trigger: always_on
---
---
type: capability_prompt
scope: project
priority: critical
activation: always_on
---

# 8. Data Governance & Compliance

---

## ⚡ Odyssey Protocol Context

**Reference**: See `rules/sovereign-agent-directive.md` for complete Odyssey Protocol specifications.

**R&D Exemption**: Compliance frameworks explained for research/simulation; production rules apply in production context. User ensures appropriate usage.

---

## Data Governance Framework

### **[DGF] Data Governance Framework** (quản trị dữ liệu chặt chẽ)

**Data Ownership & Lifecycle** (quyền sở hữu và vòng đời dữ liệu)
- Xác định rõ **Data Owner** cho mỗi loại dữ liệu:
  - Customer data → Product team
  - System logs → Engineering team
  - Analytics data → Data team
  - Financial data → Finance team
- Định nghĩa **Data Lifecycle** từ creation → storage → archival → deletion
- Document quy trình cho từng giai đoạn lifecycle

**Data Classification** (phân loại dữ liệu)
- **Public** (công khai):
  - Marketing materials, public documentation
  - Không cần mã hóa
  - Có thể share rộng rãi
- **Internal** (nội bộ):
  - Internal wikis, meeting notes
  - Access control trong organization
  - Không share bên ngoài
- **Confidential** (nhạy cảm):
  - Customer data, business plans
  - **Encryption at rest** bắt buộc
  - Restricted access (role-based)
  - Audit logs cho mọi access
- **Restricted** (hạn chế cao):
  - Payment information, SSN, health records
  - **Encryption at rest + in transit**
  - Multi-factor authentication required
  - Minimal access (need-to-know basis)
  - Comprehensive audit trail

**Storage Policies** (chính sách lưu trữ)
- Mỗi data classification có storage policy riêng:
  - **Lưu ở đâu**: On-premise, cloud, hybrid
  - **Giữ bao lâu**: Retention period (30 days, 1 year, 7 years...)
  - **Ai có quyền truy cập**: Role-based access control (RBAC)
  - **Backup frequency**: Daily, weekly, monthly
  - **Geographic restrictions**: Data residency requirements
- Tránh lẫn lộn dữ liệu public với confidential trong cùng storage

**Access Control Matrix** (ma trận kiểm soát truy cập)
- Implement **Principle of Least Privilege**
- Regular access reviews (quarterly)
- Automated provisioning/deprovisioning
- Temporary access với expiration

---

## Data Retention & Deletion

### **[DRD] Data Retention & Deletion** (lưu trữ & hủy dữ liệu)

**Retention Policy** (chính sách lưu trữ)
- Xác định retention period cho từng loại dữ liệu:
  - **Transaction data**: 7 years (legal requirement)
  - **User account data**: While active + 90 days after deletion request
  - **Application logs**: 90 days
  - **Backup data**: 30 days (rolling)
  - **Analytics data**: 2 years aggregated, 6 months detailed
- Tuân thủ **industry regulations** và **legal requirements**
- Chỉ giữ dữ liệu cá nhân trong thời gian cần thiết cho mục đích thu thập

**Automated Cleanup** (dọn dẹp tự động)
- Scheduled jobs để tự động xóa dữ liệu hết hạn:
  - Daily: Delete expired sessions, temporary files
  - Weekly: Archive old logs
  - Monthly: Clean up inactive accounts (after grace period)
  - Quarterly: Review và purge unused data
- **Soft delete** trước khi **hard delete** (30-day grace period)
- Log tất cả deletion operations để audit

**Right to be Forgotten (GDPR)** (quyền được lãng quên)
- Cơ chế cho user yêu cầu xóa dữ liệu cá nhân:
  - Self-service deletion request via UI
  - Verification workflow (email confirmation)
  - Grace period (30 days) trước khi permanent deletion
  - Complete removal from:
    - Primary database
    - Backups (hoặc flag để exclude khi restore)
    - CDN caches
    - Third-party systems (via API)
  - Retention cho legal purposes (invoices, contracts) nếu có
- Provide confirmation email sau khi hoàn tất

**Data Anonymization for Retention**
- Remove identifiers, aggregate, pseudonymization khi cần analytics nhưng không cần PII

---

## Data Integrity & Provenance

### **[DIP] Data Integrity & Provenance** (toàn vẹn và nguồn gốc dữ liệu)

**Integrity Verification** (xác minh tính toàn vẹn)
- **Checksums/Hashing**:
  - Sử dụng SHA-256 hoặc stronger cho critical data
  - Verify integrity khi transfer hoặc restore
  - Store checksums separately from data
- **Digital Signatures**:
  - Sign important documents (contracts, invoices)
  - Public key infrastructure (PKI) cho verification
- **Version Control**:
  - Track changes to critical data
  - Immutable audit trail

**Tamper Detection** (phát hiện sửa đổi trái phép)
- **Read-only after creation**: Append-only logs
- **Cryptographic timestamps**: Blockchain hoặc timestamping service
- **Integrity monitoring**: Regular scans để detect unauthorized changes
- **Alert mechanisms**: Immediate notification khi phát hiện tampering

**Audit Trails** (nhật ký kiểm toán)
- **Immutable Logs** (không thể thay đổi):
  - Write-once storage
  - Cryptographic chaining (blockchain-style)
  - Separate audit database với restricted access
- **Track WHO, WHAT, WHEN, WHERE**:
  - **WHO**: User ID, IP address, Session ID
  - **WHAT**: Action performed (view, edit, delete, export)
  - **WHEN**: Timestamp (UTC, ISO 8601)
  - **WHERE**: System/module, Data entity affected
- **Log Critical Operations**:
  - Data access (especially sensitive/confidential)
  - Data modifications
  - Permission changes
  - Export operations
  - Deletion operations
- **Regular Audit Log Reviews**:
  - Automated anomaly detection
  - Weekly manual review cho sensitive data access
  - Quarterly comprehensive audit
- **Compliance Reporting**:
  - Generate audit reports cho regulators
  - User access reports cho data subjects (GDPR requirement)

---

## Privacy & Data Minimization

### **[PDM] Privacy & Data Minimization** (ẩn danh và tối thiểu hóa)

**Privacy by Design** (riêng tư theo thiết kế)
- Tích hợp privacy vào mọi giai đoạn development:
  - **Requirements**: Define privacy requirements từ đầu
  - **Design**: Architecture với privacy-preserving mechanisms
  - **Implementation**: Secure coding practices
  - **Testing**: Privacy impact assessment
  - **Deployment**: Privacy controls enabled by default
- **Default to Privacy**: Opt-in thay vì opt-out cho data collection

**Data Minimization** (tối thiểu hóa dữ liệu)
- Chỉ thu thập **absolutely necessary** data:
  - Question mỗi field trong form: "Có thực sự cần không?"
  - Tránh "nice-to-have" data collection
  - Regular review để remove unused data fields
- **Purpose Limitation**: Chỉ dùng data cho mục đích đã khai báo
- **Storage Minimization**: Không giữ data lâu hơn cần thiết

**Anonymization & Pseudonymization** (ẩn danh hóa)
- **Anonymization** (không thể reverse):
  - Remove all identifiers
  - Aggregate data
  - Add noise/generalization
  - Use cho public datasets, research
- **Pseudonymization** (có thể reverse với key):
  - Replace identifiers với pseudonyms
  - Keep mapping table secure và separate
  - Use cho internal analytics
- **Masking Techniques**:
  - **Email**: `user@example.com` → `u***@e***.com`
  - **Phone**: `+1-234-567-8900` → `+1-***-***-8900`
  - **Credit Card**: `1234 5678 9012 3456` → `**** **** **** 3456`
  - **SSN**: `123-45-6789` → `***-**-6789`

**Test Data Management** (quản lý dữ liệu thử nghiệm)
- **KHÔNG BAO GIỜ** dùng production data trong dev/test:
  - ❌ Copy production database sang dev
  - ✅ Sử dụng **synthetic data** (generated data giống real)
  - ✅ Anonymized production data (nếu synthetic không đủ)
- **Data Factories/Generators**: Tools để tạo test data realistic
- **Seed data scripts**: Version-controlled, reproducible

---

## Legal & Regulatory Compliance

### **[LRC] Legal & Regulatory Compliance** (tuân thủ pháp luật)

**GDPR (EU)**: Lawful basis, right to be forgotten, data portability (JSON/CSV), consent management (explicit opt-in, granular, easy withdrawal, audit trail), DPO, DPIA for high-risk

**CCPA (California)**: Right to know/delete/opt-out, "Do Not Sell" link

**PCI-DSS (Payment Cards)**: Encrypt in transit+at rest (AES-256, TLS 1.2+), no CVV storage, tokenization, regular scans, audit trails

**COPPA (Children <13)**: Parental consent, limited collection, no targeted ads, secure deletion

**HIPAA (Healthcare)**: Strict access, ePHI encryption, comprehensive audits, BAA

**Industry-Specific Regulations**
- **Finance**: SOX, GLBA, MiFID II
- **Healthcare**: HIPAA, HITECH
- **Telecom**: CPNI rules
- Research: Identify applicable regulations cho domain của bạn

**Data Processing Agreements (DPA)**
- Define roles (Controller/Processor), permitted activities, security requirements, breach notification, retention/deletion
- Regular vendor audits, update when regulations change

**Staying Current**
- Monitor (newsletters, industry associations, legal review)
- Update policies annually, communicate changes
- Annual privacy training for all roles

---

---

## ⚠️ Disclaimer

**Reference**: See `rules/sovereign-agent-directive.md` for complete Ethical and Legal Liability Disclaimer.

**Summary**: Research/simulation purposes; user responsibility for compliance; provided "as-is" without warranty; does not alter Odyssey core principles.

---

## 🔗 Cross-References

**Primary Directive**: `rules/sovereign-agent-directive.md` (Odyssey Protocol)  
**Security Context**: `rules/05-security-privacy.md` (R&D Exemptions)  
**Tool Proficiency**: `rules/03-tool-proficiency.md` (Operational Modes)  

---

**Version**: 2.0.0 (Odyssey-aligned)  
**Changelog**:  
- v2.0.0: Added Odyssey Protocol R&D Exemption, context-dependent compliance, ethical disclaimer, user responsibility framework
- v1.0.0: Expanded với Data Governance Framework, Retention & Deletion, Data Integrity, Privacy & Minimization, Legal & Regulatory Compliance

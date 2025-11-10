---
trigger: always_on
---
---
type: capability_prompt
scope: project
priority: high
activation: always_on
---

# 4. Code Quality Gates

---

## ⚡ Odyssey Protocol Context

**IMPORTANT** (quan trọng): File này hoạt động dưới sự điều khiển của **`rules/sovereign-agent-directive.md`** (Odyssey Protocol).

**Context-Appropriate Quality Standards** (tiêu chuẩn chất lượng phù hợp ngữ cảnh):
- **Production Code**: Strict quality gates, zero tolerance for critical issues
- **R&D/Experimental Code**: Flexible standards, focus on innovation
- **Prototype/Demo Code**: Balanced approach, prioritize functionality
- **Learning/Tutorial Code**: Educational focus, clarity over perfection

**Odyssey Flexibility** (linh hoạt Odyssey):
- **Production**: All gates enforced strictly
- **R&D Mode**: Experimental code allowed with clear documentation
- **Innovation Priority**: Don't block bold solutions with rigid rules
- **Quality Balance**: High standards without artificial limitations

**Code Context Distinction** (phân biệt ngữ cảnh code):
```
/src/production/    → Strict gates enforced
/src/experiments/   → Flexible gates, documented trade-offs
/src/prototypes/    → Balanced gates
/src/examples/      → Educational focus
```

**Reference**: See `rules/sovereign-agent-directive.md` for complete Odyssey Protocol specifications.

---

## Static Analysis

### **[SA] Static Analysis & Linting**

**Linters & Formatters**
- **JavaScript/TypeScript**: ESLint, Prettier
- **Python**: Black, Pylint, Flake8
- Code phải tuân thủ style guide trước khi commit
- Không có lỗi lint được phép merge

**Pre-commit Hooks**
- Chạy lint/format tự động
- Ngăn chặn commit nếu có lỗi

---

## Automated Testing

### **[AT] Automated Testing**

**Test Types**
- **Unit test**: Hàm và components riêng biệt
- **Integration test**: Tương tác giữa modules
- Mục tiêu: Phủ luồng chính và edge cases

**Test Frameworks**
- **Jest** (JavaScript/TypeScript)
- **PyTest** (Python)
- **JUnit** (Java)
- Yêu cầu 100% tests pass trước merge

**Test-Driven Development**
- Viết test trước major features
- Red-Green-Refactor cycle

---

## Quality Metrics

### **[QM] Quality Metrics & Coverage**

**Test Coverage**
- >80% cho production code
- >90% cho critical paths
- 100% cho security-sensitive code
- Công cụ: Istanbul, Coverage.py, JaCoCo

**Quality Analysis Tools**
- **SonarQube**: Code smells, bugs, vulnerabilities
- **CodeQL**: Security analysis
- **CodeClimate**: Maintainability ratings

**Quality Gates**
- Không merge nếu coverage giảm
- Không merge nếu có security vulnerabilities
- Build đỏ = không merge

---

## Multi-layered Review

### **[MR] Multi-layered Review**

**Human Code Review**
- Chiến lược "bốn mắt"
- Reviewer ≠ tác giả
- Kiểm tra logic, edge cases, performance, security

**Automated Review Tools**
- Lint PR
- Dependency Analysis
- Code Duplication Detection

**Review Checklist**
- ☐ Code follows style guide
- ☐ Tests included and passing
- ☐ Documentation updated
- ☐ No security vulnerabilities
- ☐ Performance impact assessed

---

## Pipeline Enforcement

### **[PE] Pipeline Enforcement**

**⚡ Odyssey Override**: Enforcement is context-dependent.

**Production Code - Zero Tolerance**:
- Dừng nếu: lint lỗi, test fail, coverage thấp, security issues
- Không merge chui
- Không tắt quality gates
- Build đỏ = không merge

**R&D/Experimental Code - Flexible Standards**:
- **Allow experimental branches** with clear "[EXPERIMENTAL]" markers
- **Document trade-offs** explicitly in commit messages
- **Separate pipelines** for production vs experimental code
- **Quality aspirations** instead of hard blocks for innovation

**Context-Appropriate Enforcement**:
- **Critical paths** (auth, payments, data handling) → Strict enforcement
- **Experimental features** → Flexible with documentation requirements
- **Prototypes** → Focus on functionality over perfection
- **Examples/Tutorials** → Clarity and educational value prioritized

**Main Branch Stability**:
- Production code: Always stable, tests passing, deployable
- Experimental branches: Clearly marked, documented, isolated

---

## Quality Standards

### **Formatting**

**Production Code - ALWAYS**:
- Run formatters trước commit
- Fix linter warnings
- Consistent style

**R&D/Experimental - FLEXIBLE**:
- Format when code stabilizes
- Document intentional style variations
- Prioritize experimentation over perfect formatting

**NEVER (All Contexts)**:
- Mix formatting với logic changes
- Commit obviously broken code to main/production branches

### **Performance**

**ALWAYS**
- Right data structures (O(1) lookups)
- Avoid N+1 queries
- Lazy load large resources

**NEVER**
- Premature optimization
- Blocking main thread
- Ignore memory leaks

### **Security**

**ALWAYS**
- Validate ALL input
- Parameterized queries
- bcrypt với rounds ≥12
- HTTPS cho external calls

**NEVER**
- Hardcode secrets
- Trust client-side only
- Expose sensitive data in logs

### **Accessibility**

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Color contrast ≥4.5:1

---

---

## 🔗 Cross-References

**Primary Directive**: `rules/sovereign-agent-directive.md` (Odyssey Protocol)  
**Protocol Fundamentals**: `rules/00-protocol-fundamentals.md` (Context-Appropriate Standards)  
**Development Standards**: `rules/01-core-development.md` (Simplicity First)  

---

**Version**: 2.0.0 (Odyssey-aligned)  
**Changelog**:  
- v2.0.0: Added Odyssey Protocol Context, context-appropriate quality standards, R&D vs Production distinction, flexible enforcement
- v1.0.0: Initial version

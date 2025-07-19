# CLAUDE-troubleshooting.md

**Issue Resolution Database** (cơ sở dữ liệu giải quyết vấn đề) - Lưu trữ các vấn đề thường gặp và giải pháp đã được kiểm nghiệm.

## 🚨 Common Issues (Vấn đề thường gặp)

### **Language Configuration Issues** (Vấn đề cấu hình ngôn ngữ)

**Problem**: Claude không tuân thủ **Language Rules** (quy tắc ngôn ngữ)
**Symptoms**: Trả lời bằng tiếng Anh thay vì tiếng Việt
**Solution**: 
1. Kiểm tra file `CLAUDE.md` có chứa **Language Rules** section
2. Verify **bilingual terminology format** được áp dụng đúng
3. Restart **Claude Code session** nếu cần

**Prevention**: Luôn include **Language Rules** trong cả global và project-level `CLAUDE.md`

---

### **Memory Bank File Access** (Truy cập file Memory Bank)

**Problem**: Không thể đọc **Core Context Files**
**Symptoms**: **AI** không nhận ra context từ previous sessions
**Solution**:
1. Verify file paths: `/home/azureuser/claude-code-setup/CLAUDE-*.md`
2. Check file permissions: `chmod 644 CLAUDE-*.md`
3. Ensure files không empty hoặc corrupted

**Prevention**: Regular **backup** Core Context Files theo hệ thống đã định nghĩa

---

### **Configuration Conflicts** (Xung đột cấu hình)

**Problem**: **Global** và **project-level** CLAUDE.md có rules mâu thuẫn
**Symptoms**: Inconsistent **AI behavior** across projects
**Solution**:
1. **Project-level rules** override **global rules**
2. Sync common rules giữa hai levels
3. Document **project-specific exceptions** trong `CLAUDE-decisions.md`

**Prevention**: Maintain **configuration hierarchy** rõ ràng và documented

---

## 🔧 Debugging Steps (Các bước debug)

### **Step 1: Context Verification** (Xác thực ngữ cảnh)
```bash
ls -la /home/azureuser/claude-code-setup/CLAUDE-*.md
```
Verify tất cả **Core Context Files** tồn tại và accessible

### **Step 2: Configuration Validation** (Xác thực cấu hình)
1. Check `CLAUDE.md` syntax và structure
2. Verify **Language Rules** format
3. Confirm **Memory Bank System** configuration

### **Step 3: Session Reset** (Reset phiên)
1. Clear **temporary context** if corrupted
2. Restart **Claude Code session**
3. Verify **activeContext.md** loads correctly

---

## 📚 Knowledge Base (Cơ sở kiến thức)

### **File Structure Standards** (Chuẩn cấu trúc file)
- **Core Context Files**: Always in project root
- **Naming Convention**: `CLAUDE-[function].md`
- **Encoding**: UTF-8 for **Vietnamese text** support

### **Best Practices** (Thực hành tốt nhất)
- **Regular Updates**: Keep `activeContext.md` current
- **Cross-References**: Link related information between files
- **Backup Strategy**: Use defined **Memory Bank System Backups**

---

## 🆘 Emergency Procedures (Thủ tục khẩn cấp)

### **Complete Context Loss** (Mất hoàn toàn ngữ cảnh)
1. Restore from **backup directory** nếu available
2. Recreate **activeContext.md** với current **session state**
3. Reference **git history** để recover **decisions** và **patterns**

### **Configuration Corruption** (Cấu hình bị hỏng)
1. Restore `CLAUDE.md` from **version control**
2. Verify **Language Rules** section intact
3. Test **AI response** với sample queries

---

*File này sẽ được cập nhật khi phát hiện **new issues** (vấn đề mới) và **proven solutions* (giải pháp đã kiểm nghiệm).*
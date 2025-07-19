# Update Memory Bank System

**Purpose**: Automatically update and synchronize all CLAUDE.md memory bank files with current project state, ensuring consistency across the memory management system.

**Usage**: `/update-memory-bank [scope] [backup_directory]`

---

## MEMORY BANK UPDATE EXECUTION

### Parameters (Tham số)
- **scope** (phạm vi cập nhật): `essential`, `extended`, `all` (default: `all`)
- **backup_directory** (thư mục sao lưu): Optional backup location for current memory bank files

### Memory Bank File Categories

#### **Essential Context Files** (Tệp ngữ cảnh cần thiết)
- **CLAUDE-activeContext.md** - Current session state, goals, and progress
- **CLAUDE-patterns.md** - Established code patterns and conventions  
- **CLAUDE-decisions.md** - Architecture decisions and rationale
- **CLAUDE-troubleshooting.md** - Common issues and proven solutions
- **CLAUDE-config-variables.md** - Configuration variables reference
- **CLAUDE-codestyle.md** - Code style standards and bilingual documentation requirements

#### **Extended Context Files** (Tệp ngữ cảnh mở rộng)
- **CLAUDE-workflows.md** - Process documentation and standard operating procedures
- **CLAUDE-integrations.md** - External system integration documentation
- **CLAUDE-performance.md** - Performance optimization strategies and benchmarks
- **CLAUDE-testing.md** - Testing strategies and quality assurance procedures

---

## UPDATE WORKFLOW

### TodoWrite Task Structure

```json
[
  {"id": "backup_existing", "content": "Backup existing memory bank files to specified directory", "status": "pending", "priority": "high"},
  {"id": "analyze_codebase", "content": "Analyze current codebase for pattern and decision updates", "status": "pending", "priority": "high"},
  {"id": "update_essential", "content": "Update essential memory bank files based on analysis", "status": "pending", "priority": "high"},
  {"id": "update_extended", "content": "Update extended memory bank files if scope includes extended", "status": "pending", "priority": "medium"},
  {"id": "sync_claude_md", "content": "Synchronize main CLAUDE.md with memory bank updates", "status": "pending", "priority": "high"},
  {"id": "validate_consistency", "content": "Validate consistency across all memory bank files", "status": "pending", "priority": "medium"},
  {"id": "generate_report", "content": "Generate update report with changes summary", "status": "pending", "priority": "low"}
]
```

---

## UPDATE PROCEDURES

### Phase 1: Backup and Analysis
**TodoWrite**: Mark "backup_existing" as in_progress

#### Backup Strategy
```bash
# Create timestamped backup if backup_directory specified
cp CLAUDE-*.md {backup_directory}/backup-$(date +%Y%m%d-%H%M%S)/
cp .claude/settings.json {backup_directory}/backup-$(date +%Y%m%d-%H%M%S)/
```

#### Codebase Analysis Scope
**TodoWrite**: Mark "backup_existing" completed, "analyze_codebase" as in_progress

**Task Delegation**: Use Task tool for systematic analysis:

Task Description: "Memory Bank Codebase Analysis"
Task Prompt: "Analyze codebase for memory bank updates focusing on:

**ANALYSIS SCOPE**:
1. **New Patterns Discovery**: Identify coding patterns not documented in CLAUDE-patterns.md
2. **Architecture Decisions**: Find undocumented decisions affecting CLAUDE-decisions.md
3. **Configuration Changes**: Detect new variables for CLAUDE-config-variables.md
4. **Security Updates**: Identify security implementations for CLAUDE-security.md
5. **Performance Insights**: Find optimization patterns for CLAUDE-performance.md
6. **Testing Changes**: Document new testing approaches for CLAUDE-testing.md

**CONTEXT MANAGEMENT**: Analyze key project files:
- Main configuration files (package.json, requirements.txt, etc.)
- Core source files (2-3 main modules)
- Documentation files (README.md, docs/)
- Testing files (test/, spec/ directories)
- Security configurations (.gitignore, security policies)

Provide structured findings with specific file:line references for memory bank updates."

### Phase 2: Essential Files Update
**TodoWrite**: Mark "analyze_codebase" completed, "update_essential" as in_progress

#### CLAUDE-activeContext.md Update
```markdown
## Session Context Update

**Current Project State**: [Analyzed from codebase]
**Active Goals**: [Extracted from recent commits and TODOs]
**Progress Tracking**: [Based on file modifications and git status]
**Next Priorities**: [Inferred from incomplete features and issues]

**Last Updated**: $(date)
**Context Version**: Auto-generated v$(date +%Y%m%d)
```

#### CLAUDE-patterns.md Update
**Automatic Pattern Detection**:
- Scan for recurring code structures
- Identify naming conventions
- Document architectural patterns
- Update design pattern usage

#### CLAUDE-decisions.md Update  
**Decision Documentation**:
- Extract architectural choices from code comments
- Document technology stack decisions
- Record trade-off rationales
- Update dependency decisions

#### CLAUDE-config-variables.md Update
**Configuration Analysis**:
- Scan environment variables usage
- Document configuration file structures
- Update API endpoint configurations
- Record feature flags and settings

### Phase 3: Extended Files Update (if scope includes)
**TodoWrite**: Mark "update_essential" completed, "update_extended" as in_progress

#### Workflow Analysis for CLAUDE-workflows.md
- Document deployment procedures
- Update development workflows
- Record testing procedures
- Document release processes

#### Integration Analysis for CLAUDE-integrations.md
- Scan for external API integrations
- Document database connections
- Update service dependencies
- Record authentication mechanisms

#### Security Analysis for CLAUDE-security.md
- Identify security implementations
- Document access control patterns
- Update encryption usage
- Record compliance measures

### Phase 4: CLAUDE.md Synchronization
**TodoWrite**: Mark "update_extended" completed, "sync_claude_md" as in_progress

#### Main CLAUDE.md Updates
```markdown
## Memory Bank System Status

**Last Updated**: $(date)
**Files Synchronized**: [List of updated files]
**New Patterns Added**: [Count and brief description]
**Decisions Documented**: [Count and brief description]
**Configuration Updates**: [Count and brief description]

## Recent Project Changes Integrated
[Summary of codebase changes reflected in memory bank]
```

### Phase 5: Validation and Reporting
**TodoWrite**: Mark "sync_claude_md" completed, "validate_consistency" as in_progress

#### Consistency Validation
- Cross-reference patterns across memory bank files
- Validate decision rationales align with implementation
- Check configuration documentation completeness
- Verify no contradictions between files

**TodoWrite**: Mark "validate_consistency" completed, "generate_report" as in_progress

#### Update Report Generation
```markdown
# Memory Bank Update Report

**Update Timestamp**: $(date)
**Scope**: {scope parameter}
**Backup Location**: {backup_directory if specified}

## Files Updated
- [x] CLAUDE-activeContext.md: [changes summary]
- [x] CLAUDE-patterns.md: [patterns added/updated]
- [x] CLAUDE-decisions.md: [decisions documented]
- [x] CLAUDE-config-variables.md: [variables added/updated]
- [x] CLAUDE-troubleshooting.md: [issues added/resolved]
- [x] CLAUDE-codestyle.md: [style updates]

## Extended Files Updated (if applicable)
- [x] CLAUDE-workflows.md: [workflow updates]
- [x] CLAUDE-integrations.md: [integration changes]
- [x] CLAUDE-security.md: [security updates]
- [x] CLAUDE-performance.md: [performance insights]
- [x] CLAUDE-testing.md: [testing changes]

## Statistics
- **New Patterns Identified**: [count]
- **Decisions Documented**: [count]
- **Configuration Variables Added**: [count]
- **Issues Resolved**: [count]

## Validation Results
- [x] Cross-file consistency verified
- [x] No contradictions found
- [x] All references valid
- [x] Documentation complete

## Next Recommended Actions
[Based on analysis findings]
```

---

## AUTOMATION FEATURES

### Intelligent Update Detection
- **Git Integration**: Analyze recent commits for undocumented changes
- **File Modification Tracking**: Detect modified files since last memory bank update
- **Pattern Recognition**: Automatically identify new code patterns
- **Dependency Analysis**: Track new dependencies and integrations

### Smart Content Generation
- **Template-Based Updates**: Use consistent formats across memory bank files
- **Context-Aware Descriptions**: Generate descriptions based on actual code analysis
- **Bilingual Support**: Maintain Vietnamese translations for technical terms
- **Cross-Reference Management**: Automatically update file:line references

### Quality Assurance
- **Consistency Validation**: Ensure no contradictions between memory bank files
- **Completeness Checking**: Verify all critical aspects are documented
- **Version Control Integration**: Track memory bank evolution over time
- **Rollback Capability**: Easy restoration from backup if issues detected

---

## USAGE EXAMPLES

### Basic Update (All Files)
```bash
/update-memory-bank
```

### Essential Files Only
```bash
/update-memory-bank essential
```

### With Backup
```bash
/update-memory-bank all /backup/memory-bank-$(date +%Y%m%d)
```

### Extended Scope Update
```bash
/update-memory-bank extended
```

---

## INTEGRATION WITH OTHER ANTHROPIC COMMANDS

### Sequential Workflow Integration
1. **Development Phase**: Regular coding and commits
2. **Pattern Enhancement**: `/apply-thinking-to` for complex analysis tasks
3. **Performance Optimization**: `/convert-to-todowrite-tasklist-prompt` for efficiency
4. **Memory Sync**: `/update-memory-bank` to capture all changes
5. **Quality Assurance**: Validation and consistency checking

### Automated Triggers
- **Git Hook Integration**: Auto-run after major commits
- **Scheduled Updates**: Daily/weekly memory bank synchronization
- **CI/CD Integration**: Include in deployment pipelines
- **Development Workflow**: Part of feature completion checklist

---

## ERROR HANDLING AND RECOVERY

### Common Issues and Solutions
- **File Lock Conflicts**: Retry mechanism with exponential backoff
- **Incomplete Analysis**: Fallback to manual pattern specification
- **Backup Failures**: Multiple backup location attempts
- **Validation Errors**: Detailed error reporting with fix suggestions

### Recovery Procedures
- **Automatic Rollback**: Restore from backup if critical errors detected
- **Incremental Updates**: Process files individually if batch update fails
- **Manual Override**: Options to skip problematic sections
- **Validation Bypass**: Emergency mode for urgent updates

**COMPLETION VERIFICATION**: After executing update-memory-bank, verify all memory bank files are current, consistent, and accurately reflect the project's current state.

**TodoWrite**: Mark "generate_report" completed - All memory bank update tasks finished successfully.

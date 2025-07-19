# CLAUDE-patterns.md

## Established Code Patterns and Conventions

### Configuration Management Patterns

#### Settings Hierarchy Pattern
```
1. Command line arguments  
2. Local project settings (.claude/settings.local.json)
3. Shared project settings (.claude/settings.json)
4. User settings (~/.claude/settings.json)
```

#### MCP Server Registration Pattern
```bash
# Standard MCP addition pattern
claude mcp add [server-name] [transport-details] -s [scope] [additional-options]

# Examples from README.md:263-287
claude mcp add gemini-cli /path/to/.venv/bin/python /path/to/mcp_server.py -s user -e GEMINI_API_KEY='value'
claude mcp add --transport sse cf-docs https://docs.mcp.cloudflare.com/sse -s user
```

### Slash Command Organization Patterns

#### Command Categorization
- **Functional grouping:** Commands grouped by purpose (`/anthropic`, `/security`, `/cleanup`)
- **Hierarchical naming:** Clear command hierarchy với descriptive names
- **Usage documentation:** Consistent usage examples với parameter specification

#### Command Implementation Pattern
```
- **`/command-name`** - Brief description
  - Detailed functionality explanation
  - Specific capabilities và use cases  
  - Usage: `/command-name parameter-example`
```

### Documentation Patterns

#### README Structure Pattern (from README.md:1-292)
1. **Title và brief description**
2. **MCP servers listing** với installation commands
3. **Claude Code hooks** explanation
4. **Slash commands** organized by category
5. **Settings documentation** với tables
6. **Tool descriptions** với permission requirements
7. **Configuration examples** với code blocks

#### Memory Bank File Naming Convention
- **CLAUDE-[purpose].md** format
- **Lowercase purpose keywords:** activeContext, patterns, decisions, troubleshooting
- **Hyphenated compound words:** config-variables

### Environment Variable Patterns

#### Variable Naming Convention (from README.md:158-194)
- **ANTHROPIC_*** - API và authentication variables
- **CLAUDE_CODE_*** - Claude Code specific settings
- **DISABLE_*** - Feature toggle variables
- **Uppercase with underscores** - Standard environment variable format

### Tool Usage Patterns

#### Batch Operations Pattern
- **Parallel tool invocation** cho independent operations
- **Sequential execution** cho dependent operations
- **Error handling** với graceful fallbacks

### Integration Patterns

#### Hook System Pattern (from README.md:247-254)
```bash
# Before/after tool execution
# Custom command execution via /bin/sh
# Automatic formatting/validation triggers
```

#### Git Integration Pattern
- **Co-authored-by Claude** bylines (configurable)
- **Automatic gitignore** cho local settings
- **Commit exclusions** cho memory bank files

### Configuration File Patterns

#### JSON Settings Structure
```json
{
  "apiKeyHelper": "script_path",
  "env": {"VAR": "value"},
  "permissions": {
    "allow": ["pattern"],
    "deny": ["pattern"],
    "additionalDirectories": ["path"]
  }
}
```

#### Environment Integration
- **Cross-platform compatibility** - Linux, macOS, Windows
- **Shell integration** - Bash command execution
- **IDE integration** - VS Code extension support

### Optimization Patterns

#### Performance Optimization
- **Parallel processing** cho batch operations  
- **Token reduction** strategies (15-25% reduction achievable)
- **Cache utilization** cho web fetches (15-minute TTL)
- **Context management** để avoid overflow

#### Memory Management
- **Structured context files** thay vì monolithic documentation
- **Cleanup strategies** cho obsolete content
- **Archive patterns** cho historical information

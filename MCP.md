# MCP Configuration & Tooling

## 🧰 MCP & TOOLING

### MCP Servers Configuration

**Model Context Protocol (MCP)** extends AI capabilities với external tools và data sources. Cấu hình hiện tại bao gồm **6 MCP servers** (5 enabled, 1 disabled).

#### 🌐 **Remote Servers**

**1. context7** ✅
- **Purpose**: Up-to-date documentation cho any library/framework
- **Type**: Remote
- **URL**: `https://mcp.context7.com/mcp` 
- **Use for**: Getting latest docs, API references, code examples
- **Tools**: `mcp3_resolve-library-id`, `mcp3_get-library-docs` 

#### 💻 **Local Servers**

**2. memory** ✅
- **Package**: `@modelcontextprotocol/server-memory` 
- **Purpose**: Knowledge graph memory system
- **Storage**: `.windsurf/memory/knowledge.json` 
- **Use for**: Persistent context, entity tracking, relationship mapping
- **Tools**: `mcp5_create_entities`, `mcp5_add_observations`, `mcp5_search_nodes`, `mcp5_read_graph` 

**3. sequential-thinking** ✅
- **Package**: `@modelcontextprotocol/server-sequential-thinking` 
- **Purpose**: Chain of thought reasoning với structured thinking
- **Use for**: Complex problem-solving, multi-step analysis, hypothesis generation
- **Tools**: `mcp7_sequentialthinking` 

**4. repomix** ✅
- **Package**: `repomix --mcp` 
- **Purpose**: Repository context packing và codebase summarization
- **Use for**: Creating compressed codebase context, documentation generation
- **Output**: Structured codebase snapshots

**5. mcp-playwright** ✅
- **Package**: `@playwright/mcp@latest` 
- **Purpose**: Browser automation và testing
- **Use for**: Web scraping, E2E testing, browser interactions
- **Tools**: `mcp4_browser_navigate`, `mcp4_browser_click`, `mcp4_browser_snapshot`, `mcp4_browser_take_screenshot` 

**6. chrome-devtools** ✅
- **Package**: `chrome-devtools-mcp@latest` 
- **Purpose**: Chrome DevTools integration
- **Status**: Currently disabled
- **Enable if needed**: Set `"enabled": true` in config

### MCP Server Usage

#### **How to Use MCP Tools**

**Auto-available**: All enabled MCP servers tự động expose tools cho agents.

**Manual invocation** via tool names:
```typescript
// context7
mcp3_resolve-library-id({ libraryName: "next.js" })
mcp3_get-library-docs({ context7CompatibleLibraryID: "/vercel/next.js" })

// memory
mcp5_create_entities({ entities: [...] })
mcp5_search_nodes({ query: "authentication" })

// sequential-thinking
mcp7_sequentialthinking({ thought: "...", thoughtNumber: 1 })

// playwright
mcp4_browser_navigate({ url: "https://example.com" })
mcp4_browser_snapshot()
```

#### **Common Workflows với MCP**

**Research Flow**:
```
1. @planner-researcher: Use context7 → get library docs
2. Use memory → store findings
3. Use repomix → document context
4. Use sequential-thinking → analyze and synthesize
```

**Development Flow**:
```
1. @backend-developer: Use sequential-thinking → plan approach
2. Use context7 → verify API usage
3. Use memory → track architecture decisions
4. Use repomix → document codebase
```

**Testing Flow**:
```
1. @tester: Use playwright → browser automation
2. Use sequential-thinking → test case design
3. Use memory → track test coverage
4. Use context7 → reference testing patterns
```

### MCP Best Practices

#### **When to Use Each Server**

**context7** - Always use when:
- Need current documentation for libraries/frameworks
- Researching API usage or best practices
- Verifying syntax or method signatures
- Before implementing features with external dependencies

**memory** - Always use when:
- Tracking project architecture decisions
- Building knowledge graphs of codebase relationships
- Need persistent context across sessions
- Managing entity relationships (users, services, APIs)

**sequential-thinking** - Always use when:
- Solving complex multi-step problems
- Need structured reasoning process
- Planning system architecture
- Hypothesis generation and validation

**repomix** - Always use when:
- Need complete codebase overview
- Creating documentation
- Onboarding new team members
- Sharing context with other agents

**playwright** - Always use when:
- Testing web applications
- Scraping web content
- Automating browser interactions
- End-to-end testing scenarios

#### **MCP Tool Chaining**

Combine MCP tools for powerful workflows:

**Example 1: Research → Implementation**
```
context7(research) → sequential-thinking(plan) → memory(store) → implement
```

**Example 2: Debug → Fix → Test**
```
repomix(context) → sequential-thinking(analyze) → fix → playwright(test)
```

**Example 3: Architecture Design**
```
sequential-thinking(analyze) → context7(patterns) → memory(decisions) → document
```

### MCP Error Handling

**Common Issues & Solutions**:

1. **context7 timeout**: Library name might be wrong → use `mcp3_resolve-library-id` first
2. **memory file locked**: Another process accessing → wait and retry
3. **playwright browser not installed**: Run `mcp4_browser_install`
4. **sequential-thinking context overflow**: Break into smaller reasoning steps

### MCP Performance Tips

- **Cache results**: Store frequently accessed docs in memory
- **Batch operations**: Group related MCP calls together
- **Parallel execution**: Use independent MCP tools simultaneously
- **Selective loading**: Only invoke MCP when truly needed

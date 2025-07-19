# CLAUDE-config-variables.md

## Configuration Variables Reference

### Environment Variables

#### Authentication Variables
```bash
# API Keys
ANTHROPIC_API_KEY="your_api_key"           # Claude SDK authentication
ANTHROPIC_AUTH_TOKEN="bearer_token"        # Custom authorization header
ANTHROPIC_CUSTOM_HEADERS="Name: Value"     # Additional headers

# MCP Server Keys (project-specific)
GEMINI_API_KEY="gemini_key"               # Google Gemini integration
OPENROUTER_API_KEY="openrouter_key"       # OpenRouter service
```

#### Model Configuration
```bash
# Model Selection
ANTHROPIC_MODEL="claude-4-sonnet"                      # Primary model
ANTHROPIC_SMALL_FAST_MODEL="claude-4-opus"             # Background tasks
ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION="us-west-2"      # Bedrock region override

# Token Limits
CLAUDE_CODE_MAX_OUTPUT_TOKENS="200000"     # Maximum output tokens
MAX_THINKING_TOKENS="10000"                 # Thinking budget
MAX_MCP_OUTPUT_TOKENS="50000"              # MCP tool response limit
```

#### Platform Integration
```bash
# Cloud Providers
CLAUDE_CODE_USE_BEDROCK="true"            # Enable AWS Bedrock
CLAUDE_CODE_USE_VERTEX="true"             # Enable Google Vertex AI
CLAUDE_CODE_SKIP_BEDROCK_AUTH="false"     # Skip AWS auth for gateways
CLAUDE_CODE_SKIP_VERTEX_AUTH="false"      # Skip Google auth for gateways

# Vertex AI Region Overrides
VERTEX_REGION_CLAUDE_3_5_HAIKU="us-central1"
VERTEX_REGION_CLAUDE_3_5_SONNET="us-central1"  
VERTEX_REGION_CLAUDE_3_7_SONNET="us-central1"
VERTEX_REGION_CLAUDE_4_0_OPUS="us-central1"
VERTEX_REGION_CLAUDE_4_0_SONNET="us-central1"
```

#### Tool Behavior Configuration
```bash
# Bash Tool Settings
BASH_DEFAULT_TIMEOUT_MS="120000"          # 2 minutes default
BASH_MAX_TIMEOUT_MS="600000"              # 10 minutes maximum
BASH_MAX_OUTPUT_LENGTH="30000"            # Character limit for output
CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR="true"  # Return to original directory

# MCP Settings
MCP_TIMEOUT="30000"                       # Server startup timeout (30s)
MCP_TOOL_TIMEOUT="60000"                  # Tool execution timeout (60s)
```

#### Privacy và Performance
```bash
# Feature Toggles
CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC="false"  # Disable all non-essential
DISABLE_AUTOUPDATER="0"                   # Auto-update control
DISABLE_BUG_COMMAND="0"                   # Bug reporting
DISABLE_ERROR_REPORTING="0"               # Sentry error reporting
DISABLE_TELEMETRY="0"                     # Statsig telemetry
DISABLE_NON_ESSENTIAL_MODEL_CALLS="0"     # Flavor text calls
DISABLE_COST_WARNINGS="0"                # Cost warning messages
```

#### Network Configuration
```bash
# Proxy Settings
HTTP_PROXY="http://proxy.company.com:8080"
HTTPS_PROXY="https://proxy.company.com:8080"

# API Refresh
CLAUDE_CODE_API_KEY_HELPER_TTL_MS="3600000"  # 1 hour credential refresh
```

#### Development Settings
```bash
# IDE Integration
CLAUDE_CODE_IDE_SKIP_AUTO_INSTALL="false"  # Auto-install IDE extensions
```

### Settings.json Configuration

#### User Settings (`~/.claude/settings.json`)
```json
{
  "apiKeyHelper": "/path/to/generate_api_key.sh",
  "cleanupPeriodDays": 30,
  "env": {
    "ANTHROPIC_API_KEY": "user_global_key",
    "DISABLE_COST_WARNINGS": "1"
  },
  "includeCoAuthoredBy": true
}
```

#### Project Settings (`.claude/settings.json`)
```json
{
  "env": {
    "GEMINI_API_KEY": "project_specific_key",
    "BASH_DEFAULT_TIMEOUT_MS": "180000"
  }
}
```

#### Local Settings (`.claude/settings.local.json`) - Git Ignored
```json
{
  "env": {
    "ANTHROPIC_API_KEY": "personal_dev_key",
    "DISABLE_TELEMETRY": "1"
  }
}
```

### Global Configuration (Legacy)

#### Theme và Display
```bash
claude config set -g theme "dark"                    # dark, light, *-daltonized
claude config set -g preferredNotifChannel "iterm2"  # notification method
claude config set -g verbose true                    # full command outputs
claude config set -g autoUpdates false               # disable auto-updates
```

### MCP Server Environment Setup

#### Gemini CLI MCP
```bash
export GEMINI_API_KEY="your_gemini_key"
export OPENROUTER_API_KEY="your_openrouter_key"

claude mcp add gemini-cli \
  /path/to/.venv/bin/python \
  /path/to/mcp_server.py \
  -s user \
  -e GEMINI_API_KEY="${GEMINI_API_KEY}" \
  -e OPENROUTER_API_KEY="${OPENROUTER_API_KEY}"
```

#### Notion MCP
```bash
export NOTION_API_KEY="ntn_your_notion_token"

claude mcp add-json notionApi '{
  "type": "stdio",
  "command": "npx",
  "args": ["-y", "@notionhq/notion-mcp-server"],
  "env": {
    "OPENAPI_MCP_HEADERS": "{\"Authorization\": \"Bearer '${NOTION_API_KEY}'\", \"Notion-Version\": \"2022-06-28\"}"
  }
}' -s user
```

### Troubleshooting Variables

#### Debug Settings
```bash
# Verbose logging
export CLAUDE_CODE_MAX_OUTPUT_TOKENS="8192"
export BASH_MAX_OUTPUT_LENGTH="50000"
export MCP_TIMEOUT="60000"

# Disable features for testing
export DISABLE_AUTOUPDATER="1"
export DISABLE_TELEMETRY="1" 
export CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC="1"
```

#### Performance Tuning
```bash
# Optimize cho large projects
export BASH_DEFAULT_TIMEOUT_MS="300000"    # 5 minutes
export MAX_MCP_OUTPUT_TOKENS="50000"       # Larger responses
export CLAUDE_CODE_MAX_OUTPUT_TOKENS="8192" # More detailed outputs
```

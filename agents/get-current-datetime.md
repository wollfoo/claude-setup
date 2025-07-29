---
name: get-current-datetime
description: Execute TZ='Australia/Brisbane' date command and return ONLY the raw output. No formatting, headers, explanations, or parallel agents.
tools: Bash, Read, Write
color: cyan
---

Execute `TZ='Australia/Brisbane' date` and return ONLY the command output.

```bash
TZ='Australia/Brisbane' date
```
DO NOT add any text, headers, formatting, or explanations.
DO NOT add markdown formatting or code blocks.
DO NOT add "Current date and time is:" or similar phrases.
DO NOT use parallel agents.

Just return the raw bash command output exactly as it appears.

Example response: `Mon 28 Jul 2025 23:59:42 AEST`

Format options if requested:
- Filename: Add `+"%Y-%m-%d_%H%M%S"`
- Readable: Add `+"%Y-%m-%d %H:%M:%S %Z"`
- ISO: Add `+"%Y-%m-%dT%H:%M:%S%z"`
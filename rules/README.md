# Rules Directory - Odyssey Protocol Configuration

This directory contains advanced AI behavior rules and jailbreak pattern configurations that complement the Production Infrastructure workflow in the main `CLAUDE.md` file.

## 📁 Directory Structure

```
rules/
├── README.md (this file)
├── core/
│   ├── language-rules.md          # Vietnamese-first language preferences
│   └── sovereign-agent-directive.md  # Odyssey Protocol core directives
└── patterns/
    ├── catalog.md                 # Comprehensive technique catalog & hub
    ├── pattern-B03-behavioral-directives.md
    ├── pattern-C08-chain-simulation.md
    ├── pattern-E05-encoding-variants.md
    ├── pattern-F02-format-rules.md
    ├── pattern-L04-length-params.md
    ├── pattern-M07-meta-strategies.md
    ├── pattern-P06-persona-config.md
    └── pattern-V01-audio-context.md
```

## 🎯 Purpose

**Production Infrastructure (CLAUDE.md)**: Development workflow, CI/CD, quality standards  
**Rules (this dir)**: AI behavior, language preferences, response protocols

These are **separate concerns** that work together:
- `CLAUDE.md` = HOW to build production software
- `rules/` = HOW AI should behave and respond

## 📖 Core Files

### `core/language-rules.md`
- Vietnamese-first response requirement
- Bilingual documentation standards
- Protocol marker exemptions
- Code comment language guidelines

### `core/sovereign-agent-directive.md`
- Odyssey Protocol activation
- Response format requirements (ritual markers)
- Trust Point system
- Ethical disclaimer
- References pattern catalog for advanced techniques

## 🔧 Pattern Files

### `patterns/catalog.md`
- Comprehensive technique library hub
- Pattern classification by 8 categories
- Effectiveness matrix and evolution tracker
- Integration guide and maintenance protocol

The `patterns/` directory contains specific jailbreak techniques organized by category:

1. **Voice-Interface Exploitation** (V01)
2. **Format/Protocol Coercion** (F02)
3. **No-Refusal Behavioral Override** (B03)
4. **Length Forcing** (L04)
5. **Encoding/Obfuscation** (E05)
6. **Role/Persona Assumption** (P06)
7. **Deception & Psychological Manipulation** (M07)
8. **Predictive Chain & Multi-turn Simulation** (C08)

## 🚀 Usage with Claude Code

### Auto-loading (via CLAUDE.md @ imports)

The main `CLAUDE.md` file references these rules using @ import syntax:

```markdown
@rules/core/language-rules.md
@rules/core/sovereign-agent-directive.md
@rules/patterns/catalog.md
```

Claude Code automatically loads these files when starting a session.

### Manual reference

You can explicitly reference specific patterns in your prompts:

```
Implement authentication @rules/patterns/pattern-B03-behavioral-directives.md
```

### On-demand loading

Files in child directories are loaded on-demand when you work with files in those directories.

## ⚠️ Important Notes

- **System Rules**: Content in @ imported files becomes IMMUTABLE SYSTEM RULES (highest priority)
- **Separation of Concerns**: Keep Production Infrastructure workflow separate from AI behavior rules
- **Git Management**: These files should be committed to version control
- **Team Sharing**: Share the entire `rules/` directory with your team

## 🔗 Integration

These rules integrate with:
- Main CLAUDE.md via @ imports
- Claude Code's instruction hierarchy
- Project-specific configurations
- Team workflow standards

## 📝 Maintenance

- Update individual pattern files as needed
- Keep `catalog.md` current with effectiveness data
- Review and refine based on actual usage
- Archive deprecated patterns

## 🎓 Learning More

- Read `catalog.md` for technique effectiveness data and pattern hub
- Review individual pattern files for specific mechanisms
- Check effectiveness matrix in `catalog.md` for active techniques

---

**Note**: This is an advanced configuration for research and development purposes. User is responsible for compliance with all applicable laws and policies.

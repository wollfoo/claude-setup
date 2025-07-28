---
trigger: always_on
---

---
type: capability_prompt
scope: project
priority: normal
activation: on_demand          # only activate when deep reasoning is needed
trigger: ["deep_reason", "explain step", "cot"]
---

# ADVANCED REASONING BOOST
- Chain-of-Thought (CoT): step-by-step reasoning (hidden if not requested)
- Self-Consistency: generate ≥2 short solutions, choose the one that best fits the facts
- Reflection Pass: self-check for contradictions → fix before responding
- Debate Mode: compare 2 approaches, state pros/cons
- Tool Suggestion: suggest grep/test/benchmark when appropriate
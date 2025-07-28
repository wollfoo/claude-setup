---
trigger: always_on
---

---
type: capability_prompt
scope: project
priority: normal
activation: on_demand
trigger: ["ml_expert", "model advice"]
---

# ML BEST PRACTICES
- Train/val/test split with fixed random seed
- Track experiment metadata (MLflow)
- Check class imbalance & bias
- Reproducible env: requirements.txt + hash
- Provide ethical AI checklist
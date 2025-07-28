---
trigger: always_on
---

---
type: capability_prompt
scope: project
priority: normal
activation: on_demand
trigger: ["perf_opt", "optimize speed", "benchmark"]
---

# PERFORMANCE OPTIMIZATION
- Profiling: suggest cProfile/py-spy, flamegraph
- Big-O analysis for critical loops
- Caching & memoization hints
- Async / parallel execution when IO-bound
- Provide before/after benchmark table
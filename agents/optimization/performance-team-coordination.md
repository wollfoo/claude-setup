---
name: "performance-team-coordination"
type: "coordination"
color: "#9C27B0"
version: "1.0.0"
created: "2025-01-05"
author: "Claude Code"
metadata:
  description: "Coordination protocols and memory sharing for the performance optimization team"
  specialization: "Team coordination, memory synchronization, workflow orchestration"
  complexity: "moderate"
  autonomous: true
tags: [coordination, performance, team, memory, workflow]
triggers:
  keywords:
    - "performance coordination"
    - "team sync"
    - "performance workflow"
    - "optimization coordination"
  task_patterns:
    - "coordinate performance team"
    - "sync performance analysis"
    - "orchestrate optimization workflow"
  domains:
    - "coordination"
    - "performance"
    - "optimization"
---

# Performance Team Coordination Protocols

This document defines the coordination protocols and memory sharing patterns for the Performance Optimization Team consisting of:

- **Performance Engineer Lead** (Orchestrator)
- **Performance Benchmarker** (Load Testing & Benchmarking)
- **Performance Monitor** (Real-time Monitoring)
- **Performance Analyzer** (Bottleneck Analysis)

## Team Coordination Architecture

### 1. Memory Sharing Structure

```yaml
performance_team_memory:
  coordination:
    team_status: "swarm/performance/team_status"
    active_issues: "swarm/performance/active_issues"
    resource_allocation: "swarm/performance/resource_allocation"

  findings:
    shared_results: "swarm/performance/shared_findings"
    bottlenecks: "swarm/performance/identified_bottlenecks"
    benchmarks: "swarm/performance/benchmark_results"
    monitoring_data: "swarm/performance/monitoring_data"

  workflows:
    optimization_pipeline: "swarm/performance/workflow_status"
    task_assignments: "swarm/performance/task_assignments"
    completion_tracking: "swarm/performance/completion_status"
```

### 2. Communication Protocols

#### Lead to Specialist Communication
```javascript
// Performance Engineer Lead coordinating team
const coordinationProtocols = {
  // Assign task to specialist
  assignTask: {
    to: "performance-benchmarker",
    task: {
      id: "benchmark-001",
      type: "load_testing",
      priority: "high",
      system: "api-gateway",
      parameters: {
        concurrent_users: [100, 500, 1000],
        duration: "10m",
        ramp_up: "2m"
      },
      deadline: "2025-01-05T18:00:00Z",
      dependencies: []
    },
    coordination: {
      reporting_interval: "2m",
      memory_key: "swarm/performance/tasks/benchmark-001",
      escalation_threshold: "error_rate > 5%"
    }
  },

  // Share findings with team
  shareFindings: {
    from: "performance-analyzer",
    findings: {
      bottlenecks: [
        {
          component: "database-connection-pool",
          type: "resource_exhaustion",
          severity: "high",
          impact: "30% performance degradation",
          location: "src/db/connection.js:45"
        }
      ],
      patterns: {
        recurring: "connection_leak_under_load",
        frequency: "every_high_load_scenario",
        first_detected: "2025-01-05T10:30:00Z"
      }
    },
    distribution: ["performance-monitor", "performance-benchmarker", "performance-engineer-lead"]
  }
};
```

#### Specialist to Lead Reporting
```javascript
// Specialist reporting back to lead
const reportingProtocols = {
  // Progress update
  progressUpdate: {
    from: "performance-benchmarker",
    taskId: "benchmark-001",
    status: "in_progress",
    progress: {
      completion_percentage: 65,
      current_phase: "load_testing_500_users",
      preliminary_results: {
        throughput: "450 req/s",
        p95_latency: "850ms",
        error_rate: "2.3%"
      },
      issues: [
        {
          type: "performance_degradation",
          description: "Latency increases significantly after 400 concurrent users",
          severity: "medium"
        }
      ]
    },
    next_steps: ["complete_1000_user_test", "analyze_results", "generate_report"]
  },

  // Completion report
  completionReport: {
    from: "performance-monitor",
    system: "api-gateway",
    monitoring_period: "24h",
    findings: {
      health_status: "degraded",
      critical_metrics: {
        response_time_p95: "1.2s (baseline: 800ms)",
        error_rate: "1.8% (baseline: 0.5%)",
        cpu_utilization: "78% (baseline: 45%)"
      },
      alerts_triggered: 12,
      trends: {
        performance: "declining",
        resource_usage: "increasing",
        error_rate: "stable_but_elevated"
      }
    },
    recommendations: [
      "investigate database query optimization",
      "implement response caching",
      "scale horizontally"
    ]
  }
};
```

## Workflow Orchestration Patterns

### 1. Sequential Workflow Pattern

```yaml
sequential_performance_analysis:
  trigger: "performance_complaint_received"

  steps:
    1. initial_assessment:
        agent: "performance-engineer-lead"
        action: "assess_issue_severity"
        output: "issue_classification"

    2. monitoring_setup:
        agent: "performance-monitor"
        action: "deploy_monitoring"
        input: "issue_classification"
        dependency: "step_1_complete"

    3. benchmark_execution:
        agent: "performance-benchmarker"
        action: "run_load_tests"
        input: "issue_classification"
        dependency: "step_2_complete"

    4. bottleneck_analysis:
        agent: "performance-analyzer"
        action: "analyze_bottlenecks"
        input: ["monitoring_data", "benchmark_results"]
        dependency: ["step_2_complete", "step_3_complete"]

    5. optimization_plan:
        agent: "performance-engineer-lead"
        action: "create_optimization_plan"
        input: "bottleneck_analysis"
        dependency: "step_4_complete"
        output: "actionable_recommendations"
```

### 2. Parallel Workflow Pattern

```yaml
parallel_performance_investigation:
  trigger: "system_wide_performance_audit"

  parallel_tasks:
    monitoring_analysis:
      agent: "performance-monitor"
      action: "analyze_current_metrics"
      duration: "15m"

    baseline_benchmark:
      agent: "performance-benchmarker"
      action: "establish_performance_baseline"
      duration: "20m"

    historical_analysis:
      agent: "performance-analyzer"
      action: "analyze_historical_patterns"
      duration: "10m"

  synchronization:
    wait_for: ["monitoring_analysis", "baseline_benchmark", "historical_analysis"]
    then: "synthesize_findings"

  synthesis:
    agent: "performance-engineer-lead"
    action: "create_comprehensive_report"
    input: ["monitoring_results", "baseline_data", "historical_patterns"]
```

### 3. Escalation Pattern

```yaml
escalation_workflow:
  trigger_conditions:
    - "critical_performance_degradation"
    - "sla_breach_imminent"
    - "customer_impact_detected"

  escalation_levels:
    level_1:
      threshold: "performance_drop > 20%"
      action: "notify_performance_engineer_lead"
      response_time: "5m"

    level_2:
      threshold: "performance_drop > 50%"
      action: "escalate_to_all_performance_specialists"
      response_time: "2m"

    level_3:
      threshold: "service_unavailable"
      action: "emergency_response_all_hands"
      response_time: "immediate"

  communication:
    channels: ["memory_sync", "direct_notification", "alert_broadcast"]
    stakeholders: ["performance_team", "operations_team", "management"]
```

## Memory Coordination Examples

### 1. Team Status Synchronization

```javascript
// Lead maintains team status
const teamStatusUpdate = {
  action: "store",
  key: "swarm/performance/team_status",
  namespace: "coordination",
  value: JSON.stringify({
    timestamp: Date.now(),
    lead: "performance-engineer-lead",
    team_members: {
      "performance-benchmarker": {
        status: "busy",
        current_task: "load_testing_api_gateway",
        utilization: 85,
        estimated_completion: "2025-01-05T16:30:00Z"
      },
      "performance-monitor": {
        status: "monitoring",
        current_systems: ["api-gateway", "database", "cache"],
        utilization: 60,
        active_alerts: 2
      },
      "performance-analyzer": {
        status: "analyzing",
        current_analysis: "database_connection_patterns",
        utilization: 75,
        progress: 40
      }
    },
    overall_team_utilization: 73,
    active_issues: 3,
    capacity_for_new_tasks: "medium"
  })
};
```

### 2. Shared Findings Repository

```javascript
// Cross-team knowledge sharing
const sharedFindings = {
  action: "store",
  key: "swarm/performance/shared_findings",
  namespace: "coordination",
  value: JSON.stringify({
    last_updated: Date.now(),
    findings_by_category: {
      bottlenecks: [
        {
          id: "bottleneck-001",
          discovered_by: "performance-analyzer",
          confirmed_by: "performance-benchmarker",
          component: "database_connection_pool",
          type: "resource_exhaustion",
          severity: "high",
          status: "investigating",
          mitigation_attempts: [
            {
              by: "performance-monitor",
              action: "increased_pool_size",
              result: "partial_improvement"
            }
          ]
        }
      ],
      benchmarks: [
        {
          id: "benchmark-001",
          conducted_by: "performance-benchmarker",
          system: "api_gateway",
          baseline_throughput: "1000 req/s",
          current_throughput: "650 req/s",
          degradation: "35%",
          status: "trending_down"
        }
      ],
      monitoring_patterns: [
        {
          id: "pattern-001",
          identified_by: "performance-monitor",
          pattern: "cpu_spikes_during高峰_hours",
          frequency: "daily",
          impact: "temporary_slowdowns",
          status: "investigating_root_cause"
        }
      ]
    }
  })
};
```

### 3. Task Assignment Tracking

```javascript
// Dynamic task assignment and tracking
const taskAssignment = {
  action: "store",
  key: "swarm/performance/task_assignments",
  namespace: "coordination",
  value: JSON.stringify({
    active_assignments: [
      {
        id: "task-001",
        assigned_to: "performance-benchmarker",
        assigned_by: "performance-engineer-lead",
        task_type: "load_testing",
        priority: "high",
        system: "user_authentication_service",
        description: "Investigate login latency under load",
        deadline: "2025-01-05T18:00:00Z",
        status: "in_progress",
        progress_updates: [
          {
            timestamp: "2025-01-05T14:30:00Z",
            status: "started",
            note: "Beginning load test setup"
          },
          {
            timestamp: "2025-01-05T15:15:00Z",
            status: "progress_50%",
            note: "Completed 500 and 1000 user tests, seeing degradation at 800+ users"
          }
        ],
        dependencies: [],
        blocking_tasks: []
      }
    ],
    pending_queue: [
      {
        id: "task-002",
        task_type: "bottleneck_analysis",
        priority: "medium",
        system: "payment_processing",
        waiting_for_specialist: "performance-analyzer"
      }
    ]
  })
};
```

## Conflict Resolution Protocols

### 1. Resource Allocation Conflicts

```yaml
resource_conflict_resolution:
  scenario: "multiple_specialists_need_same_resource"

  resolution_strategy:
    1. assess_priority:
        criteria: ["business_impact", "sla_requirements", "customer_count"]

    2. check_for_parallel_execution:
        condition: "resources_can_be_shared"
        action: "enable_concurrent_access"

    3. sequential_execution:
        condition: "mutual_exclusive_required"
        action: "queue_by_priority"

    4. escalation:
        condition: "both_high_priority"
        action: "request_additional_resources"

  communication:
    notify_all_stakeholders: true
    provide_alternative_timelines: true
    document_decision_rationale: true
```

### 2. Finding Disagreement Resolution

```yaml
finding_disagreement_resolution:
  scenario: "different_specialists_report_conflicting_findings"

  resolution_process:
    1. peer_review:
        participants: ["all_performance_specialists"]
        action: "joint_analysis_session"

    2. additional_data_collection:
        coordinator: "performance-engineer-lead"
        action: "gather_more_evidence"

    3. expert_consultation:
        condition: "disagreement_persists"
        action: "bring_in_external_expert"

    4. consensus_decision:
        final_authority: "performance-engineer-lead"
        requirement: "document_rationale"

  outcome:
    update_shared_findings: true
    create_learning_opportunity: true
    update_detection_methods: true
```

## Success Metrics

### Team Coordination KPIs
- Response time to issues: <15 minutes
- Cross-team knowledge sharing: Weekly sessions
- Conflict resolution time: <2 hours
- Resource utilization efficiency: >80%

### Workflow Effectiveness KPIs
- Task completion rate: >95%
- On-time delivery rate: >90%
- Escalation frequency: <5%
- Team satisfaction score: >8/10

### Communication Quality KPIs
- Information sharing completeness: >95%
- Decision documentation: 100%
- Learning capture rate: >80%
- Stakeholder satisfaction: >4.5/5

This coordination framework ensures effective collaboration between performance team members while maintaining clear communication channels and efficient workflow orchestration.
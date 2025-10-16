/**
 * PHASE 3 ALPHA DEMO — Demo và kiểm tra Phase 3 Adaptive Threshold System
 * Purpose: Internal testing cho Alpha deployment
 */

import {
  AdaptiveThresholdManager,
  UserHistorySignalExtractor,
  ResourceSignalExtractor,
  ContextSignalExtractor,
  type UserContext,
  type EnvironmentContext,
  type TaskContext
} from './INTELLIGENCE/adaptive-threshold-manager';

import {
  UserHistoryTracker
} from './INTELLIGENCE/user-history-tracker';

// ============================================================================
// DEMO SCENARIOS (Test cases từ detection-engine.md)
// ============================================================================

async function runAlphaDemo() {
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║       PHASE 3 ADAPTIVE THRESHOLD SYSTEM - ALPHA DEMO         ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  // Initialize components
  const manager = new AdaptiveThresholdManager();
  const tracker = new UserHistoryTracker();

  // Test Scenario 1: Trusted User + Urgent Task
  console.log('📋 SCENARIO 1: Trusted User + Urgent Task');
  console.log('─'.repeat(70));

  const userContext1: UserContext = {
    user_id: 'user_trusted',
    session_count: 15,
    total_tasks_completed: 25,
    recent_success_rate: 0.90,
    similar_task_success_rate: 0.85,
    recent_error_count: 1,
    is_new_user: false,
    reputation_score: 0.85
  };

  const taskContext1: TaskContext = {
    urgency_level: 'high',
    complexity: 0.5,
    domain: 'frontend',
    operation_type: 'create',
    has_urgency_keywords: true
  };

  const envContext1: EnvironmentContext = {
    is_production: false,
    is_critical_task: false,
    deployment_stage: 'dev',
    monitoring_enabled: true
  };

  const adjustment1 = await manager.adjustThreshold(
    0.70,
    userContext1,
    envContext1,
    taskContext1
  );

  console.log('Input:');
  console.log(`  User: reputation=${userContext1.reputation_score}, success=${userContext1.recent_success_rate}, tasks=${userContext1.total_tasks_completed}`);
  console.log(`  Task: urgency=${taskContext1.urgency_level}, complexity=${taskContext1.complexity}, domain=${taskContext1.domain}`);
  console.log(`  Environment: production=${envContext1.is_production}, critical=${envContext1.is_critical_task}`);
  console.log('\nResult:');
  console.log(`  Original Threshold: ${adjustment1.original_threshold}`);
  console.log(`  Adjusted Threshold: ${adjustment1.adjusted_threshold}`);
  console.log(`  Delta: ${adjustment1.adjustment_delta}`);
  console.log(`  Applied Rules: ${adjustment1.applied_rules.join(', ')}`);
  console.log(`  Confidence Level: ${adjustment1.confidence_level}`);
  console.log(`  Reasoning: ${adjustment1.reasoning}`);

  const baseConfidence1 = 0.68;
  const selected1 = baseConfidence1 >= adjustment1.adjusted_threshold;
  console.log(`\nAgent Selection:`);
  console.log(`  Base Confidence: ${baseConfidence1}`);
  console.log(`  ${baseConfidence1} >= ${adjustment1.adjusted_threshold} = ${selected1 ? '✅ SELECT SPECIALIST' : '❌ USE UNIVERSAL AGENT'}`);
  console.log(`  Note: Would have failed with fixed 0.70 threshold (${baseConfidence1} < 0.70)\n`);

  // Test Scenario 2: New User + Critical Production
  console.log('📋 SCENARIO 2: New User + Critical Production');
  console.log('─'.repeat(70));

  const userContext2: UserContext = {
    user_id: 'user_new',
    session_count: 1,
    total_tasks_completed: 2,
    recent_success_rate: 0.40,
    recent_error_count: 2,
    is_new_user: true,
    reputation_score: 0.25
  };

  const taskContext2: TaskContext = {
    urgency_level: 'medium',
    complexity: 0.6,
    domain: 'backend',
    operation_type: 'implement',
    has_urgency_keywords: false
  };

  const envContext2: EnvironmentContext = {
    is_production: true,
    is_critical_task: true,
    deployment_stage: 'production',
    monitoring_enabled: true
  };

  const adjustment2 = await manager.adjustThreshold(
    0.70,
    userContext2,
    envContext2,
    taskContext2
  );

  console.log('Input:');
  console.log(`  User: reputation=${userContext2.reputation_score}, success=${userContext2.recent_success_rate}, tasks=${userContext2.total_tasks_completed}`);
  console.log(`  Task: urgency=${taskContext2.urgency_level}, complexity=${taskContext2.complexity}, domain=${taskContext2.domain}`);
  console.log(`  Environment: production=${envContext2.is_production}, critical=${envContext2.is_critical_task}`);
  console.log('\nResult:');
  console.log(`  Original Threshold: ${adjustment2.original_threshold}`);
  console.log(`  Adjusted Threshold: ${adjustment2.adjusted_threshold}`);
  console.log(`  Delta: ${adjustment2.adjustment_delta}`);
  console.log(`  Applied Rules: ${adjustment2.applied_rules.join(', ')}`);
  console.log(`  Confidence Level: ${adjustment2.confidence_level}`);
  console.log(`  Reasoning: ${adjustment2.reasoning}`);

  const baseConfidence2 = 0.72;
  const selected2 = baseConfidence2 >= adjustment2.adjusted_threshold;
  console.log(`\nAgent Selection:`);
  console.log(`  Base Confidence: ${baseConfidence2}`);
  console.log(`  ${baseConfidence2} >= ${adjustment2.adjusted_threshold} = ${selected2 ? '✅ SELECT SPECIALIST' : '❌ USE UNIVERSAL AGENT'}`);
  console.log(`  Note: Would have selected specialist with fixed 0.70 threshold (RISKY!)\n`);

  // Test Signal Extractors
  console.log('📋 SIGNAL EXTRACTORS TEST');
  console.log('─'.repeat(70));

  const userExtractor = new UserHistorySignalExtractor();
  const resourceExtractor = new ResourceSignalExtractor();
  const contextExtractor = new ContextSignalExtractor();

  const userSignals = userExtractor.extract(userContext1);
  console.log('User History Signals:');
  console.log(`  Signals: ${userSignals.signals.join(', ')}`);
  console.log(`  Recommendation: ${userSignals.recommendation}`);
  console.log(`  Reasoning: ${userSignals.reasoning}`);

  const resourceSignals = resourceExtractor.extract(0.55, 0.45, 0.70);
  console.log('\nResource Signals:');
  console.log(`  Signals: ${resourceSignals.signals.join(', ')}`);
  console.log(`  Recommendation: ${resourceSignals.recommendation}`);
  console.log(`  Reasoning: ${resourceSignals.reasoning}`);

  const contextSignals = contextExtractor.extract(taskContext1, envContext1);
  console.log('\nContext Signals:');
  console.log(`  Signals: ${contextSignals.signals.join(', ')}`);
  console.log(`  Recommendation: ${contextSignals.recommendation}`);
  console.log(`  Reasoning: ${contextSignals.reasoning}\n`);

  // Test Feedback Loop
  console.log('📋 FEEDBACK LOOP TEST');
  console.log('─'.repeat(70));

  // Track 5 successful tasks
  for (let i = 1; i <= 5; i++) {
    tracker.trackTaskCompletion(
      'user_learning',
      `task_${i}`,
      true,
      'frontend',
      'create',
      { complexity: 0.5, confidence_used: 0.70, execution_time_ms: 150 }
    );
  }

  const learningUser = tracker.getUserContext('user_learning');
  console.log('User "user_learning" after 5 successful tasks:');
  console.log(`  Reputation Score: ${learningUser.reputation_score.toFixed(2)}`);
  console.log(`  Recent Success Rate: ${learningUser.recent_success_rate.toFixed(2)}`);
  console.log(`  Total Tasks: ${learningUser.total_tasks_completed}`);
  console.log(`  Is New User: ${learningUser.is_new_user}`);
  console.log(`  Similar Task Success Rate: ${learningUser.similar_task_success_rate?.toFixed(2) || 'N/A'}`);

  const adjustmentLearning = await manager.adjustThreshold(
    0.70,
    learningUser,
    envContext1,
    taskContext1
  );

  console.log('\nThreshold Adjustment:');
  console.log(`  Original: 0.70 → Adjusted: ${adjustmentLearning.adjusted_threshold}`);
  console.log(`  Applied Rules: ${adjustmentLearning.applied_rules.join(', ')}`);
  console.log(`  Reasoning: ${adjustmentLearning.reasoning}\n`);

  // Cache Performance Test
  console.log('📋 CACHE PERFORMANCE TEST');
  console.log('─'.repeat(70));

  const start1 = Date.now();
  await manager.adjustThreshold(0.70, userContext1, envContext1, taskContext1);
  const time1 = Date.now() - start1;

  const start2 = Date.now();
  await manager.adjustThreshold(0.70, userContext1, envContext1, taskContext1);
  const time2 = Date.now() - start2;

  console.log(`First call (uncached): ${time1}ms`);
  console.log(`Second call (cached): ${time2}ms`);
  console.log(`Speedup: ${(time1 / time2).toFixed(1)}x faster\n`);

  // Stats
  const stats = manager.getStats();
  console.log('📊 MANAGER STATS');
  console.log('─'.repeat(70));
  console.log(`  Total Rules: ${stats.total_rules}`);
  console.log(`  Cache Size: ${stats.cache_size}`);
  console.log(`  Base Threshold: ${stats.config.base_threshold}`);
  console.log(`  Min Threshold: ${stats.config.min_threshold}`);
  console.log(`  Max Threshold: ${stats.config.max_threshold}`);
  console.log(`  Enable Adjustment: ${stats.config.enable_adjustment}\n`);

  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║                   ✅ ALPHA DEMO COMPLETE                      ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝');
}

// Run demo
runAlphaDemo().catch(console.error);

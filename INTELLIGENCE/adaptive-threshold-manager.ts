/**
 * ADAPTIVE THRESHOLD MANAGER — Trình quản lý ngưỡng thích nghi
 * Dynamic Confidence Threshold System
 *
 * Purpose (Mục đích):
 * - Điều chỉnh ngưỡng tin cậy dựa trên context người dùng và môi trường
 * - Tăng tính chính xác routing bằng cách tùy chỉnh ngưỡng theo từng tình huống
 * - Cân bằng giữa tính nghiêm ngặt (strict) và linh hoạt (lenient)
 *
 * Architecture (Kiến trúc):
 * - Base threshold: 0.70 (mặc định)
 * - Adjustment range: 0.60 (lenient) to 0.80 (strict)
 * - Rule-based adjustment system với 6 rules (3 down, 3 up)
 */

import { UserHistoryTracker, UserReputation } from './user-history-tracker';

/**
 * UserContext — Ngữ cảnh người dùng cho threshold adjustment
 */
export interface UserContext {
  user_id: string;                     // Unique user identifier
  session_count: number;               // Tổng số session của user
  total_tasks_completed: number;       // Tổng số task đã hoàn thành
  recent_success_rate: number;         // Tỷ lệ thành công gần đây (0.0-1.0)
  similar_task_success_rate?: number; // Tỷ lệ thành công với task tương tự
  recent_error_count: number;          // Số lỗi trong 10 task gần nhất
  is_new_user: boolean;                // User mới (< 5 tasks)
  reputation_score: number;            // Điểm uy tín (0.0-1.0)
}

/**
 * EnvironmentContext — Ngữ cảnh môi trường
 */
export interface EnvironmentContext {
  is_production: boolean;              // Môi trường production?
  is_critical_task: boolean;           // Task quan trọng?
  deployment_stage?: 'dev' | 'staging' | 'production';
  monitoring_enabled: boolean;         // Có monitoring không?
}

/**
 * TaskContext — Ngữ cảnh task
 */
export interface TaskContext {
  urgency_level: 'low' | 'medium' | 'high';  // Mức độ khẩn cấp
  complexity: number;                         // Độ phức tạp (0.0-1.0)
  domain: string;                             // Domain (frontend/backend/etc)
  operation_type: string;                     // Loại operation
  has_urgency_keywords: boolean;              // Có từ khóa urgent không?
}

/**
 * ThresholdAdjustment — Kết quả điều chỉnh ngưỡng
 */
export interface ThresholdAdjustment {
  original_threshold: number;          // Ngưỡng ban đầu (0.70)
  adjusted_threshold: number;          // Ngưỡng sau điều chỉnh
  adjustment_delta: number;            // Chênh lệch (+/-)
  applied_rules: string[];             // Các rule đã áp dụng
  reasoning: string;                   // Lý do điều chỉnh
  confidence_level: 'strict' | 'moderate' | 'lenient';
}

/**
 * AdjustmentRule — Quy tắc điều chỉnh
 */
export interface AdjustmentRule {
  rule_id: string;                     // ID quy tắc
  condition: (ctx: AdaptiveThresholdContext) => boolean;  // Điều kiện
  threshold_value: number;             // Giá trị ngưỡng mới
  priority: number;                    // Độ ưu tiên (1-10)
  reasoning: string;                   // Lý do
  category: 'down' | 'up';             // Loại điều chỉnh
}

/**
 * AdaptiveThresholdContext — Context đầy đủ cho threshold adjustment
 */
export interface AdaptiveThresholdContext {
  user: UserContext;
  environment: EnvironmentContext;
  task: TaskContext;
  base_confidence: number;             // Confidence từ Phase 3
}

/**
 * ThresholdConfig — Cấu hình ngưỡng
 */
export interface ThresholdConfig {
  base_threshold: number;              // Ngưỡng cơ bản (0.70)
  min_threshold: number;               // Ngưỡng tối thiểu (0.60)
  max_threshold: number;               // Ngưỡng tối đa (0.80)
  enable_adjustment: boolean;          // Bật/tắt adjustment
  adjustment_rules: AdjustmentRule[];  // Danh sách rules
  cache_ttl: number;                   // Cache TTL (seconds)
}

/**
 * AdaptiveThresholdManager — Core threshold adjustment engine
 */
export class AdaptiveThresholdManager {
  private userHistoryTracker: UserHistoryTracker;
  private config: ThresholdConfig;
  private adjustmentRules: AdjustmentRule[];
  private cache: Map<string, ThresholdAdjustment>;

  constructor(config?: Partial<ThresholdConfig>) {
    this.userHistoryTracker = new UserHistoryTracker();
    this.config = this.initializeConfig(config);
    this.adjustmentRules = this.loadAdjustmentRules();
    this.cache = new Map();
  }

  /**
   * initializeConfig — Khởi tạo cấu hình mặc định
   */
  private initializeConfig(custom?: Partial<ThresholdConfig>): ThresholdConfig {
    return {
      base_threshold: 0.70,
      min_threshold: 0.60,
      max_threshold: 0.80,
      enable_adjustment: true,
      adjustment_rules: [],
      cache_ttl: 300,  // 5 minutes
      ...custom
    };
  }

  /**
   * loadAdjustmentRules — Tải 6 quy tắc điều chỉnh
   *
   * Adjust DOWN (more lenient - dễ dàng hơn):
   * 1. user_history_positive: 0.70 → 0.65 (trusted user)
   * 2. task_urgency_high: 0.70 → 0.62 (urgent task)
   * 3. similar_past_success: 0.70 → 0.60 (proven pattern)
   *
   * Adjust UP (more strict - nghiêm ngặt hơn):
   * 4. error_rate_high: 0.70 → 0.75 (recent failures)
   * 5. critical_production: 0.70 → 0.80 (production env)
   * 6. new_user: 0.70 → 0.75 (unproven user)
   */
  private loadAdjustmentRules(): AdjustmentRule[] {
    return [
      // Rule 1: Trusted User (user_history_positive)
      {
        rule_id: 'user_history_positive',
        condition: (ctx) => {
          return ctx.user.reputation_score >= 0.80 &&
                 ctx.user.recent_success_rate >= 0.85 &&
                 ctx.user.total_tasks_completed >= 10;
        },
        threshold_value: 0.65,
        priority: 8,
        reasoning: 'User has proven track record (≥80% reputation, ≥85% success, ≥10 tasks)',
        category: 'down'
      },

      // Rule 2: High Urgency Task (task_urgency_high)
      {
        rule_id: 'task_urgency_high',
        condition: (ctx) => {
          return ctx.task.urgency_level === 'high' ||
                 ctx.task.has_urgency_keywords;
        },
        threshold_value: 0.62,
        priority: 9,
        reasoning: 'High urgency task detected - prioritize speed over strictness',
        category: 'down'
      },

      // Rule 3: Similar Past Success (similar_past_success)
      {
        rule_id: 'similar_past_success',
        condition: (ctx) => {
          return ctx.user.similar_task_success_rate !== undefined &&
                 ctx.user.similar_task_success_rate >= 0.80;
        },
        threshold_value: 0.60,
        priority: 7,
        reasoning: 'User has >80% success rate with similar tasks - proven capability',
        category: 'down'
      },

      // Rule 4: High Error Rate (error_rate_high)
      {
        rule_id: 'error_rate_high',
        condition: (ctx) => {
          return ctx.user.recent_error_count >= 3 ||
                 ctx.user.recent_success_rate < 0.50;
        },
        threshold_value: 0.75,
        priority: 10,
        reasoning: 'Recent high error rate (≥3 errors or <50% success) - increase scrutiny',
        category: 'up'
      },

      // Rule 5: Critical Production (critical_production)
      {
        rule_id: 'critical_production',
        condition: (ctx) => {
          return ctx.environment.is_production &&
                 ctx.environment.is_critical_task;
        },
        threshold_value: 0.80,
        priority: 10,
        reasoning: 'Critical production environment - maximum validation required',
        category: 'up'
      },

      // Rule 6: New User (new_user)
      {
        rule_id: 'new_user',
        condition: (ctx) => {
          return ctx.user.is_new_user ||
                 ctx.user.total_tasks_completed < 5 ||
                 ctx.user.reputation_score < 0.30;
        },
        threshold_value: 0.75,
        priority: 9,
        reasoning: 'New or unproven user (<5 tasks or <30% reputation) - require validation',
        category: 'up'
      }
    ];
  }

  /**
   * adjustThreshold — Main entry point cho threshold adjustment
   *
   * @param baseConfidence - Confidence từ Phase 3 Intent Disambiguation
   * @param userContext - Ngữ cảnh người dùng
   * @param environmentContext - Ngữ cảnh môi trường
   * @param taskContext - Ngữ cảnh task
   * @returns ThresholdAdjustment với ngưỡng đã điều chỉnh
   */
  public async adjustThreshold(
    baseConfidence: number,
    userContext: UserContext,
    environmentContext: EnvironmentContext,
    taskContext: TaskContext
  ): Promise<ThresholdAdjustment> {
    const startTime = Date.now();

    // Check cache first
    const cacheKey = this.generateCacheKey(userContext, environmentContext, taskContext);
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Build full context
    const context: AdaptiveThresholdContext = {
      user: userContext,
      environment: environmentContext,
      task: taskContext,
      base_confidence: baseConfidence
    };

    // Step 1: Evaluate all adjustment rules
    const applicableRules = this.evaluateRules(context);

    // Step 2: Select highest priority rule
    const selectedRule = this.selectRule(applicableRules);

    // Step 3: Calculate adjusted threshold
    const adjustedThreshold = selectedRule
      ? this.clampThreshold(selectedRule.threshold_value)
      : this.config.base_threshold;

    // Step 4: Generate reasoning
    const adjustment: ThresholdAdjustment = {
      original_threshold: this.config.base_threshold,
      adjusted_threshold: adjustedThreshold,
      adjustment_delta: adjustedThreshold - this.config.base_threshold,
      applied_rules: selectedRule ? [selectedRule.rule_id] : [],
      reasoning: this.generateReasoning(selectedRule, context),
      confidence_level: this.determineConfidenceLevel(adjustedThreshold)
    };

    // Cache result
    this.cache.set(cacheKey, adjustment);

    return adjustment;
  }

  /**
   * evaluateRules — Đánh giá tất cả rules và tìm rules phù hợp
   */
  private evaluateRules(context: AdaptiveThresholdContext): AdjustmentRule[] {
    return this.adjustmentRules.filter(rule => {
      try {
        return rule.condition(context);
      } catch (error) {
        console.warn(`Rule evaluation failed: ${rule.rule_id}`, error);
        return false;
      }
    });
  }

  /**
   * selectRule — Chọn rule có priority cao nhất
   *
   * Logic:
   * 1. Nếu có nhiều rules → chọn rule có priority cao nhất
   * 2. Nếu cùng priority → rules "up" (strict) được ưu tiên hơn "down"
   * 3. Nếu không có rule nào → return undefined (dùng base threshold)
   */
  private selectRule(rules: AdjustmentRule[]): AdjustmentRule | undefined {
    if (rules.length === 0) {
      return undefined;
    }

    // Sort by priority (descending), then by category ('up' before 'down')
    return rules.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }
      return a.category === 'up' ? -1 : 1;
    })[0];
  }

  /**
   * clampThreshold — Đảm bảo threshold trong range [0.60, 0.80]
   */
  private clampThreshold(value: number): number {
    return Math.max(
      this.config.min_threshold,
      Math.min(this.config.max_threshold, value)
    );
  }

  /**
   * determineConfidenceLevel — Xác định mức độ confidence
   */
  private determineConfidenceLevel(threshold: number): 'strict' | 'moderate' | 'lenient' {
    if (threshold >= 0.75) {
      return 'strict';      // 0.75-0.80: High scrutiny
    } else if (threshold <= 0.65) {
      return 'lenient';     // 0.60-0.65: Low scrutiny
    } else {
      return 'moderate';    // 0.65-0.75: Medium scrutiny
    }
  }

  /**
   * generateReasoning — Tạo reasoning text
   */
  private generateReasoning(
    rule: AdjustmentRule | undefined,
    context: AdaptiveThresholdContext
  ): string {
    if (!rule) {
      return `No adjustment rules triggered. Using base threshold ${this.config.base_threshold}.`;
    }

    const delta = rule.threshold_value - this.config.base_threshold;
    const direction = delta > 0 ? 'increased' : 'decreased';
    const percentage = Math.abs(delta * 100).toFixed(0);

    return `Threshold ${direction} by ${percentage}% (${this.config.base_threshold} → ${rule.threshold_value}). ` +
           `Rule: ${rule.rule_id}. Reason: ${rule.reasoning}`;
  }

  /**
   * generateCacheKey — Tạo cache key
   */
  private generateCacheKey(
    user: UserContext,
    env: EnvironmentContext,
    task: TaskContext
  ): string {
    return `${user.user_id}_${env.is_production}_${task.urgency_level}_${user.reputation_score.toFixed(2)}`;
  }

  /**
   * clearCache — Xóa cache
   */
  public clearCache(): void {
    this.cache.clear();
  }

  /**
   * getStats — Lấy thống kê
   */
  public getStats(): {
    total_rules: number;
    cache_size: number;
    config: ThresholdConfig;
  } {
    return {
      total_rules: this.adjustmentRules.length,
      cache_size: this.cache.size,
      config: this.config
    };
  }
}

/**
 * ========================================================================
 * SIGNAL EXTRACTORS — Trích xuất signals từ context
 * ========================================================================
 */

/**
 * UserHistorySignalExtractor — Trích xuất signals từ lịch sử người dùng
 *
 * Purpose (Mục đích):
 * - Phân tích user behavior để đưa ra recommendation về threshold adjustment
 * - Tạo signals dựa trên reputation, success rate, error patterns
 *
 * Signals Generated (Tín hiệu tạo ra):
 * - trusted_user: reputation ≥ 0.80, success ≥ 0.85, tasks ≥ 10
 * - similar_success: similar_task_success_rate ≥ 0.80
 * - high_error_rate: recent_error_count ≥ 3 hoặc success < 0.50
 * - new_unproven_user: tasks < 5 hoặc reputation < 0.30
 */
export class UserHistorySignalExtractor {
  /**
   * extract — Trích xuất user history signals
   */
  public extract(user: UserContext): {
    signals: string[];
    recommendation: 'down' | 'up' | 'neutral';
    reasoning: string;
  } {
    const signals: string[] = [];
    let recommendation: 'down' | 'up' | 'neutral' = 'neutral';
    const reasons: string[] = [];

    // Signal 1: Trusted User (điều chỉnh xuống)
    if (
      user.reputation_score >= 0.80 &&
      user.recent_success_rate >= 0.85 &&
      user.total_tasks_completed >= 10
    ) {
      signals.push('trusted_user');
      recommendation = 'down';
      reasons.push(
        `Trusted user (reputation: ${(user.reputation_score * 100).toFixed(0)}%, ` +
        `success: ${(user.recent_success_rate * 100).toFixed(0)}%, ` +
        `tasks: ${user.total_tasks_completed})`
      );
    }

    // Signal 2: Similar Past Success (điều chỉnh xuống mạnh)
    if (user.similar_task_success_rate && user.similar_task_success_rate >= 0.80) {
      signals.push('similar_success');
      if (recommendation !== 'up') {
        recommendation = 'down';
      }
      reasons.push(
        `High success rate with similar tasks (${(user.similar_task_success_rate * 100).toFixed(0)}%)`
      );
    }

    // Signal 3: High Error Rate (điều chỉnh lên - override down signals)
    if (user.recent_error_count >= 3 || user.recent_success_rate < 0.50) {
      signals.push('high_error_rate');
      recommendation = 'up';  // Override
      reasons.push(
        `Recent high error rate (${user.recent_error_count} errors, ` +
        `${(user.recent_success_rate * 100).toFixed(0)}% success)`
      );
    }

    // Signal 4: New/Unproven User (điều chỉnh lên)
    if (
      user.is_new_user ||
      user.total_tasks_completed < 5 ||
      user.reputation_score < 0.30
    ) {
      signals.push('new_unproven_user');
      if (recommendation !== 'up') {
        recommendation = recommendation === 'down' ? 'neutral' : 'up';
      }
      reasons.push(
        `New or unproven user (${user.total_tasks_completed} tasks, ` +
        `${(user.reputation_score * 100).toFixed(0)}% reputation)`
      );
    }

    const reasoning = reasons.length > 0
      ? reasons.join('. ')
      : 'No significant user history signals detected';

    return { signals, recommendation, reasoning };
  }
}

/**
 * ResourceSignalExtractor — Trích xuất signals từ tài nguyên hệ thống
 *
 * Purpose (Mục đích):
 * - Đánh giá resource availability và system load
 * - Tạo signals dựa trên memory, CPU, disk usage
 * - Recommend threshold adjustment dựa trên resource pressure
 *
 * Signals Generated (Tín hiệu tạo ra):
 * - low_resources: memory > 85% hoặc CPU > 90%
 * - resource_critical: memory > 95% hoặc CPU > 95%
 * - resource_healthy: memory < 60% và CPU < 70%
 */
export class ResourceSignalExtractor {
  /**
   * extract — Trích xuất resource signals
   *
   * @param memoryUsage - Memory usage percentage (0.0-1.0)
   * @param cpuUsage - CPU usage percentage (0.0-1.0)
   * @param diskUsage - Disk usage percentage (0.0-1.0)
   */
  public extract(
    memoryUsage: number,
    cpuUsage: number,
    diskUsage?: number
  ): {
    signals: string[];
    recommendation: 'down' | 'up' | 'neutral';
    reasoning: string;
  } {
    const signals: string[] = [];
    let recommendation: 'down' | 'up' | 'neutral' = 'neutral';
    const reasons: string[] = [];

    // Signal 1: Critical Resources (điều chỉnh lên - cần optimization)
    if (memoryUsage >= 0.95 || cpuUsage >= 0.95) {
      signals.push('resource_critical');
      recommendation = 'up';
      reasons.push(
        `Critical resource usage (memory: ${(memoryUsage * 100).toFixed(0)}%, ` +
        `CPU: ${(cpuUsage * 100).toFixed(0)}%) - need strict routing for optimization`
      );
    }
    // Signal 2: Low Resources (điều chỉnh lên nhẹ)
    else if (memoryUsage >= 0.85 || cpuUsage >= 0.90) {
      signals.push('low_resources');
      recommendation = 'up';
      reasons.push(
        `High resource usage (memory: ${(memoryUsage * 100).toFixed(0)}%, ` +
        `CPU: ${(cpuUsage * 100).toFixed(0)}%) - increase scrutiny`
      );
    }
    // Signal 3: Healthy Resources (có thể điều chỉnh xuống)
    else if (memoryUsage < 0.60 && cpuUsage < 0.70) {
      signals.push('resource_healthy');
      recommendation = 'down';
      reasons.push(
        `Healthy resource usage (memory: ${(memoryUsage * 100).toFixed(0)}%, ` +
        `CPU: ${(cpuUsage * 100).toFixed(0)}%) - can afford lenient routing`
      );
    }

    // Optional: Disk usage check
    if (diskUsage !== undefined && diskUsage >= 0.90) {
      signals.push('disk_pressure');
      if (recommendation !== 'up') {
        recommendation = 'neutral';
      }
      reasons.push(`High disk usage (${(diskUsage * 100).toFixed(0)}%)`);
    }

    const reasoning = reasons.length > 0
      ? reasons.join('. ')
      : 'Resource usage within normal range';

    return { signals, recommendation, reasoning };
  }

  /**
   * getCurrentResourceUsage — Lấy resource usage hiện tại từ hệ thống
   * (Placeholder - cần implement với os module trong production)
   */
  public getCurrentResourceUsage(): {
    memory: number;
    cpu: number;
    disk?: number;
  } {
    // TODO: Implement với os module trong Node.js
    // Hiện tại return mock data
    return {
      memory: 0.55,  // 55% memory usage
      cpu: 0.45,     // 45% CPU usage
      disk: 0.70     // 70% disk usage
    };
  }
}

/**
 * ContextSignalExtractor — Trích xuất signals từ context yêu cầu
 *
 * Purpose (Mục đích):
 * - Phân tích nội dung yêu cầu để tìm urgency, complexity, domain cues
 * - Tạo signals dựa trên task characteristics và environment
 *
 * Signals Generated (Tín hiệu tạo ra):
 * - urgent_task: urgency = high hoặc có urgent keywords
 * - critical_production: production + critical task
 * - complex_task: complexity > 0.7
 * - simple_task: complexity < 0.3
 */
export class ContextSignalExtractor {
  private urgentKeywords = [
    'urgent', 'asap', 'immediately', 'critical', 'emergency',
    'now', 'quickly', 'fast', 'priority', 'deadline'
  ];

  /**
   * extract — Trích xuất context signals
   */
  public extract(
    task: TaskContext,
    environment: EnvironmentContext,
    requestText?: string
  ): {
    signals: string[];
    recommendation: 'down' | 'up' | 'neutral';
    reasoning: string;
  } {
    const signals: string[] = [];
    let recommendation: 'down' | 'up' | 'neutral' = 'neutral';
    const reasons: string[] = [];

    // Signal 1: Urgent Task (điều chỉnh xuống - prioritize speed)
    if (task.urgency_level === 'high' || task.has_urgency_keywords) {
      signals.push('urgent_task');
      recommendation = 'down';
      reasons.push(
        `High urgency task (level: ${task.urgency_level}) - prioritize speed over strictness`
      );
    }

    // Signal 2: Critical Production (điều chỉnh lên - maximum validation)
    if (environment.is_production && environment.is_critical_task) {
      signals.push('critical_production');
      recommendation = 'up';  // Override urgent
      reasons.push('Critical production environment - maximum validation required');
    }

    // Signal 3: Complex Task (điều chỉnh lên nhẹ)
    if (task.complexity > 0.7) {
      signals.push('complex_task');
      if (recommendation !== 'up') {
        recommendation = 'neutral';
      }
      reasons.push(
        `High complexity task (${(task.complexity * 100).toFixed(0)}%) - increase scrutiny`
      );
    }

    // Signal 4: Simple Task (có thể điều chỉnh xuống)
    if (task.complexity < 0.3 && recommendation !== 'up') {
      signals.push('simple_task');
      if (recommendation !== 'down') {
        recommendation = 'neutral';
      }
      reasons.push(
        `Simple task (${(task.complexity * 100).toFixed(0)}% complexity) - lenient routing acceptable`
      );
    }

    // Optional: Detect urgent keywords from request text
    if (requestText && !task.has_urgency_keywords) {
      const hasUrgentKeyword = this.urgentKeywords.some(keyword =>
        requestText.toLowerCase().includes(keyword)
      );
      if (hasUrgentKeyword) {
        signals.push('urgent_keywords_detected');
        if (recommendation !== 'up') {
          recommendation = 'down';
          reasons.push('Urgent keywords detected in request text');
        }
      }
    }

    const reasoning = reasons.length > 0
      ? reasons.join('. ')
      : 'No significant context signals detected';

    return { signals, recommendation, reasoning };
  }

  /**
   * hasUrgentKeywords — Kiểm tra xem text có chứa urgent keywords không
   */
  public hasUrgentKeywords(text: string): boolean {
    const lowerText = text.toLowerCase();
    return this.urgentKeywords.some(keyword => lowerText.includes(keyword));
  }
}

export default AdaptiveThresholdManager;

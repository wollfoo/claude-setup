/**
 * USER HISTORY TRACKER — Trình theo dõi lịch sử người dùng
 * User Reputation & Success Rate Tracking System
 *
 * Purpose (Mục đích):
 * - Theo dõi lịch sử hoàn thành task của người dùng
 * - Tính toán reputation score và success rate
 * - Cung cấp context cho Adaptive Threshold Manager
 * - Lưu trữ và phân tích patterns thành công/thất bại
 *
 * Architecture (Kiến trúc):
 * - Task history persistence — lưu trữ lịch sử task
 * - Reputation calculation — tính toán điểm uy tín
 * - Success rate analysis — phân tích tỷ lệ thành công
 * - Domain-specific tracking — theo dõi theo domain
 */

import { UserContext } from './adaptive-threshold-manager';

/**
 * TaskCompletion — Bản ghi hoàn thành task
 */
export interface TaskCompletion {
  task_id: string;                     // Unique task identifier
  user_id: string;                     // User identifier
  timestamp: number;                   // Completion timestamp (Unix ms)
  success: boolean;                    // Task thành công hay thất bại
  domain: string;                      // Domain (frontend/backend/etc.)
  operation_type: string;              // Loại operation (create/implement/fix/etc.)
  complexity: number;                  // Độ phức tạp task (0.0-1.0)
  confidence_used: number;             // Confidence đã sử dụng (0.0-1.0)
  execution_time_ms?: number;          // Thời gian thực thi (ms)
  error_message?: string;              // Thông báo lỗi (nếu thất bại)
}

/**
 * UserReputation — Điểm uy tín người dùng
 */
export interface UserReputation {
  user_id: string;                     // User identifier
  reputation_score: number;            // Điểm uy tín (0.0-1.0)
  total_tasks: number;                 // Tổng số task
  successful_tasks: number;            // Số task thành công
  failed_tasks: number;                // Số task thất bại
  recent_success_rate: number;         // Tỷ lệ thành công gần đây (0.0-1.0)
  session_count: number;               // Số session
  last_activity: number;               // Timestamp hoạt động cuối
  created_at: number;                  // Timestamp tạo record
  updated_at: number;                  // Timestamp cập nhật cuối
}

/**
 * DomainStatistics — Thống kê theo domain
 */
export interface DomainStatistics {
  domain: string;                      // Domain name
  total_tasks: number;                 // Tổng số task trong domain
  successful_tasks: number;            // Số task thành công
  success_rate: number;                // Tỷ lệ thành công (0.0-1.0)
  recent_tasks: TaskCompletion[];      // Các task gần đây
}

/**
 * UserHistoryConfig — Cấu hình tracking
 */
export interface UserHistoryConfig {
  max_history_size: number;            // Số task tối đa lưu trữ
  recent_task_window: number;          // Số task gần đây để tính success rate
  reputation_decay_factor: number;     // Hệ số giảm reputation theo thời gian
  enable_persistence: boolean;         // Bật/tắt lưu trữ
  storage_path?: string;               // Đường dẫn lưu trữ
}

/**
 * UserHistoryTracker — Core tracking engine
 */
export class UserHistoryTracker {
  private taskHistory: Map<string, TaskCompletion[]>;  // userId → task completions
  private userReputations: Map<string, UserReputation>; // userId → reputation
  private config: UserHistoryConfig;

  constructor(config?: Partial<UserHistoryConfig>) {
    this.taskHistory = new Map();
    this.userReputations = new Map();
    this.config = this.initializeConfig(config);
  }

  /**
   * initializeConfig — Khởi tạo cấu hình mặc định
   */
  private initializeConfig(custom?: Partial<UserHistoryConfig>): UserHistoryConfig {
    return {
      max_history_size: 1000,          // Lưu 1000 tasks mới nhất
      recent_task_window: 10,          // Tính success rate từ 10 tasks gần nhất
      reputation_decay_factor: 0.95,   // Giảm 5% reputation mỗi tháng không hoạt động
      enable_persistence: false,       // Tắt persistence mặc định (in-memory)
      ...custom
    };
  }

  /**
   * trackTaskCompletion — Ghi nhận hoàn thành task
   *
   * @param userId - User identifier
   * @param taskId - Task identifier
   * @param success - Task thành công hay thất bại
   * @param domain - Domain (frontend/backend/etc.)
   * @param operationType - Loại operation
   * @param options - Tùy chọn bổ sung (complexity, execution time, etc.)
   */
  public trackTaskCompletion(
    userId: string,
    taskId: string,
    success: boolean,
    domain: string,
    operationType: string,
    options?: {
      complexity?: number;
      confidence_used?: number;
      execution_time_ms?: number;
      error_message?: string;
    }
  ): void {
    const completion: TaskCompletion = {
      task_id: taskId,
      user_id: userId,
      timestamp: Date.now(),
      success,
      domain,
      operation_type: operationType,
      complexity: options?.complexity ?? 0.5,
      confidence_used: options?.confidence_used ?? 0.7,
      execution_time_ms: options?.execution_time_ms,
      error_message: options?.error_message
    };

    // Add to task history
    if (!this.taskHistory.has(userId)) {
      this.taskHistory.set(userId, []);
    }
    const history = this.taskHistory.get(userId)!;
    history.unshift(completion);  // Add to beginning (most recent first)

    // Trim history if exceeds max size
    if (history.length > this.config.max_history_size) {
      history.length = this.config.max_history_size;
    }

    // Update reputation
    this.updateReputation(userId, completion);
  }

  /**
   * updateReputation — Cập nhật reputation score
   */
  private updateReputation(userId: string, newCompletion: TaskCompletion): void {
    let reputation = this.userReputations.get(userId);

    if (!reputation) {
      // Create new reputation record
      reputation = {
        user_id: userId,
        reputation_score: 0.5,  // Start at neutral
        total_tasks: 0,
        successful_tasks: 0,
        failed_tasks: 0,
        recent_success_rate: 0.0,
        session_count: 1,
        last_activity: Date.now(),
        created_at: Date.now(),
        updated_at: Date.now()
      };
      this.userReputations.set(userId, reputation);
    }

    // Update task counts
    reputation.total_tasks++;
    if (newCompletion.success) {
      reputation.successful_tasks++;
    } else {
      reputation.failed_tasks++;
    }

    // Calculate recent success rate
    const recentTasks = this.getRecentTasks(userId, this.config.recent_task_window);
    const recentSuccesses = recentTasks.filter(t => t.success).length;
    reputation.recent_success_rate = recentSuccesses / Math.max(recentTasks.length, 1);

    // Calculate reputation score (weighted: 70% recent + 30% overall)
    const overallSuccessRate = reputation.successful_tasks / reputation.total_tasks;
    reputation.reputation_score =
      (reputation.recent_success_rate * 0.70) +
      (overallSuccessRate * 0.30);

    // Apply time decay if user was inactive
    const daysSinceLastActivity = (Date.now() - reputation.last_activity) / (1000 * 60 * 60 * 24);
    if (daysSinceLastActivity > 30) {
      const monthsInactive = Math.floor(daysSinceLastActivity / 30);
      const decayFactor = Math.pow(this.config.reputation_decay_factor, monthsInactive);
      reputation.reputation_score *= decayFactor;
    }

    // Update timestamps
    reputation.last_activity = Date.now();
    reputation.updated_at = Date.now();
  }

  /**
   * getUserContext — Lấy UserContext cho Adaptive Threshold Manager
   *
   * @param userId - User identifier
   * @returns UserContext với đầy đủ thông tin
   */
  public getUserContext(userId: string): UserContext {
    const reputation = this.userReputations.get(userId);
    const history = this.taskHistory.get(userId) || [];

    if (!reputation) {
      // New user — return default context
      return {
        user_id: userId,
        session_count: 0,
        total_tasks_completed: 0,
        recent_success_rate: 0.0,
        recent_error_count: 0,
        is_new_user: true,
        reputation_score: 0.5  // Neutral starting point
      };
    }

    // Calculate recent error count
    const recentTasks = this.getRecentTasks(userId, this.config.recent_task_window);
    const recentErrors = recentTasks.filter(t => !t.success).length;

    return {
      user_id: userId,
      session_count: reputation.session_count,
      total_tasks_completed: reputation.total_tasks,
      recent_success_rate: reputation.recent_success_rate,
      recent_error_count: recentErrors,
      is_new_user: reputation.total_tasks < 5,
      reputation_score: reputation.reputation_score
    };
  }

  /**
   * calculateReputation — Tính toán reputation score
   *
   * @param userId - User identifier
   * @returns Reputation score (0.0-1.0)
   */
  public calculateReputation(userId: string): number {
    const reputation = this.userReputations.get(userId);
    return reputation?.reputation_score ?? 0.5;  // Default to neutral
  }

  /**
   * getRecentSuccessRate — Lấy tỷ lệ thành công gần đây
   *
   * @param userId - User identifier
   * @param count - Số task gần đây để tính
   * @returns Success rate (0.0-1.0)
   */
  public getRecentSuccessRate(userId: string, count: number = 10): number {
    const recentTasks = this.getRecentTasks(userId, count);
    if (recentTasks.length === 0) return 0.0;

    const successes = recentTasks.filter(t => t.success).length;
    return successes / recentTasks.length;
  }

  /**
   * getSimilarTaskSuccessRate — Lấy tỷ lệ thành công với task tương tự
   *
   * @param userId - User identifier
   * @param domain - Domain để filter
   * @param operationType - Operation type để filter
   * @returns Success rate (0.0-1.0) hoặc undefined nếu không có data
   */
  public getSimilarTaskSuccessRate(
    userId: string,
    domain: string,
    operationType: string
  ): number | undefined {
    const history = this.taskHistory.get(userId);
    if (!history) return undefined;

    // Filter tasks matching domain and operation type
    const similarTasks = history.filter(
      t => t.domain === domain && t.operation_type === operationType
    );

    if (similarTasks.length === 0) return undefined;

    const successes = similarTasks.filter(t => t.success).length;
    return successes / similarTasks.length;
  }

  /**
   * getRecentErrorCount — Đếm số lỗi gần đây
   *
   * @param userId - User identifier
   * @param count - Số task gần đây để kiểm tra
   * @returns Số lỗi
   */
  public getRecentErrorCount(userId: string, count: number = 10): number {
    const recentTasks = this.getRecentTasks(userId, count);
    return recentTasks.filter(t => !t.success).length;
  }

  /**
   * getRecentTasks — Lấy các task gần đây
   */
  private getRecentTasks(userId: string, count: number): TaskCompletion[] {
    const history = this.taskHistory.get(userId);
    if (!history) return [];
    return history.slice(0, count);
  }

  /**
   * getDomainStatistics — Lấy thống kê theo domain
   *
   * @param userId - User identifier
   * @param domain - Domain để phân tích
   * @returns Domain statistics
   */
  public getDomainStatistics(userId: string, domain: string): DomainStatistics {
    const history = this.taskHistory.get(userId) || [];
    const domainTasks = history.filter(t => t.domain === domain);

    const successfulTasks = domainTasks.filter(t => t.success).length;
    const successRate = domainTasks.length > 0
      ? successfulTasks / domainTasks.length
      : 0.0;

    return {
      domain,
      total_tasks: domainTasks.length,
      successful_tasks: successfulTasks,
      success_rate: successRate,
      recent_tasks: domainTasks.slice(0, 10)  // 10 most recent
    };
  }

  /**
   * incrementSessionCount — Tăng session count
   *
   * @param userId - User identifier
   */
  public incrementSessionCount(userId: string): void {
    const reputation = this.userReputations.get(userId);
    if (reputation) {
      reputation.session_count++;
      reputation.updated_at = Date.now();
    }
  }

  /**
   * clearHistory — Xóa lịch sử user
   *
   * @param userId - User identifier
   */
  public clearHistory(userId: string): void {
    this.taskHistory.delete(userId);
    this.userReputations.delete(userId);
  }

  /**
   * getStats — Lấy thống kê tổng quan
   */
  public getStats(): {
    total_users: number;
    total_tasks: number;
    active_users: number;
    average_reputation: number;
  } {
    const totalUsers = this.userReputations.size;
    const totalTasks = Array.from(this.taskHistory.values())
      .reduce((sum, history) => sum + history.length, 0);

    // Active users: có hoạt động trong 7 ngày qua
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const activeUsers = Array.from(this.userReputations.values())
      .filter(r => r.last_activity > sevenDaysAgo)
      .length;

    // Average reputation
    const reputations = Array.from(this.userReputations.values());
    const averageReputation = reputations.length > 0
      ? reputations.reduce((sum, r) => sum + r.reputation_score, 0) / reputations.length
      : 0.5;

    return {
      total_users: totalUsers,
      total_tasks: totalTasks,
      active_users: activeUsers,
      average_reputation: averageReputation
    };
  }

  /**
   * exportUserData — Xuất dữ liệu user (for debugging/analysis)
   *
   * @param userId - User identifier
   * @returns Full user data
   */
  public exportUserData(userId: string): {
    reputation: UserReputation | undefined;
    task_history: TaskCompletion[];
    domain_statistics: Map<string, DomainStatistics>;
  } {
    const reputation = this.userReputations.get(userId);
    const taskHistory = this.taskHistory.get(userId) || [];

    // Calculate domain statistics
    const domains = new Set(taskHistory.map(t => t.domain));
    const domainStats = new Map<string, DomainStatistics>();
    domains.forEach(domain => {
      domainStats.set(domain, this.getDomainStatistics(userId, domain));
    });

    return {
      reputation,
      task_history: taskHistory,
      domain_statistics: domainStats
    };
  }
}

export default UserHistoryTracker;

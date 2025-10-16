/**
 * INTENT DISAMBIGUATOR — Phân giải ý định cho yêu cầu mơ hồ
 * Phase 3: Intent Disambiguation (30-80ms target)
 *
 * Purpose (Mục đích):
 * - Xử lý các yêu cầu mơ hồ/không rõ ràng (vague requests)
 * - Áp dụng confidence-based decision making (3-tier threshold system)
 * - Smart inference từ project context và session history
 * - Tạo clarification questions khi cần thiết
 *
 * Architecture (Kiến trúc):
 * - Vague pattern detection — nhận diện pattern mơ hồ
 * - Context-based inference — suy luận dựa trên context
 * - Confidence threshold logic — quyết định dựa trên ngưỡng confidence
 * - Clarification generation — tạo câu hỏi làm rõ
 */

import { ContextExtractor, SessionContext, ProjectContext } from './context-extractor';
import { MultiSignalAggregator, SignalScore, AggregatedResult } from './multi-signal-aggregator';

/**
 * VaguePattern — Pattern mơ hồ cần disambiguation
 */
export interface VaguePattern {
  pattern: string;                    // Pattern string (e.g., "improve code")
  base_score: number;                 // Base confidence score (0.0-1.0)
  keywords: string[];                 // Keywords triggering this pattern
  negative_indicators: string[];      // Indicators lowering confidence
  clarification_questions: string[];  // Questions to ask if confidence too low
  inference_rules: InferenceRule[];   // Rules for smart inference
}

/**
 * InferenceRule — Quy tắc suy luận cho disambiguation
 */
export interface InferenceRule {
  condition: string;           // Điều kiện để áp dụng rule (e.g., "project_is_frontend_heavy")
  condition_type: 'project' | 'session' | 'file' | 'behavioral';
  confidence_boost: number;    // Boost confidence khi áp dụng (+0.05 to +0.20)
  inferred_domain?: string;    // Domain được suy luận (frontend/backend/testing/etc.)
  inferred_focus?: string;     // Focus area được suy luận (performance/quality/structure)
}

/**
 * DisambiguationResult — Kết quả phân giải ý định
 */
export interface DisambiguationResult {
  is_vague: boolean;                  // Request có mơ hồ không?
  matched_pattern?: VaguePattern;     // Pattern mơ hồ được match
  base_confidence: number;            // Confidence ban đầu
  context_boost: number;              // Boost từ context inference
  final_confidence: number;           // Confidence cuối cùng
  decision: 'ask' | 'assume' | 'proceed';  // Quyết định hành động
  clarification_question?: string;    // Câu hỏi làm rõ (nếu ask)
  inferred_domain?: string;           // Domain được suy luận (nếu assume/proceed)
  inferred_focus?: string;            // Focus được suy luận (nếu assume/proceed)
  applied_rules: string[];            // Các rule đã áp dụng
  reasoning: string;                  // Lý do quyết định
  response_time_ms: number;           // Thời gian xử lý (ms)
}

/**
 * ConfidenceThresholds — Ngưỡng confidence cho decision making
 */
export interface ConfidenceThresholds {
  ask_threshold: number;      // < 0.55: ask user to clarify
  assume_threshold: number;   // 0.55-0.69: make smart assumption
  proceed_threshold: number;  // >= 0.70: proceed confidently
}

/**
 * IntentDisambiguator — Core engine cho Phase 3
 */
export class IntentDisambiguator {
  private contextExtractor: ContextExtractor;
  private signalAggregator: MultiSignalAggregator;
  private vaguePatterns: Map<string, VaguePattern>;
  private thresholds: ConfidenceThresholds;
  private cache: Map<string, DisambiguationResult>;
  private cache_ttl: number = 3600000; // 1 hour

  /**
   * Constructor — Khởi tạo disambiguator
   */
  constructor() {
    this.contextExtractor = new ContextExtractor();
    this.signalAggregator = new MultiSignalAggregator();
    this.vaguePatterns = new Map();
    this.thresholds = {
      ask_threshold: 0.55,
      assume_threshold: 0.70,
      proceed_threshold: 0.70
    };
    this.cache = new Map();

    this.loadVaguePatterns();
  }

  /**
   * loadVaguePatterns — Tải database các vague patterns
   */
  private loadVaguePatterns(): void {
    // Pattern 1: "improve code"
    this.vaguePatterns.set('improve_code', {
      pattern: 'improve code',
      base_score: 0.50,
      keywords: ['improve', 'better', 'enhance', 'optimize', 'refactor', 'code'],
      negative_indicators: ['specific', 'exact', 'which', 'what'],
      clarification_questions: [
        'Which aspect would you like to improve? (performance | quality | structure | readability)',
        'Which file or module needs improvement?',
        'What specific issue are you trying to solve?'
      ],
      inference_rules: [
        {
          condition: 'project_is_frontend_heavy',
          condition_type: 'project',
          confidence_boost: 0.10,
          inferred_domain: 'frontend',
          inferred_focus: 'quality'
        },
        {
          condition: 'recent_performance_issues',
          condition_type: 'session',
          confidence_boost: 0.15,
          inferred_focus: 'performance'
        },
        {
          condition: 'recent_refactoring_tasks',
          condition_type: 'session',
          confidence_boost: 0.12,
          inferred_focus: 'structure'
        }
      ]
    });

    // Pattern 2: "fix app"
    this.vaguePatterns.set('fix_app', {
      pattern: 'fix app',
      base_score: 0.45,
      keywords: ['fix', 'bug', 'error', 'issue', 'problem', 'broken', 'app', 'application'],
      negative_indicators: ['specific', 'exact', 'which', 'where'],
      clarification_questions: [
        'What is broken? (UI | API | deployment | database | authentication)',
        'What error message are you seeing?',
        'When did the issue start occurring?'
      ],
      inference_rules: [
        {
          condition: 'recent_errors_in_logs',
          condition_type: 'session',
          confidence_boost: 0.20,
          inferred_focus: 'debugging'
        },
        {
          condition: 'recent_ui_changes',
          condition_type: 'file',
          confidence_boost: 0.15,
          inferred_domain: 'frontend',
          inferred_focus: 'debugging'
        },
        {
          condition: 'recent_api_changes',
          condition_type: 'file',
          confidence_boost: 0.15,
          inferred_domain: 'backend',
          inferred_focus: 'debugging'
        }
      ]
    });

    // Pattern 3: "make better"
    this.vaguePatterns.set('make_better', {
      pattern: 'make better',
      base_score: 0.40,
      keywords: ['make', 'better', 'improve', 'enhance', 'upgrade', 'modernize'],
      negative_indicators: ['specific', 'exact', 'which', 'what', 'how'],
      clarification_questions: [
        'What aspect needs to be better? (performance | UX | code quality | security)',
        'Which component or feature are you focusing on?',
        'What does "better" mean in this context?'
      ],
      inference_rules: [
        {
          condition: 'near_deadline',
          condition_type: 'behavioral',
          confidence_boost: 0.15,
          inferred_focus: 'quick_fix'
        },
        {
          condition: 'project_is_new',
          condition_type: 'project',
          confidence_boost: 0.10,
          inferred_focus: 'quality'
        }
      ]
    });

    // Pattern 4: "optimize the app"
    this.vaguePatterns.set('optimize_app', {
      pattern: 'optimize the app',
      base_score: 0.55,
      keywords: ['optimize', 'performance', 'speed', 'faster', 'slow', 'app', 'application'],
      negative_indicators: ['specific', 'exact', 'which', 'where'],
      clarification_questions: [
        'Which part needs optimization? (frontend | backend | database | API)',
        'What performance issue are you experiencing?',
        'What is your target performance metric?'
      ],
      inference_rules: [
        {
          condition: 'recent_backend_files',
          condition_type: 'file',
          confidence_boost: 0.15,
          inferred_domain: 'backend',
          inferred_focus: 'performance'
        },
        {
          condition: 'recent_frontend_files',
          condition_type: 'file',
          confidence_boost: 0.15,
          inferred_domain: 'frontend',
          inferred_focus: 'performance'
        },
        {
          condition: 'recent_database_changes',
          condition_type: 'file',
          confidence_boost: 0.18,
          inferred_domain: 'backend',
          inferred_focus: 'database_optimization'
        }
      ]
    });

    // Pattern 5: "update code"
    this.vaguePatterns.set('update_code', {
      pattern: 'update code',
      base_score: 0.48,
      keywords: ['update', 'change', 'modify', 'edit', 'code'],
      negative_indicators: ['specific', 'exact', 'which', 'what', 'where'],
      clarification_questions: [
        'What do you want to update? (dependencies | features | logic | styling)',
        'Which file or module needs updating?',
        'What specific change are you making?'
      ],
      inference_rules: [
        {
          condition: 'recent_dependency_updates',
          condition_type: 'session',
          confidence_boost: 0.12,
          inferred_focus: 'dependencies'
        },
        {
          condition: 'recent_feature_additions',
          condition_type: 'session',
          confidence_boost: 0.15,
          inferred_focus: 'features'
        }
      ]
    });
  }

  /**
   * disambiguate — Main entry point cho disambiguation
   *
   * @param userRequest - User's original request
   * @param sessionContext - Current session context
   * @param projectContext - Project context
   * @returns DisambiguationResult
   */
  public async disambiguate(
    userRequest: string,
    sessionContext?: SessionContext,
    projectContext?: ProjectContext
  ): Promise<DisambiguationResult> {
    const startTime = Date.now();

    // Check cache first
    const cacheKey = this.generateCacheKey(userRequest, sessionContext);
    const cached = this.cache.get(cacheKey);
    if (cached && (Date.now() - cached.response_time_ms < this.cache_ttl)) {
      return cached;
    }

    // Step 1: Detect vague patterns
    const matchedPattern = this.detectVaguePattern(userRequest);

    if (!matchedPattern) {
      // Not a vague request, proceed normally
      return {
        is_vague: false,
        base_confidence: 1.0,
        context_boost: 0.0,
        final_confidence: 1.0,
        decision: 'proceed',
        applied_rules: [],
        reasoning: 'Request is clear and specific, no disambiguation needed',
        response_time_ms: Date.now() - startTime
      };
    }

    // Step 2: Calculate base confidence
    const baseConfidence = matchedPattern.base_score;

    // Step 3: Extract context if available
    let contextBoost = 0.0;
    let appliedRules: string[] = [];
    let inferredDomain: string | undefined;
    let inferredFocus: string | undefined;

    if (sessionContext && projectContext) {
      const inferenceResult = this.applyInferenceRules(
        matchedPattern,
        sessionContext,
        projectContext
      );
      contextBoost = inferenceResult.boost;
      appliedRules = inferenceResult.applied_rules;
      inferredDomain = inferenceResult.inferred_domain;
      inferredFocus = inferenceResult.inferred_focus;
    }

    // Step 4: Calculate final confidence
    const finalConfidence = Math.min(1.0, baseConfidence + contextBoost);

    // Step 5: Make decision based on confidence thresholds
    const decision = this.makeDecision(finalConfidence);

    // Step 6: Generate clarification question if needed
    let clarificationQuestion: string | undefined;
    if (decision === 'ask' && matchedPattern.clarification_questions.length > 0) {
      clarificationQuestion = this.selectBestClarificationQuestion(
        matchedPattern,
        sessionContext,
        projectContext
      );
    }

    // Step 7: Generate reasoning
    const reasoning = this.generateReasoning(
      matchedPattern,
      baseConfidence,
      contextBoost,
      finalConfidence,
      decision,
      appliedRules
    );

    const result: DisambiguationResult = {
      is_vague: true,
      matched_pattern: matchedPattern,
      base_confidence: baseConfidence,
      context_boost: contextBoost,
      final_confidence: finalConfidence,
      decision,
      clarification_question,
      inferred_domain: inferredDomain,
      inferred_focus: inferredFocus,
      applied_rules: appliedRules,
      reasoning,
      response_time_ms: Date.now() - startTime
    };

    // Cache result
    this.cache.set(cacheKey, result);

    return result;
  }

  /**
   * detectVaguePattern — Detect if request matches any vague pattern
   */
  private detectVaguePattern(userRequest: string): VaguePattern | null {
    const requestLower = userRequest.toLowerCase();

    for (const [key, pattern] of this.vaguePatterns.entries()) {
      // Check if any keywords match
      const keywordMatches = pattern.keywords.filter(kw =>
        requestLower.includes(kw.toLowerCase())
      ).length;

      // Check if any negative indicators present
      const negativeMatches = pattern.negative_indicators.filter(ni =>
        requestLower.includes(ni.toLowerCase())
      ).length;

      // Match if: sufficient keywords AND minimal negative indicators
      if (keywordMatches >= 2 && negativeMatches === 0) {
        return pattern;
      }
    }

    return null;
  }

  /**
   * applyInferenceRules — Apply inference rules to boost confidence
   */
  private applyInferenceRules(
    pattern: VaguePattern,
    sessionContext: SessionContext,
    projectContext: ProjectContext
  ): {
    boost: number;
    applied_rules: string[];
    inferred_domain?: string;
    inferred_focus?: string;
  } {
    let totalBoost = 0.0;
    const appliedRules: string[] = [];
    let inferredDomain: string | undefined;
    let inferredFocus: string | undefined;

    for (const rule of pattern.inference_rules) {
      const conditionMet = this.evaluateCondition(rule, sessionContext, projectContext);

      if (conditionMet) {
        totalBoost += rule.confidence_boost;
        appliedRules.push(rule.condition);

        if (rule.inferred_domain && !inferredDomain) {
          inferredDomain = rule.inferred_domain;
        }
        if (rule.inferred_focus && !inferredFocus) {
          inferredFocus = rule.inferred_focus;
        }
      }
    }

    return {
      boost: Math.min(0.30, totalBoost), // Cap at +0.30 max
      applied_rules: appliedRules,
      inferred_domain: inferredDomain,
      inferred_focus: inferredFocus
    };
  }

  /**
   * evaluateCondition — Evaluate an inference rule condition
   */
  private evaluateCondition(
    rule: InferenceRule,
    sessionContext: SessionContext,
    projectContext: ProjectContext
  ): boolean {
    switch (rule.condition_type) {
      case 'project':
        return this.evaluateProjectCondition(rule.condition, projectContext);
      case 'session':
        return this.evaluateSessionCondition(rule.condition, sessionContext);
      case 'file':
        return this.evaluateFileCondition(rule.condition, sessionContext);
      case 'behavioral':
        return this.evaluateBehavioralCondition(rule.condition, sessionContext);
      default:
        return false;
    }
  }

  /**
   * evaluateProjectCondition — Evaluate project-level conditions
   */
  private evaluateProjectCondition(condition: string, projectContext: ProjectContext): boolean {
    switch (condition) {
      case 'project_is_frontend_heavy':
        return projectContext.primary_domain === 'frontend';
      case 'project_is_backend_heavy':
        return projectContext.primary_domain === 'backend';
      case 'project_is_new':
        // Simple heuristic: project < 3 months old
        return projectContext.age_months < 3;
      default:
        return false;
    }
  }

  /**
   * evaluateSessionCondition — Evaluate session-level conditions
   */
  private evaluateSessionCondition(condition: string, sessionContext: SessionContext): boolean {
    switch (condition) {
      case 'recent_errors_in_logs':
        return sessionContext.recent_tasks.some(task =>
          task.includes('error') || task.includes('bug') || task.includes('fix')
        );
      case 'recent_performance_issues':
        return sessionContext.recent_tasks.some(task =>
          task.includes('slow') || task.includes('performance') || task.includes('optimize')
        );
      case 'recent_refactoring_tasks':
        return sessionContext.recent_tasks.some(task =>
          task.includes('refactor') || task.includes('improve') || task.includes('clean')
        );
      case 'recent_dependency_updates':
        return sessionContext.recent_tasks.some(task =>
          task.includes('update') || task.includes('upgrade') || task.includes('dependency')
        );
      case 'recent_feature_additions':
        return sessionContext.recent_tasks.some(task =>
          task.includes('add') || task.includes('implement') || task.includes('feature')
        );
      default:
        return false;
    }
  }

  /**
   * evaluateFileCondition — Evaluate file-level conditions
   */
  private evaluateFileCondition(condition: string, sessionContext: SessionContext): boolean {
    const recentFiles = sessionContext.recently_modified_files || [];

    switch (condition) {
      case 'recent_backend_files':
        return recentFiles.some(file =>
          file.includes('server') || file.includes('api') || file.includes('database') ||
          file.includes('controller') || file.includes('model')
        );
      case 'recent_frontend_files':
        return recentFiles.some(file =>
          file.includes('component') || file.includes('page') || file.includes('.vue') ||
          file.includes('.jsx') || file.includes('.tsx')
        );
      case 'recent_database_changes':
        return recentFiles.some(file =>
          file.includes('database') || file.includes('migration') || file.includes('schema')
        );
      case 'recent_ui_changes':
        return recentFiles.some(file =>
          file.includes('component') || file.includes('.css') || file.includes('style')
        );
      case 'recent_api_changes':
        return recentFiles.some(file =>
          file.includes('api') || file.includes('route') || file.includes('endpoint')
        );
      default:
        return false;
    }
  }

  /**
   * evaluateBehavioralCondition — Evaluate behavioral conditions
   */
  private evaluateBehavioralCondition(condition: string, sessionContext: SessionContext): boolean {
    switch (condition) {
      case 'near_deadline':
        // Heuristic: frequent tasks in short time = deadline pressure
        return sessionContext.recent_tasks.length > 5 &&
               sessionContext.session_duration_minutes < 60;
      default:
        return false;
    }
  }

  /**
   * makeDecision — Make decision based on confidence thresholds
   */
  private makeDecision(finalConfidence: number): 'ask' | 'assume' | 'proceed' {
    if (finalConfidence < this.thresholds.ask_threshold) {
      return 'ask';
    } else if (finalConfidence < this.thresholds.assume_threshold) {
      return 'assume';
    } else {
      return 'proceed';
    }
  }

  /**
   * selectBestClarificationQuestion — Select most relevant clarification question
   */
  private selectBestClarificationQuestion(
    pattern: VaguePattern,
    sessionContext?: SessionContext,
    projectContext?: ProjectContext
  ): string {
    // Simple heuristic: return first question
    // TODO: Implement smarter selection based on context
    return pattern.clarification_questions[0];
  }

  /**
   * generateReasoning — Generate human-readable reasoning
   */
  private generateReasoning(
    pattern: VaguePattern,
    baseConfidence: number,
    contextBoost: number,
    finalConfidence: number,
    decision: 'ask' | 'assume' | 'proceed',
    appliedRules: string[]
  ): string {
    let reasoning = `Detected vague pattern: "${pattern.pattern}"\n`;
    reasoning += `Base confidence: ${(baseConfidence * 100).toFixed(1)}%\n`;

    if (contextBoost > 0) {
      reasoning += `Context boost: +${(contextBoost * 100).toFixed(1)}% (from ${appliedRules.length} rules)\n`;
      reasoning += `Applied rules: ${appliedRules.join(', ')}\n`;
    }

    reasoning += `Final confidence: ${(finalConfidence * 100).toFixed(1)}%\n`;
    reasoning += `Decision: ${decision.toUpperCase()}\n`;

    switch (decision) {
      case 'ask':
        reasoning += 'Confidence too low (<55%) - need user clarification';
        break;
      case 'assume':
        reasoning += 'Moderate confidence (55-69%) - making smart assumption based on context';
        break;
      case 'proceed':
        reasoning += 'High confidence (≥70%) - proceeding with inferred intent';
        break;
    }

    return reasoning;
  }

  /**
   * generateCacheKey — Generate cache key for request
   */
  private generateCacheKey(userRequest: string, sessionContext?: SessionContext): string {
    const requestKey = userRequest.toLowerCase().trim();
    const sessionKey = sessionContext
      ? `${sessionContext.primary_domain}_${sessionContext.recent_tasks.length}`
      : 'no_session';
    return `${requestKey}_${sessionKey}`;
  }

  /**
   * clearCache — Clear disambiguation cache
   */
  public clearCache(): void {
    this.cache.clear();
  }

  /**
   * getStats — Get disambiguation statistics
   */
  public getStats(): {
    total_patterns: number;
    cache_size: number;
    cache_hit_rate: number;
  } {
    return {
      total_patterns: this.vaguePatterns.size,
      cache_size: this.cache.size,
      cache_hit_rate: 0.0 // TODO: Track cache hits
    };
  }
}

export default IntentDisambiguator;

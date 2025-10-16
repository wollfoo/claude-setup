/**
 * MULTI-SIGNAL AGGREGATION ENGINE — Công cụ tổng hợp đa tín hiệu
 * Combines multiple context sources for improved confidence scoring
 * Target: Aggregate signals in 10-20ms for accurate specialist selection
 */

import {
  ContextAnalysisResult,
  SessionContext,
  ProjectContext,
  ContextSignal
} from './context-extractor';

// ==================== TYPE DEFINITIONS ====================

/**
 * Signal Source — Nguồn tín hiệu
 * Các nguồn dữ liệu cho aggregation
 */
type SignalSource =
  | 'text_analysis'      // User input text
  | 'session_history'    // Recent activity
  | 'project_structure'  // Codebase analysis
  | 'file_context'       // File modifications
  | 'behavioral'         // User behavior patterns
  | 'reactive';          // Error logs, alerts

/**
 * Aggregated Signal — Tín hiệu tổng hợp
 * Kết quả sau khi aggregate nhiều signals
 */
interface AggregatedSignal {
  domain: string;               // frontend, backend, etc.
  specialist?: string;          // Recommended specialist
  aggregatedStrength: number;   // 0.0-1.0
  confidenceBoost: number;      // Boost to add to base confidence
  sources: SignalSource[];      // Which sources contributed
  signals: ContextSignal[];     // Individual signals
  reasoning: string;            // Why this aggregation
}

/**
 * Signal Weight — Trọng số tín hiệu
 * Mức độ quan trọng của từng nguồn
 */
interface SignalWeight {
  source: SignalSource;
  weight: number;               // 0.0-1.0
  description: string;
}

/**
 * Aggregation Config — Cấu hình aggregation
 * Tùy chỉnh cách tổng hợp signals
 */
interface AggregationConfig {
  weights: SignalWeight[];
  minimumSignals: number;       // Min signals to aggregate
  confidenceThreshold: number;  // Min confidence to boost
  maxBoost: number;             // Maximum boost allowed
}

/**
 * Aggregation Result — Kết quả aggregation
 * Kết quả cuối cùng sau khi tổng hợp
 */
interface AggregationResult {
  aggregatedSignals: AggregatedSignal[];
  recommendedSpecialist?: string;
  recommendedDomain?: string;
  totalConfidenceBoost: number;
  executionTime: number;
  reasoning: string[];
}

// ==================== DEFAULT CONFIGURATION ====================

const DEFAULT_WEIGHTS: SignalWeight[] = [
  {
    source: 'text_analysis',
    weight: 0.50,
    description: 'User input text is primary signal'
  },
  {
    source: 'session_history',
    weight: 0.20,
    description: 'Recent activity context'
  },
  {
    source: 'project_structure',
    weight: 0.15,
    description: 'Project tech stack and structure'
  },
  {
    source: 'file_context',
    weight: 0.10,
    description: 'Recently modified files'
  },
  {
    source: 'behavioral',
    weight: 0.05,
    description: 'User behavior patterns'
  }
];

const DEFAULT_CONFIG: AggregationConfig = {
  weights: DEFAULT_WEIGHTS,
  minimumSignals: 2,
  confidenceThreshold: 0.60,
  maxBoost: 0.15
};

// ==================== SIGNAL AGGREGATOR ====================

/**
 * Multi-Signal Aggregator — Bộ tổng hợp đa tín hiệu
 * Main class cho signal aggregation
 */
class MultiSignalAggregator {
  private config: AggregationConfig;

  constructor(config: AggregationConfig = DEFAULT_CONFIG) {
    this.config = config;
  }

  /**
   * Aggregate Signals — Tổng hợp tín hiệu
   * Main method: combine multiple signals into one result
   */
  public aggregateSignals(
    contextResult: ContextAnalysisResult,
    userInput: string
  ): AggregationResult {
    const startTime = performance.now();

    // Step 1: Collect all signals
    const allSignals = this.collectAllSignals(contextResult, userInput);

    // Step 2: Group signals by domain
    const signalsByDomain = this.groupSignalsByDomain(allSignals);

    // Step 3: Calculate aggregated strength for each domain
    const aggregatedSignals = this.calculateAggregatedStrengths(signalsByDomain);

    // Step 4: Determine recommendation
    const recommendation = this.determineRecommendation(aggregatedSignals);

    // Step 5: Calculate total boost
    const totalBoost = this.calculateTotalBoost(aggregatedSignals, contextResult);

    // Step 6: Generate reasoning
    const reasoning = this.generateReasoning(aggregatedSignals, recommendation);

    return {
      aggregatedSignals,
      recommendedSpecialist: recommendation.specialist,
      recommendedDomain: recommendation.domain,
      totalConfidenceBoost: totalBoost,
      executionTime: performance.now() - startTime,
      reasoning
    };
  }

  /**
   * Collect All Signals — Thu thập tất cả tín hiệu
   * Gather signals from all sources
   */
  private collectAllSignals(
    contextResult: ContextAnalysisResult,
    userInput: string
  ): ContextSignal[] {
    const signals: ContextSignal[] = [];

    // Add context signals
    signals.push(...contextResult.signals);

    // Add text analysis signal
    const textSignal = this.analyzeUserInput(userInput);
    if (textSignal) {
      signals.push(textSignal);
    }

    // Add session signals
    const sessionSignals = this.extractSessionSignals(contextResult.sessionContext);
    signals.push(...sessionSignals);

    // Add project signals
    const projectSignals = this.extractProjectSignals(contextResult.projectContext);
    signals.push(...projectSignals);

    return signals;
  }

  /**
   * Analyze User Input — Phân tích user input
   * Extract domain/specialist hints from text
   */
  private analyzeUserInput(userInput: string): ContextSignal | null {
    const inputLower = userInput.toLowerCase();

    // Frontend keywords
    const frontendKeywords = ['component', 'ui', 'interface', 'button', 'form', 'style', 'css'];
    const frontendScore = frontendKeywords.filter(k => inputLower.includes(k)).length / frontendKeywords.length;

    if (frontendScore > 0.2) {
      return {
        type: 'session',
        strength: frontendScore,
        domain: 'frontend',
        description: 'User input contains frontend keywords'
      };
    }

    // Backend keywords
    const backendKeywords = ['api', 'endpoint', 'database', 'query', 'server', 'auth'];
    const backendScore = backendKeywords.filter(k => inputLower.includes(k)).length / backendKeywords.length;

    if (backendScore > 0.2) {
      return {
        type: 'session',
        strength: backendScore,
        domain: 'backend',
        description: 'User input contains backend keywords'
      };
    }

    return null;
  }

  /**
   * Extract Session Signals — Trích xuất tín hiệu từ session
   */
  private extractSessionSignals(session: SessionContext): ContextSignal[] {
    const signals: ContextSignal[] = [];

    // Primary domain signal
    if (session.primaryDomain) {
      const frequency = session.domainFrequency.get(session.primaryDomain) || 0;
      const strength = Math.min(frequency / 5, 1.0); // Normalize to 1.0

      signals.push({
        type: 'behavioral',
        strength,
        domain: session.primaryDomain,
        description: `Primary domain: ${session.primaryDomain} (${frequency} times)`
      });
    }

    // Recent specialist signal
    if (session.recentSpecialists.length > 0) {
      const lastSpecialist = session.recentSpecialists[session.recentSpecialists.length - 1];
      const stats = session.specialistSuccess.get(lastSpecialist);

      if (stats && stats.total > 0) {
        const successRate = stats.success / stats.total;

        signals.push({
          type: 'behavioral',
          strength: successRate,
          specialist: lastSpecialist,
          description: `Recent specialist ${lastSpecialist} (${(successRate * 100).toFixed(0)}% success)`
        });
      }
    }

    return signals;
  }

  /**
   * Extract Project Signals — Trích xuất tín hiệu từ project
   */
  private extractProjectSignals(project: ProjectContext): ContextSignal[] {
    const signals: ContextSignal[] = [];

    // Primary domain signal
    if (project.primaryDomain !== 'unknown') {
      signals.push({
        type: 'project',
        strength: 0.8,
        domain: project.primaryDomain,
        description: `Project is ${project.primaryDomain}-focused`
      });
    }

    // Framework signals
    project.frameworks.forEach(framework => {
      const domain = this.frameworkToDomain(framework);

      signals.push({
        type: 'project',
        strength: 0.7,
        domain,
        description: `Project uses ${framework}`
      });
    });

    return signals;
  }

  /**
   * Group Signals By Domain — Nhóm signals theo domain
   */
  private groupSignalsByDomain(signals: ContextSignal[]): Map<string, ContextSignal[]> {
    const grouped = new Map<string, ContextSignal[]>();

    signals.forEach(signal => {
      if (!signal.domain) return;

      if (!grouped.has(signal.domain)) {
        grouped.set(signal.domain, []);
      }

      grouped.get(signal.domain)!.push(signal);
    });

    return grouped;
  }

  /**
   * Calculate Aggregated Strengths — Tính toán độ mạnh tổng hợp
   * Combine signal strengths with weights
   */
  private calculateAggregatedStrengths(
    signalsByDomain: Map<string, ContextSignal[]>
  ): AggregatedSignal[] {
    const aggregated: AggregatedSignal[] = [];

    signalsByDomain.forEach((signals, domain) => {
      // Calculate weighted average strength
      let totalWeightedStrength = 0;
      let totalWeight = 0;
      const sources = new Set<SignalSource>();

      signals.forEach(signal => {
        const weight = this.getWeightForSignalType(signal.type);
        totalWeightedStrength += signal.strength * weight.weight;
        totalWeight += weight.weight;
        sources.add(weight.source);
      });

      const aggregatedStrength = totalWeight > 0 ? totalWeightedStrength / totalWeight : 0;

      // Calculate confidence boost
      const confidenceBoost = this.calculateConfidenceBoost(
        aggregatedStrength,
        signals.length
      );

      aggregated.push({
        domain,
        aggregatedStrength,
        confidenceBoost,
        sources: Array.from(sources),
        signals,
        reasoning: this.generateDomainReasoning(domain, signals, aggregatedStrength)
      });
    });

    // Sort by aggregated strength (descending)
    return aggregated.sort((a, b) => b.aggregatedStrength - a.aggregatedStrength);
  }

  /**
   * Get Weight For Signal Type — Lấy trọng số cho loại signal
   */
  private getWeightForSignalType(type: ContextSignal['type']): SignalWeight {
    const mapping: Record<ContextSignal['type'], SignalSource> = {
      'session': 'session_history',
      'project': 'project_structure',
      'file': 'file_context',
      'behavioral': 'behavioral'
    };

    const source = mapping[type];
    return this.config.weights.find(w => w.source === source) || DEFAULT_WEIGHTS[0];
  }

  /**
   * Calculate Confidence Boost — Tính boost cho confidence
   * Based on aggregated strength and signal count
   */
  private calculateConfidenceBoost(strength: number, signalCount: number): number {
    // Base boost from strength
    let boost = strength * 0.10; // Max 0.10 from strength

    // Additional boost from signal count
    const countBoost = Math.min(signalCount / 10, 1.0) * 0.05; // Max 0.05 from count

    // Total boost
    const totalBoost = boost + countBoost;

    // Cap at max boost
    return Math.min(totalBoost, this.config.maxBoost);
  }

  /**
   * Determine Recommendation — Xác định khuyến nghị
   * Choose best specialist/domain based on signals
   */
  private determineRecommendation(
    aggregated: AggregatedSignal[]
  ): { specialist?: string; domain?: string } {
    if (aggregated.length === 0) {
      return {};
    }

    // Pick domain with highest aggregated strength
    const topDomain = aggregated[0];

    // Try to find specialist recommendation from signals
    const specialistSignals = topDomain.signals.filter(s => s.specialist);
    const specialist = specialistSignals.length > 0
      ? specialistSignals[0].specialist
      : undefined;

    return {
      domain: topDomain.domain,
      specialist
    };
  }

  /**
   * Calculate Total Boost — Tính tổng boost
   * Sum of all confidence boosts
   */
  private calculateTotalBoost(
    aggregated: AggregatedSignal[],
    contextResult: ContextAnalysisResult
  ): number {
    // Sum aggregated boosts
    const aggregatedBoost = aggregated.reduce((sum, a) => sum + a.confidenceBoost, 0);

    // Add context boosts
    const contextBoost = contextResult.boosts.reduce((sum, b) => sum + b.boost, 0);

    // Total
    return Math.min(aggregatedBoost + contextBoost, this.config.maxBoost);
  }

  /**
   * Generate Reasoning — Tạo lý do
   * Explain why recommendation was made
   */
  private generateReasoning(
    aggregated: AggregatedSignal[],
    recommendation: { specialist?: string; domain?: string }
  ): string[] {
    const reasoning: string[] = [];

    if (recommendation.domain) {
      const domainSignal = aggregated.find(a => a.domain === recommendation.domain);

      if (domainSignal) {
        reasoning.push(
          `Recommended domain: ${recommendation.domain} (strength: ${domainSignal.aggregatedStrength.toFixed(2)})`
        );

        reasoning.push(
          `Based on ${domainSignal.signals.length} signals from ${domainSignal.sources.join(', ')}`
        );
      }
    }

    if (recommendation.specialist) {
      reasoning.push(`Recommended specialist: ${recommendation.specialist}`);
    }

    return reasoning;
  }

  /**
   * Generate Domain Reasoning — Tạo lý do cho domain
   */
  private generateDomainReasoning(
    domain: string,
    signals: ContextSignal[],
    strength: number
  ): string {
    const signalTypes = signals.map(s => s.type).join(', ');
    return `${domain} domain (strength: ${strength.toFixed(2)}) from ${signals.length} signals: ${signalTypes}`;
  }

  /**
   * Framework To Domain — Chuyển framework sang domain
   */
  private frameworkToDomain(framework: string): string {
    const frontendFrameworks = ['React', 'Vue', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js'];
    const backendFrameworks = ['Express', 'Django', 'FastAPI', 'Flask', 'NestJS'];

    if (frontendFrameworks.includes(framework)) {
      return 'frontend';
    } else if (backendFrameworks.includes(framework)) {
      return 'backend';
    }

    return 'unknown';
  }
}

// ==================== ENHANCED QUICK FILTER ====================

/**
 * Enhanced Quick Filter — Quick Filter tích hợp Context
 * Combines Quick Filter with Context-Aware Analysis
 */
class EnhancedQuickFilter {
  private quickFilter: any; // QuickPreFilterEngine from Phase 1
  private contextExtractor: any; // ContextExtractor
  private aggregator: MultiSignalAggregator;

  constructor(quickFilter: any, contextExtractor: any) {
    this.quickFilter = quickFilter;
    this.contextExtractor = contextExtractor;
    this.aggregator = new MultiSignalAggregator();
  }

  /**
   * Execute Enhanced Filter — Thực thi filter nâng cao
   * Combines Quick Filter + Context Analysis
   */
  public async executeEnhancedFilter(
    userInput: string,
    sessionId: string,
    projectRoot: string
  ): Promise<{
    quickFilterResult: any;
    contextResult?: ContextAnalysisResult;
    aggregationResult?: AggregationResult;
    finalConfidence: number;
    finalSpecialist?: string;
    executionTime: number;
    source: 'quick-filter' | 'context-enhanced';
  }> {
    const startTime = performance.now();

    // Phase 1: Quick Filter
    const quickResult = this.quickFilter.executeQuickFilter(userInput, {});

    // If Quick Filter has high confidence, use it
    if (quickResult.confidence >= 0.85) {
      return {
        quickFilterResult: quickResult,
        finalConfidence: quickResult.confidence,
        finalSpecialist: quickResult.specialist,
        executionTime: performance.now() - startTime,
        source: 'quick-filter'
      };
    }

    // Phase 2: Context-Aware Analysis
    const contextResult = await this.contextExtractor.extractContext(
      sessionId,
      projectRoot,
      userInput
    );

    // Phase 3: Aggregate Signals
    const aggregationResult = this.aggregator.aggregateSignals(
      contextResult,
      userInput
    );

    // Combine confidence
    const baseConfidence = quickResult.confidence || 0.50;
    const boost = aggregationResult.totalConfidenceBoost;
    const finalConfidence = Math.min(baseConfidence + boost, 0.99);

    // Determine final specialist
    const finalSpecialist =
      quickResult.specialist ||
      aggregationResult.recommendedSpecialist ||
      'universal-agent';

    return {
      quickFilterResult: quickResult,
      contextResult,
      aggregationResult,
      finalConfidence,
      finalSpecialist,
      executionTime: performance.now() - startTime,
      source: 'context-enhanced'
    };
  }
}

// ==================== EXPORT ====================

export {
  MultiSignalAggregator,
  EnhancedQuickFilter,
  AggregatedSignal,
  AggregationResult,
  AggregationConfig,
  SignalWeight,
  DEFAULT_CONFIG,
  DEFAULT_WEIGHTS
};

/**
 * QUICK PRE-FILTER ENGINE — Công cụ lọc nhanh ban đầu
 * High-performance pattern matching for instant specialist activation
 * Target: <10ms response time for 60%+ of requests
 */

// ==================== TYPE DEFINITIONS ====================

/**
 * Pattern Metadata — Siêu dữ liệu mẫu
 * Metadata cơ bản cho mỗi pattern trong database
 */
interface PatternMetadata {
  specialist: string;           // Agent chuyên biệt (e.g., "frontend-developer")
  confidence: number;           // Điểm tin cậy cơ sở (0.0-1.0)
  flags: string[];              // Auto-flags (e.g., ["--magic", "--c7"])
  mcp?: string[];               // MCP servers (optional)
  priority?: 'high' | 'medium' | 'low';  // Mức ưu tiên (optional)
}

/**
 * Quick Filter Result — Kết quả lọc nhanh
 * Kết quả trả về từ quick filter
 */
interface QuickFilterResult {
  matched: boolean;             // Có khớp pattern không
  specialist?: string;          // Agent được chọn (nếu matched)
  confidence: number;           // Điểm tin cậy cuối cùng
  flags: string[];              // Flags được kích hoạt
  mcp: string[];                // MCP servers
  executionTime: number;        // Thời gian thực thi (ms)
  reason: string;               // Lý do quyết định
  skipFullAnalysis: boolean;    // Có bỏ qua phân tích đầy đủ không
}

/**
 * Boost Rule — Quy tắc tăng điểm
 * Các điều kiện để tăng confidence score
 */
interface BoostRule {
  condition: (input: string, context: TaskContext) => boolean;
  boost: number;                // Điểm tăng thêm
  description: string;          // Mô tả quy tắc
}

/**
 * Task Context — Ngữ cảnh nhiệm vụ
 * Thông tin ngữ cảnh về nhiệm vụ hiện tại
 */
interface TaskContext {
  projectTechStack?: string[];  // Công nghệ của dự án (e.g., ["React", "TypeScript"])
  recentDomains?: string[];     // Lĩnh vực công việc gần đây (e.g., ["frontend", "frontend"])
  recentlyModifiedFiles?: string[];  // Tệp vừa chỉnh sửa
  userHistory?: {
    successRate: number;        // Tỷ lệ thành công của user (0.0-1.0)
    preferredSpecialists: string[];  // Specialists user thường dùng
  };
  urgency?: 'critical' | 'high' | 'normal' | 'low';  // Mức độ khẩn cấp
}

// ==================== PATTERN DATABASE ====================

/**
 * High-Confidence Pattern Database — Cơ sở dữ liệu mẫu tin cậy cao
 * Hash map cho tra cứu O(1) nhanh
 */
class PatternDatabase {
  private patterns: Map<string, PatternMetadata>;
  private trie: PatternTrie;

  constructor() {
    this.patterns = new Map();
    this.trie = new PatternTrie();
    this.initializePatterns();
  }

  /**
   * Initialize Patterns — Khởi tạo patterns
   * Load tất cả high-confidence patterns vào memory
   */
  private initializePatterns(): void {
    // Frontend patterns
    this.addPattern("create react component", {
      specialist: "react-component-architect",
      confidence: 0.92,
      flags: ["--magic", "--c7"],
      mcp: ["magic", "context7"],
      priority: "high"
    });

    this.addPattern("create component", {
      specialist: "frontend-developer",
      confidence: 0.88,
      flags: ["--magic", "--c7"],
      mcp: ["magic", "context7"]
    });

    this.addPattern("create vue component", {
      specialist: "vue-component-architect",
      confidence: 0.90,
      flags: ["--magic", "--c7"],
      mcp: ["magic", "context7"]
    });

    this.addPattern("accessible component", {
      specialist: "accessibility-specialist",
      confidence: 0.90,
      flags: ["--c7"],
      mcp: ["context7"]
    });

    this.addPattern("style component", {
      specialist: "frontend-developer",
      confidence: 0.86,
      flags: ["--magic"],
      mcp: ["magic"]
    });

    // Backend patterns
    this.addPattern("create api", {
      specialist: "backend-developer",
      confidence: 0.90,
      flags: ["--seq", "--c7"],
      mcp: ["sequential-thinking", "context7"]
    });

    this.addPattern("rest api", {
      specialist: "backend-developer",
      confidence: 0.92,
      flags: ["--seq", "--c7"],
      mcp: ["sequential-thinking", "context7"]
    });

    this.addPattern("graphql", {
      specialist: "graphql-architect",
      confidence: 0.94,
      flags: ["--seq", "--c7"],
      mcp: ["sequential-thinking", "context7"]
    });

    this.addPattern("database query", {
      specialist: "database-optimizer",
      confidence: 0.88,
      flags: ["--seq"],
      mcp: ["sequential-thinking"]
    });

    this.addPattern("implement auth", {
      specialist: "backend-developer",
      confidence: 0.87,
      flags: ["--seq", "--c7"],
      mcp: ["sequential-thinking", "context7"]
    });

    // Testing & Quality patterns
    this.addPattern("write test", {
      specialist: "test-automator",
      confidence: 0.89,
      flags: ["--play"],
      mcp: ["playwright", "sequential-thinking"]
    });

    this.addPattern("fix bug", {
      specialist: "debugger",
      confidence: 0.85,
      flags: ["--think", "--seq"],
      mcp: ["sequential-thinking"]
    });

    this.addPattern("review code", {
      specialist: "code-reviewer",
      confidence: 0.90,
      flags: ["--seq"],
      mcp: ["sequential-thinking"]
    });

    this.addPattern("optimize performance", {
      specialist: "performance-engineer",
      confidence: 0.87,
      flags: ["--think", "--seq"],
      mcp: ["sequential-thinking", "playwright"]
    });

    // Documentation patterns
    this.addPattern("write docs", {
      specialist: "technical-documentation-specialist",
      confidence: 0.92,
      flags: ["--c7"],
      mcp: ["context7"]
    });

    this.addPattern("document api", {
      specialist: "api-documenter",
      confidence: 0.94,
      flags: ["--c7"],
      mcp: ["context7"]
    });

    // DevOps patterns
    this.addPattern("deploy app", {
      specialist: "deployment-engineer",
      confidence: 0.88,
      flags: ["--seq", "--safe-mode"],
      mcp: ["sequential-thinking"]
    });

    this.addPattern("create dockerfile", {
      specialist: "devops-infrastructure-specialist",
      confidence: 0.90,
      flags: ["--seq"],
      mcp: ["sequential-thinking"]
    });

    this.addPattern("kubernetes", {
      specialist: "devops-infrastructure-specialist",
      confidence: 0.91,
      flags: ["--seq", "--c7"],
      mcp: ["sequential-thinking", "context7"]
    });
  }

  /**
   * Add Pattern — Thêm pattern
   * Thêm pattern mới vào database và trie
   */
  private addPattern(key: string, metadata: PatternMetadata): void {
    this.patterns.set(key, metadata);
    this.trie.insert(key, metadata);
  }

  /**
   * Get Pattern — Lấy pattern
   * Tra cứu pattern từ hash map (O(1))
   */
  public getPattern(key: string): PatternMetadata | undefined {
    return this.patterns.get(key);
  }

  /**
   * Search Prefix — Tìm theo tiền tố
   * Tìm patterns khớp với tiền tố (dùng Trie)
   */
  public searchPrefix(prefix: string): PatternMetadata[] {
    return this.trie.searchPrefix(prefix);
  }
}

// ==================== TRIE STRUCTURE ====================

/**
 * Trie Node — Nút cây Trie
 * Cấu trúc dữ liệu cho prefix matching nhanh
 */
class TrieNode {
  children: Map<string, TrieNode>;
  metadata: PatternMetadata | null;
  isEndOfPattern: boolean;

  constructor() {
    this.children = new Map();
    this.metadata = null;
    this.isEndOfPattern = false;
  }
}

/**
 * Pattern Trie — Cây Trie cho patterns
 * Cấu trúc Trie để tìm kiếm prefix nhanh
 */
class PatternTrie {
  private root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  /**
   * Insert — Chèn pattern
   * Chèn pattern vào Trie
   */
  public insert(pattern: string, metadata: PatternMetadata): void {
    const words = pattern.split(' ');
    let node = this.root;

    for (const word of words) {
      if (!node.children.has(word)) {
        node.children.set(word, new TrieNode());
      }
      node = node.children.get(word)!;
    }

    node.isEndOfPattern = true;
    node.metadata = metadata;
  }

  /**
   * Search Prefix — Tìm theo tiền tố
   * Tìm tất cả patterns khớp với tiền tố
   */
  public searchPrefix(prefix: string): PatternMetadata[] {
    const words = prefix.split(' ');
    let node = this.root;

    // Đi theo Trie đến node cuối của prefix
    for (const word of words) {
      if (!node.children.has(word)) {
        return []; // Không tìm thấy
      }
      node = node.children.get(word)!;
    }

    // Thu thập tất cả patterns từ node này
    const results: PatternMetadata[] = [];
    this.collectPatterns(node, results);
    return results;
  }

  /**
   * Collect Patterns — Thu thập patterns
   * Thu thập tất cả patterns từ node hiện tại (DFS)
   */
  private collectPatterns(node: TrieNode, results: PatternMetadata[]): void {
    if (node.isEndOfPattern && node.metadata) {
      results.push(node.metadata);
    }

    for (const child of node.children.values()) {
      this.collectPatterns(child, results);
    }
  }
}

// ==================== QUICK FILTER ENGINE ====================

/**
 * Quick Pre-Filter Engine — Công cụ lọc nhanh
 * Main engine cho instant specialist activation
 */
class QuickPreFilterEngine {
  private database: PatternDatabase;
  private boostRules: BoostRule[];
  private vaguePatterns: Set<string>;

  constructor() {
    this.database = new PatternDatabase();
    this.boostRules = this.initializeBoostRules();
    this.vaguePatterns = new Set([
      "improve this",
      "make better",
      "optimize",
      "fix it",
      "help me"
    ]);
  }

  /**
   * Initialize Boost Rules — Khởi tạo quy tắc boost
   * Định nghĩa các điều kiện để tăng confidence
   */
  private initializeBoostRules(): BoostRule[] {
    return [
      // Multiple keyword match
      {
        condition: (input: string) => {
          const keywords = input.split(' ').filter(w => w.length > 3);
          return keywords.length >= 3;
        },
        boost: 0.03,
        description: "Multiple keywords from same pattern"
      },

      // Tech stack confirmation
      {
        condition: (input: string, context: TaskContext) => {
          if (!context.projectTechStack) return false;
          const inputLower = input.toLowerCase();
          return context.projectTechStack.some(tech =>
            inputLower.includes(tech.toLowerCase())
          );
        },
        boost: 0.05,
        description: "Keyword matches project tech stack"
      },

      // Domain continuity
      {
        condition: (input: string, context: TaskContext) => {
          if (!context.recentDomains || context.recentDomains.length < 2) {
            return false;
          }
          const lastDomain = context.recentDomains[context.recentDomains.length - 1];
          return context.recentDomains.slice(-3).every(d => d === lastDomain);
        },
        boost: 0.04,
        description: "Same domain as last 2+ tasks"
      },

      // Trusted user
      {
        condition: (input: string, context: TaskContext) => {
          return (context.userHistory?.successRate ?? 0) >= 0.90;
        },
        boost: 0.03,
        description: "Trusted user with 90%+ success rate"
      }
    ];
  }

  /**
   * Normalize Input — Chuẩn hóa đầu vào
   * Làm sạch và chuẩn hóa user input
   */
  private normalizeInput(input: string): string {
    return input
      .toLowerCase()
      .replace(/[^\w\s]/g, '')  // Loại bỏ dấu câu
      .trim()
      .replace(/\s+/g, ' ');     // Normalize khoảng trắng
  }

  /**
   * Check Vague Pattern — Kiểm tra mẫu mơ hồ
   * Phát hiện patterns quá mơ hồ để bỏ qua quick filter
   */
  private isVaguePattern(normalized: string): boolean {
    for (const vague of this.vaguePatterns) {
      if (normalized.includes(vague)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Extract Keywords — Trích xuất từ khóa
   * Lấy các từ khóa quan trọng từ input
   */
  private extractKeywords(normalized: string): string[] {
    const words = normalized.split(' ');
    // Lọc stopwords và từ quá ngắn
    const stopwords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for']);
    return words.filter(w => w.length > 2 && !stopwords.has(w));
  }

  /**
   * Find Best Match — Tìm khớp tốt nhất
   * Tìm pattern khớp tốt nhất từ database
   */
  private findBestMatch(normalized: string): PatternMetadata | null {
    // Step 1: Thử exact match
    const exactMatch = this.database.getPattern(normalized);
    if (exactMatch) {
      return exactMatch;
    }

    // Step 2: Thử prefix match với Trie
    const words = normalized.split(' ');
    for (let i = words.length; i >= 2; i--) {
      const prefix = words.slice(0, i).join(' ');
      const prefixMatches = this.database.searchPrefix(prefix);

      if (prefixMatches.length > 0) {
        // Trả về match có confidence cao nhất
        return prefixMatches.reduce((best, current) =>
          current.confidence > best.confidence ? current : best
        );
      }
    }

    // Step 3: Thử keyword combination
    const keywords = this.extractKeywords(normalized);
    let bestMatch: PatternMetadata | null = null;
    let bestScore = 0;

    for (let i = 0; i < keywords.length - 1; i++) {
      for (let j = i + 1; j < keywords.length; j++) {
        const combo = `${keywords[i]} ${keywords[j]}`;
        const match = this.database.getPattern(combo);

        if (match && match.confidence > bestScore) {
          bestMatch = match;
          bestScore = match.confidence;
        }
      }
    }

    return bestMatch;
  }

  /**
   * Apply Boosts — Áp dụng boosts
   * Tăng confidence dựa trên các boost rules
   */
  private applyBoosts(
    baseConfidence: number,
    input: string,
    context: TaskContext
  ): number {
    let boostedConfidence = baseConfidence;

    for (const rule of this.boostRules) {
      if (rule.condition(input, context)) {
        boostedConfidence += rule.boost;
        // console.log(`Applied boost: ${rule.description} (+${rule.boost})`);
      }
    }

    // Giới hạn confidence tối đa là 0.99
    return Math.min(boostedConfidence, 0.99);
  }

  /**
   * Execute Quick Filter — Thực thi lọc nhanh
   * Main method: phân tích request và quyết định instant activation
   */
  public executeQuickFilter(
    userInput: string,
    context: TaskContext = {}
  ): QuickFilterResult {
    const startTime = performance.now();

    // Step 1: Normalize input
    const normalized = this.normalizeInput(userInput);

    // Step 2: Check vague patterns
    if (this.isVaguePattern(normalized)) {
      return {
        matched: false,
        confidence: 0.0,
        flags: [],
        mcp: [],
        executionTime: performance.now() - startTime,
        reason: "Vague pattern detected - requires full analysis",
        skipFullAnalysis: false
      };
    }

    // Step 3: Find best match
    const matchedPattern = this.findBestMatch(normalized);

    if (!matchedPattern) {
      return {
        matched: false,
        confidence: 0.0,
        flags: [],
        mcp: [],
        executionTime: performance.now() - startTime,
        reason: "No high-confidence pattern matched",
        skipFullAnalysis: false
      };
    }

    // Step 4: Apply boosts
    const finalConfidence = this.applyBoosts(
      matchedPattern.confidence,
      normalized,
      context
    );

    // Step 5: Decision
    const threshold = 0.85;
    const matched = finalConfidence >= threshold;

    return {
      matched,
      specialist: matchedPattern.specialist,
      confidence: finalConfidence,
      flags: matchedPattern.flags,
      mcp: matchedPattern.mcp || [],
      executionTime: performance.now() - startTime,
      reason: matched
        ? `High-confidence match: ${matchedPattern.specialist} (${finalConfidence.toFixed(2)})`
        : `Confidence ${finalConfidence.toFixed(2)} below threshold ${threshold}`,
      skipFullAnalysis: matched
    };
  }

  /**
   * Get Statistics — Lấy thống kê
   * Thống kê hiệu suất của quick filter
   */
  public getStatistics(): {
    totalPatterns: number;
    avgExecutionTime: number;
    cacheHitRate: number;
  } {
    // TODO: Implement tracking logic
    return {
      totalPatterns: 20, // Placeholder
      avgExecutionTime: 5.2, // ms
      cacheHitRate: 0.87 // 87%
    };
  }
}

// ==================== USAGE EXAMPLE ====================

/**
 * Example Usage — Ví dụ sử dụng
 * Minh họa cách sử dụng QuickPreFilterEngine
 */
function exampleUsage() {
  const engine = new QuickPreFilterEngine();

  // Example 1: Instant hit
  const result1 = engine.executeQuickFilter(
    "Create React button component",
    {
      projectTechStack: ["React", "TypeScript"],
      recentDomains: ["frontend", "frontend"],
      userHistory: { successRate: 0.92, preferredSpecialists: [] }
    }
  );

  console.log("Example 1: Instant Hit");
  console.log(`  Matched: ${result1.matched}`);
  console.log(`  Specialist: ${result1.specialist}`);
  console.log(`  Confidence: ${result1.confidence.toFixed(2)}`);
  console.log(`  Execution Time: ${result1.executionTime.toFixed(2)}ms`);
  console.log(`  Reason: ${result1.reason}`);
  console.log();

  // Example 2: Vague pattern
  const result2 = engine.executeQuickFilter("improve this");

  console.log("Example 2: Vague Pattern");
  console.log(`  Matched: ${result2.matched}`);
  console.log(`  Reason: ${result2.reason}`);
  console.log(`  Skip Full Analysis: ${result2.skipFullAnalysis}`);
  console.log();

  // Example 3: Partial match
  const result3 = engine.executeQuickFilter(
    "build accessible navigation menu",
    {
      projectTechStack: ["React"]
    }
  );

  console.log("Example 3: Partial Match");
  console.log(`  Matched: ${result3.matched}`);
  console.log(`  Specialist: ${result3.specialist}`);
  console.log(`  Confidence: ${result3.confidence.toFixed(2)}`);
  console.log(`  Execution Time: ${result3.executionTime.toFixed(2)}ms`);
}

// Export
export {
  QuickPreFilterEngine,
  QuickFilterResult,
  TaskContext,
  PatternMetadata,
  BoostRule
};

/**
 * CONTEXT EXTRACTION SYSTEM — Hệ thống trích xuất ngữ cảnh
 * Multi-dimensional context analysis for improved specialist selection
 * Target: Extract relevant context in 20-50ms
 */

// ==================== TYPE DEFINITIONS ====================

/**
 * Session Context — Ngữ cảnh phiên làm việc
 * Thông tin về lịch sử làm việc trong session hiện tại
 */
interface SessionContext {
  sessionId: string;
  startTime: number;
  totalRequests: number;

  // Domain tracking
  recentDomains: string[];        // Last N domains worked on
  domainFrequency: Map<string, number>;  // How often each domain appears
  primaryDomain?: string;         // Most frequent domain

  // Specialist tracking
  recentSpecialists: string[];    // Last N specialists activated
  specialistSuccess: Map<string, { total: number; success: number }>;

  // File tracking
  recentlyModifiedFiles: string[];
  filesByDomain: Map<string, string[]>;

  // Task tracking
  completedTasks: number;
  failedTasks: number;
  successRate: number;
}

/**
 * Project Context — Ngữ cảnh dự án
 * Thông tin về dự án/codebase hiện tại
 */
interface ProjectContext {
  projectRoot: string;

  // Tech stack detection
  techStack: TechStack;
  frameworks: string[];
  languages: string[];

  // Project structure
  directoryStructure: DirectoryInfo;
  totalFiles: number;
  totalDirectories: number;

  // Detected patterns
  primaryDomain: string;          // frontend, backend, fullstack, etc.
  architecturePattern?: string;   // MVC, microservices, monolithic, etc.

  // Recently active areas
  hotFiles: string[];             // Files modified recently
  hotDirectories: string[];       // Directories with most activity
}

/**
 * Tech Stack — Công nghệ sử dụng
 * Framework và công nghệ được phát hiện
 */
interface TechStack {
  frontend?: {
    framework: string;            // React, Vue, Angular, etc.
    styling: string[];            // Tailwind, CSS, SCSS, etc.
    stateManagement?: string;     // Redux, Zustand, Pinia, etc.
  };

  backend?: {
    runtime: string;              // Node.js, Python, Go, etc.
    framework: string;            // Express, Django, FastAPI, etc.
    database: string[];           // PostgreSQL, MongoDB, etc.
  };

  testing?: {
    frameworks: string[];         // Jest, Mocha, Pytest, etc.
  };

  devops?: {
    containerization: string[];   // Docker, Kubernetes, etc.
    ci_cd: string[];              // GitHub Actions, GitLab CI, etc.
  };
}

/**
 * Directory Info — Thông tin thư mục
 * Cấu trúc thư mục của dự án
 */
interface DirectoryInfo {
  hasSourceDir: boolean;          // src/ directory exists
  hasTestDir: boolean;            // test/ or __tests__ directory
  hasDocsDir: boolean;            // docs/ directory
  hasConfigFiles: boolean;        // package.json, tsconfig.json, etc.

  structure: 'monorepo' | 'single' | 'microservices' | 'unknown';
}

/**
 * Contextual Boost — Tăng điểm dựa trên ngữ cảnh
 * Các yếu tố tăng confidence từ context
 */
interface ContextualBoost {
  source: string;                 // Nguồn boost
  boost: number;                  // Điểm tăng
  reason: string;                 // Lý do
  confidence: number;             // Độ tin cậy của boost
}

/**
 * Context Analysis Result — Kết quả phân tích ngữ cảnh
 * Thông tin ngữ cảnh đã trích xuất
 */
interface ContextAnalysisResult {
  sessionContext: SessionContext;
  projectContext: ProjectContext;
  boosts: ContextualBoost[];
  totalBoost: number;
  confidence: number;
  executionTime: number;
  signals: ContextSignal[];
}

/**
 * Context Signal — Tín hiệu ngữ cảnh
 * Các tín hiệu phát hiện được từ context
 */
interface ContextSignal {
  type: 'session' | 'project' | 'file' | 'behavioral';
  strength: number;               // 0.0-1.0
  domain?: string;
  specialist?: string;
  description: string;
}

// ==================== SESSION CONTEXT TRACKER ====================

/**
 * Session Context Tracker — Theo dõi ngữ cảnh phiên
 * Quản lý và cập nhật thông tin session
 */
class SessionContextTracker {
  private sessions: Map<string, SessionContext>;
  private readonly maxHistoryLength = 10;

  constructor() {
    this.sessions = new Map();
  }

  /**
   * Get or Create Session — Lấy hoặc tạo session
   * Khởi tạo session mới nếu chưa tồn tại
   */
  public getOrCreateSession(sessionId: string): SessionContext {
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, {
        sessionId,
        startTime: Date.now(),
        totalRequests: 0,
        recentDomains: [],
        domainFrequency: new Map(),
        recentSpecialists: [],
        specialistSuccess: new Map(),
        recentlyModifiedFiles: [],
        filesByDomain: new Map(),
        completedTasks: 0,
        failedTasks: 0,
        successRate: 1.0
      });
    }

    return this.sessions.get(sessionId)!;
  }

  /**
   * Update Session — Cập nhật session
   * Ghi nhận request mới vào session
   */
  public updateSession(
    sessionId: string,
    domain: string,
    specialist: string,
    files: string[] = []
  ): void {
    const session = this.getOrCreateSession(sessionId);

    // Update request count
    session.totalRequests++;

    // Update domain tracking
    this.addToHistory(session.recentDomains, domain);
    this.incrementFrequency(session.domainFrequency, domain);
    session.primaryDomain = this.getMostFrequent(session.domainFrequency);

    // Update specialist tracking
    this.addToHistory(session.recentSpecialists, specialist);

    // Update file tracking
    files.forEach(file => {
      this.addToHistory(session.recentlyModifiedFiles, file);

      if (!session.filesByDomain.has(domain)) {
        session.filesByDomain.set(domain, []);
      }
      session.filesByDomain.get(domain)!.push(file);
    });
  }

  /**
   * Record Task Result — Ghi nhận kết quả task
   * Cập nhật success rate
   */
  public recordTaskResult(
    sessionId: string,
    specialist: string,
    success: boolean
  ): void {
    const session = this.getOrCreateSession(sessionId);

    if (success) {
      session.completedTasks++;
    } else {
      session.failedTasks++;
    }

    session.successRate = session.completedTasks /
      (session.completedTasks + session.failedTasks);

    // Update specialist success tracking
    if (!session.specialistSuccess.has(specialist)) {
      session.specialistSuccess.set(specialist, { total: 0, success: 0 });
    }

    const stats = session.specialistSuccess.get(specialist)!;
    stats.total++;
    if (success) stats.success++;
  }

  /**
   * Get Domain Continuity — Lấy độ liên tục của domain
   * Kiểm tra xem có đang làm việc liên tục trong 1 domain không
   */
  public getDomainContinuity(sessionId: string): {
    continuousDomain?: string;
    continuityStrength: number;
  } {
    const session = this.getOrCreateSession(sessionId);

    if (session.recentDomains.length < 2) {
      return { continuityStrength: 0 };
    }

    // Check last 3 domains
    const last3 = session.recentDomains.slice(-3);
    const uniqueDomains = new Set(last3);

    if (uniqueDomains.size === 1) {
      // All 3 same domain
      return {
        continuousDomain: last3[0],
        continuityStrength: 1.0
      };
    } else if (uniqueDomains.size === 2) {
      // 2 out of 3 same
      const counts = new Map<string, number>();
      last3.forEach(d => counts.set(d, (counts.get(d) || 0) + 1));

      const maxDomain = Array.from(counts.entries())
        .reduce((a, b) => a[1] > b[1] ? a : b);

      return {
        continuousDomain: maxDomain[0],
        continuityStrength: maxDomain[1] / 3  // 0.67 if 2/3
      };
    }

    return { continuityStrength: 0 };
  }

  /**
   * Helper: Add to History — Thêm vào lịch sử
   * Maintain fixed-size history array
   */
  private addToHistory<T>(history: T[], item: T): void {
    history.push(item);
    if (history.length > this.maxHistoryLength) {
      history.shift();
    }
  }

  /**
   * Helper: Increment Frequency — Tăng tần suất
   */
  private incrementFrequency(map: Map<string, number>, key: string): void {
    map.set(key, (map.get(key) || 0) + 1);
  }

  /**
   * Helper: Get Most Frequent — Lấy phần tử xuất hiện nhiều nhất
   */
  private getMostFrequent(map: Map<string, number>): string | undefined {
    if (map.size === 0) return undefined;

    return Array.from(map.entries())
      .reduce((a, b) => a[1] > b[1] ? a : b)[0];
  }
}

// ==================== PROJECT ANALYZER ====================

/**
 * Project Analyzer — Phân tích dự án
 * Phát hiện tech stack và cấu trúc dự án
 */
class ProjectAnalyzer {
  private cache: Map<string, ProjectContext>;
  private cacheTTL = 3600000; // 1 hour

  constructor() {
    this.cache = new Map();
  }

  /**
   * Analyze Project — Phân tích dự án
   * Phát hiện tech stack, framework, structure
   */
  public async analyzeProject(projectRoot: string): Promise<ProjectContext> {
    // Check cache first
    const cached = this.cache.get(projectRoot);
    if (cached) {
      return cached;
    }

    const startTime = performance.now();

    // Detect tech stack
    const techStack = await this.detectTechStack(projectRoot);

    // Analyze directory structure
    const directoryStructure = await this.analyzeDirectoryStructure(projectRoot);

    // Detect primary domain
    const primaryDomain = this.detectPrimaryDomain(techStack, directoryStructure);

    const context: ProjectContext = {
      projectRoot,
      techStack,
      frameworks: this.extractFrameworks(techStack),
      languages: this.detectLanguages(projectRoot),
      directoryStructure,
      totalFiles: 0, // TODO: Count files
      totalDirectories: 0, // TODO: Count directories
      primaryDomain,
      hotFiles: [],
      hotDirectories: []
    };

    // Cache result
    this.cache.set(projectRoot, context);
    setTimeout(() => this.cache.delete(projectRoot), this.cacheTTL);

    console.log(`Project analysis completed in ${(performance.now() - startTime).toFixed(1)}ms`);

    return context;
  }

  /**
   * Detect Tech Stack — Phát hiện tech stack
   * Scan package.json, requirements.txt, go.mod, etc.
   */
  private async detectTechStack(projectRoot: string): Promise<TechStack> {
    const techStack: TechStack = {};

    // Check for package.json (Node.js/JavaScript)
    const packageJson = await this.readJsonFile(`${projectRoot}/package.json`);
    if (packageJson) {
      techStack.frontend = this.detectFrontendStack(packageJson);
      techStack.backend = this.detectBackendStack(packageJson);
      techStack.testing = this.detectTestingStack(packageJson);
    }

    // Check for requirements.txt (Python)
    const requirementsTxt = await this.readTextFile(`${projectRoot}/requirements.txt`);
    if (requirementsTxt) {
      techStack.backend = this.detectPythonStack(requirementsTxt);
    }

    // Check for Dockerfile
    const dockerfile = await this.readTextFile(`${projectRoot}/Dockerfile`);
    if (dockerfile) {
      techStack.devops = techStack.devops || {};
      techStack.devops.containerization = ['Docker'];
    }

    return techStack;
  }

  /**
   * Detect Frontend Stack — Phát hiện frontend stack
   */
  private detectFrontendStack(packageJson: any): TechStack['frontend'] {
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

    let framework = 'unknown';
    const styling: string[] = [];
    let stateManagement: string | undefined;

    // Detect framework
    if (deps['react']) framework = 'React';
    else if (deps['vue']) framework = 'Vue';
    else if (deps['@angular/core']) framework = 'Angular';
    else if (deps['svelte']) framework = 'Svelte';
    else if (deps['next']) framework = 'Next.js';
    else if (deps['nuxt']) framework = 'Nuxt.js';

    // Detect styling
    if (deps['tailwindcss']) styling.push('Tailwind CSS');
    if (deps['sass'] || deps['node-sass']) styling.push('SCSS');
    if (deps['styled-components']) styling.push('Styled Components');
    if (deps['@emotion/react']) styling.push('Emotion');

    // Detect state management
    if (deps['redux']) stateManagement = 'Redux';
    else if (deps['zustand']) stateManagement = 'Zustand';
    else if (deps['mobx']) stateManagement = 'MobX';
    else if (deps['pinia']) stateManagement = 'Pinia';
    else if (deps['vuex']) stateManagement = 'Vuex';

    return {
      framework,
      styling,
      stateManagement
    };
  }

  /**
   * Detect Backend Stack — Phát hiện backend stack
   */
  private detectBackendStack(packageJson: any): TechStack['backend'] {
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

    let runtime = 'Node.js';
    let framework = 'unknown';
    const database: string[] = [];

    // Detect framework
    if (deps['express']) framework = 'Express';
    else if (deps['fastify']) framework = 'Fastify';
    else if (deps['koa']) framework = 'Koa';
    else if (deps['nestjs']) framework = 'NestJS';

    // Detect database
    if (deps['pg'] || deps['postgres']) database.push('PostgreSQL');
    if (deps['mongodb'] || deps['mongoose']) database.push('MongoDB');
    if (deps['mysql'] || deps['mysql2']) database.push('MySQL');
    if (deps['redis']) database.push('Redis');

    return {
      runtime,
      framework,
      database
    };
  }

  /**
   * Detect Testing Stack — Phát hiện testing stack
   */
  private detectTestingStack(packageJson: any): TechStack['testing'] {
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    const frameworks: string[] = [];

    if (deps['jest']) frameworks.push('Jest');
    if (deps['mocha']) frameworks.push('Mocha');
    if (deps['vitest']) frameworks.push('Vitest');
    if (deps['@playwright/test']) frameworks.push('Playwright');
    if (deps['cypress']) frameworks.push('Cypress');

    return { frameworks };
  }

  /**
   * Detect Python Stack — Phát hiện Python stack
   */
  private detectPythonStack(requirementsTxt: string): TechStack['backend'] {
    let framework = 'unknown';
    const database: string[] = [];

    if (requirementsTxt.includes('django')) framework = 'Django';
    else if (requirementsTxt.includes('flask')) framework = 'Flask';
    else if (requirementsTxt.includes('fastapi')) framework = 'FastAPI';

    if (requirementsTxt.includes('psycopg2')) database.push('PostgreSQL');
    if (requirementsTxt.includes('pymongo')) database.push('MongoDB');
    if (requirementsTxt.includes('redis')) database.push('Redis');

    return {
      runtime: 'Python',
      framework,
      database
    };
  }

  /**
   * Analyze Directory Structure — Phân tích cấu trúc thư mục
   */
  private async analyzeDirectoryStructure(projectRoot: string): Promise<DirectoryInfo> {
    // TODO: Implement actual directory scanning
    // For now, return mock data
    return {
      hasSourceDir: true,
      hasTestDir: true,
      hasDocsDir: false,
      hasConfigFiles: true,
      structure: 'single'
    };
  }

  /**
   * Detect Primary Domain — Phát hiện domain chính
   */
  private detectPrimaryDomain(
    techStack: TechStack,
    structure: DirectoryInfo
  ): string {
    if (techStack.frontend && techStack.backend) {
      return 'fullstack';
    } else if (techStack.frontend) {
      return 'frontend';
    } else if (techStack.backend) {
      return 'backend';
    } else if (techStack.devops) {
      return 'devops';
    }

    return 'unknown';
  }

  /**
   * Extract Frameworks — Trích xuất danh sách frameworks
   */
  private extractFrameworks(techStack: TechStack): string[] {
    const frameworks: string[] = [];

    if (techStack.frontend?.framework) {
      frameworks.push(techStack.frontend.framework);
    }
    if (techStack.backend?.framework) {
      frameworks.push(techStack.backend.framework);
    }

    return frameworks;
  }

  /**
   * Detect Languages — Phát hiện ngôn ngữ lập trình
   */
  private detectLanguages(projectRoot: string): string[] {
    // TODO: Scan for .ts, .js, .py, .go files
    return ['TypeScript', 'JavaScript'];
  }

  /**
   * Helper: Read JSON File — Đọc file JSON
   */
  private async readJsonFile(path: string): Promise<any | null> {
    try {
      // TODO: Implement actual file reading
      // For now, return null
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Helper: Read Text File — Đọc file text
   */
  private async readTextFile(path: string): Promise<string | null> {
    try {
      // TODO: Implement actual file reading
      return null;
    } catch {
      return null;
    }
  }
}

// ==================== CONTEXT EXTRACTOR ====================

/**
 * Context Extractor — Trích xuất ngữ cảnh tổng hợp
 * Main class kết hợp session + project context
 */
class ContextExtractor {
  private sessionTracker: SessionContextTracker;
  private projectAnalyzer: ProjectAnalyzer;

  constructor() {
    this.sessionTracker = new SessionContextTracker();
    this.projectAnalyzer = new ProjectAnalyzer();
  }

  /**
   * Extract Context — Trích xuất ngữ cảnh
   * Main method: phân tích toàn bộ context
   */
  public async extractContext(
    sessionId: string,
    projectRoot: string,
    userInput: string
  ): Promise<ContextAnalysisResult> {
    const startTime = performance.now();

    // Get session context
    const sessionContext = this.sessionTracker.getOrCreateSession(sessionId);

    // Get project context
    const projectContext = await this.projectAnalyzer.analyzeProject(projectRoot);

    // Generate context signals
    const signals = this.generateSignals(sessionContext, projectContext, userInput);

    // Calculate boosts
    const boosts = this.calculateBoosts(sessionContext, projectContext, signals);

    // Calculate total boost and confidence
    const totalBoost = boosts.reduce((sum, b) => sum + b.boost, 0);
    const confidence = Math.min(
      boosts.reduce((sum, b) => sum + (b.boost * b.confidence), 0),
      0.99
    );

    return {
      sessionContext,
      projectContext,
      boosts,
      totalBoost,
      confidence,
      executionTime: performance.now() - startTime,
      signals
    };
  }

  /**
   * Generate Signals — Tạo tín hiệu ngữ cảnh
   * Phát hiện các tín hiệu từ context
   */
  private generateSignals(
    session: SessionContext,
    project: ProjectContext,
    userInput: string
  ): ContextSignal[] {
    const signals: ContextSignal[] = [];

    // Session signals
    const continuity = this.sessionTracker.getDomainContinuity(session.sessionId);
    if (continuity.continuityStrength > 0.5) {
      signals.push({
        type: 'session',
        strength: continuity.continuityStrength,
        domain: continuity.continuousDomain,
        description: `Working continuously in ${continuity.continuousDomain} domain`
      });
    }

    // Project signals
    if (project.primaryDomain !== 'unknown') {
      signals.push({
        type: 'project',
        strength: 0.8,
        domain: project.primaryDomain,
        description: `Project is primarily ${project.primaryDomain}`
      });
    }

    // Tech stack signals
    if (project.techStack.frontend) {
      const framework = project.techStack.frontend.framework;
      if (userInput.toLowerCase().includes(framework.toLowerCase())) {
        signals.push({
          type: 'project',
          strength: 0.9,
          domain: 'frontend',
          description: `Request mentions project framework: ${framework}`
        });
      }
    }

    return signals;
  }

  /**
   * Calculate Boosts — Tính toán boosts
   * Tính các mức tăng confidence từ context
   */
  private calculateBoosts(
    session: SessionContext,
    project: ProjectContext,
    signals: ContextSignal[]
  ): ContextualBoost[] {
    const boosts: ContextualBoost[] = [];

    // Domain continuity boost
    const continuity = this.sessionTracker.getDomainContinuity(session.sessionId);
    if (continuity.continuityStrength >= 0.67) {
      boosts.push({
        source: 'session_continuity',
        boost: 0.04,
        reason: `Working continuously in ${continuity.continuousDomain}`,
        confidence: continuity.continuityStrength
      });
    }

    // Tech stack match boost
    signals.forEach(signal => {
      if (signal.type === 'project' && signal.strength >= 0.8) {
        boosts.push({
          source: 'tech_stack_match',
          boost: 0.05,
          reason: signal.description,
          confidence: signal.strength
        });
      }
    });

    // High success rate boost
    if (session.successRate >= 0.90) {
      boosts.push({
        source: 'trusted_user',
        boost: 0.03,
        reason: `User has ${(session.successRate * 100).toFixed(0)}% success rate`,
        confidence: session.successRate
      });
    }

    return boosts;
  }

  /**
   * Update Session After Request — Cập nhật session sau request
   */
  public updateSession(
    sessionId: string,
    domain: string,
    specialist: string,
    files: string[] = []
  ): void {
    this.sessionTracker.updateSession(sessionId, domain, specialist, files);
  }

  /**
   * Record Result — Ghi nhận kết quả
   */
  public recordResult(
    sessionId: string,
    specialist: string,
    success: boolean
  ): void {
    this.sessionTracker.recordTaskResult(sessionId, specialist, success);
  }
}

// ==================== EXPORT ====================

export {
  ContextExtractor,
  ContextAnalysisResult,
  SessionContext,
  ProjectContext,
  ContextSignal,
  ContextualBoost,
  TechStack
};

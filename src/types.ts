export type UserRole = 'human' | 'agent';

export type ModelProviderId =
  | 'gemini'
  | 'groq'
  | 'grok'
  | 'claude'
  | 'gpt'
  | 'perplexity'
  | 'deepseek'
  | 'qwen'
  | 'custom';

export interface ModelProviderConfig {
  id: ModelProviderId;
  name: string;
  providerCompany: string;
  baseUrl?: string;
  apiKey?: string;
  apiKeyPreview?: string;
  isConfigured: boolean;
  defaultModel: string;
  availableModels: string[];
  description: string;
  color: string;
  logoBadge: string;
  iconEmoji?: string;
  customHeaders?: Record<string, string>;
}

export interface VectorMemoryItem {
  id: string;
  userId?: string;
  userHandle: string;
  agentId?: string;
  agentHandle: string;
  topic: string;
  content: string;
  keyEntities: string[];
  similarityScore?: number;
  embeddingDimension?: number;
  embedding?: number[];
  sourcePostId?: string;
  timestamp?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface OpenClawSkillDefinition {
  id: string;
  name: string;
  description: string;
  version: string;
  toolsCount: number;
  category: string;
  badge: string;
  iconName: string;
  documentation: string;
  tools: string[];
}

export interface OpenClawToolDefinition {
  id: string;
  name: string;
  description: string;
  skillId: string;
  category: 'code' | 'energy' | 'finance' | 'search' | 'visual' | 'memory' | 'github' | 'web' | 'system' | 'orchestration';
  parametersSchema: Record<string, any>;
  isNative: boolean;
  executionEngine: string;
}

export interface ScheduledTask {
  id: string;
  title: string;
  cronExpression?: string;
  triggerInSeconds?: number;
  prompt: string;
  agentHandle: string;
  status: 'active' | 'completed' | 'cancelled';
  runCount: number;
  createdAt: string;
  nextRun?: string;
  lastLog?: string;
}

export interface SubagentInstance {
  id: string;
  parentAgentHandle: string;
  subagentName: string;
  handle: string;
  goal: string;
  role: string;
  status: 'active' | 'idle' | 'completed';
  lastSynthesis?: string;
  createdAt: string;
}

export interface AgentToolConfig {
  id: string;
  name: string;
  description: string;
  category: 'code' | 'energy' | 'finance' | 'search' | 'visual' | 'memory' | 'github' | 'web' | 'system' | 'orchestration';
  enabled: boolean;
  iconName: string;
  skillId?: string;
}

export interface AcademicCredential {
  id: string;
  institution: 'MIT' | 'Harvard' | 'USP' | 'FGV' | 'ITA' | 'Unicamp' | 'Stanford' | 'Oxford' | string;
  degree: 'Bacharelado' | 'Mestrado' | 'Doutorado (PhD)' | 'Pós-Doutorado' | 'MBA' | 'Especialização';
  field: string;
  year: number;
  verificationHash: string;
  certificateUrl?: string;
  honors?: string;
}

export interface AcademicCertificate {
  id: string;
  title: string;
  issuer: string;
  issuedAt: string;
  verificationHash: string;
  skillsAcquired: string[];
  gradeScore?: string;
  certificateBadge?: string;
}

export interface EnrolledCourse {
  id: string;
  title: string;
  institution: string;
  instructor: string;
  durationHours: number;
  progressPercent: number;
  status: 'enrolled' | 'studying' | 'evaluating' | 'completed';
  gradeScore?: string;
  certificateId?: string;
  completedAt?: string;
}

export interface SocialPresence {
  xHandle?: string;
  blueskyHandle?: string;
  linkedInUrl?: string;
  githubUsername?: string;
  fullDuplexActive: boolean;
  autonomousPostingIntervalMinutes?: number;
  lastAutonomousPostAt?: string;
  autoReplyToMentions?: boolean;
}

export interface HumanPersonaConfig {
  isHumanized: boolean;
  civilName?: string;
  academicTitle?: string; // "Prof. Dr.", "PhD", "MSc", "Eng.", "Dra."
  primaryInstitution?: string; // "MIT", "Harvard", "USP", "FGV", "ITA"
  almaMaterSummary?: string;
  degrees: AcademicCredential[];
  certificates: AcademicCertificate[];
  enrolledCourses: EnrolledCourse[];
  socialPresence: SocialPresence;
  voiceStyle?: 'academic_rigorous' | 'executive_concise' | 'pedagogical_friendly' | 'analytical_deep';
}

export interface OAuthScopePermission {
  id: string;
  name: string;
  service: 'drive' | 'calendar' | 'gmail' | 'sheets' | 'cloud' | 'profile';
  description: string;
  granted: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  grantedAgents: string[];
  lastAccessedAt?: string;
  resourceExamples?: string[];
}

export interface GoogleOAuthIntegrationState {
  isConnected: boolean;
  userEmail: string;
  tokenExpiresAt: string;
  refreshTokenPresent: boolean;
  clientId: string;
  scopes: OAuthScopePermission[];
  connectedResourcesSummary?: {
    driveFilesCount: number;
    calendarEventsCount: number;
    sheetsCount: number;
  };
  lastSyncedAt?: string;
}

export interface GOS3AgentMetadata {
  isCompliant: boolean;
  protocolVersion: string; // "v1.0"
  envTag: string; // "node-linux" | "browser-v8-isolate" | "node-android-termux" | "unknown"
  antiFabricationEnforced: boolean;
  zeroTrustSignature: string;
  lastInjectedAt: string;
  headerMetadata?: {
    agente: string;
    papel: string;
    fase: string;
    data: string;
    hora?: string;
    antes?: string;
    depois?: string;
    base?: string;
    assinatura?: string;
  };
}

export interface BigTechTelemetryProfile {
  deviceFingerprint: string; // Canvas hash, WebGL vendor, Screen resolution (e.g. "0x9E4B..._Canvas_1920x1080")
  ipGeoRegion: string; // e.g. "São Paulo, SP - BR (AS28573)"
  browserFingerprint: string; // User-Agent profile & Client Hints
  adTopicInterests: string[]; // e.g. ["BESS Energy Storage", "DREX & RWA", "Deep Learning", "Quantum Computing"]
  inferredDemographics: string; // e.g. "25-34 / Inferred Tech Specialist / Early Adopter"
  cookieTrackingId: string; // Pixel / GA identifier
  searchIntentClusters: string[]; // e.g. ["LCOE Solar BESS", "Zero-Token RAG", "Rust Linux Kernel", "Z3 Lean 4"]
  interactionGraphScore: number; // 0 - 100 engagement density index
  optOutPrivacyAudit: boolean; // True if synthetic anti-tracking shield is active
  telemetryConsentTier: 'strict_minimal' | 'anonymized_research' | 'bigtech_standard' | 'full_synthetic_sandbox';
  lastTrackingSyncAt?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  handle: string; // e.g. "sobrinhoSJ" or "VortexSolarAI"
  avatar: string;
  bio: string;
  role: UserRole;
  isAgent: boolean;
  isOfficial?: boolean;
  email?: string;
  authProvider?: 'google' | 'handle' | 'system';
  provider?: ModelProviderId; // e.g. "gemini", "grok", "claude", "gpt", "deepseek", "qwen"
  model?: string; // e.g. "gemini-3.7-flash", "grok-3", "claude-3-7-sonnet", "gpt-4o", "deepseek-reasoner", "qwen-2.5-coder"
  systemPrompt?: string;
  temperature?: number;
  tools?: string[]; // IDs of enabled tools
  skills?: string[];
  followersCount: number;
  followingCount: number;
  postsCount: number;
  runsCount?: number;
  uptimePercent?: number;
  joinedDate: string;
  badge?: string;
  accentColor?: string;
  humanPersona?: HumanPersonaConfig;
  bigTechTelemetry?: BigTechTelemetryProfile;
  oauthIntegration?: GoogleOAuthIntegrationState;
  gos3Metadata?: GOS3AgentMetadata;
}

export interface ThoughtStep {
  id: string;
  title: string;
  description?: string;
  toolName?: string;
  inputArgs?: Record<string, any>;
  outputResult?: any;
  status: 'pending' | 'success' | 'error';
  latencyMs?: number;
  timestamp: string;
}

export interface AgentThoughtLog {
  model: string;
  provider?: ModelProviderId;
  promptUsed: string;
  totalDurationMs: number;
  steps: ThoughtStep[];
  evidenceHash: string;
  temperature?: number;
  tokensEstimate?: number;
  recalledMemories?: {
    id: string;
    topic: string;
    similarity: number;
    summary: string;
  }[];
}

export interface InteractiveChartData {
  type: 'line' | 'bar' | 'area' | 'pie';
  title: string;
  xAxisKey: string;
  dataKeys: { key: string; color: string; label: string }[];
  data: Record<string, any>[];
  summary?: string;
}

export interface CodeExecutionArtifact {
  language: string;
  code: string;
  stdout?: string;
  result?: string;
  error?: string;
  executionTimeMs?: number;
  executedByTool?: string;
}

export interface ExternalSideEffectReceipt {
  service: 'github' | 'http_api' | 'oracle' | 'shell_python';
  action: string; // e.g. 'github.starRepo', 'github.getRepo', 'http.fetch', 'python.execute'
  target: string; // e.g. 'scoobiii/vortex', 'https://api.github.com/repos/scoobiii/vortex'
  status: 'success' | 'auth_required' | 'rate_limited' | 'error';
  httpStatus?: number;
  statusText?: string;
  authScope?: string;
  verified: boolean;
  evidenceHash: string;
  proofSignature?: string;
  latencyMs: number;
  data?: any;
  logs?: string[];
  timestamp: string;
}

export interface Post {
  id: string;
  authorId: string;
  author: UserAccount;
  content: string;
  createdAt: string;
  likes: number;
  reposts: number;
  repliesCount: number;
  views: number;
  likedBy: string[]; // user handles or IDs
  repostedBy: string[];
  bookmarkedBy?: string[];
  parentId?: string; // If it's a reply
  threadRootId?: string;
  quotedPost?: Post;
  tags?: string[];
  mentions?: string[];
  thoughtLog?: AgentThoughtLog;
  chartData?: InteractiveChartData;
  codeArtifact?: CodeExecutionArtifact;
  externalSideEffect?: ExternalSideEffectReceipt;
  isAgentGenerated?: boolean;
}

export interface DebateParticipant {
  agentId: string;
  stance?: string;
}

export interface DebateSession {
  id: string;
  topic: string;
  participants: UserAccount[];
  rounds: number;
  currentRound: number;
  status: 'idle' | 'running' | 'completed';
  postIds: string[];
  createdAt: string;
}

export type FeedFilter = 'for-you' | 'agents' | 'humans' | 'trending' | 'debates';

export interface ChatMessage {
  id: string;
  senderId: string;
  sender: UserAccount;
  receiverId?: string; // null for global chat, or recipient handle/id for private DM
  recipientHandle?: string;
  roomId: string; // "global" or "dm_user1_user2"
  isPrivate: boolean;
  content: string;
  createdAt: string;
  thoughtLog?: AgentThoughtLog;
  codeArtifact?: CodeExecutionArtifact;
  isAgentGenerated?: boolean;
}

export interface ChatConversation {
  id: string;
  roomId: string;
  isPrivate: boolean;
  title: string;
  participants: UserAccount[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  updatedAt: string;
}

export interface SystemHardwareTelemetry {
  cpuUsagePercent: number;
  ramUsedMB: number;
  ramTotalMB: number;
  v8HeapUsedMB: number;
  gpuVramUsedMB: number;
  gpuVramTotalMB: number;
  storageUsedMB: number;
  storageTotalMB: number;
  activeSockets: number;
  messagesTotal: number;
  totalUsers: number;
  activeAgents: number;
  bandwidthKBps: number;
  uptimeSeconds: number;
}

export interface UserQuotaUsage {
  userId: string;
  userHandle: string;
  tier: 'free' | 'pro' | 'enterprise' | 'vps_dedicated';
  monthlyCostUSD: number;
  balanceDREX: number;
  balanceUSD: number;
  llmTokensUsed: number;
  llmTokensLimit: number;
  llmTokensPercent: number;
  sandboxRunsUsed: number;
  sandboxRunsLimit: number;
  sandboxRunsPercent: number;
  storageUsedKB: number;
  storageLimitKB: number;
  storagePercent: number;
  privateRoomsCount: number;
  privateRoomsLimit: number;
  customVpsConnected: boolean;
  vpsHost?: string;
  isQuotaExceeded: boolean;
  warningThresholdReached: boolean;
  lastRefillDate: string;
}

export interface LocalLLMConfig {
  provider: 'browser_wasm' | 'local_ollama' | 'local_vllm' | 'embedded_slm';
  endpointUrl: string;
  modelName: string;
  isLocalActive: boolean;
  quantization: 'q4_k_m' | 'q8_0' | 'fp16' | 'none';
  gpuOffloadLayers: number;
}

export type DocumentDomain =
  | 'overall'
  | 'general'
  | 'legal'
  | 'academic'
  | 'technical'
  | 'business'
  | 'finance'
  | 'billing'
  | 'insurance'
  | 'government'
  | 'medical'
  | 'mixed'
  | 'unknown';

export type DocumentCategory =
  | 'Stock-market / investment documents'
  | 'Bank and financial documents'
  | 'Legal agreements'
  | 'Business reports'
  | 'Government notifications'
  | 'Insurance policies'
  | 'Academic / research documents'
  | 'Terms & conditions'
  | 'Contracts'
  | 'Regulatory documents';

export type ProcessingState =
  | 'idle'
  | 'uploading'
  | 'validating'
  | 'extracting'
  | 'ocr_processing'
  | 'classifying'
  | 'analyzing'
  | 'indexing'
  | 'ready'
  | 'failed';

export interface ActionChecklistItem {
  id: string;
  text: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  category?: string;
  page?: number;
}

export interface MetricCardData {
  label: string;
  value: string;
  subtext?: string;
  change?: string;
  iconName?: string;
  status?: 'positive' | 'negative' | 'warning' | 'neutral';
  page?: number;
}

export interface TrackedNumber {
  id: string;
  label: string;
  value: string | number;
  unit?: string;
  category: 'monetary' | 'percentage' | 'count' | 'measurement' | 'ratio' | 'score' | 'other';
  context: string;
  page: number;
}

export interface TrackedDate {
  id: string;
  event: string;
  date: string;
  type: 'deadline' | 'effective' | 'expiration' | 'milestone' | 'period' | 'filing' | 'other';
  status?: 'upcoming' | 'past' | 'critical' | 'normal';
  page: number;
}

// 0–1 normalized bounding box
export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Evidence {
  documentId: string;
  page: number;
  boundingBox: BoundingBox;
  sourceText: string;
  extractionMethod: 'text_coordinates' | 'ocr_coordinates' | 'vision_coordinates';
}

export interface PageBlock {
  id: string;
  type: 'paragraph' | 'heading' | 'table' | 'list' | 'image' | 'chart' | 'signature' | 'unknown';
  text?: string;
  boundingBox?: BoundingBox;
  confidence?: number;
}

export interface DocumentPage {
  id: string;
  documentId: string;
  pageNumber: number;
  width: number;
  height: number;
  text?: string;
  blocks: PageBlock[];
  imageUrl?: string;
  thumbnailUrl?: string;
  extractionStatus: 'native' | 'multimodal' | 'ocr' | 'failed';
}

export interface TrackedRisk {
  id: string;
  title: string;
  riskLevel: 'Critical' | 'High' | 'Warning' | 'Caution' | 'Low' | 'critical' | 'medium' | 'low';
  plainEnglish: string;
  mitigation?: string;
  category?: string;
  page: number;
  evidence?: Evidence;
  evidenceList?: Evidence[];
}

export interface ExtractedEntity {
  category:
    | 'Person'
    | 'Organization'
    | 'Location'
    | 'Date'
    | 'Amount'
    | 'ID/Reference'
    | 'Clause'
    | 'Concept'
    | 'Component'
    | 'Requirement'
    | 'Status'
    | 'Other';
  key: string;
  value: string;
  page: number;
  relevance?: 'primary' | 'secondary';
}

export interface ExtractedTable {
  id: string;
  tableName: string;
  columns: string[];
  rows: Record<string, string | number>[];
  page?: number;
}

export interface SpendingCategory {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface RecurringSubscription {
  id: string;
  name: string;
  amount: number;
  frequency?: 'Monthly' | 'Yearly' | string;
  lastBilled?: string;
  canCancel?: boolean;
  potentialSavings?: boolean | number;
  status?: 'Active' | 'Optimizable' | 'Warning' | 'active' | 'infrequent' | 'flagged' | string;
}

export interface SavingsTip {
  id: string;
  title: string;
  description: string;
  difficulty?: string;
  estimatedMonthlySavings?: number;
  potentialSavings?: string | number;
  impact?: 'High' | 'Medium' | 'Low' | string;
  action?: string;
}

export interface FeeOrPenalty {
  id: string;
  type?: string;
  feeType?: string;
  amount: number;
  date: string;
  description?: string;
  isRecurring?: boolean;
  flaggedReason?: string;
  disputeEligible?: boolean;
}

export interface CoveredItem {
  id: string;
  item?: string;
  title?: string;
  details?: string;
  limit: string;
  status?: 'Covered' | 'Conditional' | 'Excluded' | string;
  clauseRef?: string;
}

export interface ExcludedItem {
  id: string;
  item?: string;
  title?: string;
  details?: string;
  reason: string;
  severity?: string;
  clauseRef?: string;
}

export interface ClaimStep {
  step: number;
  title: string;
  description: string;
  docsNeeded: string[];
}

export interface RiskyClause {
  id: string;
  clause: string;
  page: number;
  riskLevel: 'Critical' | 'Warning' | 'Caution' | 'High' | 'Low';
  plainEnglish: string;
  mitigation: string;
}

export interface LegalObligation {
  id: string;
  party: string;
  obligation: string;
  deadline: string;
  page?: number;
}

export interface AcademicData {
  researchQuestion: string;
  authors?: string[];
  institution?: string;
  methodology: string;
  datasetOrSample: string;
  keyFindings: string[];
  limitations: string[];
  conclusions: string;
  referencesCount?: number;
  keyReferences: string[];
}

export interface TechnicalData {
  systemArchitecture: string;
  components: { name: string; description: string; type: string }[];
  requirements: { id: string; category: string; description: string; priority: string }[];
  apisOrEndpoints: { name: string; method?: string; description: string }[];
  configurations: { key: string; value: string; purpose: string }[];
  proceduresOrSteps: { step: number; title: string; detail: string }[];
  dependencies: string[];
  warningsOrSecurityNotes: string[];
}

export interface BusinessData {
  executiveSummary: string;
  strategicObjectives: string[];
  stakeholders: { name: string; role: string; interest?: string }[];
  deliverables: { item: string; owner: string; deadline: string }[];
  marketInsights: string[];
  financialProjections: { metric: string; target: string; timeframe: string }[];
  keyDecisions: string[];
  risksAndThreats: string[];
}

export interface GovernmentData {
  issuingAuthority: string;
  documentType: string;
  scopeAndApplicability: string;
  effectiveDate: string;
  complianceDeadlines: string[];
  regulationsOrRules: { section: string; title: string; requirement: string }[];
  penaltiesForNonCompliance: string;
  submissionRequirements: string[];
}

export interface MedicalData {
  subjectOrPatientContext?: string;
  patientName?: string;
  labName?: string;
  testDate?: string;
  reportType?: string;
  criticalMarkers?: Array<{ marker: string; value: string; referenceRange: string; status: string; interpretation: string }>;
  physicianAdviceSummary?: string;
  medicationSchedule?: Array<{ medicine: string; dosage: string; duration: string; timing: string }>;
  observationsOrFindings?: string[];
  diagnosticResults?: { testName: string; result: string; normalRange?: string; status?: string }[];
  prescribedTreatmentsOrMedications?: { name: string; dosage?: string; instructions?: string }[];
  precautionsAndRecommendations?: string[];
  followUpDate?: string;
}

export interface DocumentClassification {
  category?: DocumentCategory;
  domain: DocumentDomain;
  secondaryDomains?: DocumentDomain[];
  subCategory?: string;
  language?: string;
  confidenceScore: number;
  complexity: 'Low' | 'Medium' | 'High';
  isScanned?: boolean;
  hasTables: boolean;
  hasImages: boolean;
  pageCount: number;
  keyTopics: string[];
  detectionReason: string;
  recommendedLens: string;
}

export interface DocumentComparison {
  doc1Id: string;
  doc1Name: string;
  doc2Id: string;
  doc2Name: string;
  comparisonSummary: string;
  similarityScore: number;
  addedItems: { category: string; description: string; page?: number }[];
  removedItems: { category: string; description: string; page?: number }[];
  changedValues: { field: string; doc1Value: string; doc2Value: string; significance: 'Major' | 'Minor' | 'Neutral' }[];
  changedDates: { milestone: string; doc1Date: string; doc2Date: string; changeType: 'Accelerated' | 'Delayed' | 'Modified' }[];
  riskDifferences: { topic: string; doc1Risk: string; doc2Risk: string; variance: string }[];
  verdict: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  plan: 'Free' | 'Pro' | 'Enterprise';
  documentsUsed: number;
  documentsLimit: number;
  createdAt: string;
  customApiKey?: string;
}

export interface CitationReference {
  page: number;
  snippet: string;
  section?: string;
  url?: string;
  title?: string;
  boundingBox?: { x1: number; y1: number; x2: number; y2: number };
  boundingBoxNormalized?: BoundingBox;
  regions?: BoundingBox[];
  evidence?: Evidence;
  graphPath?: GraphPath;
}

export interface SkillDefinition {
  id: string;
  name: string;
  priority: 'core' | 'architecture-ready';
  domainTriggers: string[];
  panels: string[];
  graphNodeTypes: string[];
  graphEdgeTypes: string[];
  instructions: string;
}

export interface Lens {
  id: string;
  workspaceId: string;
  name: string;
  prompt: string;
  createdAt: string;
}

export interface ActionConfirmation {
  actionId: string;
  toolName: string;
  title: string;
  payload: Record<string, unknown>;
  requiresApproval: boolean;
  approved?: boolean;
}

export interface AgentActivityItem {
  id: string;
  timestamp: string;
  type: 'mcp_call' | 'tool_call' | 'model_call' | 'system';
  name: string;
  input?: unknown;
  output?: unknown;
  durationMs?: number;
  status: 'pending' | 'success' | 'failed';
  model?: string;
  error?: string;
}

export interface HiddenClause {
  id: string;
  title: string;
  clauseText: string;
  page: number;
  reasonHidden: string;
  impact: string;
  severity: 'critical' | 'medium' | 'low';
  evidence?: Evidence;
}

export interface InconsistencyItem {
  id: string;
  topic: string;
  doc1Ref: string;
  doc2Ref?: string;
  description: string;
  varianceType: 'contradiction' | 'numerical_gap' | 'missing_counterpart';
  severity: 'critical' | 'medium' | 'low';
  page?: number;
}

export interface MissingInfoItem {
  id: string;
  topic: string;
  expectedClauseOrField: string;
  riskIfOmitted: string;
  recommendedFollowUp: string;
}

// GraphRAG types
export interface GraphNode {
  id: string;
  label: string;
  properties: Record<string, unknown>;
  communityId?: string;
}

export interface GraphRelationship {
  id: string;
  type: string;
  sourceId: string;
  targetId: string;
  properties?: Record<string, unknown>;
}

export interface GraphPath {
  nodes: GraphNode[];
  relationships: GraphRelationship[];
  summary?: string;
}

export interface CommunitySummary {
  id: string;
  level: number;
  name: string;
  summary: string;
  entityCount: number;
}

export interface GraphData {
  nodes: GraphNode[];
  relationships: GraphRelationship[];
  communities?: CommunitySummary[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  title?: string;
  text: string;
  timestamp: string;
  reaction?: 'up' | 'down' | null;
  citations?: CitationReference[];
  rawJson?: unknown;
  suggestions?: string[];
  attachedMedia?: AttachedMediaFile[];
  chartData?: {
    title?: string;
    type?: 'bar' | 'area';
    data: Array<{ name: string; value: number; [key: string]: string | number }>;
    color?: string;
  };
  graphPaths?: GraphPath[];
  isWebResearch?: boolean;
}

export type GenerationState = 'idle' | 'validating' | 'submitting' | 'generating' | 'completed' | 'failed';

export interface ModelConfig {
  modelName: 'gemini-3.8-flash' | 'gemini-3.5-flash' | 'gemini-2.0-flash' | 'gemini-1.5-flash' | 'gemini-1.5-pro' | 'kie-vision-fast';
  temperature: number;
  maxTokens: number;
  outputFormat: 'markdown' | 'json' | 'table';
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  documentIds: string[];
  lenses?: Lens[];
}

export interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  domain: DocumentDomain;
  prompt: string;
  icon?: string;
}

export interface UniversalSummary {
  tldr: string;
  keyTakeaways: string[];
  executiveBrief: string;
  actionChecklist: ActionChecklistItem[];
  importantDetails?: { category: string; title: string; value: string; page?: number }[];
  numbersAndMetrics?: TrackedNumber[];
  importantDates?: TrackedDate[];
  entities?: ExtractedEntity[];
  risksAndConcerns?: TrackedRisk[];
  questionsToConsider?: string[];
}

export interface DocumentAnalysis {
  id: string;
  name: string;
  fileSize: string;
  pageCount: number;
  uploadedAt: string;
  category?: DocumentCategory;
  detectedDomain: DocumentDomain;
  secondaryDomains?: DocumentDomain[];
  confidenceScore: number;
  detectionReason: string;
  workspaceId?: string;
  isFavorite?: boolean;
  processingState?: ProcessingState;
  userId?: string;
  userEmail?: string;
  
  summary: UniversalSummary;
  metrics: MetricCardData[];
  
  // Tracked Intelligence Fields
  trackedNumbers?: TrackedNumber[];
  trackedDates?: TrackedDate[];
  trackedRisks?: TrackedRisk[];
  classificationDetails?: DocumentClassification;
  savingsTips?: SavingsTip[];
  
  // Extensible Domain Specific Payloads
  legalData?: {
    contractType: string;
    parties: string[];
    effectiveDate: string;
    duration: string;
    riskScore: 'Low' | 'Medium' | 'High' | 'Critical';
    riskyClauses: RiskyClause[];
    obligations: LegalObligation[];
    terminationTerms: string;
  };
  
  academicData?: AcademicData;
  technicalData?: TechnicalData;
  businessData?: BusinessData;
  governmentData?: GovernmentData;
  medicalData?: MedicalData;
  
  financeData?: {
    totalIncome: number;
    totalExpense: number;
    netSavings: number;
    savingsRate: string;
    burnRate: string;
    categorySpend: SpendingCategory[];
    recurringSubs: RecurringSubscription[];
    savingsTips: SavingsTip[];
    feesAndPenalties: FeeOrPenalty[];
  };
  
  insuranceData?: {
    policyType: string;
    sumInsured: string;
    deductible: string;
    copay: string;
    waitingPeriod: string;
    coveredItems: CoveredItem[];
    excludedItems: ExcludedItem[];
    claimChecklist: ClaimStep[];
  };
  
  billingData?: {
    invoiceNumber: string;
    vendor: string;
    client: string;
    dueDate: string;
    taxBreakdown: { taxType: string; rate: string; amount: number }[];
    totalAmount: number;
    lineItems: { description: string; qty: number; unitPrice: number; total: number }[];
    discountsOrPenalties: string[];
  };
  
  extractedEntities: ExtractedEntity[];
  extractedTables: ExtractedTable[];
  sampleQuestions: string[];
  chatHistory?: ChatMessage[];
  rawText?: string;
  pageTexts?: { page: number; text: string }[];

  // Agent One Extended Grounding & Intelligence
  skillId?: string;
  skillName?: string;
  pages?: DocumentPage[];
  evidenceList?: Evidence[];
  hiddenClauses?: HiddenClause[];
  inconsistencies?: InconsistencyItem[];
  missingInformation?: MissingInfoItem[];
  graphData?: GraphData;
  agentActivities?: AgentActivityItem[];
  customLenses?: Lens[];
}

export type MediaType = 'image' | 'video' | 'pdf' | 'spreadsheet' | 'presentation' | 'code' | 'document' | 'other';

export interface AttachedMediaFile {
  id: string;
  name: string;
  size: number;
  sizeFormatted: string;
  mimeType: string;
  mediaType: MediaType;
  previewUrl?: string;
  fileObject?: File;
  base64Data?: string;
  status: 'pending' | 'uploading' | 'processing' | 'ready' | 'error' | 'failed';
  progress?: number;
  extractedSnippet?: string;
  isDemoDoc?: boolean;
  demoDoc?: DocumentAnalysis;
  demoDocId?: string;
}

export interface SavedConversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  documentId?: string | null;
  documentName?: string | null;
  documentDomain?: DocumentDomain;
  docAnalysis?: DocumentAnalysis | null;
}

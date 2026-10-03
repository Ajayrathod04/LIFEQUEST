export type MissionDomain =
  | "solve"
  | "field"
  | "skill"
  | "career"
  | "play"
  | "reset"
  | "impact";

export type MissionStepType =
  | "scenario"
  | "choice"
  | "action"
  | "evidence"
  | "feedback"
  | "result";

export type CompetencySkill =
  | "Communication"
  | "Decision Making"
  | "Problem Solving"
  | "Situational Judgment"
  | "Prioritization"
  | "Debugging & Problem Solving"
  | "Incident Response"
  | "Scam Investigation"
  | "Risk Analysis"
  | "Digital Literacy"
  | "Evidence Organization"
  | "Consumer Advocacy"
  | "Legal Awareness"
  | "Safety Protocol"
  | string;

export interface SkillEvidenceItem {
  skill: CompetencySkill;
  level: "Proficient" | "Developing" | "Needs Improvement";
  description: string;
}

export interface OptionFeedback {
  feedback: string;
  isOptimal?: boolean;
  score?: number;
  skillEvidence?: SkillEvidenceItem[];
}

export interface MissionStep {
  id: string;
  type: MissionStepType;
  title: string;
  description: string;
  options?: string[];
  optionFeedbacks?: Record<number, OptionFeedback>;
  evidenceExplanation?: string;
  skillsDemonstrated?: string[];
}

export interface MissionResultSummary {
  missionId: string;
  overallScore: number;
  grade: "Exemplary" | "Proficient" | "Needs Revision";
  summary: string;
  selectedOptionText: string;
  skillsDemonstrated: string[];
  evidenceExplanation: string;
  skillEvidences: SkillEvidenceItem[];
  completedAt?: number;
}

export interface SkillEvidenceRecord extends SkillEvidenceItem {
  id: string;
  missionId: string;
  missionTitle: string;
  score: number;
  timestamp: number;
}

export interface SkillSummaryEntry {
  skill: CompetencySkill;
  totalEvaluations: number;
  proficientCount: number;
  averageScore: number;
  latestLevel: "Proficient" | "Developing" | "Needs Improvement";
}

export interface SessionSkillPassport {
  totalMissionsCompleted: number;
  completedMissionIds: string[];
  latestResults: Record<string, MissionResultSummary>;
  accumulatedEvidence: SkillEvidenceRecord[];
  skillSummaries: Record<string, SkillSummaryEntry>;
}

export interface EmployerAssessmentConfig {
  id: string;
  title: string;
  missionId: string;
  missionTitle: string;
  targetRole?: string;
  requiredSkills: CompetencySkill[];
  createdAt: number;
}

// 1. Evidence Provenance Statuses
export type EvidenceStatus =
  | "Simulated"
  | "Simulated Model"
  | "Demonstrated"
  | "Projected"
  | "Field Verified";

export type ImpactEvidenceStatus = EvidenceStatus;

export interface ImpactMetric {
  label: string;
  value: string;
  unit: string;
  category: "Sustainability" | "Economic" | "Education" | "Community";
  status: ImpactEvidenceStatus;
  measurementContext: string;
}

export interface ImpactEvidenceRecord {
  id: string;
  missionId: string;
  missionTitle: string;
  problemStatement: string;
  actionTaken: string;
  measurement: string;
  outcome: string;
  measurableImpact: ImpactMetric[];
  skillsDemonstrated: string[];
  evidenceVerification: string;
  evidenceStatus: ImpactEvidenceStatus;
  timestamp: number;
}

export interface SessionImpactPassport {
  totalImpactMissionsCompleted: number;
  totalImpactPoints: number;
  accumulatedImpactRecords: ImpactEvidenceRecord[];
  aggregatedMetrics: Record<string, { label: string; aggregateValue: string; unit: string; status: ImpactEvidenceStatus }>;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  domain: MissionDomain;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedMinutes: number;
  skills: string[];
  steps: MissionStep[];
  isProRequired?: boolean;
}

// 2. SKILL Assessment Lab Types
export type AssessmentRole =
  | "Senior Product Lead"
  | "Fullstack Software Engineer"
  | "Operations Lead"
  | "Customer Success Manager"
  | "Sustainability Project Director"
  | "Incident Response Lead"
  | string;

export type AssessmentMode =
  | "scenario_judgment"
  | "mcq"
  | "prioritization"
  | "debugging"
  | "incident_response"
  | "communication_judgment";

export type QuestionChallengeType =
  | "scenario"
  | "mcq"
  | "prioritization"
  | "debugging"
  | "incident"
  | "communication";

export interface AssessmentOption {
  id: string;
  text: string;
  isOptimal?: boolean;
  rationale?: string;
  scoreImpact?: number;
}

export interface AssessmentPriorityItem {
  id: string;
  label: string;
  correctRank: number;
}

export interface AssessmentChallengeItem {
  id: string;
  title: string;
  prompt: string;
  challengeType: QuestionChallengeType;
  options?: AssessmentOption[];
  priorityItems?: AssessmentPriorityItem[];
  codeOrLogSnippet?: string;
  expectedKeywordFix?: string;
  skillsEvaluated: CompetencySkill[];
}

export interface AssessmentLabConfig {
  id: string;
  title: string;
  targetRole: AssessmentRole;
  mode: AssessmentMode;
  requiredSkills: CompetencySkill[];
  challenges: AssessmentChallengeItem[];
  estimatedMinutes: number;
}

export interface ObservableResult {
  challengeId: string;
  challengeTitle: string;
  selectedOptionId?: string;
  userRankedIds?: string[];
  debuggingInput?: string;
  score: number;
  feedback: string;
  evidenceStatus: EvidenceStatus;
  observedCompetencies: SkillEvidenceItem[];
}

// 3. SOLVE Tool Types
export type SolveToolCategory =
  | "Scan"
  | "ClaimKit"
  | "Legal Awareness"
  | "Safety"
  | "Docs";

export interface SolveToolModule {
  id: string;
  title: string;
  category: SolveToolCategory;
  description: string;
  disclaimer?: string;
  iconName: string;
  actionLabel: string;
  isProRequired?: boolean;
}

// 4. Lumi Quest Guide Instructional Types
export interface LumiGuidanceContext {
  missionId?: string;
  stepId?: string;
  domain?: MissionDomain;
  instructionTitle: string;
  guidanceText: string;
  keyTakeaway: string;
  disclaimer?: string;
}

// 5. Replay State Representation
export interface MissionReplayState {
  originalMissionId: string;
  attemptNumber: number;
  previousScore?: number;
  previousGrade?: string;
  isReplayActive: boolean;
  startedAt: number;
}

// PLAY Branching Simulation Types
export interface PlaySimulationStats {
  trust: number;     // 0 - 100
  time: number;      // 0 - 100
  resources: number; // 0 - 100
  reputation: number;// 0 - 100
}

export interface PlayChoiceOption {
  id: string;
  text: string;
  consequenceText: string;
  statImpact: Partial<PlaySimulationStats>;
  nextBranchNodeId: string;
}

export interface PlayBranchNode {
  id: string;
  stepNumber: number;
  situationTitle: string;
  situationDescription: string;
  contextBanner?: string;
  choices: PlayChoiceOption[];
}

export interface PlaySimulationOutcome {
  id: string;
  title: string;
  summary: string;
  finalGrade: "Master Strategist" | "Pragmatic Leader" | "Crisis Containment" | "System Collapse";
  recapPath: string[];
}

export interface PlayScenario {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  initialStats: PlaySimulationStats;
  startNodeId: string;
  nodes: Record<string, PlayBranchNode>;
  outcomes: Record<string, PlaySimulationOutcome>;
}

// RESET Micro-Interaction Types
export interface ResetSessionState {
  durationSeconds: number;
  phase: "ready" | "inhale" | "hold" | "exhale" | "complete";
  completedCount: number;
  lastCompletedAt?: number;
}

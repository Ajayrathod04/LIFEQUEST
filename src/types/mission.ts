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

export interface MissionStep {
  id: string;
  type: MissionStepType;
  title: string;
  description: string;
  options?: string[];
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
}

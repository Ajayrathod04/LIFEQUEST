import type { Mission } from "../types/mission";

export function getMissionProgress(
  mission: Mission,
  currentStep: number,
): number {
  if (mission.steps.length === 0) {
    return 0;
  }

  return Math.min(
    100,
    Math.round(((currentStep + 1) / mission.steps.length) * 100),
  );
}

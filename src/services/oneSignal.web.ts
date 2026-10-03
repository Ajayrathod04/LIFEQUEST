export interface OneSignalState {
  isInitialized: boolean;
  appId: string | null;
  lastNotificationSent: string | null;
}

let initialized = false;

export async function initOneSignal(): Promise<boolean> {
  initialized = true;
  console.log("[OneSignal Web] Native OneSignal disabled on Web.");
  return true;
}

export async function scheduleMissionRetentionReminder(
  missionTitle: string = "Career Mission"
): Promise<boolean> {
  console.log(
    `[OneSignal Web] Retention reminder: ${missionTitle}`
  );
  return true;
}

export function getOneSignalStatus(): OneSignalState {
  return {
    isInitialized: initialized,
    appId: null,
    lastNotificationSent:
      "Your LIFEQUEST mission is waiting. Continue where you left off.",
  };
}

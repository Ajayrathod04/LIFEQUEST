import { Platform } from "react-native";
import Constants from "expo-constants";
import { OneSignal } from "react-native-onesignal";
import { trackEvent } from "./analytics";

export interface OneSignalState {
  isInitialized: boolean;
  appId: string | null;
  lastNotificationSent: string | null;
}

let isOneSignalInitialized = false;

const configuredAppId =
  process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID ||
  (Constants.expoConfig?.extra?.oneSignalAppId as string | undefined) ||
  null;

export async function initOneSignal(): Promise<boolean> {
  if (isOneSignalInitialized) return true;

  try {
    if (Platform.OS === "web") {
      console.log(
        "[OneSignal] Web detected - native OneSignal SDK skipped."
      );
      isOneSignalInitialized = true;
      trackEvent("onesignal_initialized", { platform: "web" });
      return true;
    }

    if (!configuredAppId || typeof configuredAppId !== "string" || configuredAppId.trim() === "" || configuredAppId.includes("your_")) {
      console.warn("[OneSignal] No valid App ID configured - skipping notification initialization.");
      return false;
    }

    try {
      OneSignal.initialize(configuredAppId);
    } catch (initErr) {
      console.warn("[OneSignal] Core initialization notice:", initErr);
      return false;
    }

    // Android 13+ runtime notification permission request safely guarded
    try {
      if (OneSignal.Notifications && typeof OneSignal.Notifications.requestPermission === "function") {
        await OneSignal.Notifications.requestPermission(true);
      }
    } catch (permErr) {
      console.warn("[OneSignal] Notification permission request notice:", permErr);
    }

    isOneSignalInitialized = true;

    console.log(
      `[OneSignal] SDK initialized successfully: ${configuredAppId}`
    );

    trackEvent("onesignal_initialized", {
      platform: Platform.OS,
    });

    return true;
  } catch (err: any) {
    console.warn(
      "[OneSignal] Initialization notice:",
      err?.message || err
    );
    return false;
  }
}

export async function scheduleMissionRetentionReminder(
  missionTitle: string = "Career Mission"
): Promise<boolean> {
  try {
    const message =
      `Your LIFEQUEST mission "${missionTitle}" is waiting. ` +
      `Continue where you left off.`;

    console.log(
      `[OneSignal] Retention event triggered: "${message}"`
    );

    trackEvent("onesignal_retention_triggered", {
      missionTitle,
      message,
      timestamp: Date.now(),
    });

    return true;
  } catch (err) {
    console.warn(
      "[OneSignal] Failed to trigger retention event:",
      err
    );
    return false;
  }
}

export function getOneSignalStatus(): OneSignalState {
  return {
    isInitialized: isOneSignalInitialized,
    appId: configuredAppId,
    lastNotificationSent:
      "Your LIFEQUEST mission is waiting. Continue where you left off.",
  };
}

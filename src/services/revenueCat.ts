import { Platform } from "react-native";
import Purchases, {
  CustomerInfo,
  LOG_LEVEL,
  PurchasesOffering,
  PurchasesPackage,
} from "react-native-purchases";

// RevenueCat Entitlement ID for LIFEQUEST Pro
export const ENTITLEMENT_ID = "lifequest_pro";

// Configuration state interface
export interface RevenueCatState {
  isConfigured: boolean;
  isWebFallback: boolean;
  hasProEntitlement: boolean;
  isJudgeAccess: boolean;
  activeOffering: PurchasesOffering | null;
  customerInfo: CustomerInfo | null;
  loading: boolean;
  error: string | null;
}

// Global in-memory state for Judge Access override & status listeners
let isJudgeAccessActive = false;
let isConfigured = false;
let listeners: Array<(state: Partial<RevenueCatState>) => void> = [];

/**
 * Public API keys should be configured in app config or EXPO_PUBLIC environment variables.
 * Note: Never commit private secret keys (e.g. RevenueCat Secret Keys / App Store Shared Secrets).
 */
const REVENUECAT_ANDROID_KEY =
  process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY ||
  process.env.EXPO_PUBLIC_REVENUECAT_TEST_STORE_KEY ||
  "";

const REVENUECAT_IOS_KEY =
  process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY ||
  process.env.EXPO_PUBLIC_REVENUECAT_TEST_STORE_KEY ||
  "";

/**
 * Initialize RevenueCat SDK safely across Native & Web environments.
 * Prevents native crashes if API key is unconfigured or native module is unavailable.
 */
export async function initRevenueCat(): Promise<boolean> {
  if (isConfigured) return true;

  // Web does not support native RevenueCat billing natively
  if (Platform.OS === "web") {
    console.log(
      "[RevenueCat Service] Running on Web platform - using web fallback status."
    );
    isConfigured = false;
    return false;
  }

  try {
    const apiKey =
      Platform.OS === "ios" ? REVENUECAT_IOS_KEY : REVENUECAT_ANDROID_KEY;

    if (!apiKey || typeof apiKey !== "string" || apiKey.trim() === "" || apiKey.includes("your_")) {
      console.warn(
        "[RevenueCat Service] No valid public SDK key configured - running safely in Free mode with Judge Access enabled."
      );
      isConfigured = false;
      return false;
    }

    // Set log level for dev diagnostics
    if (__DEV__) {
      try {
        await Purchases.setLogLevel(LOG_LEVEL.DEBUG);
      } catch (logErr) {
        console.warn("[RevenueCat Service] Could not set debug log level:", logErr);
      }
    }

    await Purchases.configure({ apiKey });
    isConfigured = true;
    console.log("[RevenueCat Service] RevenueCat SDK configured successfully.");
    return true;
  } catch (err: any) {
    console.warn(
      "[RevenueCat Service] SDK configuration notice:",
      err?.message || err
    );
    isConfigured = false;
    return false;
  }
}

/**
 * Check if the active customer holds the 'lifequest_pro' entitlement, or if Judge Access is active.
 */
export async function checkProEntitlement(): Promise<{
  hasPro: boolean;
  isJudge: boolean;
  customerInfo: CustomerInfo | null;
}> {
  if (isJudgeAccessActive) {
    return { hasPro: true, isJudge: true, customerInfo: null };
  }

  if (!isConfigured && Platform.OS !== "web") {
    await initRevenueCat();
  }

  if (!isConfigured) {
    return { hasPro: false, isJudge: false, customerInfo: null };
  }

  try {
    const customerInfo = await Purchases.getCustomerInfo();
    const hasPro = Boolean(customerInfo.entitlements.active[ENTITLEMENT_ID]);
    return { hasPro, isJudge: false, customerInfo };
  } catch (err) {
    console.warn("[RevenueCat Service] Failed to fetch customer info:", err);
    return { hasPro: false, isJudge: false, customerInfo: null };
  }
}

/**
 * Fetch available offerings configured in RevenueCat dashboard.
 */
export async function getRevenueCatOfferings(): Promise<PurchasesOffering | null> {
  if (!isConfigured && Platform.OS !== "web") {
    await initRevenueCat();
  }

  if (!isConfigured) {
    return null;
  }

  try {
    const offerings = await Purchases.getOfferings();
    if (offerings.current !== null) {
      return offerings.current;
    }
    return null;
  } catch (err) {
    console.warn("[RevenueCat Service] Failed to fetch offerings:", err);
    return null;
  }
}

/**
 * Purchase a selected RevenueCat package (e.g. Monthly / Annual).
 */
export async function purchaseProPackage(pkg: PurchasesPackage): Promise<{
  success: boolean;
  userCancelled: boolean;
  customerInfo?: CustomerInfo;
  error?: string;
}> {
  if (!isConfigured) {
    return {
      success: false,
      userCancelled: false,
      error:
        "RevenueCat is not initialized or store billing is unconfigured in this environment.",
    };
  }

  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    const hasPro = Boolean(customerInfo.entitlements.active[ENTITLEMENT_ID]);
    return {
      success: hasPro,
      userCancelled: false,
      customerInfo,
    };
  } catch (err: any) {
    if (err.userCancelled) {
      return { success: false, userCancelled: true };
    }
    return {
      success: false,
      userCancelled: false,
      error: err.message || "Purchase failed. Please try again.",
    };
  }
}

/**
 * Restore previous store purchases via RevenueCat.
 */
export async function restoreProPurchases(): Promise<{
  success: boolean;
  hasPro: boolean;
  customerInfo?: CustomerInfo;
  error?: string;
}> {
  if (!isConfigured) {
    return {
      success: false,
      hasPro: false,
      error:
        "Store purchases restore is only available on native store builds.",
    };
  }

  try {
    const customerInfo = await Purchases.restorePurchases();
    const hasPro = Boolean(customerInfo.entitlements.active[ENTITLEMENT_ID]);
    return {
      success: true,
      hasPro,
      customerInfo,
    };
  } catch (err: any) {
    return {
      success: false,
      hasPro: false,
      error: err.message || "Failed to restore purchases.",
    };
  }
}

/**
 * Judge Access override controller for hackathon competition testing.
 * Enables judges to evaluate LIFEQUEST Pro features seamlessly.
 */
export function setJudgeAccessState(active: boolean): void {
  isJudgeAccessActive = active;
  console.log(
    `[RevenueCat Service] Judge Access Pass override set to: ${active}`,
  );
  notifyListeners({ isJudgeAccess: active, hasProEntitlement: active });
}

export function getJudgeAccessState(): boolean {
  return isJudgeAccessActive;
}

export function subscribeToRevenueCatState(
  listener: (state: Partial<RevenueCatState>) => void,
): () => void {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function notifyListeners(state: Partial<RevenueCatState>): void {
  listeners.forEach((l) => l(state));
}

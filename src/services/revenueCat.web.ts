import { Platform } from "react-native";

export const ENTITLEMENT_ID = "lifequest_pro";

export interface RevenueCatState {
  isConfigured: boolean;
  isWebFallback: boolean;
  hasProEntitlement: boolean;
  isJudgeAccess: boolean;
  activeOffering: any | null;
  customerInfo: any | null;
  loading: boolean;
  error: string | null;
}

let isJudgeAccessActive = false;
let listeners: Array<(state: Partial<RevenueCatState>) => void> = [];

export async function initRevenueCat(): Promise<boolean> {
  return false;
}

export async function checkProEntitlement() {
  return {
    hasPro: isJudgeAccessActive,
    isJudge: isJudgeAccessActive,
    customerInfo: null,
  };
}

export async function getRevenueCatOfferings() {
  return null;
}

export async function purchaseProPackage(_pkg: unknown) {
  return {
    success: false,
    userCancelled: false,
    error: "Store billing is available only on native builds.",
  };
}

export async function restoreProPurchases() {
  return {
    success: false,
    hasPro: false,
    error: "Store purchases restore is available only on native builds.",
  };
}

export function setJudgeAccessState(active: boolean): void {
  isJudgeAccessActive = active;
  listeners.forEach((listener) =>
    listener({
      isJudgeAccess: active,
      hasProEntitlement: active,
    })
  );
}

export function getJudgeAccessState(): boolean {
  return isJudgeAccessActive;
}

export function subscribeToRevenueCatState(
  listener: (state: Partial<RevenueCatState>) => void
): () => void {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

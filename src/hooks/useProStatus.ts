import { useState, useEffect, useCallback } from "react";
import {
  checkProEntitlement,
  getJudgeAccessState,
  subscribeToRevenueCatState,
} from "../services/revenueCat";

export function useProStatus() {
  const [isPro, setIsPro] = useState<boolean>(false);
  const [isJudge, setIsJudge] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [paywallVisible, setPaywallVisible] = useState<boolean>(false);
  const [paywallSource, setPaywallSource] = useState<string>("");

  const refreshStatus = useCallback(async () => {
    setLoading(true);
    const { hasPro, isJudge: judgeActive } = await checkProEntitlement();
    setIsPro(hasPro);
    setIsJudge(judgeActive);
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshStatus();

    // Subscribe to Judge Access or state changes from RevenueCat service
    const unsubscribe = subscribeToRevenueCatState((state) => {
      if (state.isJudgeAccess !== undefined) {
        setIsJudge(state.isJudgeAccess);
        if (state.isJudgeAccess) {
          setIsPro(true);
        } else {
          refreshStatus();
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [refreshStatus]);

  const showPaywall = useCallback((source: string = "PRO Feature") => {
    setPaywallSource(source);
    setPaywallVisible(true);
  }, []);

  const hidePaywall = useCallback(() => {
    setPaywallVisible(false);
  }, []);

  return {
    isPro,
    isJudge,
    loading,
    paywallVisible,
    paywallSource,
    showPaywall,
    hidePaywall,
    refreshStatus,
  };
}

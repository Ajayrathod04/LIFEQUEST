import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { colors, fonts, spacing } from "../../constants/theme";
import {
  checkProEntitlement,
  getRevenueCatOfferings,
  purchaseProPackage,
  restoreProPurchases,
  setJudgeAccessState,
  getJudgeAccessState,
  ENTITLEMENT_ID,
} from "../../services/revenueCat";
import type { PurchasesOffering, PurchasesPackage } from "react-native-purchases";

interface PaywallModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  sourceTrigger?: string;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  visible,
  onClose,
  onSuccess,
  sourceTrigger = "Unlock Premium",
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual">("annual");
  const [offering, setOffering] = useState<PurchasesOffering | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isJudgeActive, setIsJudgeActive] = useState<boolean>(getJudgeAccessState());

  useEffect(() => {
    if (visible) {
      loadOfferings();
      setIsJudgeActive(getJudgeAccessState());
    }
  }, [visible]);

  const loadOfferings = async () => {
    setLoading(true);
    try {
      const currentOffering = await getRevenueCatOfferings();
      if (currentOffering) {
        setOffering(currentOffering);
      }
    } catch (e) {
      console.warn("Could not load RevenueCat offerings:", e);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    setLoading(true);
    setStatusMessage(null);

    // If native offering is available from RevenueCat SDK
    if (offering) {
      const pkgToBuy =
        selectedPlan === "annual" ? offering.annual : offering.monthly;
      if (pkgToBuy) {
        const result = await purchaseProPackage(pkgToBuy as PurchasesPackage);
        setLoading(false);
        if (result.success) {
          setStatusMessage("Purchased successfully! Welcome to LIFEQUEST Pro.");
          if (onSuccess) onSuccess();
          setTimeout(() => {
            onClose();
          }, 1200);
          return;
        } else if (result.userCancelled) {
          setStatusMessage("Purchase was cancelled.");
          return;
        } else {
          setStatusMessage(result.error || "Purchase failed.");
          return;
        }
      }
    }

    // Unconfigured store or Web / localhost fallback message
    setLoading(false);
    if (Platform.OS === "web") {
      Alert.alert(
        "Store Billing Notice",
        "Native store purchases are handled via App Store / Google Play in a native build. For competition evaluation, please use the 'Unlock Judge Access' pass below.",
        [{ text: "OK" }]
      );
    } else {
      setStatusMessage("RevenueCat product offerings require App Store / Google Play configuration. Use Judge Access pass below to test.");
    }
  };

  const handleRestore = async () => {
    setLoading(true);
    setStatusMessage(null);
    const result = await restoreProPurchases();
    setLoading(false);

    if (result.hasPro) {
      setStatusMessage("Purchases restored! LIFEQUEST Pro is active.");
      if (onSuccess) onSuccess();
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setStatusMessage(result.error || "No active LIFEQUEST Pro subscriptions found.");
    }
  };

  const handleToggleJudgeAccess = () => {
    const nextState = !isJudgeActive;
    setJudgeAccessState(nextState);
    setIsJudgeActive(nextState);
    setStatusMessage(
      nextState
        ? "Judge Pass Activated! All LIFEQUEST Pro features unlocked."
        : "Judge Pass Deactivated. Standard Free access active."
    );
    if (nextState && onSuccess) {
      onSuccess();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕ Close</Text>
          </TouchableOpacity>
          <View style={styles.proHeaderBadge}>
            <Text style={styles.proHeaderBadgeText}>PRO EDITION</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Hero Banner */}
          <View style={styles.heroCard}>
            <View style={styles.glowDot} />
            <Text style={styles.heroTitle}>LIFEQUEST PRO</Text>
            <Text style={styles.heroSubtitle}>
              Practice deeper. Demonstrate more. Build stronger evidence.
            </Text>
            {sourceTrigger ? (
              <View style={styles.triggerPill}>
                <Text style={styles.triggerPillText}>UNLOCKING: {sourceTrigger.toUpperCase()}</Text>
              </View>
            ) : null}
          </View>

          {/* Benefits Grid */}
          <View style={styles.benefitsCard}>
            <Text style={styles.sectionTitle}>Included in LIFEQUEST Pro</Text>

            <View style={styles.benefitRow}>
              <View style={styles.benefitIconBox}>
                <Text style={styles.benefitIcon}>⚡</Text>
              </View>
              <View style={styles.benefitTextContainer}>
                <Text style={styles.benefitTitle}>Advanced Career Simulations</Text>
                <Text style={styles.benefitDesc}>
                  Multi-national mergers, regulatory crisis scenarios, and executive board decisions.
                </Text>
              </View>
            </View>

            <View style={styles.benefitRow}>
              <View style={styles.benefitIconBox}>
                <Text style={styles.benefitIcon}>📊</Text>
              </View>
              <View style={styles.benefitTextContainer}>
                <Text style={styles.benefitTitle}>Deeper Skill Analysis</Text>
                <Text style={styles.benefitDesc}>
                  360° competency breakdown, percentile benchmarking, and detailed feedback vectors.
                </Text>
              </View>
            </View>

            <View style={styles.benefitRow}>
              <View style={styles.benefitIconBox}>
                <Text style={styles.benefitIcon}>🛡️</Text>
              </View>
              <View style={styles.benefitTextContainer}>
                <Text style={styles.benefitTitle}>Expanded Evidence Passport</Text>
                <Text style={styles.benefitDesc}>
                  Unlimited skill evidence storage, verifiable audit histories, and employer-ready exports.
                </Text>
              </View>
            </View>

            <View style={styles.benefitRow}>
              <View style={styles.benefitIconBox}>
                <Text style={styles.benefitIcon}>🎮</Text>
              </View>
              <View style={styles.benefitTextContainer}>
                <Text style={styles.benefitTitle}>Premium Branching Scenarios</Text>
                <Text style={styles.benefitDesc}>
                  Full access to high-stakes PLAY simulations and advanced real-world impact packs.
                </Text>
              </View>
            </View>
          </View>

          {/* Subscription Tier Picker */}
          <View style={styles.plansContainer}>
            <Text style={styles.sectionTitle}>Select Access Tier</Text>

            {/* Annual Plan */}
            <TouchableOpacity
              style={[styles.planCard, selectedPlan === "annual" && styles.planCardSelected]}
              onPress={() => setSelectedPlan("annual")}
              activeOpacity={0.8}
            >
              <View style={styles.planHeader}>
                <View style={styles.radioCircle}>
                  {selectedPlan === "annual" ? <View style={styles.radioInner} /> : null}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.planTitle}>Annual Pro Membership</Text>
                  <Text style={styles.planSubtitle}>
                    {offering?.annual?.product?.priceString
                      ? `${offering.annual.product.priceString} / year`
                      : "$79.99 / year ($6.66/mo)"}
                  </Text>
                </View>
                <View style={styles.savingsBadge}>
                  <Text style={styles.savingsText}>SAVE 33%</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Monthly Plan */}
            <TouchableOpacity
              style={[styles.planCard, selectedPlan === "monthly" && styles.planCardSelected]}
              onPress={() => setSelectedPlan("monthly")}
              activeOpacity={0.8}
            >
              <View style={styles.planHeader}>
                <View style={styles.radioCircle}>
                  {selectedPlan === "monthly" ? <View style={styles.radioInner} /> : null}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.planTitle}>Monthly Pro Access</Text>
                  <Text style={styles.planSubtitle}>
                    {offering?.monthly?.product?.priceString
                      ? `${offering.monthly.product.priceString} / month`
                      : "$9.99 / month"}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Status / Message Alert */}
          {statusMessage ? (
            <View style={styles.statusBox}>
              <Text style={styles.statusText}>{statusMessage}</Text>
            </View>
          ) : null}

          {/* Primary Purchase CTA */}
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={handlePurchase}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.ctaButtonText}>
                {isJudgeActive
                  ? "Judge Access Active • Upgrade via Store"
                  : "Subscribe to LIFEQUEST Pro"}
              </Text>
            )}
          </TouchableOpacity>

          {/* Restore Purchases Button */}
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleRestore}
            disabled={loading}
          >
            <Text style={styles.secondaryButtonText}>Restore Purchases</Text>
          </TouchableOpacity>

          {/* JUDGE ACCESS COMPETITION SECTION */}
          <View style={styles.judgeSection}>
            <View style={styles.judgeBadgeRow}>
              <Text style={styles.judgeBadgeLabel}>COMPETITION EVALUATION</Text>
            </View>
            <Text style={styles.judgeTitle}>Judge Access Pass</Text>
            <Text style={styles.judgeDesc}>
              Judges and evaluators can activate this pass to test all premium LIFEQUEST Pro features instantly without store credentials.
            </Text>

            <TouchableOpacity
              style={[
                styles.judgeButton,
                isJudgeActive && styles.judgeButtonActive,
              ]}
              onPress={handleToggleJudgeAccess}
              activeOpacity={0.8}
            >
              <Text style={styles.judgeButtonText}>
                {isJudgeActive ? "✓ JUDGE PRO ACCESS ACTIVE (TAP TO RESET)" : "🔓 UNLOCK JUDGE PRO ACCESS"}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footerNote}>
            Powered by RevenueCat SDK • Entitlement: {ENTITLEMENT_ID} • Cancel anytime in Store Settings.
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
    backgroundColor: colors.surface,
  },
  closeButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  closeText: {
    color: colors.muted,
    fontSize: 14,
    fontFamily: fonts.medium,
  },
  proHeaderBadge: {
    backgroundColor: "#311B92",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  proHeaderBadgeText: {
    color: "#E0E7FF",
    fontSize: 11,
    fontFamily: fonts.bold,
    letterSpacing: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl * 2,
  },
  heroCard: {
    backgroundColor: "#13182E",
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: "center",
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: "#4C1D95",
    position: "relative",
    overflow: "hidden",
  },
  glowDot: {
    position: "absolute",
    top: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primaryGlow,
  },
  heroTitle: {
    color: "#F3E8FF",
    fontSize: 26,
    fontFamily: fonts.bold,
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  heroSubtitle: {
    color: colors.muted,
    fontSize: 14,
    fontFamily: fonts.medium,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  triggerPill: {
    backgroundColor: "#3B0764",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#7E22CE",
  },
  triggerPillText: {
    color: "#E9D5FF",
    fontSize: 10,
    fontFamily: fonts.bold,
    letterSpacing: 0.8,
  },
  benefitsCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 15,
    fontFamily: fonts.bold,
    marginBottom: spacing.md,
    letterSpacing: 0.5,
  },
  benefitRow: {
    flexDirection: "row",
    marginBottom: spacing.md,
    alignItems: "flex-start",
  },
  benefitIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#1E1B4B",
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  benefitIcon: {
    fontSize: 18,
  },
  benefitTextContainer: {
    flex: 1,
  },
  benefitTitle: {
    color: colors.text,
    fontSize: 14,
    fontFamily: fonts.bold,
    marginBottom: 2,
  },
  benefitDesc: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 16,
  },
  plansContainer: {
    marginBottom: spacing.md,
  },
  planCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.surfaceBorder,
  },
  planCardSelected: {
    borderColor: colors.primary,
    backgroundColor: "#1E1B4B",
  },
  planHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  planTitle: {
    color: colors.text,
    fontSize: 15,
    fontFamily: fonts.bold,
  },
  planSubtitle: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 2,
  },
  savingsBadge: {
    backgroundColor: "#065F46",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  savingsText: {
    color: "#34D399",
    fontSize: 10,
    fontFamily: fonts.bold,
  },
  statusBox: {
    backgroundColor: "#1E1B4B",
    padding: spacing.sm,
    borderRadius: 8,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  statusText: {
    color: "#DDD6FE",
    fontSize: 12,
    textAlign: "center",
    fontFamily: fonts.medium,
  },
  ctaButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginBottom: spacing.sm,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  ctaButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: fonts.bold,
    letterSpacing: 0.5,
  },
  secondaryButton: {
    paddingVertical: spacing.sm,
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  secondaryButtonText: {
    color: colors.muted,
    fontSize: 13,
    fontFamily: fonts.medium,
    textDecorationLine: "underline",
  },
  judgeSection: {
    backgroundColor: "#18181B",
    borderRadius: 14,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: "#D97706",
    marginBottom: spacing.md,
  },
  judgeBadgeRow: {
    alignSelf: "flex-start",
    backgroundColor: "#451A03",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: spacing.xs,
  },
  judgeBadgeLabel: {
    color: "#FBBF24",
    fontSize: 9,
    fontFamily: fonts.bold,
    letterSpacing: 1,
  },
  judgeTitle: {
    color: "#FDE68A",
    fontSize: 15,
    fontFamily: fonts.bold,
    marginBottom: 4,
  },
  judgeDesc: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 16,
    marginBottom: spacing.md,
  },
  judgeButton: {
    backgroundColor: "#B45309",
    borderRadius: 10,
    paddingVertical: spacing.sm,
    alignItems: "center",
  },
  judgeButtonActive: {
    backgroundColor: "#059669",
  },
  judgeButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontFamily: fonts.bold,
    letterSpacing: 0.5,
  },
  footerNote: {
    color: "#4B5563",
    fontSize: 10,
    textAlign: "center",
    lineHeight: 14,
  },
});

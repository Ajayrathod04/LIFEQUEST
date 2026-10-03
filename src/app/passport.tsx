import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { DevelopmentFocus } from "../components/passport/DevelopmentFocus";
import { EvidenceTimeline } from "../components/passport/EvidenceTimeline";
import { FutureOpportunityPreview } from "../components/passport/FutureOpportunityPreview";
import { MissionEvidenceCard } from "../components/passport/MissionEvidenceCard";
import { PassportEmptyState } from "../components/passport/PassportEmptyState";
import { PassportOverview } from "../components/passport/PassportOverview";
import { SkillEvidenceCard } from "../components/passport/SkillEvidenceCard";
import { SkillPassportHeader } from "../components/passport/SkillPassportHeader";
import { getSessionSkillPassport } from "../engine/missionEngine";
import type { SessionSkillPassport } from "../types/mission";
import { useProStatus } from "../hooks/useProStatus";
import { PaywallModal } from "../components/monetization/PaywallModal";
import { colors, ModeAccents, Shadows } from "../constants/theme";

export default function PassportScreen() {
  const { isPro, paywallVisible, paywallSource, showPaywall, hidePaywall } = useProStatus();

  const [passport, setPassport] = useState<SessionSkillPassport>(
    getSessionSkillPassport()
  );

  useFocusEffect(
    useCallback(() => {
      setPassport(getSessionSkillPassport());
    }, [])
  );

  const hasEvidence = passport.totalMissionsCompleted > 0;
  const summaryEntries = Object.values(passport.skillSummaries);

  const latestRecordsBySkill = passport.accumulatedEvidence.reduce<
    Record<string, (typeof passport.accumulatedEvidence)[0]>
  >((acc, item) => {
    acc[item.skill] = item;
    return acc;
  }, {});

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SkillPassportHeader />

      {!hasEvidence ? (
        <>
          <PassportEmptyState />
          <FutureOpportunityPreview />
        </>
      ) : (
        <>
          {/* Section A: Passport Overview */}
          <PassportOverview passport={passport} />

          {/* Section B: Core Skill Profile */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CORE SKILL PROFILE</Text>

            {summaryEntries.map((summary) => (
              <SkillEvidenceCard
                key={summary.skill}
                summary={summary}
                latestRecord={latestRecordsBySkill[summary.skill]}
              />
            ))}
          </View>

          {/* PRO Section: Executive Benchmark & Shareable Proof Card */}
          <View style={[styles.proSectionCard, Shadows.card]}>
            <View style={styles.proSectionHeader}>
              <View style={styles.proTagBadge}>
                <Text style={styles.proTagBadgeText}>LIFEQUEST PRO PROOF CARD</Text>
              </View>
              <Text style={styles.proSectionTitle}>
                360° Executive Competency Benchmark & Share Card
              </Text>
            </View>

            {isPro ? (
              <View style={styles.proUnlockedContent}>
                <View style={styles.benchmarkScoreRow}>
                  <View style={styles.benchmarkStatBox}>
                    <Text style={styles.statLabel}>INDUSTRY PERCENTILE</Text>
                    <Text style={styles.statValueHigh}>Top 4%</Text>
                    <Text style={styles.statSub}>Vs 12,500+ Executive Benchmarks</Text>
                  </View>
                  <View style={styles.benchmarkStatBox}>
                    <Text style={styles.statLabel}>STAKEHOLDER TRUST</Text>
                    <Text style={styles.statValue}>96 / 100</Text>
                    <Text style={styles.statSub}>High Crisis Velocity</Text>
                  </View>
                </View>

                <View style={styles.vectorList}>
                  <Text style={styles.vectorListTitle}>Verified Evidence Provenance Vectors:</Text>
                  <Text style={styles.vectorItem}>
                    • Decision Precision: 98th Percentile (Low risk tolerance breach)
                  </Text>
                  <Text style={styles.vectorItem}>
                    • Multi-party Alignment: 94th Percentile (Optimal conciliation)
                  </Text>
                  <Text style={styles.vectorItem}>
                    • Provenance: SIMULATED PRACTICE MODEL • Non-Certifying Record
                  </Text>
                </View>

                <View style={styles.proCertBadge}>
                  <Text style={styles.proCertText}>
                    ✓ PORTABLE SHAREABLE PROOF-OF-PRACTICE CARD GENERATED
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.proLockedContent}>
                <Text style={styles.proLockedDesc}>
                  Unlock percentile benchmarking against executive cohorts, 360° decision vectors, and exportable Pro Passport share cards.
                </Text>

                <Pressable
                  onPress={() => showPaywall("360° Executive Skill Benchmark")}
                  style={({ pressed }) => [styles.unlockProButton, pressed && styles.pressedState]}
                >
                  <Text style={styles.unlockProButtonText}>UNLOCK PRO BENCHMARK & SHARE CARD →</Text>
                </Pressable>
              </View>
            )}
          </View>

          {/* Section C: Evidence Timeline */}
          <EvidenceTimeline records={passport.accumulatedEvidence} />

          {/* Section D: Mission → Evidence Connection */}
          <MissionEvidenceCard results={passport.latestResults} />

          {/* Section E: Development Focus */}
          <DevelopmentFocus summaries={passport.skillSummaries} />

          {/* Section F: Future Opportunity Preview */}
          <FutureOpportunityPreview />
        </>
      )}

      <PaywallModal
        visible={paywallVisible}
        onClose={hidePaywall}
        sourceTrigger={paywallSource}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 48,
    backgroundColor: colors.background,
    maxWidth: 800,
    alignSelf: "center",
    width: "100%",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.text,
    letterSpacing: 1,
    marginBottom: 12,
  },
  proSectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 24,
  },
  proSectionHeader: {
    marginBottom: 12,
  },
  proTagBadge: {
    alignSelf: "flex-start",
    backgroundColor: ModeAccents.passport.badgeBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: ModeAccents.passport.border,
    marginBottom: 6,
  },
  proTagBadgeText: {
    color: ModeAccents.passport.badgeText,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  proSectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
  },
  proUnlockedContent: {
    gap: 12,
  },
  benchmarkScoreRow: {
    flexDirection: "row",
    gap: 10,
  },
  benchmarkStatBox: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.muted,
    marginBottom: 4,
  },
  statValueHigh: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.warning,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.primary,
  },
  statSub: {
    fontSize: 10,
    color: colors.muted,
    marginTop: 2,
  },
  vectorList: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 10,
    padding: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  vectorListTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  vectorItem: {
    fontSize: 11,
    color: colors.muted,
    lineHeight: 16,
  },
  proCertBadge: {
    backgroundColor: colors.successBg,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.success,
  },
  proCertText: {
    color: colors.success,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  proLockedContent: {
    gap: 12,
  },
  proLockedDesc: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  unlockProButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  unlockProButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  pressedState: {
    opacity: 0.85,
  },
});

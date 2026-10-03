import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { SessionSkillPassport } from "../../types/mission";
import { colors, ModeAccents, Shadows } from "../../constants/theme";

interface EmployerPerformanceReportProps {
  passport: SessionSkillPassport;
}

export function EmployerPerformanceReport({ passport }: EmployerPerformanceReportProps) {
  const router = useRouter();

  const resultsList = Object.values(passport.latestResults);
  const latestResult = resultsList[resultsList.length - 1];
  const summaryEntries = Object.values(passport.skillSummaries);

  if (!latestResult) return null;

  const avgScore =
    resultsList.length > 0
      ? Math.round(
          resultsList.reduce((acc, r) => acc + r.overallScore, 0) /
            resultsList.length,
        )
      : 0;

  const developmentArea =
    summaryEntries.find((s) => s.latestLevel !== "Proficient")?.skill ??
    "Cross-Functional Crisis Escalation";

  return (
    <View style={styles.container}>
      {/* Candidate Performance Overview Card */}
      <View style={[styles.performanceCard, Shadows.card]}>
        <View style={styles.cardHeader}>
          <View style={styles.reportBadge}>
            <Text style={styles.reportBadgeText}>VERIFIED CANDIDATE REPORT</Text>
          </View>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>
              {latestResult.overallScore}/100 • {latestResult.grade}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Candidate Observed Performance</Text>

        <View style={styles.provenanceNoticeBox}>
          <Text style={styles.provenanceNoticeText}>
            PROVENANCE: Observed in Candidate Simulation Model • Non-Certifying Practice Record
          </Text>
        </View>

        <View style={styles.metaGrid}>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Assessed Target Scenario:</Text>
            <Text style={styles.metaValue}>{latestResult.missionId}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Evaluation Standard:</Text>
            <Text style={styles.metaValue}>Executive Leadership Benchmark</Text>
          </View>
        </View>

        <View style={styles.decisionRecapBox}>
          <Text style={styles.recapLabel}>Observed Candidate Choice:</Text>
          <Text style={styles.recapText}>“{latestResult.selectedOptionText}”</Text>
        </View>

        <View style={styles.feedbackBox}>
          <Text style={styles.feedbackLabel}>Executive Leadership Feedback:</Text>
          <Text style={styles.feedbackText}>{latestResult.summary}</Text>
        </View>
      </View>

      {/* Competency Evidence Breakdown */}
      <View style={styles.evidenceSection}>
        <Text style={styles.evidenceSectionTitle}>OBSERVED COMPETENCY BREAKDOWN</Text>
        <Text style={styles.evidenceSectionSubtitle}>
          Evidence items generated from candidate scenario decisions:
        </Text>

        {latestResult.skillEvidences.map((ev) => (
          <View key={ev.skill} style={[styles.evidenceCard, Shadows.subtle]}>
            <View style={styles.evidenceHeader}>
              <Text style={styles.skillTitle}>{ev.skill}</Text>
              <View
                style={[
                  styles.levelBadge,
                  ev.level === "Proficient"
                    ? styles.levelProficient
                    : styles.levelDeveloping,
                ]}
              >
                <Text style={styles.levelBadgeText}>{ev.level}</Text>
              </View>
            </View>

            <Text style={styles.evidenceDesc}>“{ev.description}”</Text>
          </View>
        ))}
      </View>

      {/* Summary Card */}
      <View style={[styles.summaryCard, Shadows.subtle]}>
        <Text style={styles.summaryTitle}>ASSESSMENT METADATA & STRENGTHS</Text>

        <View style={styles.summaryGrid}>
          <View style={styles.summaryTile}>
            <Text style={styles.summaryTileNum}>{summaryEntries.length}</Text>
            <Text style={styles.summaryTileLabel}>Competencies Tested</Text>
          </View>
          <View style={styles.summaryTile}>
            <Text style={styles.summaryTileNum}>{passport.accumulatedEvidence.length}</Text>
            <Text style={styles.summaryTileLabel}>Evidence Items</Text>
          </View>
          <View style={styles.summaryTile}>
            <Text style={styles.summaryTileNum}>{avgScore}/100</Text>
            <Text style={styles.summaryTileLabel}>Average Score</Text>
          </View>
        </View>

        <View style={styles.devAreaBox}>
          <Text style={styles.devAreaLabel}>Recommended Growth Area:</Text>
          <Text style={styles.devAreaText}>
            {developmentArea} — Candidate demonstrates strong strategic intuition; recommended to test in advanced multi-branch crisis scenarios.
          </Text>
        </View>
      </View>

      {/* Action CTA */}
      <Pressable
        onPress={() => router.push("/career" as any)}
        style={({ pressed }) => [styles.retestButton, pressed && styles.pressedState]}
      >
        <Text style={styles.retestButtonText}>Launch Candidate Assessment →</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
    marginBottom: 32,
  },
  performanceCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  reportBadge: {
    backgroundColor: ModeAccents.employer.badgeBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: ModeAccents.employer.border,
  },
  reportBadgeText: {
    color: ModeAccents.employer.badgeText,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  scoreBadge: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  scoreText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 10,
  },
  provenanceNoticeBox: {
    backgroundColor: colors.warningBg,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FDE68A",
    marginBottom: 14,
  },
  provenanceNoticeText: {
    fontSize: 11,
    color: "#92400E",
    fontWeight: "700",
  },
  metaGrid: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    padding: 14,
    gap: 8,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaLabel: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: "600",
  },
  metaValue: {
    fontSize: 12,
    color: colors.text,
    fontWeight: "700",
  },
  decisionRecapBox: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    marginBottom: 14,
  },
  recapLabel: {
    fontSize: 11,
    color: colors.muted,
    fontWeight: "600",
    marginBottom: 4,
  },
  recapText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 19,
  },
  feedbackBox: {
    backgroundColor: ModeAccents.employer.badgeBg,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: ModeAccents.employer.border,
  },
  feedbackLabel: {
    fontSize: 11,
    color: ModeAccents.employer.badgeText,
    fontWeight: "800",
    marginBottom: 4,
  },
  feedbackText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 19,
  },
  evidenceSection: {
    gap: 10,
  },
  evidenceSectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.text,
    letterSpacing: 1,
  },
  evidenceSectionSubtitle: {
    fontSize: 12,
    color: colors.muted,
    marginBottom: 2,
  },
  evidenceCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  evidenceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  skillTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.text,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  levelProficient: {
    backgroundColor: colors.successBg,
  },
  levelDeveloping: {
    backgroundColor: colors.warningBg,
  },
  levelBadgeText: {
    color: colors.text,
    fontSize: 10,
    fontWeight: "800",
  },
  evidenceDesc: {
    fontSize: 13,
    color: colors.muted,
    lineHeight: 19,
    fontStyle: "italic",
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  summaryTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: 1.2,
    marginBottom: 14,
  },
  summaryGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  summaryTile: {
    backgroundColor: colors.surfaceLight,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    width: "31%",
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  summaryTileNum: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 2,
  },
  summaryTileLabel: {
    fontSize: 10,
    color: colors.muted,
    textAlign: "center",
    fontWeight: "600",
  },
  devAreaBox: {
    backgroundColor: colors.surfaceLight,
    padding: 12,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: colors.warning,
  },
  devAreaLabel: {
    fontSize: 11,
    color: colors.warning,
    fontWeight: "700",
    marginBottom: 2,
  },
  devAreaText: {
    fontSize: 12,
    color: colors.text,
    lineHeight: 18,
  },
  retestButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  retestButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  pressedState: {
    opacity: 0.85,
  },
});

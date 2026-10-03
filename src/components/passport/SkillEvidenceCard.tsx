import { StyleSheet, Text, View } from "react-native";
import type { SkillEvidenceRecord, SkillSummaryEntry } from "../../types/mission";
import { colors, Shadows } from "../../constants/theme";

interface SkillEvidenceCardProps {
  summary: SkillSummaryEntry;
  latestRecord?: SkillEvidenceRecord;
}

export function SkillEvidenceCard({ summary, latestRecord }: SkillEvidenceCardProps) {
  const isProficient = summary.latestLevel === "Proficient";
  const isDeveloping = summary.latestLevel === "Developing";

  return (
    <View style={[styles.card, Shadows.card]}>
      <View style={styles.headerRow}>
        <Text style={styles.skillName}>{summary.skill.toUpperCase()}</Text>
        <View
          style={[
            styles.levelBadge,
            isProficient
              ? styles.levelProficient
              : isDeveloping
              ? styles.levelDeveloping
              : styles.levelNeedsImprovement,
          ]}
        >
          <Text style={styles.levelBadgeText}>{summary.latestLevel.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.metricsRow}>
        <Text style={styles.scoreText}>
          Score: <Text style={styles.scoreHighlight}>{summary.averageScore}</Text>/100
        </Text>
        <Text style={styles.countText}>
          {summary.totalEvaluations} Evidence Record{summary.totalEvaluations === 1 ? "" : "s"}
        </Text>
      </View>

      {/* Visual Progress Bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressBar, { width: `${Math.min(100, Math.max(10, summary.averageScore))}%` }]} />
      </View>

      {/* Short Evidence Excerpt */}
      <Text style={styles.descriptionText}>
        “{latestRecord?.description ?? "Demonstrated through situation-based workplace scenario performance."}”
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  skillName: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.text,
    letterSpacing: 0.8,
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
  levelNeedsImprovement: {
    backgroundColor: colors.dangerBg,
  },
  levelBadgeText: {
    color: colors.text,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 13,
    color: colors.muted,
  },
  scoreHighlight: {
    color: colors.primary,
    fontWeight: "800",
  },
  countText: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: "600",
  },
  progressTrack: {
    height: 6,
    backgroundColor: colors.surfaceLight,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressBar: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  descriptionText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 19,
    fontStyle: "italic",
  },
});

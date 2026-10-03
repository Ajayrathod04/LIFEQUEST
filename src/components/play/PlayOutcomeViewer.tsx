import { Pressable, StyleSheet, Text, View } from "react-native";
import type { PlaySimulationOutcome, PlaySimulationStats } from "../../types/mission";
import { colors, Shadows } from "../../constants/theme";

interface PlayOutcomeViewerProps {
  outcome: PlaySimulationOutcome;
  finalStats: PlaySimulationStats;
  decisionHistory: string[];
  onReplay: () => void;
}

export function PlayOutcomeViewer({
  outcome,
  finalStats,
  decisionHistory,
  onReplay,
}: PlayOutcomeViewerProps) {
  const isPositive =
    outcome.finalGrade === "Master Strategist" ||
    outcome.finalGrade === "Pragmatic Leader";

  return (
    <View style={styles.container}>
      <View style={[styles.card, Shadows.card, isPositive ? styles.cardSuccess : styles.cardWarning]}>
        <View style={styles.badgeRow}>
          <Text style={styles.badgeText}>SIMULATION COMPLETED</Text>
          <View style={[styles.gradeBadge, isPositive ? styles.gradePos : styles.gradeNeg]}>
            <Text style={styles.gradeText}>{outcome.finalGrade.toUpperCase()}</Text>
          </View>
        </View>

        <Text style={styles.title}>{outcome.title}</Text>
        <Text style={styles.summary}>{outcome.summary}</Text>

        {/* Final State Metrics Summary */}
        <Text style={styles.sectionHeader}>FINAL METRICS SUMMARY:</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Trust</Text>
            <Text style={styles.statVal}>{Math.max(0, finalStats.trust)}%</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Time</Text>
            <Text style={styles.statVal}>{Math.max(0, finalStats.time)}%</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Resources</Text>
            <Text style={styles.statVal}>{Math.max(0, finalStats.resources)}%</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Reputation</Text>
            <Text style={styles.statVal}>{Math.max(0, finalStats.reputation)}%</Text>
          </View>
        </View>

        {/* Decision Path Recap */}
        <Text style={styles.sectionHeader}>EXECUTED BRANCH DECISION PATH:</Text>
        <View style={styles.pathList}>
          {decisionHistory.map((stepText, idx) => (
            <View key={idx} style={styles.pathItem}>
              <Text style={styles.pathNum}>Branch {idx + 1}:</Text>
              <Text style={styles.pathText}>“{stepText}”</Text>
            </View>
          ))}
        </View>

        <Pressable
          onPress={onReplay}
          style={({ pressed }) => [styles.replayButton, pressed && styles.pressed]}
        >
          <Text style={styles.replayButtonText}>🔄 Replay Simulation & Test Different Choices</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 22,
    borderWidth: 1.5,
    borderColor: colors.surfaceBorder,
  },
  cardSuccess: {
    borderColor: colors.success,
  },
  cardWarning: {
    borderColor: colors.danger,
  },
  badgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  badgeText: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  gradeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  gradePos: {
    backgroundColor: colors.successBg,
  },
  gradeNeg: {
    backgroundColor: colors.dangerBg,
  },
  gradeText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 8,
  },
  summary: {
    fontSize: 14,
    color: colors.muted,
    lineHeight: 22,
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.muted,
    letterSpacing: 1,
    marginBottom: 10,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  statLabel: {
    fontSize: 10,
    color: colors.muted,
    fontWeight: "600",
    marginBottom: 2,
  },
  statVal: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.text,
  },
  pathList: {
    gap: 8,
    marginBottom: 24,
  },
  pathItem: {
    backgroundColor: colors.surfaceLight,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  pathNum: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: "800",
    marginBottom: 2,
  },
  pathText: {
    fontSize: 12,
    color: colors.text,
    lineHeight: 18,
  },
  replayButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  replayButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  pressed: {
    opacity: 0.85,
  },
});

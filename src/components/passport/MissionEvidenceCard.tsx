import { StyleSheet, Text, View } from "react-native";
import type { MissionResultSummary } from "../../types/mission";
import { colors, Shadows } from "../../constants/theme";

interface MissionEvidenceCardProps {
  results: Record<string, MissionResultSummary>;
}

export function MissionEvidenceCard({ results }: MissionEvidenceCardProps) {
  const resultEntries = Object.values(results);
  if (resultEntries.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>MISSION EVIDENCE ORIGIN</Text>
      <Text style={styles.sectionSubtitle}>
        Observed performance mapping from completed real-world scenarios
      </Text>

      <View style={styles.list}>
        {resultEntries.map((res) => (
          <View key={res.missionId} style={[styles.card, Shadows.card]}>
            <View style={styles.cardHeader}>
              <View style={styles.badgeCompleted}>
                <Text style={styles.badgeCompletedText}>MISSION COMPLETED</Text>
              </View>
              <Text style={styles.scoreText}>{res.overallScore}/100 • {res.grade}</Text>
            </View>

            <Text style={styles.missionTitle}>
              {res.missionId === "career-escalation-001"
                ? "High-Stakes Client Escalation"
                : res.missionId === "consumer-refund-001"
                ? "The Refund Problem"
                : res.missionId}
            </Text>

            <View style={styles.recapBox}>
              <Text style={styles.recapLabel}>Decision Made:</Text>
              <Text style={styles.recapValue}>“{res.selectedOptionText}”</Text>
            </View>

            <Text style={styles.tagsLabel}>Demonstrated Skills:</Text>
            <View style={styles.tagsRow}>
              {res.skillsDemonstrated.map((s) => (
                <View key={s} style={styles.tag}>
                  <Text style={styles.tagText}>{s}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.text,
    letterSpacing: 1,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: colors.muted,
    marginBottom: 16,
  },
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  badgeCompleted: {
    backgroundColor: colors.successBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeCompletedText: {
    color: colors.success,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  scoreText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
  },
  missionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 10,
  },
  recapBox: {
    backgroundColor: colors.surfaceLight,
    padding: 12,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    marginBottom: 12,
  },
  recapLabel: {
    fontSize: 11,
    color: colors.muted,
    fontWeight: "600",
    marginBottom: 2,
  },
  recapValue: {
    fontSize: 12,
    color: colors.text,
    lineHeight: 18,
  },
  tagsLabel: {
    fontSize: 11,
    color: colors.muted,
    fontWeight: "600",
    marginBottom: 6,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tag: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  tagText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: "600",
  },
});

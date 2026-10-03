import { StyleSheet, Text, View } from "react-native";
import type { SkillSummaryEntry } from "../../types/mission";

interface DevelopmentFocusProps {
  summaries: Record<string, SkillSummaryEntry>;
}

export function DevelopmentFocus({ summaries }: DevelopmentFocusProps) {
  const summaryList = Object.values(summaries);
  if (summaryList.length === 0) return null;

  // Find skill with lowest score or non-proficient level
  const focusSkill =
    summaryList.find((s) => s.latestLevel !== "Proficient") ??
    summaryList.reduce((min, s) => (s.averageScore < min.averageScore ? s : min), summaryList[0]);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>DEVELOPMENT FOCUS</Text>
        <View style={styles.focusBadge}>
          <Text style={styles.focusBadgeText}>{focusSkill.latestLevel.toUpperCase()}</Text>
        </View>
      </View>

      <Text style={styles.skillTitle}>{focusSkill.skill}</Text>
      <Text style={styles.recommendationText}>
        Complete a higher-difficulty workplace scenario to generate additional evidence and elevate your profile to Proficient.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#1F2937",
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#F59E0B",
    letterSpacing: 1.2,
  },
  focusBadge: {
    backgroundColor: "#78350F",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  focusBadgeText: {
    color: "#FDE68A",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  skillTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#F9FAFB",
    marginBottom: 6,
  },
  recommendationText: {
    fontSize: 13,
    color: "#D1D5DB",
    lineHeight: 20,
  },
});

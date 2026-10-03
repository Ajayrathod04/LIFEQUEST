import { StyleSheet, Text, View } from "react-native";
import type { SkillEvidenceRecord } from "../../types/mission";

interface EvidenceTimelineProps {
  records: SkillEvidenceRecord[];
}

export function EvidenceTimeline({ records }: EvidenceTimelineProps) {
  if (records.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>EVIDENCE TIMELINE</Text>
      <Text style={styles.sectionSubtitle}>
        Chronological log of demonstrated competencies
      </Text>

      <View style={styles.timelineList}>
        {records.map((item, index) => {
          const dateStr = item.timestamp
            ? new Date(item.timestamp).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Recent Session";

          return (
            <View key={item.id || index} style={styles.timelineCard}>
              <View style={styles.topRow}>
                <Text style={styles.skillTitle}>{item.skill}</Text>
                <View
                  style={[
                    styles.levelBadge,
                    item.level === "Proficient"
                      ? styles.levelProficient
                      : item.level === "Developing"
                      ? styles.levelDeveloping
                      : styles.levelNeedsImprovement,
                  ]}
                >
                  <Text style={styles.levelBadgeText}>
                    {item.score} • {item.level}
                  </Text>
                </View>
              </View>

              <View style={styles.missionMetaRow}>
                <Text style={styles.missionTitle}>{item.missionTitle}</Text>
                <Text style={styles.timeText}>{dateStr}</Text>
              </View>

              <Text style={styles.descText}>“{item.description}”</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#F9FAFB",
    letterSpacing: 1,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#9CA3AF",
    marginBottom: 16,
  },
  timelineList: {
    gap: 12,
  },
  timelineCard: {
    backgroundColor: "#111827",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1F2937",
    borderLeftWidth: 3,
    borderLeftColor: "#8B5CF6",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  skillTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#F9FAFB",
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  levelProficient: {
    backgroundColor: "#065F46",
  },
  levelDeveloping: {
    backgroundColor: "#78350F",
  },
  levelNeedsImprovement: {
    backgroundColor: "#991B1B",
  },
  levelBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },
  missionMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  missionTitle: {
    fontSize: 12,
    color: "#8B5CF6",
    fontWeight: "700",
  },
  timeText: {
    fontSize: 11,
    color: "#6B7280",
  },
  descText: {
    fontSize: 13,
    color: "#D1D5DB",
    lineHeight: 19,
  },
});

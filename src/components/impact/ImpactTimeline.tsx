import { StyleSheet, Text, View } from "react-native";
import type { ImpactEvidenceRecord } from "../../types/mission";
import { colors, ModeAccents, Shadows } from "../../constants/theme";

interface ImpactTimelineProps {
  records: ImpactEvidenceRecord[];
}

export function ImpactTimeline({ records }: ImpactTimelineProps) {
  if (!records || records.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>VERIFIED IMPACT LOGS</Text>
      <Text style={styles.sectionSubtitle}>
        Sequential history of completed real-world practice missions and verified field outcomes:
      </Text>

      {records.map((rec) => (
        <View key={rec.id} style={[styles.recordCard, Shadows.card]}>
          <View style={styles.recordHeader}>
            <Text style={styles.missionTitle}>{rec.missionTitle}</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>FIELD LOGGED</Text>
            </View>
          </View>

          <View style={styles.box}>
            <Text style={styles.boxLabel}>Target Problem:</Text>
            <Text style={styles.boxText}>{rec.problemStatement}</Text>
          </View>

          <View style={styles.boxAction}>
            <Text style={styles.actionLabel}>Executed Action Strategy:</Text>
            <Text style={styles.actionText}>“{rec.actionTaken}”</Text>
          </View>

          {rec.measurement && (
            <View style={styles.boxMeasurement}>
              <Text style={styles.measurementLabel}>Measurement Method:</Text>
              <Text style={styles.measurementText}>{rec.measurement}</Text>
            </View>
          )}

          <Text style={styles.metricsHeader}>Measurable Impact & Provenance Status Breakdown:</Text>

          <View style={styles.metricsRow}>
            {rec.measurableImpact.map((m, idx) => (
              <View key={idx} style={styles.metricCardTile}>
                <View style={styles.metricHeaderRow}>
                  <Text style={styles.metricValueText}>{m.value} {m.unit}</Text>
                  <View style={styles.statusPill}>
                    <Text style={styles.statusPillText}>{m.status ?? "SIMULATED MODEL"}</Text>
                  </View>
                </View>
                <Text style={styles.metricLabelText}>{m.label}</Text>
                {m.measurementContext && (
                  <Text style={styles.metricContextText}>{m.measurementContext}</Text>
                )}
              </View>
            ))}
          </View>

          <View style={styles.verificationRow}>
            <Text style={styles.verificationText}>
              🛡️ {rec.evidenceVerification}
            </Text>
          </View>
        </View>
      ))}
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
  recordCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 14,
  },
  recordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  missionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
    maxWidth: "75%",
  },
  statusBadge: {
    backgroundColor: colors.successBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.success,
  },
  statusText: {
    color: colors.success,
    fontSize: 10,
    fontWeight: "800",
  },
  box: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  boxLabel: {
    fontSize: 11,
    color: colors.muted,
    fontWeight: "600",
    marginBottom: 2,
  },
  boxText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 19,
  },
  boxAction: {
    backgroundColor: colors.successBg,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: colors.success,
  },
  actionLabel: {
    fontSize: 11,
    color: colors.success,
    fontWeight: "700",
    marginBottom: 2,
  },
  actionText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 19,
  },
  boxMeasurement: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  measurementLabel: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: "700",
    marginBottom: 2,
  },
  measurementText: {
    fontSize: 12,
    color: colors.text,
    lineHeight: 18,
  },
  metricsHeader: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.muted,
    marginBottom: 8,
  },
  metricsRow: {
    gap: 8,
    marginBottom: 14,
  },
  metricCardTile: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  metricHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  metricValueText: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.success,
  },
  statusPill: {
    backgroundColor: colors.surface,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  statusPillText: {
    color: colors.muted,
    fontSize: 9,
    fontWeight: "800",
  },
  metricLabelText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 2,
  },
  metricContextText: {
    fontSize: 11,
    color: colors.muted,
    lineHeight: 16,
  },
  verificationRow: {
    backgroundColor: colors.surfaceLight,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  verificationText: {
    fontSize: 11,
    color: colors.muted,
    fontWeight: "600",
  },
});

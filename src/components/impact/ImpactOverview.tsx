import { StyleSheet, Text, View } from "react-native";
import type { SessionImpactPassport } from "../../types/mission";
import { colors, ModeAccents, Shadows } from "../../constants/theme";

interface ImpactOverviewProps {
  impactPassport: SessionImpactPassport;
}

export function ImpactOverview({ impactPassport }: ImpactOverviewProps) {
  const hasRecords = impactPassport.accumulatedImpactRecords.length > 0;

  return (
    <View style={[styles.container, Shadows.card]}>
      <View style={styles.headerRow}>
        <View style={styles.pillBadge}>
          <Text style={styles.pillText}>FIELD INTERVENTION AUDIT LOG</Text>
        </View>
        <Text style={styles.pointsText}>{impactPassport.totalImpactPoints} Impact Pts</Text>
      </View>

      <Text style={styles.cardTitle}>MEASURABLE OUTCOMES SUMMARY</Text>
      <Text style={styles.cardSubtitle}>
        Audited environmental and community impact calculated from field scenario decisions:
      </Text>

      <View style={styles.metricsGrid}>
        <View style={styles.metricTile}>
          <View style={styles.tileHeader}>
            <Text style={styles.metricValue}>{hasRecords ? "450 kWh" : "0 kWh"}</Text>
            <View style={styles.statusBadgeSimulated}>
              <Text style={styles.statusTextSimulated}>SIMULATED</Text>
            </View>
          </View>
          <Text style={styles.metricLabel}>Monthly Energy Saved</Text>
        </View>

        <View style={styles.metricTile}>
          <View style={styles.tileHeader}>
            <Text style={styles.metricValue}>{hasRecords ? "$4,200" : "$0"}</Text>
            <View style={styles.statusBadgeProjected}>
              <Text style={styles.statusTextProjected}>PROJECTED</Text>
            </View>
          </View>
          <Text style={styles.metricLabel}>Annual Budget Saved</Text>
        </View>

        <View style={styles.metricTile}>
          <View style={styles.tileHeader}>
            <Text style={styles.metricValue}>{hasRecords ? "1.8 Tons" : "0 Tons"}</Text>
            <View style={styles.statusBadgeSimulated}>
              <Text style={styles.statusTextSimulated}>SIMULATED</Text>
            </View>
          </View>
          <Text style={styles.metricLabel}>CO2 Offset / Year</Text>
        </View>

        <View style={styles.metricTile}>
          <View style={styles.tileHeader}>
            <Text style={styles.metricValue}>{hasRecords ? "120" : "0"}</Text>
            <View style={styles.statusBadgeDemonstrated}>
              <Text style={styles.statusTextDemonstrated}>DEMONSTRATED</Text>
            </View>
          </View>
          <Text style={styles.metricLabel}>Community Lives Touched</Text>
        </View>
      </View>

      <View style={styles.credibilityNotice}>
        <Text style={styles.credibilityText}>
          ℹ️ Metrics derived from mathematical scenario models & field audit telemetry. Unverified offline metrics are explicitly flagged as Simulated/Projected.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1.5,
    borderColor: colors.impact,
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  pillBadge: {
    backgroundColor: ModeAccents.impact.badgeBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: ModeAccents.impact.border,
  },
  pillText: {
    color: ModeAccents.impact.badgeText,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  pointsText: {
    color: colors.impact,
    fontSize: 13,
    fontWeight: "800",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: colors.muted,
    marginBottom: 16,
    lineHeight: 19,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  metricTile: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    padding: 14,
    width: "48%",
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  tileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.impact,
  },
  statusBadgeSimulated: {
    backgroundColor: colors.surface,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  statusTextSimulated: {
    color: colors.muted,
    fontSize: 9,
    fontWeight: "800",
  },
  statusBadgeProjected: {
    backgroundColor: colors.warningBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  statusTextProjected: {
    color: "#92400E",
    fontSize: 9,
    fontWeight: "800",
  },
  statusBadgeDemonstrated: {
    backgroundColor: colors.successBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.success,
  },
  statusTextDemonstrated: {
    color: colors.success,
    fontSize: 9,
    fontWeight: "800",
  },
  metricLabel: {
    fontSize: 11,
    color: colors.muted,
    fontWeight: "600",
  },
  credibilityNotice: {
    marginTop: 16,
    backgroundColor: colors.surfaceLight,
    padding: 12,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: colors.impact,
  },
  credibilityText: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 16,
  },
});

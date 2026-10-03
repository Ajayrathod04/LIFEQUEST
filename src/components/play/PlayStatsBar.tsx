import { StyleSheet, Text, View } from "react-native";
import type { PlaySimulationStats } from "../../types/mission";
import { colors, Shadows } from "../../constants/theme";

interface PlayStatsBarProps {
  stats: PlaySimulationStats;
  lastImpact?: Partial<PlaySimulationStats> | null;
}

export function PlayStatsBar({ stats, lastImpact }: PlayStatsBarProps) {
  const statItems = [
    { key: "trust", label: "Trust", val: stats.trust, color: colors.primary, diff: lastImpact?.trust },
    { key: "time", label: "Time", val: stats.time, color: colors.resetAccent, diff: lastImpact?.time },
    { key: "resources", label: "Resources", val: stats.resources, color: colors.success, diff: lastImpact?.resources },
    { key: "reputation", label: "Reputation", val: stats.reputation, color: colors.playAccent, diff: lastImpact?.reputation },
  ];

  return (
    <View style={[styles.container, Shadows.subtle]}>
      <Text style={styles.barTitle}>LIVE CRISIS SIMULATION METERS</Text>
      <View style={styles.grid}>
        {statItems.map((item) => {
          const clamped = Math.max(0, Math.min(100, item.val));
          return (
            <View key={item.key} style={styles.tile}>
              <View style={styles.tileHeader}>
                <Text style={styles.label}>{item.label}</Text>
                <View style={styles.valueRow}>
                  <Text style={[styles.valNum, { color: item.color }]}>{clamped}%</Text>
                  {item.diff !== undefined && item.diff !== 0 && (
                    <Text
                      style={[
                        styles.diffText,
                        item.diff > 0 ? styles.diffPos : styles.diffNeg,
                      ]}
                    >
                      {item.diff > 0 ? `+${item.diff}` : `${item.diff}`}
                    </Text>
                  )}
                </View>
              </View>

              <View style={styles.track}>
                <View
                  style={[
                    styles.fill,
                    { width: `${clamped}%`, backgroundColor: item.color },
                  ]}
                />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 20,
  },
  barTitle: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: 1,
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tile: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 10,
    padding: 10,
    width: "48%",
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  tileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  label: {
    fontSize: 11,
    color: colors.muted,
    fontWeight: "600",
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  valNum: {
    fontSize: 13,
    fontWeight: "800",
  },
  diffText: {
    fontSize: 10,
    fontWeight: "800",
  },
  diffPos: {
    color: colors.success,
  },
  diffNeg: {
    color: colors.danger,
  },
  track: {
    height: 6,
    backgroundColor: colors.surfaceBorder,
    borderRadius: 3,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 3,
  },
});

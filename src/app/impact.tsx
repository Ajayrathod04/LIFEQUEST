import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

import { ImpactEmptyState } from "../components/impact/ImpactEmptyState";
import { ImpactHeader } from "../components/impact/ImpactHeader";
import { ImpactOverview } from "../components/impact/ImpactOverview";
import { ImpactTimeline } from "../components/impact/ImpactTimeline";
import { SkillImpactConnector } from "../components/impact/SkillImpactConnector";
import { getSessionImpactPassport } from "../engine/missionEngine";
import type { SessionImpactPassport } from "../types/mission";
import { colors, ModeAccents, Shadows } from "../constants/theme";

export default function ImpactPassportScreen() {
  const router = useRouter();
  const [impactPassport, setImpactPassport] = useState<SessionImpactPassport>(
    getSessionImpactPassport()
  );

  useFocusEffect(
    useCallback(() => {
      setImpactPassport(getSessionImpactPassport());
    }, [])
  );

  const hasRecords = impactPassport.accumulatedImpactRecords.length > 0;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ImpactHeader />

      <Pressable
        onPress={() => router.push("/impact-mission" as any)}
        style={({ pressed }) => [styles.launchTopBtn, Shadows.subtle, pressed && styles.pressed]}
      >
        <Text style={styles.launchTopBtnText}>Execute Energy & Solar Impact Audit →</Text>
      </Pressable>

      <ImpactOverview impactPassport={impactPassport} />

      <SkillImpactConnector />

      {hasRecords ? (
        <ImpactTimeline records={impactPassport.accumulatedImpactRecords} />
      ) : (
        <ImpactEmptyState />
      )}
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
  launchTopBtn: {
    backgroundColor: colors.impact,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  launchTopBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  pressed: {
    opacity: 0.85,
  },
});

import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";

import { AssessmentCreator } from "../components/employer/AssessmentCreator";
import { EmployerEmptyState } from "../components/employer/EmployerEmptyState";
import { EmployerHeader } from "../components/employer/EmployerHeader";
import { EmployerPerformanceReport } from "../components/employer/EmployerPerformanceReport";
import { getSessionSkillPassport } from "../engine/missionEngine";
import type { SessionSkillPassport } from "../types/mission";
import { colors } from "../constants/theme";

export default function EmployerScreen() {
  const searchParams = useLocalSearchParams<{ report?: string }>();
  const [passport, setPassport] = useState<SessionSkillPassport>(
    getSessionSkillPassport()
  );

  const hasEvidence = passport.totalMissionsCompleted > 0;

  const [activeTab, setActiveTab] = useState<"create" | "report">(
    searchParams.report === "true" || hasEvidence ? "report" : "create"
  );

  useFocusEffect(
    useCallback(() => {
      const updated = getSessionSkillPassport();
      setPassport(updated);
      if (searchParams.report === "true" || updated.totalMissionsCompleted > 0) {
        setActiveTab("report");
      }
    }, [searchParams.report])
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <EmployerHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        hasEvidence={hasEvidence}
      />

      {activeTab === "create" ? (
        <AssessmentCreator />
      ) : hasEvidence ? (
        <EmployerPerformanceReport passport={passport} />
      ) : (
        <EmployerEmptyState />
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
});

import { ScrollView, StyleSheet } from "react-native";
import { ImpactHeader } from "../components/impact/ImpactHeader";
import { ImpactMissionExecution } from "../components/impact/ImpactMissionExecution";
import { colors } from "../constants/theme";

export default function ImpactMissionScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ImpactHeader />
      <ImpactMissionExecution />
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

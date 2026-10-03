import { ScrollView, StyleSheet } from "react-native";
import { ResetBreathingRing } from "../components/reset/ResetBreathingRing";
import { ResetHeader } from "../components/reset/ResetHeader";
import { colors } from "../constants/theme";

export default function ResetScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ResetHeader />
      <ResetBreathingRing />
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

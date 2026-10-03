import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ModeAccents } from "../../constants/theme";

export function ImpactHeader() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Pressable
          onPress={() => router.push("/")}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        >
          <Text style={styles.backButtonText}>← Home</Text>
        </Pressable>
        <View style={styles.brandBadge}>
          <Text style={styles.brandBadgeText}>{ModeAccents.impact.label}</Text>
        </View>
      </View>

      <Text style={styles.title}>IMPACT PASSPORT</Text>
      <Text style={styles.subtitle}>
        Portable evidence of real-world action, measurable outcomes, and community impact.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  backButtonText: {
    color: "#9CA3AF",
    fontSize: 14,
    fontWeight: "600",
  },
  brandBadge: {
    backgroundColor: ModeAccents.impact.badgeBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: ModeAccents.impact.border,
  },
  brandBadgeText: {
    color: ModeAccents.impact.badgeText,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#F9FAFB",
    letterSpacing: 1,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    lineHeight: 21,
  },
  pressed: {
    opacity: 0.8,
  },
});

import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, ModeAccents } from "../../constants/theme";

export function SkillPassportHeader() {
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
          <Text style={styles.brandBadgeText}>VERIFIED EVIDENCE</Text>
        </View>
      </View>

      <Text style={styles.title}>Skill Passport</Text>
      <Text style={styles.subtitle}>
        Verifiable proof of what you have practiced and demonstrated across real-world scenarios.
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
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  backButtonText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "600",
  },
  brandBadge: {
    backgroundColor: ModeAccents.passport.badgeBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: ModeAccents.passport.border,
  },
  brandBadgeText: {
    color: ModeAccents.passport.badgeText,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: colors.muted,
    lineHeight: 21,
  },
  pressed: {
    opacity: 0.8,
  },
});

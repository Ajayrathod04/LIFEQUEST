import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export function ImpactEmptyState() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Text style={styles.iconText}>🌱</Text>
      </View>

      <Text style={styles.title}>No Real-World Impact Logged Yet</Text>
      <Text style={styles.subtitle}>
        Complete real-world impact missions to convert field actions into verified environmental and community evidence.
      </Text>

      <Pressable
        onPress={() => router.push("/impact-mission" as any)}
        style={({ pressed }) => [styles.launchButton, pressed && styles.pressed]}
      >
        <Text style={styles.launchButtonText}>Launch Interactive Impact Mission →</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#111827",
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1F2937",
    marginBottom: 24,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#064E3B",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#10B981",
  },
  iconText: {
    fontSize: 26,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#F9FAFB",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
    maxWidth: 400,
  },
  launchButton: {
    backgroundColor: "#10B981",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  launchButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  pressed: {
    opacity: 0.85,
  },
});

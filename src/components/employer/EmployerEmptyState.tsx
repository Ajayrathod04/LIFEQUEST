import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export function EmployerEmptyState() {
  const router = useRouter();

  return (
    <View style={styles.card}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>NO EVIDENCE RECORDED</Text>
      </View>

      <Text style={styles.title}>NO CANDIDATE EVIDENCE YET</Text>
      <Text style={styles.subtitle}>
        Launch the candidate assessment to run the scenario and generate verified performance evidence records.
      </Text>

      <Pressable
        onPress={() => router.push("/career" as any)}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <Text style={styles.buttonText}>Launch Candidate Assessment →</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#111827",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1.5,
    borderColor: "#8B5CF6",
    alignItems: "center",
    marginBottom: 32,
    marginTop: 12,
  },
  badge: {
    backgroundColor: "#1E1B4B",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#4C1D95",
  },
  badgeText: {
    color: "#C4B5FD",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    color: "#F9FAFB",
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 24,
    maxWidth: 320,
  },
  button: {
    backgroundColor: "#8B5CF6",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
    width: "100%",
  },
  buttonPressed: {
    opacity: 0.85,
    backgroundColor: "#7C3AED",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});

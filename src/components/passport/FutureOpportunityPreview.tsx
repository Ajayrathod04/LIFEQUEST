import { StyleSheet, Text, View } from "react-native";

export function FutureOpportunityPreview() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>FUTURE OPPORTUNITY PREVIEW</Text>
      <Text style={styles.subtitle}>
        Your demonstrated skills can become verified evidence for future career opportunities.
      </Text>

      <View style={styles.list}>
        <View style={styles.bulletRow}>
          <Text style={styles.bulletDot}>•</Text>
          <Text style={styles.bulletText}>Share verified skill evidence</Text>
        </View>
        <View style={styles.bulletRow}>
          <Text style={styles.bulletDot}>•</Text>
          <Text style={styles.bulletText}>Employer assessment results</Text>
        </View>
        <View style={styles.bulletRow}>
          <Text style={styles.bulletDot}>•</Text>
          <Text style={styles.bulletText}>Demonstrated candidate profile</Text>
        </View>
        <View style={styles.bulletRow}>
          <Text style={styles.bulletDot}>•</Text>
          <Text style={styles.bulletText}>Role & opportunity matching</Text>
        </View>
      </View>

      <View style={styles.noteBox}>
        <Text style={styles.noteText}>
          Proof of capability over unverified résumé claims.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0F172A",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#1E293B",
    marginBottom: 32,
  },
  title: {
    fontSize: 12,
    fontWeight: "800",
    color: "#38BDF8",
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: "#94A3B8",
    lineHeight: 19,
    marginBottom: 14,
  },
  list: {
    gap: 8,
    marginBottom: 14,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  bulletDot: {
    color: "#38BDF8",
    fontSize: 14,
    fontWeight: "800",
  },
  bulletText: {
    color: "#E2E8F0",
    fontSize: 13,
    fontWeight: "600",
  },
  noteBox: {
    backgroundColor: "#1E293B",
    padding: 10,
    borderRadius: 8,
  },
  noteText: {
    color: "#94A3B8",
    fontSize: 12,
    fontStyle: "italic",
    textAlign: "center",
  },
});

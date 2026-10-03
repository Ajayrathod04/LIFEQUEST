import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface EmployerHeaderProps {
  activeTab: "create" | "report";
  onTabChange: (tab: "create" | "report") => void;
  hasEvidence: boolean;
}

export function EmployerHeader({
  activeTab,
  onTabChange,
  hasEvidence,
}: EmployerHeaderProps) {
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
          <Text style={styles.brandBadgeText}>EMPLOYER PORTAL DEMO</Text>
        </View>
      </View>

      <Text style={styles.title}>EMPLOYER ASSESSMENT</Text>
      <Text style={styles.subtitle}>
        Evaluate demonstrated capability through realistic workplace situations.
      </Text>

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <Pressable
          onPress={() => onTabChange("create")}
          style={[styles.tabButton, activeTab === "create" && styles.tabButtonActive]}
        >
          <Text style={[styles.tabText, activeTab === "create" && styles.tabTextActive]}>
            1. CREATE ASSESSMENT
          </Text>
        </Pressable>

        <Pressable
          onPress={() => onTabChange("report")}
          style={[styles.tabButton, activeTab === "report" && styles.tabButtonActive]}
        >
          <Text style={[styles.tabText, activeTab === "report" && styles.tabTextActive]}>
            2. PERFORMANCE REPORT {hasEvidence ? "• (1)" : ""}
          </Text>
        </Pressable>
      </View>
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
    backgroundColor: "#1E1B4B",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#4C1D95",
  },
  brandBadgeText: {
    color: "#C4B5FD",
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
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: "#1E1B4B",
    borderWidth: 1,
    borderColor: "#8B5CF6",
  },
  tabText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#9CA3AF",
    letterSpacing: 0.5,
  },
  tabTextActive: {
    color: "#F9FAFB",
  },
  pressed: {
    opacity: 0.8,
  },
});

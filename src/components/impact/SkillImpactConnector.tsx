import { StyleSheet, Text, View } from "react-native";

export function SkillImpactConnector() {
  const steps = [
    { label: "1. MISSION", detail: "Community Solar & Energy Optimization" },
    { label: "2. ACTION", detail: "LED retrofitting, smart thermal controls, grant solar app" },
    { label: "3. MEASUREMENT", detail: "Smart-meter power telemetry logging & thermal leak audit" },
    { label: "4. OUTCOME", detail: "38% utility cost reduction & zero runtime downtime" },
    { label: "5. EVIDENCE", detail: "Field scenario audit log & verified calculation model" },
    { label: "6. IMPACT", detail: "450 kWh saved/mo • $4,200 annual savings • 1.8T CO2 offset" },
    { label: "7. SKILL DEMONSTRATED", detail: "Sustainability Leadership & Resource Optimization" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>EVIDENCE RELATIONSHIP CHAIN</Text>
      <Text style={styles.subtitle}>
        MISSION → ACTION → MEASUREMENT → OUTCOME → EVIDENCE → IMPACT → SKILL
      </Text>


      <View style={styles.chainContainer}>
        {steps.map((item, index) => (
          <View key={index} style={styles.chainNodeWrapper}>
            <View
              style={[
                styles.nodeCard,
                index === steps.length - 1 && styles.nodeCardFinal,
              ]}
            >
              <Text style={styles.nodeLabel}>{item.label}</Text>
              <Text style={styles.nodeDetail}>{item.detail}</Text>
            </View>
            {index < steps.length - 1 && <Text style={styles.chainArrow}>↓</Text>}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0F172A",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1E293B",
    marginBottom: 24,
  },
  title: {
    fontSize: 14,
    fontWeight: "900",
    color: "#10B981",
    letterSpacing: 1.2,
    marginBottom: 4,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 12,
    color: "#94A3B8",
    textAlign: "center",
    marginBottom: 16,
  },
  chainContainer: {
    gap: 4,
    alignItems: "center",
  },
  chainNodeWrapper: {
    width: "100%",
    alignItems: "center",
  },
  nodeCard: {
    backgroundColor: "#1E293B",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    width: "100%",
    borderWidth: 1,
    borderColor: "#334155",
  },
  nodeCardFinal: {
    backgroundColor: "#064E3B",
    borderColor: "#10B981",
  },
  nodeLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#10B981",
    letterSpacing: 1,
    marginBottom: 2,
  },
  nodeDetail: {
    fontSize: 13,
    fontWeight: "700",
    color: "#F8FAFC",
  },
  chainArrow: {
    color: "#10B981",
    fontSize: 14,
    fontWeight: "900",
    marginVertical: 2,
  },
});

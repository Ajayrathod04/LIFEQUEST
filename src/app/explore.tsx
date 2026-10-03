import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { colors, ModeAccents, Shadows } from "../constants/theme";
import {
  evaluateMissionChoice,
  getSessionSkillPassport,
  saveMissionResultToSession,
} from "../engine/missionEngine";
import { missions } from "../data/missions";
import type { SolveToolCategory, SolveToolModule } from "../types/mission";
import { useProStatus } from "../hooks/useProStatus";
import { PaywallModal } from "../components/monetization/PaywallModal";

const solveTools: SolveToolModule[] = [
  {
    id: "tool-scan",
    title: "Scam & Phishing Scanner",
    category: "Scan",
    description:
      "Analyze suspicious SMS messages, UPI payment demands, or shortener links for fake authority and advance-fee scam triggers.",
    iconName: "🔍",
    actionLabel: "Analyze Suspicious Message →",
  },
  {
    id: "tool-claimkit",
    title: "Consumer ClaimKit",
    category: "ClaimKit",
    description:
      "Organize purchase invoices, diagnostic receipts, and photos into a formal statutory consumer warranty dispute file.",
    iconName: "📁",
    actionLabel: "Build Warranty Claim →",
  },
  {
    id: "tool-legal",
    title: "Legal Awareness Pack",
    category: "Legal Awareness",
    description:
      "Evaluate security deposit deductions under statutory rental rules and generate a formal evidence demand notice.",
    disclaimer:
      "EDUCATIONAL DISCLAIMER: LIFEQUEST provides scenario-based legal awareness simulations for educational purposes only. This tool does NOT provide formal legal advice or substitute for licensed legal counsel.",
    iconName: "⚖️",
    actionLabel: "Simulate Tenant Dispute →",
  },
  {
    id: "tool-safety",
    title: "Women's Safety Protocol",
    category: "Safety",
    description:
      "Evaluate late-night transit risks, activate live trip tracking protocols, and access one-tap emergency helpline numbers.",
    disclaimer:
      "SITUATIONAL GUIDANCE DISCLAIMER: LIFEQUEST provides situational awareness decision training. No digital tool guarantees absolute physical safety in active emergency scenarios.",
    iconName: "🛡️",
    actionLabel: "Launch Safety Protocol →",
  },
  {
    id: "tool-docs",
    title: "Document Vault & Checklist",
    category: "Docs",
    description:
      "Verify readiness of critical career, housing, and identity proof documents before submitting official applications.",
    iconName: "📜",
    actionLabel: "Verify Document Readiness →",
  },
];

export default function SolveHubScreen() {
  const router = useRouter();
  const { isPro, paywallVisible, paywallSource, showPaywall, hidePaywall } = useProStatus();

  const [activeCategory, setActiveCategory] = useState<SolveToolCategory | "All">("All");
  const [selectedTool, setSelectedTool] = useState<SolveToolModule | null>(null);

  // Scan simulation state
  const [scanText, setScanText] = useState(
    "CONGRATULATIONS! Your mobile number won ₹50,000 in National Lucky Draw! Deposit ₹999 fee to fast-claim@fakebank. Click http://bit.ly/claim50k"
  );
  const [scanResult, setScanResult] = useState<{
    riskLevel: "CRITICAL HIGH RISK" | "SAFE";
    triggers: string[];
    recommendation: string;
  } | null>(null);

  // ClaimKit form state
  const [claimProduct, setClaimProduct] = useState("Laptop Motherboard Defect");
  const [claimVendor, setClaimVendor] = useState("Apex Electronics Ltd");
  const [claimAmount, setClaimAmount] = useState("$600");
  const [claimGenerated, setClaimGenerated] = useState(false);

  // Docs checklist state
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({
    doc1: true,
    doc2: true,
    doc3: false,
    doc4: false,
  });

  useFocusEffect(
    useCallback(() => {
      // Refresh session passport status if needed
      getSessionSkillPassport();
    }, [])
  );

  const filteredTools =
    activeCategory === "All"
      ? solveTools
      : solveTools.filter((t) => t.category === activeCategory);

  function handleToolClick(tool: SolveToolModule) {
    if (tool.isProRequired && !isPro) {
      showPaywall(tool.title);
      return;
    }
    setSelectedTool(tool);
    setScanResult(null);
    setClaimGenerated(false);
  }

  function handleAnalyzeScan() {
    const textLower = scanText.toLowerCase();
    const triggers: string[] = [];

    if (textLower.includes("won") || textLower.includes("congratulations")) {
      triggers.push("Unsolicited Prize / Lottery Claim Trigger");
    }
    if (textLower.includes("deposit") || textLower.includes("fee") || textLower.includes("₹")) {
      triggers.push("Advance Fee Demand for Prize Release");
    }
    if (textLower.includes("bit.ly") || textLower.includes("http://")) {
      triggers.push("Unverified Shortener / Non-HTTPS URL");
    }

    if (triggers.length > 0) {
      setScanResult({
        riskLevel: "CRITICAL HIGH RISK",
        triggers,
        recommendation:
          "Do NOT send funds or click the link. Block the sender and report to official cybercrime portal (cybercrime.gov.in).",
      });

      // Log scam investigator evidence into session passport
      const scamMission = missions.find((m) => m.id === "solve-scam-lottery-001");
      if (scamMission) {
        const evalRes = evaluateMissionChoice(scamMission, 2);
        saveMissionResultToSession(evalRes, scamMission.title);
      }
    } else {
      setScanResult({
        riskLevel: "SAFE",
        triggers: ["No obvious advance-fee phishing patterns detected."],
        recommendation: "Always double check sender credentials before opening links.",
      });
    }
  }

  function handleGenerateClaim() {
    setClaimGenerated(true);

    // Save claimkit evidence to session passport
    const claimMission = missions.find((m) => m.id === "solve-claimkit-warranty-001");
    if (claimMission) {
      const evalRes = evaluateMissionChoice(claimMission, 0);
      saveMissionResultToSession(evalRes, claimMission.title);
    }
  }

  function toggleDocCheck(id: string) {
    setCheckedDocs((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Brand & Domain Header */}
      <View style={styles.headerBar}>
        <View>
          <View style={styles.domainBadge}>
            <Text style={styles.domainBadgeText}>SOLVE DOMAIN</Text>
          </View>
          <Text style={styles.title}>Practical Problem Solver</Text>
          <Text style={styles.subtitle}>
            Field-tested tools to analyze scams, preserve consumer rights, verify safety, and audit document readiness.
          </Text>
        </View>
      </View>

      {/* Category Filter Tabs */}
      <View style={styles.filterRow}>
        {(["All", "Scan", "ClaimKit", "Legal Awareness", "Safety", "Docs"] as const).map(
          (cat) => {
            const isSelected = activeCategory === cat;
            return (
              <Pressable
                key={cat}
                onPress={() => setActiveCategory(cat)}
                style={({ pressed }) => [
                  styles.filterChip,
                  isSelected && styles.filterChipActive,
                  pressed && styles.pressedState,
                ]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isSelected && styles.filterChipTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </Pressable>
            );
          }
        )}
      </View>

      {/* Tools Grid */}
      <View style={styles.toolsGrid}>
        {filteredTools.map((tool) => (
          <View key={tool.id} style={[styles.toolCard, Shadows.card]}>
            <View style={styles.toolIconHeader}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconEmoji}>{tool.iconName}</Text>
              </View>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{tool.category.toUpperCase()}</Text>
              </View>
            </View>

            <Text style={styles.toolTitle}>{tool.title}</Text>
            <Text style={styles.toolDescription}>{tool.description}</Text>

            {tool.disclaimer && (
              <View style={styles.disclaimerBox}>
                <Text style={styles.disclaimerText}>{tool.disclaimer}</Text>
              </View>
            )}

            <Pressable
              onPress={() => handleToolClick(tool)}
              style={({ pressed }) => [styles.actionButton, pressed && styles.pressedState]}
            >
              <Text style={styles.actionButtonText}>{tool.actionLabel}</Text>
            </Pressable>
          </View>
        ))}
      </View>

      {/* Interactive Tool Modal */}
      {selectedTool && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={Boolean(selectedTool)}
          onRequestClose={() => setSelectedTool(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, Shadows.hover]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {selectedTool.iconName} {selectedTool.title}
                </Text>
                <Pressable
                  onPress={() => setSelectedTool(null)}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </Pressable>
              </View>

              <ScrollView style={styles.modalBody}>
                {selectedTool.disclaimer && (
                  <View style={styles.modalDisclaimerBox}>
                    <Text style={styles.modalDisclaimerText}>
                      ⚠️ {selectedTool.disclaimer}
                    </Text>
                  </View>
                )}

                {/* 1. SCAN TOOL INTERACTION */}
                {selectedTool.category === "Scan" && (
                  <View style={styles.modalSection}>
                    <Text style={styles.inputLabel}>
                      Paste Suspicious Message or Payment Link:
                    </Text>
                    <TextInput
                      style={styles.textArea}
                      multiline
                      numberOfLines={4}
                      value={scanText}
                      onChangeText={setScanText}
                    />

                    <Pressable
                      onPress={handleAnalyzeScan}
                      style={({ pressed }) => [styles.toolRunButton, pressed && styles.pressedState]}
                    >
                      <Text style={styles.toolRunButtonText}>Run Scam Risk Scan →</Text>
                    </Pressable>

                    {scanResult && (
                      <View
                        style={[
                          styles.resultBox,
                          scanResult.riskLevel === "CRITICAL HIGH RISK"
                            ? styles.resultHighRisk
                            : styles.resultSafe,
                        ]}
                      >
                        <Text style={styles.resultRiskText}>{scanResult.riskLevel}</Text>
                        <Text style={styles.resultTitle}>Detected Risk Indicators:</Text>
                        {scanResult.triggers.map((t, i) => (
                          <Text key={i} style={styles.triggerItem}>
                            • {t}
                          </Text>
                        ))}
                        <Text style={styles.recommendationText}>
                          {scanResult.recommendation}
                        </Text>
                        <View style={styles.provenanceBadge}>
                          <Text style={styles.provenanceBadgeText}>
                            PROVENANCE: Simulated Pattern Scan • Evidence Recorded
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                )}

                {/* 2. CLAIMKIT TOOL INTERACTION */}
                {selectedTool.category === "ClaimKit" && (
                  <View style={styles.modalSection}>
                    <Text style={styles.inputLabel}>Product / Appliance Defect:</Text>
                    <TextInput
                      style={styles.inputField}
                      value={claimProduct}
                      onChangeText={setClaimProduct}
                    />

                    <Text style={styles.inputLabel}>Retailer / Manufacturer Name:</Text>
                    <TextInput
                      style={styles.inputField}
                      value={claimVendor}
                      onChangeText={setClaimVendor}
                    />

                    <Text style={styles.inputLabel}>Invoice Value:</Text>
                    <TextInput
                      style={styles.inputField}
                      value={claimAmount}
                      onChangeText={setClaimAmount}
                    />

                    <Pressable
                      onPress={handleGenerateClaim}
                      style={({ pressed }) => [styles.toolRunButton, pressed && styles.pressedState]}
                    >
                      <Text style={styles.toolRunButtonText}>Assemble Claim Bundle →</Text>
                    </Pressable>

                    {claimGenerated && (
                      <View style={styles.claimResultBox}>
                        <Text style={styles.claimResultTitle}>
                          ✓ Claim Bundle Assembled ({claimProduct})
                        </Text>
                        <Text style={styles.claimText}>
                          Formal dispute letter generated against {claimVendor} citing mandatory statutory 12-month warranty protections for {claimAmount}.
                        </Text>
                        <Text style={styles.claimTextSub}>
                          Attached Evidence: Original Invoice • Technician Diagnostic Log • Dated Photo Log
                        </Text>
                        <View style={styles.provenanceBadge}>
                          <Text style={styles.provenanceBadgeText}>
                            PROVENANCE: Simulated Consumer Claim • Logged to Skill Passport
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                )}

                {/* 3. LEGAL AWARENESS TOOL INTERACTION */}
                {selectedTool.category === "Legal Awareness" && (
                  <View style={styles.modalSection}>
                    <Text style={styles.sectionHeading}>
                      Tenant Security Deposit Dispute Scenario
                    </Text>
                    <Text style={styles.bodyText}>
                      Your landlord retained your full $1,500 deposit citing 'wall repainting' despite move-out logs proving normal wear & tear.
                    </Text>

                    <View style={styles.scenarioCard}>
                      <Text style={styles.scenarioTitle}>Statutory Rule (Rental Regulations):</Text>
                      <Text style={styles.scenarioText}>
                        Landlords cannot deduct for normal wear & tear and must provide itemized receipts for actual repairs within 14 days of move-out.
                      </Text>
                    </View>

                    <Pressable
                      onPress={() => {
                        const legalMission = missions.find((m) => m.id === "solve-legal-tenant-001");
                        if (legalMission) {
                          const evalRes = evaluateMissionChoice(legalMission, 0);
                          saveMissionResultToSession(evalRes, legalMission.title);
                        }
                        router.push("/passport" as any);
                      }}
                      style={({ pressed }) => [styles.toolRunButton, pressed && styles.pressedState]}
                    >
                      <Text style={styles.toolRunButtonText}>
                        Log Educational Legal Proof to Passport →
                      </Text>
                    </Pressable>
                  </View>
                )}

                {/* 4. SAFETY TOOL INTERACTION */}
                {selectedTool.category === "Safety" && (
                  <View style={styles.modalSection}>
                    <Text style={styles.sectionHeading}>
                      Late-Night Commute Safety Checklist
                    </Text>
                    <View style={styles.checklistContainer}>
                      <View style={styles.checkRow}>
                        <Text style={styles.checkIcon}>✓</Text>
                        <Text style={styles.checkText}>
                          Book verified ride-share from well-lit station interior
                        </Text>
                      </View>
                      <View style={styles.checkRow}>
                        <Text style={styles.checkIcon}>✓</Text>
                        <Text style={styles.checkText}>
                          Share live trip tracking link with 2 trusted emergency contacts
                        </Text>
                      </View>
                      <View style={styles.checkRow}>
                        <Text style={styles.checkIcon}>✓</Text>
                        <Text style={styles.checkText}>
                          Verify license plate and driver name before opening vehicle door
                        </Text>
                      </View>
                    </View>

                    <View style={styles.emergencyCard}>
                      <Text style={styles.emergencyTitle}>National Emergency Numbers:</Text>
                      <Text style={styles.emergencyNumber}>• National Emergency: 112</Text>
                      <Text style={styles.emergencyNumber}>• Women Helpline: 1091</Text>
                    </View>

                    <Pressable
                      onPress={() => setSelectedTool(null)}
                      style={({ pressed }) => [styles.toolRunButton, pressed && styles.pressedState]}
                    >
                      <Text style={styles.toolRunButtonText}>Save Protocol Reference →</Text>
                    </Pressable>
                  </View>
                )}

                {/* 5. DOCS TOOL INTERACTION */}
                {selectedTool.category === "Docs" && (
                  <View style={styles.modalSection}>
                    <Text style={styles.sectionHeading}>
                      Essential Application Document Readiness
                    </Text>
                    <Text style={styles.bodyText}>
                      Check off available proof documents to verify application readiness:
                    </Text>

                    <View style={styles.docList}>
                      {[
                        { id: "doc1", title: "Government Identity Proof (Passport / Driver License)" },
                        { id: "doc2", title: "Official Purchase & Service Invoices" },
                        { id: "doc3", title: "Verified Skill & Competency Passport PDF" },
                        { id: "doc4", title: "Move-in / Move-out Premises Condition Audit Log" },
                      ].map((d) => (
                        <Pressable
                          key={d.id}
                          onPress={() => toggleDocCheck(d.id)}
                          style={styles.docCheckRow}
                        >
                          <View
                            style={[
                              styles.checkbox,
                              checkedDocs[d.id] && styles.checkboxActive,
                            ]}
                          >
                            {checkedDocs[d.id] && (
                              <Text style={styles.checkboxCheck}>✓</Text>
                            )}
                          </View>
                          <Text style={styles.docCheckText}>{d.title}</Text>
                        </Pressable>
                      ))}
                    </View>

                    <Pressable
                      onPress={() => setSelectedTool(null)}
                      style={({ pressed }) => [styles.toolRunButton, pressed && styles.pressedState]}
                    >
                      <Text style={styles.toolRunButtonText}>Complete Document Audit →</Text>
                    </Pressable>
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

      <PaywallModal
        visible={paywallVisible}
        onClose={hidePaywall}
        sourceTrigger={paywallSource}
      />
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
  headerBar: {
    marginBottom: 20,
  },
  domainBadge: {
    alignSelf: "flex-start",
    backgroundColor: ModeAccents.student.badgeBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: ModeAccents.student.border,
    marginBottom: 8,
  },
  domainBadgeText: {
    color: ModeAccents.student.badgeText,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: colors.muted,
    lineHeight: 21,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  filterChip: {
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.muted,
  },
  filterChipTextActive: {
    color: "#FFFFFF",
  },
  toolsGrid: {
    gap: 20,
  },
  toolCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  toolIconHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
  },
  iconEmoji: {
    fontSize: 22,
  },
  categoryBadge: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.muted,
    letterSpacing: 0.8,
  },
  toolTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 6,
  },
  toolDescription: {
    fontSize: 14,
    color: colors.muted,
    lineHeight: 21,
    marginBottom: 14,
  },
  disclaimerBox: {
    backgroundColor: colors.warningBg,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#FDE68A",
    marginBottom: 14,
  },
  disclaimerText: {
    fontSize: 11,
    color: "#92400E",
    lineHeight: 16,
    fontWeight: "500",
  },
  actionButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  pressedState: {
    opacity: 0.85,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    width: "100%",
    maxWidth: 600,
    maxHeight: "85%",
    padding: 22,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
  },
  closeButton: {
    padding: 6,
  },
  closeButtonText: {
    fontSize: 18,
    color: colors.muted,
    fontWeight: "700",
  },
  modalBody: {
    flexGrow: 0,
  },
  modalDisclaimerBox: {
    backgroundColor: colors.warningBg,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#FDE68A",
    marginBottom: 16,
  },
  modalDisclaimerText: {
    fontSize: 12,
    color: "#92400E",
    lineHeight: 18,
    fontWeight: "600",
  },
  modalSection: {
    gap: 14,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
  },
  textArea: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 10,
    padding: 12,
    fontSize: 13,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    textAlignVertical: "top",
  },
  inputField: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  toolRunButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 6,
  },
  toolRunButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  resultBox: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    gap: 8,
  },
  resultHighRisk: {
    backgroundColor: colors.dangerBg,
    borderColor: colors.danger,
  },
  resultSafe: {
    backgroundColor: colors.successBg,
    borderColor: colors.success,
  },
  resultRiskText: {
    fontSize: 13,
    fontWeight: "900",
    color: colors.danger,
    letterSpacing: 0.8,
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
  triggerItem: {
    fontSize: 12,
    color: colors.text,
    lineHeight: 18,
  },
  recommendationText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
    marginTop: 4,
    lineHeight: 19,
  },
  provenanceBadge: {
    backgroundColor: colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 6,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  provenanceBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.muted,
  },
  claimResultBox: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.primary,
    gap: 6,
  },
  claimResultTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.primary,
  },
  claimText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 19,
  },
  claimTextSub: {
    fontSize: 12,
    color: colors.muted,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
  },
  bodyText: {
    fontSize: 14,
    color: colors.muted,
    lineHeight: 20,
  },
  scenarioCard: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    gap: 4,
  },
  scenarioTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
  },
  scenarioText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
  checklistContainer: {
    gap: 10,
  },
  checkRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  checkIcon: {
    color: colors.success,
    fontWeight: "900",
    fontSize: 16,
  },
  checkText: {
    fontSize: 13,
    color: colors.text,
    flex: 1,
  },
  emergencyCard: {
    backgroundColor: colors.dangerBg,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.danger,
    gap: 4,
  },
  emergencyTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.danger,
  },
  emergencyNumber: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
  },
  docList: {
    gap: 10,
  },
  docCheckRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.surfaceLight,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxCheck: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },
  docCheckText: {
    fontSize: 13,
    color: colors.text,
    flex: 1,
    fontWeight: "600",
  },
});

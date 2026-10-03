import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { SessionSkillPassport } from "../../types/mission";
import { colors, Shadows } from "../../constants/theme";

interface PassportOverviewProps {
  passport: SessionSkillPassport;
}

export function PassportOverview({ passport }: PassportOverviewProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const competenciesCount = Object.keys(passport.skillSummaries).length;
  const totalEvidenceCount = passport.accumulatedEvidence.length;

  const resultsList = Object.values(passport.latestResults);
  const avgOverallScore =
    resultsList.length > 0
      ? Math.round(
          resultsList.reduce((acc, r) => acc + r.overallScore, 0) /
            resultsList.length,
        )
      : 84;

  const summaryEntries = Object.values(passport.skillSummaries);

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => setIsFlipped((prev) => !prev)}
        style={({ pressed }) => [
          styles.atmCard,
          Shadows.glowViolet,
          pressed && styles.pressedState,
        ]}
      >
        {!isFlipped ? (
          /* FRONT SIDE OF DIGITAL ATM CAPABILITY CARD */
          <View style={styles.cardFront}>
            {/* Header row */}
            <View style={styles.cardHeader}>
              <View style={styles.brandGroup}>
                <Text style={styles.brandTitle}>LIFEQUEST</Text>
                <Text style={styles.cardTypeLabel}>DIGITAL CAPABILITY PASSPORT</Text>
              </View>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedBadgeText}>VERIFIED RECORD</Text>
              </View>
            </View>

            {/* Chip & Capability Score Row */}
            <View style={styles.chipRow}>
              {/* Metallic Chip Graphic */}
              <View style={styles.metallicChip}>
                <View style={styles.chipLineHorizontal} />
                <View style={styles.chipLineVertical} />
                <View style={styles.chipCore} />
              </View>

              <View style={styles.scoreContainer}>
                <Text style={styles.scoreLabel}>CORE CAPABILITY SCORE</Text>
                <Text style={styles.scoreNumber}>{avgOverallScore} <Text style={styles.scoreMax}>/ 100</Text></Text>
              </View>
            </View>

            {/* Cardholder Identity & ID */}
            <View style={styles.identityRow}>
              <View>
                <Text style={styles.holderLabel}>PASSPORT HOLDER</Text>
                <Text style={styles.holderName}>AJAY RATHOD</Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.holderLabel}>CAPABILITY ID</Text>
                <Text style={styles.idNumber}>LQ-884920</Text>
              </View>
            </View>

            {/* Competency Pills */}
            <View style={styles.skillPillsRow}>
              {summaryEntries.slice(0, 3).map((s) => (
                <View key={s.skill} style={styles.skillPill}>
                  <Text style={styles.skillPillText}>
                    {s.skill} <Text style={styles.skillPillScore}>{s.averageScore}</Text>
                  </Text>
                </View>
              ))}
              {summaryEntries.length === 0 && (
                <>
                  <View style={styles.skillPill}>
                    <Text style={styles.skillPillText}>Problem Solving <Text style={styles.skillPillScore}>88</Text></Text>
                  </View>
                  <View style={styles.skillPill}>
                    <Text style={styles.skillPillText}>Decision Making <Text style={styles.skillPillScore}>84</Text></Text>
                  </View>
                  <View style={styles.skillPill}>
                    <Text style={styles.skillPillText}>Mental Ability <Text style={styles.skillPillScore}>86</Text></Text>
                  </View>
                </>
              )}
            </View>

            {/* Footer / Flip Action */}
            <View style={styles.cardFooter}>
              <View style={styles.qrTrigger}>
                <Text style={styles.qrText}>[ QR VERIFIED ]</Text>
              </View>
              <Text style={styles.flipHintText}>TAP TO FLIP CARD 🔄</Text>
            </View>
          </View>
        ) : (
          /* BACK SIDE OF DIGITAL ATM CAPABILITY CARD */
          <View style={styles.cardBack}>
            <View style={styles.magStripe} />

            <View style={styles.backContent}>
              <View style={styles.signatureRow}>
                <View style={styles.signatureBox}>
                  <Text style={styles.signatureText}>AUDIT HASH: 0x9f8b2c4e1a07d391</Text>
                </View>
                <View style={styles.cvvBox}>
                  <Text style={styles.cvvLabel}>VERIFIED</Text>
                  <Text style={styles.cvvValue}>LQ-PASS</Text>
                </View>
              </View>

              <View style={styles.backStatsRow}>
                <View style={styles.backStatItem}>
                  <Text style={styles.backStatVal}>{passport.totalMissionsCompleted || 24}</Text>
                  <Text style={styles.backStatLab}>Missions Completed</Text>
                </View>
                <View style={styles.backStatItem}>
                  <Text style={styles.backStatVal}>{totalEvidenceCount || 39}</Text>
                  <Text style={styles.backStatLab}>Evidence Items</Text>
                </View>
                <View style={styles.backStatItem}>
                  <Text style={styles.backStatVal}>{competenciesCount || 8}</Text>
                  <Text style={styles.backStatLab}>Competencies</Text>
                </View>
              </View>

              <View style={styles.nonCertBox}>
                <Text style={styles.nonCertText}>
                  LIFEQUEST PORTABLE PRACTICE RECORD • NON-CERTIFYING DEMONSTRATED EVIDENCE
                </Text>
              </View>

              <Text style={styles.flipHintTextBack}>TAP TO FLIP FRONT 🔄</Text>
            </View>
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  atmCard: {
    backgroundColor: "#0F172A",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1.5,
    borderColor: "rgba(245, 158, 11, 0.45)",
    aspectRatio: 1.58, // Standard Bank Card Aspect Ratio
    justifyContent: "space-between",
    position: "relative",
    overflow: "hidden",
  },
  cardFront: {
    flex: 1,
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  brandGroup: {
    gap: 2,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#F8FAFC",
    letterSpacing: 2,
  },
  cardTypeLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: colors.amber,
    letterSpacing: 1,
  },
  verifiedBadge: {
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.4)",
  },
  verifiedBadgeText: {
    color: colors.emerald,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.8,
  },

  // CHIP
  chipRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  metallicChip: {
    width: 44,
    height: 34,
    borderRadius: 6,
    backgroundColor: "#D97706",
    borderWidth: 1,
    borderColor: "#FBBF24",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  chipLineHorizontal: {
    position: "absolute",
    width: "100%",
    height: 1,
    backgroundColor: "#B45309",
  },
  chipLineVertical: {
    position: "absolute",
    height: "100%",
    width: 1,
    backgroundColor: "#B45309",
  },
  chipCore: {
    width: 16,
    height: 12,
    borderRadius: 3,
    backgroundColor: "#FBBF24",
  },
  scoreContainer: {
    alignItems: "flex-end",
  },
  scoreLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: "#94A3B8",
    letterSpacing: 0.5,
  },
  scoreNumber: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.emerald,
  },
  scoreMax: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "600",
  },

  // IDENTITY
  identityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  holderLabel: {
    fontSize: 8,
    fontWeight: "800",
    color: "#64748B",
    letterSpacing: 0.8,
  },
  holderName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#F8FAFC",
    letterSpacing: 1,
  },
  idNumber: {
    fontSize: 13,
    fontFamily: "monospace",
    fontWeight: "700",
    color: colors.cyan,
  },

  // SKILLS
  skillPillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 8,
  },
  skillPill: {
    backgroundColor: "#1E293B",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  skillPillText: {
    fontSize: 10,
    color: "#94A3B8",
    fontWeight: "600",
  },
  skillPillScore: {
    color: colors.amber,
    fontWeight: "800",
  },

  // FOOTER
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#334155",
    paddingTop: 8,
  },
  qrTrigger: {
    backgroundColor: "#1E293B",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  qrText: {
    fontSize: 9,
    fontFamily: "monospace",
    color: colors.cyan,
    fontWeight: "700",
  },
  flipHintText: {
    fontSize: 9,
    fontWeight: "800",
    color: colors.amber,
    letterSpacing: 0.5,
  },

  // BACK SIDE
  cardBack: {
    flex: 1,
    justifyContent: "space-between",
    marginHorizontal: -20,
    marginVertical: -20,
    paddingVertical: 14,
  },
  magStripe: {
    height: 40,
    backgroundColor: "#020617",
    width: "100%",
    marginBottom: 10,
  },
  backContent: {
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: "space-between",
  },
  signatureRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  signatureBox: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 4,
    padding: 6,
    justifyContent: "center",
  },
  signatureText: {
    fontFamily: "monospace",
    fontSize: 9,
    color: "#0F172A",
    fontWeight: "700",
  },
  cvvBox: {
    backgroundColor: "#1E293B",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: "center",
  },
  cvvLabel: {
    fontSize: 7,
    color: "#94A3B8",
    fontWeight: "800",
  },
  cvvValue: {
    fontSize: 10,
    color: colors.emerald,
    fontWeight: "800",
  },
  backStatsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#1E293B",
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  backStatItem: {
    alignItems: "center",
  },
  backStatVal: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.text,
  },
  backStatLab: {
    fontSize: 9,
    color: "#94A3B8",
  },
  nonCertBox: {
    alignItems: "center",
  },
  nonCertText: {
    fontSize: 8,
    fontWeight: "800",
    color: colors.amber,
    letterSpacing: 0.5,
    textAlign: "center",
  },
  flipHintTextBack: {
    fontSize: 9,
    fontWeight: "800",
    color: colors.cyan,
    textAlign: "right",
  },
  pressedState: {
    opacity: 0.9,
  },
});

import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { PlayBranchNode, PlayChoiceOption } from "../../types/mission";
import { colors, ModeAccents, Shadows } from "../../constants/theme";

interface PlayBranchViewerProps {
  currentNode: PlayBranchNode;
  onMakeChoice: (choice: PlayChoiceOption) => void;
}

export function PlayBranchViewer({
  currentNode,
  onMakeChoice,
}: PlayBranchViewerProps) {
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [consequenceNotice, setConsequenceNotice] = useState<string | null>(null);

  function handleSelect(choice: PlayChoiceOption) {
    setSelectedChoiceId(choice.id);
    setConsequenceNotice(choice.consequenceText);
  }

  function handleConfirmChoice(choice: PlayChoiceOption) {
    setSelectedChoiceId(null);
    setConsequenceNotice(null);
    onMakeChoice(choice);
  }

  const activeChoice = currentNode.choices.find((c) => c.id === selectedChoiceId);

  return (
    <View style={styles.container}>
      {currentNode.contextBanner && (
        <View style={styles.bannerBox}>
          <Text style={styles.bannerText}>⚠️ {currentNode.contextBanner}</Text>
        </View>
      )}

      <View style={[styles.situationCard, Shadows.card]}>
        <Text style={styles.stepIndicator}>DECISION POINT {currentNode.stepNumber} OF 3</Text>
        <Text style={styles.situationTitle}>{currentNode.situationTitle}</Text>
        <Text style={styles.situationDesc}>{currentNode.situationDescription}</Text>
      </View>

      <Text style={styles.choiceHeader}>SELECT YOUR STRATEGIC BRANCH ACTION:</Text>

      <View style={styles.choicesList}>
        {currentNode.choices.map((choice) => {
          const isSelected = choice.id === selectedChoiceId;
          return (
            <Pressable
              key={choice.id}
              onPress={() => handleSelect(choice)}
              style={({ pressed }) => [
                styles.choiceCard,
                isSelected && styles.choiceCardSelected,
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.choiceHeaderRow}>
                <View style={[styles.radio, isSelected && styles.radioSelected]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
                <Text style={[styles.choiceText, isSelected && styles.choiceTextSelected]}>
                  {choice.text}
                </Text>
              </View>

              {/* Stat Impact Preview */}
              <View style={styles.impactPreviewRow}>
                {Object.entries(choice.statImpact).map(([k, val]) => (
                  <View key={k} style={styles.impactChip}>
                    <Text
                      style={[
                        styles.impactChipText,
                        (val ?? 0) > 0 ? styles.impactPos : styles.impactNeg,
                      ]}
                    >
                      {k.toUpperCase()}: {(val ?? 0) > 0 ? `+${val}` : `${val}`}
                    </Text>
                  </View>
                ))}
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Visible Consequence Feedback Box */}
      {consequenceNotice && activeChoice && (
        <View style={[styles.consequenceBox, Shadows.subtle]}>
          <Text style={styles.consequenceTitle}>IMMEDIATE BRANCH CONSEQUENCE:</Text>
          <Text style={styles.consequenceText}>{consequenceNotice}</Text>

          <Pressable
            onPress={() => handleConfirmChoice(activeChoice)}
            style={({ pressed }) => [styles.confirmButton, pressed && styles.pressed]}
          >
            <Text style={styles.confirmButtonText}>Execute & Advance Branch →</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  bannerBox: {
    backgroundColor: colors.warningBg,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  bannerText: {
    color: "#92400E",
    fontSize: 12,
    fontWeight: "700",
  },
  situationCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 20,
  },
  stepIndicator: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 6,
  },
  situationTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 10,
  },
  situationDesc: {
    fontSize: 14,
    color: colors.muted,
    lineHeight: 22,
  },
  choiceHeader: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.muted,
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  choicesList: {
    gap: 12,
    marginBottom: 20,
  },
  choiceCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.surfaceBorder,
  },
  choiceCardSelected: {
    borderColor: colors.primary,
    backgroundColor: ModeAccents.student.badgeBg,
  },
  choiceHeaderRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
    marginBottom: 10,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.muted,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  radioSelected: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  choiceText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 21,
  },
  choiceTextSelected: {
    color: colors.text,
    fontWeight: "700",
  },
  impactPreviewRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginLeft: 32,
  },
  impactChip: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  impactChipText: {
    fontSize: 10,
    fontWeight: "800",
  },
  impactPos: {
    color: colors.success,
  },
  impactNeg: {
    color: colors.danger,
  },
  consequenceBox: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1.5,
    borderColor: colors.primary,
    marginTop: 8,
  },
  consequenceTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: 1,
    marginBottom: 6,
  },
  consequenceText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 21,
    marginBottom: 16,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  pressed: {
    opacity: 0.85,
  },
});

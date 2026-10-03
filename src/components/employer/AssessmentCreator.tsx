import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { missions } from "../../data/missions";
import { colors, ModeAccents, Shadows } from "../../constants/theme";

export function AssessmentCreator() {
  const router = useRouter();

  const careerMission =
    missions.find((m) => m.domain === "career") ?? missions[0];

  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    "Decision Making",
    "Communication",
    "Problem Solving",
    "Situational Judgment",
  ]);

  function toggleSkill(skill: string) {
    if (selectedSkills.includes(skill)) {
      if (selectedSkills.length === 1) return;
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  }

  return (
    <View style={styles.container}>
      {/* Step 1: Choose Mission */}
      <View style={[styles.sectionCard, Shadows.card]}>
        <View style={styles.stepBadge}>
          <Text style={styles.stepBadgeText}>STEP 1</Text>
        </View>
        <Text style={styles.stepTitle}>Choose Assessment Mission</Text>
        <Text style={styles.stepSubtitle}>
          Select a situation-based scenario to evaluate candidate decision-making.
        </Text>

        <View style={styles.missionCardSelected}>
          <View style={styles.missionHeader}>
            <Text style={styles.missionDomain}>CAREER ASSESSMENT</Text>
            <Text style={styles.missionMeta}>Est. 4 Mins • Intermediate</Text>
          </View>
          <Text style={styles.missionTitle}>{careerMission.title}</Text>
          <Text style={styles.missionDesc}>{careerMission.description}</Text>
        </View>
      </View>

      {/* Step 2: Choose Required Skills */}
      <View style={[styles.sectionCard, Shadows.card]}>
        <View style={styles.stepBadge}>
          <Text style={styles.stepBadgeText}>STEP 2</Text>
        </View>
        <Text style={styles.stepTitle}>Required Competencies</Text>
        <Text style={styles.stepSubtitle}>
          Target skills to observe during the candidate scenario simulation.
        </Text>

        <View style={styles.skillChipsRow}>
          {[
            "Decision Making",
            "Communication",
            "Problem Solving",
            "Situational Judgment",
          ].map((skill) => {
            const isSelected = selectedSkills.includes(skill);
            return (
              <Pressable
                key={skill}
                onPress={() => toggleSkill(skill)}
                style={[
                  styles.skillChip,
                  isSelected && styles.skillChipSelected,
                ]}
              >
                <Text
                  style={[
                    styles.skillChipText,
                    isSelected && styles.skillChipTextSelected,
                  ]}
                >
                  {isSelected ? "✓ " : "+ "}{skill}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Step 3: Assessment Preview */}
      <View style={[styles.previewCard, Shadows.card]}>
        <View style={styles.stepBadgePreview}>
          <Text style={styles.stepBadgeTextPreview}>STEP 3 • PREVIEW</Text>
        </View>
        <Text style={styles.previewTitle}>Candidate Assessment Challenge Preview</Text>

        <View style={styles.previewGrid}>
          <View style={styles.previewRow}>
            <Text style={styles.previewLabel}>Target Scenario:</Text>
            <Text style={styles.previewValue}>{careerMission.title}</Text>
          </View>
          <View style={styles.previewRow}>
            <Text style={styles.previewLabel}>Evaluated Skills:</Text>
            <Text style={styles.previewValue}>{selectedSkills.join(", ")}</Text>
          </View>
          <View style={styles.previewRow}>
            <Text style={styles.previewLabel}>Scenario Format:</Text>
            <Text style={styles.previewValue}>4-Option Workplace Escalation</Text>
          </View>
          <View style={styles.previewRow}>
            <Text style={styles.previewLabel}>Evidence Generated:</Text>
            <Text style={styles.previewValue}>4 Structured Competency Logs</Text>
          </View>
          <View style={styles.previewRow}>
            <Text style={styles.previewLabel}>Provenance Tag:</Text>
            <Text style={styles.previewValue}>Observed Candidate Simulation</Text>
          </View>
        </View>

        <Pressable
          onPress={() => router.push("/career" as any)}
          style={({ pressed }) => [styles.launchButton, pressed && styles.pressedState]}
        >
          <Text style={styles.launchButtonText}>Launch Candidate Simulation →</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
    marginBottom: 32,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  stepBadge: {
    alignSelf: "flex-start",
    backgroundColor: ModeAccents.employer.badgeBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: ModeAccents.employer.border,
  },
  stepBadgeText: {
    color: ModeAccents.employer.badgeText,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 4,
  },
  stepSubtitle: {
    fontSize: 13,
    color: colors.muted,
    marginBottom: 16,
  },
  missionCardSelected: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  missionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  missionDomain: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },
  missionMeta: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "600",
  },
  missionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 6,
  },
  missionDesc: {
    fontSize: 13,
    color: colors.muted,
    lineHeight: 19,
  },
  skillChipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  skillChip: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  skillChipSelected: {
    borderColor: colors.primary,
    backgroundColor: ModeAccents.student.badgeBg,
  },
  skillChipText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "600",
  },
  skillChipTextSelected: {
    color: colors.primaryDark,
    fontWeight: "700",
  },
  previewCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 22,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  stepBadgePreview: {
    alignSelf: "flex-start",
    backgroundColor: ModeAccents.employer.badgeBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: ModeAccents.employer.border,
  },
  stepBadgeTextPreview: {
    color: ModeAccents.employer.badgeText,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 16,
  },
  previewGrid: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    padding: 16,
    gap: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  previewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  previewLabel: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: "600",
  },
  previewValue: {
    fontSize: 12,
    color: colors.text,
    fontWeight: "700",
    maxWidth: "60%",
    textAlign: "right",
  },
  launchButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  launchButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  pressedState: {
    opacity: 0.85,
  },
});

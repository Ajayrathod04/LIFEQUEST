import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  calculateImpactMetrics,
  saveCalculatedImpactResultToSession,
} from "../../engine/missionEngine";
import type { ImpactMeasurementInputs } from "../../engine/missionEngine";
import { colors, ModeAccents, Shadows } from "../../constants/theme";

export function ImpactMissionExecution() {
  const router = useRouter();

  const [step, setStep] = useState<number>(0);
  const [selectedStrategyIndex, setSelectedStrategyIndex] = useState<number | null>(null);

  const [inputs, setInputs] = useState<ImpactMeasurementInputs>({
    wattageReductionW: 1250,
    operatingHoursPerDay: 12,
    electricityRatePerKwh: 0.25,
    facilityCapacity: 120,
  });

  const strategies = [
    {
      id: "strat-1",
      title: "Comprehensive LED + Smart Thermal & Solar Grant Strategy",
      desc: "Mobilize local volunteers for LED retrofits, automated thermostat schedules, and municipal solar application.",
      isOptimal: true,
    },
    {
      id: "strat-2",
      title: "Passive Bulb Replacement",
      desc: "Replace bulbs only when old ones fail, leaving HVAC and thermal leaks unaddressed.",
      isOptimal: false,
    },
    {
      id: "strat-3",
      title: "Operating Hours Reduction",
      desc: "Close the facility 2 days a week, reducing community program availability.",
      isOptimal: false,
    },
  ];

  const calculated = calculateImpactMetrics(inputs);

  function handleCompleteMission() {
    const selectedStrat = selectedStrategyIndex !== null ? strategies[selectedStrategyIndex] : strategies[0];

    saveCalculatedImpactResultToSession(
      "community-energy-audit-001",
      "Community Solar & Energy Optimization",
      "40% operational utility waste at Midtown Community Hub.",
      selectedStrat.title,
      inputs,
    );

    setStep(4);
  }

  return (
    <View style={styles.container}>
      {/* Visual Relationship Chain Header */}
      <View style={[styles.relationshipBar, Shadows.subtle]}>
        <Text style={styles.relationshipTitle}>PRODUCT EXECUTION LOOP</Text>
        <Text style={styles.relationshipChain}>
          PROBLEM → ACTION → MEASUREMENT → OUTCOME → EVIDENCE → IMPACT → SKILL
        </Text>
      </View>

      {/* Step 0: Understand Problem */}
      {step === 0 && (
        <View style={[styles.stepCard, Shadows.card]}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>STEP 1 • REAL-WORLD PROBLEM</Text>
          </View>
          <Text style={styles.title}>Energy Overhead at Midtown Community Hub</Text>
          <Text style={styles.description}>
            The Midtown Community Center operates on a constrained budget. Over 40% of their operational utility expenses are wasted on legacy fluorescent lighting running 16 hours/day and uninsulated HVAC thermal leaks.
          </Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Mission Objective:</Text>
            <Text style={styles.infoText}>
              Formulate a field retrofit plan, input baseline telemetry parameters, and calculate verifiable energy and financial recovery for community programs.
            </Text>
          </View>

          <Pressable
            onPress={() => setStep(1)}
            style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
          >
            <Text style={styles.actionButtonText}>Proceed to Action Plan Strategy →</Text>
          </Pressable>
        </View>
      )}

      {/* Step 1: Action Strategy */}
      {step === 1 && (
        <View style={[styles.stepCard, Shadows.card]}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>STEP 2 • ACTION STRATEGY</Text>
          </View>
          <Text style={styles.title}>Select Field Execution Plan</Text>
          <Text style={styles.description}>
            Choose the intervention strategy to execute at Midtown Community Hub:
          </Text>

          <View style={styles.choicesList}>
            {strategies.map((strat, idx) => {
              const isSelected = selectedStrategyIndex === idx;
              return (
                <Pressable
                  key={strat.id}
                  onPress={() => setSelectedStrategyIndex(idx)}
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
                    <Text style={[styles.choiceTitle, isSelected && styles.choiceTitleSelected]}>
                      {strat.title}
                    </Text>
                  </View>
                  <Text style={styles.choiceDesc}>{strat.desc}</Text>
                </Pressable>
              );
            })}
          </View>

          <Pressable
            disabled={selectedStrategyIndex === null}
            onPress={() => setStep(2)}
            style={({ pressed }) => [
              styles.actionButton,
              selectedStrategyIndex === null && styles.disabledButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.actionButtonText}>Proceed to Telemetry Measurement →</Text>
          </Pressable>
        </View>
      )}

      {/* Step 2: Measurable Telemetry Inputs */}
      {step === 2 && (
        <View style={[styles.stepCard, Shadows.card]}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>STEP 3 • MEASUREMENT PARAMETERS</Text>
          </View>
          <Text style={styles.title}>Field Measurement & Telemetry Inputs</Text>
          <Text style={styles.description}>
            Input baseline audit measurements from the facility site inspection:
          </Text>

          <View style={styles.inputGrid}>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Wattage Savings (W):</Text>
              <View style={styles.inputControlGroup}>
                <Pressable
                  onPress={() =>
                    setInputs((p) => ({ ...p, wattageReductionW: Math.max(250, p.wattageReductionW - 250) }))
                  }
                  style={styles.adjustBtn}
                >
                  <Text style={styles.adjustBtnText}>-</Text>
                </Pressable>
                <Text style={styles.inputValueText}>{inputs.wattageReductionW} W</Text>
                <Pressable
                  onPress={() =>
                    setInputs((p) => ({ ...p, wattageReductionW: p.wattageReductionW + 250 }))
                  }
                  style={styles.adjustBtn}
                >
                  <Text style={styles.adjustBtnText}>+</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Operating Hours / Day:</Text>
              <View style={styles.inputControlGroup}>
                <Pressable
                  onPress={() =>
                    setInputs((p) => ({ ...p, operatingHoursPerDay: Math.max(1, p.operatingHoursPerDay - 1) }))
                  }
                  style={styles.adjustBtn}
                >
                  <Text style={styles.adjustBtnText}>-</Text>
                </Pressable>
                <Text style={styles.inputValueText}>{inputs.operatingHoursPerDay} hrs</Text>
                <Pressable
                  onPress={() =>
                    setInputs((p) => ({ ...p, operatingHoursPerDay: Math.min(24, p.operatingHoursPerDay + 1) }))
                  }
                  style={styles.adjustBtn}
                >
                  <Text style={styles.adjustBtnText}>+</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Electricity Tariff ($/kWh):</Text>
              <View style={styles.inputControlGroup}>
                <Text style={styles.inputValueText}>${inputs.electricityRatePerKwh.toFixed(2)} / kWh</Text>
              </View>
            </View>
          </View>

          {/* Formula Context Note */}
          <View style={styles.formulaCard}>
            <Text style={styles.formulaTitle}>TRANSPARENT CALCULATION FORMULA:</Text>
            <Text style={styles.formulaText}>
              • Monthly kWh = ({inputs.wattageReductionW}W × {inputs.operatingHoursPerDay}h × 30 days) ÷ 1000 = {calculated.monthlyKwh} kWh
            </Text>
            <Text style={styles.formulaText}>
              • Annual Savings = {calculated.monthlyKwh} kWh × 12 months × ${inputs.electricityRatePerKwh} = ${calculated.annualDollars.toLocaleString()}
            </Text>
            <Text style={styles.formulaText}>
              • CO2 Offset = ({calculated.monthlyKwh} kWh × 12 × 0.0004) = {calculated.annualCo2Tons} Tons/Year
            </Text>
          </View>

          <Pressable
            onPress={() => setStep(3)}
            style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
          >
            <Text style={styles.actionButtonText}>Calculate & Review Impact Outcome →</Text>
          </Pressable>
        </View>
      )}

      {/* Step 3: Review Outcome & Evidence Status */}
      {step === 3 && (
        <View style={[styles.stepCard, Shadows.card]}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>STEP 4 • OUTCOME & EVIDENCE CLASSIFICATION</Text>
          </View>
          <Text style={styles.title}>Calculated Impact Outcome Summary</Text>
          <Text style={styles.description}>
            Calculated environmental and financial recovery results based on audit inputs:
          </Text>

          <View style={styles.resultsGrid}>
            <View style={styles.resultTile}>
              <Text style={styles.resultVal}>{calculated.monthlyKwh} kWh</Text>
              <Text style={styles.resultLabel}>Monthly Energy Saved</Text>
              <View style={styles.badgeSimulated}>
                <Text style={styles.badgeTextSimulated}>SIMULATED MODEL</Text>
              </View>
            </View>

            <View style={styles.resultTile}>
              <Text style={styles.resultVal}>${calculated.annualDollars.toLocaleString()}</Text>
              <Text style={styles.resultLabel}>Annual Budget Recovered</Text>
              <View style={styles.badgeProjected}>
                <Text style={styles.badgeTextProjected}>PROJECTED</Text>
              </View>
            </View>

            <View style={styles.resultTile}>
              <Text style={styles.resultVal}>{calculated.annualCo2Tons} Tons</Text>
              <Text style={styles.resultLabel}>CO2 Offset / Year</Text>
              <View style={styles.badgeSimulated}>
                <Text style={styles.badgeTextSimulated}>SIMULATED MODEL</Text>
              </View>
            </View>

            <View style={styles.resultTile}>
              <Text style={styles.resultVal}>{calculated.facilityCapacity}</Text>
              <Text style={styles.resultLabel}>Community Beneficiaries</Text>
              <View style={styles.badgeDemonstrated}>
                <Text style={styles.badgeTextDemonstrated}>DEMONSTRATED</Text>
              </View>
            </View>
          </View>

          {/* Credibility Limitation Note */}
          <View style={styles.disclaimerBox}>
            <Text style={styles.disclaimerTitle}>🛡️ EVIDENCE CREDIBILITY NOTICE:</Text>
            <Text style={styles.disclaimerText}>
              Metrics are derived from mathematical field scenario calculations. Physical hardware telemetry verification is unattached in this demonstration build.
            </Text>
          </View>

          <Pressable
            onPress={handleCompleteMission}
            style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
          >
            <Text style={styles.actionButtonText}>Complete Mission & Log to Impact Passport →</Text>
          </Pressable>
        </View>
      )}

      {/* Step 4: Mission Completed & Evidence Logged */}
      {step === 4 && (
        <View style={[styles.stepCardSuccess, Shadows.card]}>
          <View style={styles.stepBadgeSuccess}>
            <Text style={styles.stepBadgeTextSuccess}>MISSION COMPLETED • EVIDENCE LOGGED</Text>
          </View>
          <Text style={styles.titleSuccess}>Impact Mission Logged Successfully!</Text>
          <Text style={styles.descriptionSuccess}>
            Your field measurement parameters and action strategy have been compiled into a portable evidence record in your Session Impact Passport.
          </Text>

          <View style={styles.skillsBox}>
            <Text style={styles.skillsTitle}>DEMONSTRATED COMPETENCIES LOGGED:</Text>
            <View style={styles.skillsRow}>
              {[
                "Sustainability Leadership",
                "Resource Optimization",
                "Community Stakeholder Management",
                "Data-Driven Problem Solving",
              ].map((skill) => (
                <View key={skill} style={styles.skillTag}>
                  <Text style={styles.skillTagText}>✓ {skill}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.footerActions}>
            <Pressable
              onPress={() => router.push("/impact" as any)}
              style={({ pressed }) => [styles.impactNavBtn, pressed && styles.pressed]}
            >
              <Text style={styles.impactNavBtnText}>View Updated Impact Passport →</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/passport" as any)}
              style={({ pressed }) => [styles.passportNavBtn, pressed && styles.pressed]}
            >
              <Text style={styles.passportNavBtnText}>View Verified Skill Passport →</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  relationshipBar: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  relationshipTitle: {
    fontSize: 10,
    fontWeight: "900",
    color: colors.impact,
    letterSpacing: 1.2,
    marginBottom: 4,
    textAlign: "center",
  },
  relationshipChain: {
    fontSize: 11,
    color: colors.muted,
    textAlign: "center",
    fontWeight: "600",
  },
  stepCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 22,
    borderWidth: 1.5,
    borderColor: colors.impact,
  },
  stepBadge: {
    alignSelf: "flex-start",
    backgroundColor: ModeAccents.impact.badgeBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: ModeAccents.impact.border,
  },
  stepBadgeText: {
    color: ModeAccents.impact.badgeText,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: colors.muted,
    lineHeight: 21,
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
    borderLeftWidth: 3,
    borderLeftColor: colors.impact,
  },
  infoTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.impact,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 19,
  },
  choicesList: {
    gap: 12,
    marginBottom: 24,
  },
  choiceCard: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.surfaceBorder,
  },
  choiceCardSelected: {
    borderColor: colors.impact,
    backgroundColor: ModeAccents.impact.badgeBg,
  },
  choiceHeaderRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginBottom: 4,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: colors.impact,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.impact,
  },
  choiceTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
    flex: 1,
  },
  choiceTitleSelected: {
    color: colors.text,
  },
  choiceDesc: {
    fontSize: 12,
    color: colors.muted,
    lineHeight: 18,
    marginLeft: 28,
  },
  inputGrid: {
    gap: 12,
    marginBottom: 20,
  },
  inputRow: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  inputLabel: {
    fontSize: 13,
    color: colors.text,
    fontWeight: "600",
  },
  inputControlGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  adjustBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  adjustBtnText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  inputValueText: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.impact,
  },
  formulaCard: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  formulaTitle: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: 1,
    marginBottom: 8,
  },
  formulaText: {
    fontSize: 12,
    color: colors.muted,
    lineHeight: 18,
    marginBottom: 4,
  },
  resultsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  resultTile: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    padding: 14,
    width: "48%",
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  resultVal: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.impact,
    marginBottom: 2,
  },
  resultLabel: {
    fontSize: 11,
    color: colors.muted,
    marginBottom: 8,
  },
  badgeSimulated: {
    alignSelf: "flex-start",
    backgroundColor: colors.surface,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeTextSimulated: {
    color: colors.muted,
    fontSize: 8,
    fontWeight: "800",
  },
  badgeProjected: {
    alignSelf: "flex-start",
    backgroundColor: colors.warningBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeTextProjected: {
    color: "#92400E",
    fontSize: 8,
    fontWeight: "800",
  },
  badgeDemonstrated: {
    alignSelf: "flex-start",
    backgroundColor: colors.successBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeTextDemonstrated: {
    color: colors.success,
    fontSize: 8,
    fontWeight: "800",
  },
  disclaimerBox: {
    backgroundColor: colors.warningBg,
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
    borderLeftWidth: 3,
    borderLeftColor: colors.warning,
  },
  disclaimerTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.warning,
    marginBottom: 4,
  },
  disclaimerText: {
    fontSize: 12,
    color: colors.text,
    lineHeight: 18,
  },
  stepCardSuccess: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 24,
    borderWidth: 1.5,
    borderColor: colors.impact,
  },
  stepBadgeSuccess: {
    alignSelf: "flex-start",
    backgroundColor: ModeAccents.impact.badgeBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: ModeAccents.impact.border,
  },
  stepBadgeTextSuccess: {
    color: ModeAccents.impact.badgeText,
    fontSize: 10,
    fontWeight: "800",
  },
  titleSuccess: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 8,
  },
  descriptionSuccess: {
    fontSize: 14,
    color: colors.muted,
    lineHeight: 21,
    marginBottom: 20,
  },
  skillsBox: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  skillsTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.impact,
    marginBottom: 10,
  },
  skillsRow: {
    gap: 8,
  },
  skillTag: {
    backgroundColor: ModeAccents.impact.badgeBg,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: ModeAccents.impact.border,
  },
  skillTagText: {
    color: ModeAccents.impact.badgeText,
    fontSize: 12,
    fontWeight: "700",
  },
  actionButton: {
    backgroundColor: colors.impact,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  disabledButton: {
    opacity: 0.4,
  },
  footerActions: {
    gap: 12,
  },
  impactNavBtn: {
    backgroundColor: colors.impact,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  impactNavBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  passportNavBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  passportNavBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  pressed: {
    opacity: 0.85,
  },
});

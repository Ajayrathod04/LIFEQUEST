import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { missions } from "../data/missions";
import {
  evaluateMissionChoice,
  getMissionProgress,
  getSessionSkillPassport,
  saveMissionResultToSession,
} from "../engine/missionEngine";
import type {
  LumiGuidanceContext,
  MissionReplayState,
  MissionResultSummary,
  SessionSkillPassport,
} from "../types/mission";
import { useProStatus } from "../hooks/useProStatus";
import { PaywallModal } from "../components/monetization/PaywallModal";
import { colors, ModeAccents, Shadows } from "../constants/theme";

export default function HomeScreen() {
  const router = useRouter();
  const { isPro, isJudge, paywallVisible, paywallSource, showPaywall, hidePaywall } =
    useProStatus();

  const [selectedMissionId, setSelectedMissionId] = useState<string>(
    "career-escalation-001"
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(
    null
  );
  const [evaluatedResult, setEvaluatedResult] = useState<MissionResultSummary | null>(
    null
  );
  const [sessionPassport, setSessionPassport] = useState<SessionSkillPassport>(
    getSessionSkillPassport()
  );
  const [replayState, setReplayState] = useState<MissionReplayState | null>(null);

  useFocusEffect(
    useCallback(() => {
      setSessionPassport(getSessionSkillPassport());
    }, [])
  );

  const activeMission =
    missions.find((m) => m.id === selectedMissionId) ?? missions[0];

  const step = activeMission.steps[currentStep];
  const progress = getMissionProgress(activeMission, currentStep);
  const isLastStep = currentStep === activeMission.steps.length - 1;

  function getLumiContext(): LumiGuidanceContext {
    if (step.type === "scenario") {
      return {
        instructionTitle: "QUEST GUIDE • OBSERVE SITUATION",
        guidanceText:
          "Read the workplace situation carefully before acting. Notice stakeholder pressures, time deadlines, and hidden technical risks.",
        keyTakeaway: "Observe facts before making high-stakes decisions.",
      };
    }
    if (step.type === "choice") {
      return {
        instructionTitle: "QUEST GUIDE • DECIDE STRATEGY",
        guidanceText:
          "Think about what you would actually do under real pressure. Weigh short-term client demands against long-term operational quality.",
        keyTakeaway: "Every decision creates measurable evidence.",
      };
    }
    if (step.type === "feedback") {
      return {
        instructionTitle: "QUEST GUIDE • EVALUATE CONSEQUENCE",
        guidanceText:
          "Here is what your decision changed in the organization. Compare your option against benchmark leadership standards.",
        keyTakeaway: "Consequence transparency drives real skill mastery.",
      };
    }
    return {
      instructionTitle: "QUEST GUIDE • VERIFY EVIDENCE",
      guidanceText:
        "Your decision has been evaluated and logged into your portable Skill Passport as verifiable evidence.",
      keyTakeaway: "Practice builds proof of real-world capability.",
    };
  }

  const lumi = getLumiContext();

  function handleMissionSelect(id: string) {
    const target = missions.find((m) => m.id === id);
    if (target?.isProRequired && !isPro) {
      showPaywall(target.title);
      return;
    }
    setSelectedMissionId(id);
    setCurrentStep(0);
    setSelectedOptionIndex(null);
    setEvaluatedResult(null);
    setReplayState(null);
  }

  function handleOptionSelect(index: number) {
    setSelectedOptionIndex(index);
    const result = evaluateMissionChoice(activeMission, index);
    setEvaluatedResult(result);
    const updatedPassport = saveMissionResultToSession(result, activeMission.title);
    setSessionPassport(updatedPassport);
  }

  function handleNext() {
    if (isLastStep) {
      setCurrentStep(0);
      setSelectedOptionIndex(null);
      setEvaluatedResult(null);
      return;
    }
    setCurrentStep((previous) => previous + 1);
  }

  function handleReplayMission() {
    const attempt = (replayState?.attemptNumber ?? 1) + 1;
    setReplayState({
      originalMissionId: activeMission.id,
      attemptNumber: attempt,
      previousScore: evaluatedResult?.overallScore,
      previousGrade: evaluatedResult?.grade,
      isReplayActive: true,
      startedAt: Date.now(),
    });
    setCurrentStep(0);
    setSelectedOptionIndex(null);
    setEvaluatedResult(null);
  }

  const choiceStep = activeMission.steps.find((s) => s.type === "choice");
  const currentOptionFeedback =
    selectedOptionIndex !== null
      ? choiceStep?.optionFeedbacks?.[selectedOptionIndex]
      : null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 1. TOP BRAND & PROFILE STATUS BAR */}
      <View style={styles.headerBar}>
        <View>
          <View style={styles.brandRow}>
            <Text style={styles.brandTitle}>LIFEQUEST</Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>LVL 07 • 4,820 XP</Text>
            </View>
          </View>
          <Text style={styles.brandSubtitle}>Prove what you can do.</Text>
        </View>

        <Pressable
          onPress={() => showPaywall("Pro Membership")}
          style={({ pressed }) => [
            styles.proHeaderPill,
            isPro && styles.proHeaderPillActive,
            pressed && styles.pressedState,
          ]}
        >
          <Text style={styles.proHeaderPillText}>
            {isJudge ? "PRO (JUDGE PASS) 👑" : isPro ? "PRO UNLOCKED ★" : "UPGRADE PRO ⚡"}
          </Text>
        </Pressable>
      </View>

      {/* 2. 3D HERO CURRENT MISSION CARD */}
      <View style={[styles.heroCard3D, Shadows.glowViolet]}>
        <View style={styles.heroGlowAccent} />

        <View style={styles.heroHeaderRow}>
          <View style={styles.heroTagBadge}>
            <View style={styles.heroTagPulseDot} />
            <Text style={styles.heroTagText}>
              NEXT MISSION • {activeMission.domain.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.heroMetaText}>
            {activeMission.difficulty.toUpperCase()} • {activeMission.estimatedMinutes} MINS
          </Text>
        </View>

        <Text style={styles.heroTitle}>{activeMission.title}</Text>
        <Text style={styles.heroDescription}>{activeMission.description}</Text>

        {/* 3D Progress ring & status */}
        <View style={styles.heroProgressRow}>
          <View style={styles.heroProgressTrack}>
            <View style={[styles.heroProgressFill, { width: "72%" }]} />
          </View>
          <Text style={styles.heroProgressPercent}>72% COMPLETE</Text>
        </View>

        <View style={styles.heroSkillsRow}>
          {activeMission.skills.map((s) => (
            <View key={s} style={styles.heroSkillChip}>
              <Text style={styles.heroSkillChipText}>{s}</Text>
            </View>
          ))}
        </View>

        <Pressable
          onPress={() => router.push("/play")}
          style={({ pressed }) => [styles.continueMissionBtn, pressed && styles.pressedState]}
        >
          <Text style={styles.continueMissionBtnText}>CONTINUE MISSION →</Text>
        </Pressable>
      </View>

      {/* 3. CORE MODULE GRID (10 Large Rounded-Square Cards) */}
      <View style={styles.sectionHeadingRow}>
        <Text style={styles.sectionHeadingTitle}>CORE CAPABILITY LABS</Text>
        <Text style={styles.sectionHeadingSub}>Select a module to build verified capability</Text>
      </View>

      <View style={styles.moduleGrid}>
        {/* Card 1: Career Quest */}
        <Pressable
          onPress={() => router.push("/career" as any)}
          style={({ pressed }) => [styles.moduleCard, Shadows.card, pressed && styles.pressedState]}
        >
          <View style={[styles.moduleIconContainer, { backgroundColor: "rgba(249, 115, 22, 0.15)" }]}>
            <Text style={styles.moduleIconText}>🎯</Text>
          </View>
          <Text style={styles.moduleTitle}>CAREER QUEST</Text>
          <Text style={styles.moduleDesc}>Build placement-ready capability</Text>
          <View style={[styles.moduleBadge, { borderColor: "rgba(249, 115, 22, 0.4)" }]}>
            <Text style={[styles.moduleBadgeText, { color: colors.careerAccent }]}>18 MASTERY PATHS</Text>
          </View>
        </Pressable>

        {/* Card 2: Mental Ability */}
        <Pressable
          onPress={() => router.push({ pathname: "/career", params: { category: "mental" } } as any)}
          style={({ pressed }) => [styles.moduleCard, Shadows.card, pressed && styles.pressedState]}
        >
          <View style={[styles.moduleIconContainer, { backgroundColor: "rgba(59, 130, 246, 0.15)" }]}>
            <Text style={styles.moduleIconText}>🧠</Text>
          </View>
          <Text style={styles.moduleTitle}>MENTAL ABILITY</Text>
          <Text style={styles.moduleDesc}>Train memory, focus & reasoning</Text>
          <View style={[styles.moduleBadge, { borderColor: "rgba(59, 130, 246, 0.4)" }]}>
            <Text style={[styles.moduleBadgeText, { color: colors.mentalAccent }]}>COGNITIVE SUITE</Text>
          </View>
        </Pressable>

        {/* Card 3: Puzzle Lab */}
        <Pressable
          onPress={() => router.push({ pathname: "/career", params: { category: "puzzles" } } as any)}
          style={({ pressed }) => [styles.moduleCard, Shadows.card, pressed && styles.pressedState]}
        >
          <View style={[styles.moduleIconContainer, { backgroundColor: "rgba(20, 184, 166, 0.15)" }]}>
            <Text style={styles.moduleIconText}>🧩</Text>
          </View>
          <Text style={styles.moduleTitle}>PUZZLE LAB</Text>
          <Text style={styles.moduleDesc}>Solve adaptive logic grids</Text>
          <View style={[styles.moduleBadge, { borderColor: "rgba(20, 184, 166, 0.4)" }]}>
            <Text style={[styles.moduleBadgeText, { color: colors.puzzleAccent }]}>ADAPTIVE PUZZLES</Text>
          </View>
        </Pressable>

        {/* Card 4: Play */}
        <Pressable
          onPress={() => router.push("/play" as any)}
          style={({ pressed }) => [styles.moduleCard, Shadows.card, pressed && styles.pressedState]}
        >
          <View style={[styles.moduleIconContainer, { backgroundColor: "rgba(236, 72, 153, 0.15)" }]}>
            <Text style={styles.moduleIconText}>🎮</Text>
          </View>
          <Text style={styles.moduleTitle}>PLAY</Text>
          <Text style={styles.moduleDesc}>Prove skills through games</Text>
          <View style={[styles.moduleBadge, { borderColor: "rgba(236, 72, 153, 0.4)" }]}>
            <Text style={[styles.moduleBadgeText, { color: colors.playAccent }]}>QUEST RUN GAME</Text>
          </View>
        </Pressable>

        {/* Card 5: Employee */}
        <Pressable
          onPress={() => router.push({ pathname: "/explore", params: { mode: "employee" } } as any)}
          style={({ pressed }) => [styles.moduleCard, Shadows.card, pressed && styles.pressedState]}
        >
          <View style={[styles.moduleIconContainer, { backgroundColor: "rgba(139, 92, 246, 0.15)" }]}>
            <Text style={styles.moduleIconText}>💼</Text>
          </View>
          <Text style={styles.moduleTitle}>EMPLOYEE</Text>
          <Text style={styles.moduleDesc}>Turn work into evidence</Text>
          <View style={[styles.moduleBadge, { borderColor: "rgba(139, 92, 246, 0.4)" }]}>
            <Text style={[styles.moduleBadgeText, { color: colors.primary }]}>SKILL GAP MISSIONS</Text>
          </View>
        </Pressable>

        {/* Card 6: Employer */}
        <Pressable
          onPress={() => router.push("/employer" as any)}
          style={({ pressed }) => [styles.moduleCard, Shadows.card, pressed && styles.pressedState]}
        >
          <View style={[styles.moduleIconContainer, { backgroundColor: "rgba(6, 182, 212, 0.15)" }]}>
            <Text style={styles.moduleIconText}>🏢</Text>
          </View>
          <Text style={styles.moduleTitle}>EMPLOYER</Text>
          <Text style={styles.moduleDesc}>Assess real capability</Text>
          <View style={[styles.moduleBadge, { borderColor: "rgba(6, 182, 212, 0.4)" }]}>
            <Text style={[styles.moduleBadgeText, { color: colors.cyan }]}>ASSESSMENT BUILDER</Text>
          </View>
        </Pressable>

        {/* Card 7: Skill Passport */}
        <Pressable
          onPress={() => router.push("/passport" as any)}
          style={({ pressed }) => [styles.moduleCard, Shadows.card, pressed && styles.pressedState]}
        >
          <View style={[styles.moduleIconContainer, { backgroundColor: "rgba(245, 158, 11, 0.15)" }]}>
            <Text style={styles.moduleIconText}>🪪</Text>
          </View>
          <Text style={styles.moduleTitle}>SKILL PASSPORT</Text>
          <Text style={styles.moduleDesc}>Your verified capability profile</Text>
          <View style={[styles.moduleBadge, { borderColor: "rgba(245, 158, 11, 0.4)" }]}>
            <Text style={[styles.moduleBadgeText, { color: colors.amber }]}>DIGITAL CARD</Text>
          </View>
        </Pressable>

        {/* Card 8: Impact Passport */}
        <Pressable
          onPress={() => router.push("/impact" as any)}
          style={({ pressed }) => [styles.moduleCard, Shadows.card, pressed && styles.pressedState]}
        >
          <View style={[styles.moduleIconContainer, { backgroundColor: "rgba(16, 185, 129, 0.15)" }]}>
            <Text style={styles.moduleIconText}>🌱</Text>
          </View>
          <Text style={styles.moduleTitle}>IMPACT PASSPORT</Text>
          <Text style={styles.moduleDesc}>Show measurable real action</Text>
          <View style={[styles.moduleBadge, { borderColor: "rgba(16, 185, 129, 0.4)" }]}>
            <Text style={[styles.moduleBadgeText, { color: colors.emerald }]}>IMPACT TIMELINE</Text>
          </View>
        </Pressable>

        {/* Card 9: Solve */}
        <Pressable
          onPress={() => router.push("/explore" as any)}
          style={({ pressed }) => [styles.moduleCard, Shadows.card, pressed && styles.pressedState]}
        >
          <View style={[styles.moduleIconContainer, { backgroundColor: "rgba(168, 85, 247, 0.15)" }]}>
            <Text style={styles.moduleIconText}>🛠️</Text>
          </View>
          <Text style={styles.moduleTitle}>SOLVE</Text>
          <Text style={styles.moduleDesc}>Practical tools for real problems</Text>
          <View style={[styles.moduleBadge, { borderColor: "rgba(168, 85, 247, 0.4)" }]}>
            <Text style={[styles.moduleBadgeText, { color: colors.solveAccent }]}>CLAIMKIT & SCAN</Text>
          </View>
        </Pressable>

        {/* PLACEMENT READINESS ECOSYSTEM */}
        <View style={{ marginTop: 18, marginBottom: 14, padding: 18, borderRadius: 22, backgroundColor: "#0B1220", borderWidth: 1, borderColor: "rgba(255,255,255,0.14)" }}>
          <Text style={{ color: "#FFFFFF", fontSize: 19, fontWeight: "800", marginBottom: 4 }}>
            PLACEMENT READINESS ECOSYSTEM
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, marginBottom: 14 }}>
            Build measurable capability across the complete placement journey.
          </Text>

          {[
            ["🧮", "APTITUDE & MATH", "Quantitative aptitude and numerical speed", "aptitude"],
            ["🧠", "LOGICAL REASONING", "Patterns, deductions and analytical thinking", "reasoning"],
            ["🧩", "PUZZLE LAB", "Matrix, code-decode and adaptive puzzles", "puzzles"],
            ["⚖️", "SITUATION JUDGEMENT", "Workplace decisions and judgement", "situations"],
            ["💼", "WORKPLACE", "Professional scenarios and behaviour", "workplace"],
            ["💬", "COMMUNICATION", "Written, verbal and workplace communication", "communication"],
            ["🎯", "INTERVIEW PREP", "Practice, tests and interview readiness", "interview"],
          ].map(([icon, title, desc, category]) => (
            <Pressable
              key={title}
              onPress={() => router.push({ pathname: "/career", params: { category } } as any)}
              style={({ pressed }) => [{
                flexDirection: "row",
                alignItems: "center",
                padding: 13,
                marginBottom: 9,
                borderRadius: 15,
                backgroundColor: "rgba(255,255,255,0.055)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.10)"
              }, pressed && styles.pressedState]}
            >
              <Text style={{ fontSize: 25, width: 38 }}>{icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "800" }}>{title}</Text>
                <Text style={{ color: "rgba(255,255,255,0.58)", fontSize: 11, marginTop: 2 }}>{desc}</Text>
              </View>
              <Text style={{ color: "#FFFFFF", fontSize: 18 }}>→</Text>
            </Pressable>
          ))}
        </View>
        {/* PLACEMENT READINESS ECOSYSTEM */}
        <View style={{ marginTop: 18, marginBottom: 14, padding: 18, borderRadius: 22, backgroundColor: "#0B1220", borderWidth: 1, borderColor: "rgba(255,255,255,0.14)" }}>
          <Text style={{ color: "#FFFFFF", fontSize: 19, fontWeight: "800", marginBottom: 4 }}>
            PLACEMENT READINESS ECOSYSTEM
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, marginBottom: 14 }}>
            Build measurable capability across the complete placement journey.
          </Text>

          {[
            ["🧮", "APTITUDE & MATH", "Quantitative aptitude and numerical speed", "aptitude"],
            ["🧠", "LOGICAL REASONING", "Patterns, deductions and analytical thinking", "reasoning"],
            ["🧩", "PUZZLE LAB", "Matrix, code-decode and adaptive puzzles", "puzzles"],
            ["⚖️", "SITUATION JUDGEMENT", "Workplace decisions and judgement", "situations"],
            ["💼", "WORKPLACE", "Professional scenarios and behaviour", "workplace"],
            ["💬", "COMMUNICATION", "Written, verbal and workplace communication", "communication"],
            ["🎯", "INTERVIEW PREP", "Practice, tests and interview readiness", "interview"],
          ].map(([icon, title, desc, category]) => (
            <Pressable
              key={title}
              onPress={() => router.push({ pathname: "/career", params: { category } } as any)}
              style={({ pressed }) => [{
                flexDirection: "row",
                alignItems: "center",
                padding: 13,
                marginBottom: 9,
                borderRadius: 15,
                backgroundColor: "rgba(255,255,255,0.055)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.10)"
              }, pressed && styles.pressedState]}
            >
              <Text style={{ fontSize: 25, width: 38 }}>{icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "800" }}>{title}</Text>
                <Text style={{ color: "rgba(255,255,255,0.58)", fontSize: 11, marginTop: 2 }}>{desc}</Text>
              </View>
              <Text style={{ color: "#FFFFFF", fontSize: 18 }}>→</Text>
            </Pressable>
          ))}
        </View>
        {/* Card 10: Reset */}
        <Pressable
          onPress={() => router.push("/reset" as any)}
          style={({ pressed }) => [styles.moduleCard, Shadows.card, pressed && styles.pressedState]}
        >
          <View style={[styles.moduleIconContainer, { backgroundColor: "rgba(56, 189, 248, 0.15)" }]}>
            <Text style={styles.moduleIconText}>🧘</Text>
          </View>
          <Text style={styles.moduleTitle}>RESET</Text>
          <Text style={styles.moduleDesc}>15-second focus recalibration</Text>
          <View style={[styles.moduleBadge, { borderColor: "rgba(56, 189, 248, 0.4)" }]}>
            <Text style={[styles.moduleBadgeText, { color: colors.resetAccent }]}>15s FOCUS RING</Text>
          </View>
        </Pressable>
      </View>

      {/* 4. LUMI INSTRUCTIONAL QUEST GUIDE */}
      <View style={[styles.lumiGuideCard, Shadows.subtle]}>
        <View style={styles.lumiHeaderRow}>
          <View style={styles.lumiAvatar}>
            <Text style={styles.lumiEmoji}>💡</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.lumiTitle}>{lumi.instructionTitle}</Text>
            <Text style={styles.lumiText}>{lumi.guidanceText}</Text>
          </View>
        </View>
        <View style={styles.lumiTakeawayBox}>
          <Text style={styles.lumiTakeawayText}>Key Takeaway: {lumi.keyTakeaway}</Text>
        </View>
      </View>

      {/* 5. SESSION PASSPORT SUMMARY */}
      {sessionPassport.totalMissionsCompleted > 0 && (
        <View style={[styles.sessionPassportCard, Shadows.card]}>
          <View style={styles.sessionHeaderRow}>
            <Text style={styles.sessionPassportTitle}>
              Session Skill Evidence ({sessionPassport.totalMissionsCompleted} Completed)
            </Text>
            <Pressable
              onPress={() => router.push("/passport" as any)}
              style={({ pressed }) => [styles.viewPassportLink, pressed && styles.pressedState]}
            >
              <Text style={styles.viewPassportLinkText}>View Passport →</Text>
            </Pressable>
          </View>
          <View style={styles.sessionSkillGrid}>
            {Object.values(sessionPassport.skillSummaries).map((sum) => (
              <View key={sum.skill} style={styles.sessionSkillTag}>
                <Text style={styles.sessionSkillName}>{sum.skill}</Text>
                <Text style={styles.sessionSkillScore}>{sum.averageScore}/100</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* 6. EMBEDDED MISSION PLAYER */}
      <View id="mission-execution-player" style={styles.sectionHeadingRow}>
        <Text style={styles.sectionHeadingTitle}>LIVE MISSION ENGINE</Text>
        <Text style={styles.sectionHeadingSub}>Select and execute interactive scenarios right now</Text>
      </View>

      <View style={styles.missionTabRow}>
        {missions.map((m) => {
          const isSelected = m.id === selectedMissionId;
          return (
            <Pressable
              key={m.id}
              onPress={() => handleMissionSelect(m.id)}
              style={({ pressed }) => [
                styles.missionTab,
                isSelected && styles.missionTabActive,
                pressed && styles.pressedState,
              ]}
            >
              <Text
                style={[
                  styles.missionTabText,
                  isSelected && styles.missionTabTextActive,
                ]}
              >
                {m.domain.toUpperCase()}: {m.title}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={[styles.playerSection, Shadows.card]}>
        <Text style={styles.playerHeading}>{activeMission.title}</Text>
        <Text style={styles.playerDescription}>{activeMission.description}</Text>

        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          Step {currentStep + 1} of {activeMission.steps.length} ({progress}% complete)
        </Text>

        <View style={styles.stepCard}>
          <Text style={styles.stepType}>
            STEP {currentStep + 1} • {step.type.toUpperCase()}
          </Text>
          <Text style={styles.stepTitle}>{step.title}</Text>
          <Text style={styles.stepDescription}>{step.description}</Text>

          {step.type === "choice" && step.options && (
            <View style={styles.optionsList}>
              {step.options.map((optionText, idx) => {
                const isSelected = selectedOptionIndex === idx;
                return (
                  <Pressable
                    key={idx}
                    onPress={() => handleOptionSelect(idx)}
                    style={({ pressed }) => [
                      styles.optionCard,
                      isSelected && styles.selectedOptionCard,
                      pressed && styles.pressedState,
                    ]}
                  >
                    <View
                      style={[
                        styles.radioCircle,
                        isSelected && styles.radioCircleSelected,
                      ]}
                    >
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.selectedOptionText,
                      ]}
                    >
                      {optionText}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>

        {step.type === "feedback" && (
          <View style={styles.feedbackCard}>
            <Text style={styles.feedbackTitle}>Consequence & Analysis</Text>
            <Text style={styles.feedbackBody}>
              {currentOptionFeedback?.feedback ??
                "Your decision is evaluated against workplace leadership standards."}
            </Text>
          </View>
        )}

        {step.type === "result" && evaluatedResult && (
          <View style={styles.resultCard}>
            <View style={styles.resultBadgeRow}>
              <View style={styles.scoreBadge}>
                <Text style={styles.scoreLabel}>SCORE</Text>
                <Text style={styles.scoreValue}>{evaluatedResult.overallScore}/100</Text>
              </View>
              <View
                style={[
                  styles.gradeBadge,
                  evaluatedResult.grade === "Exemplary"
                    ? styles.gradeExemplary
                    : styles.gradeProficient,
                ]}
              >
                <Text style={styles.gradeText}>{evaluatedResult.grade}</Text>
              </View>
            </View>

            <Text style={styles.resultTitle}>Executive Summary</Text>
            <Text style={styles.resultText}>{evaluatedResult.summary}</Text>

            <View style={styles.recapBox}>
              <Text style={styles.recapLabel}>Decision Made:</Text>
              <Text style={styles.recapValue}>{evaluatedResult.selectedOptionText}</Text>
            </View>
          </View>
        )}

        {step.type === "evidence" && evaluatedResult && (
          <View style={styles.evidenceContainer}>
            <Text style={styles.evidenceSectionTitle}>Demonstrated Skill Evidence</Text>

            {evaluatedResult.skillEvidences.map((ev) => (
              <View key={ev.skill} style={styles.evidenceCard}>
                <View style={styles.evidenceHeader}>
                  <Text style={styles.evidenceSkillName}>{ev.skill}</Text>
                  <View
                    style={[
                      styles.levelBadge,
                      ev.level === "Proficient"
                        ? styles.levelProficient
                        : styles.levelDeveloping,
                    ]}
                  >
                    <Text style={styles.levelBadgeText}>{ev.level}</Text>
                  </View>
                </View>
                <Text style={styles.evidenceDesc}>{ev.description}</Text>
              </View>
            ))}

            <View style={styles.evidenceExplanationBox}>
              <Text style={styles.evidenceExplanationTitle}>Provenance Record</Text>
              <Text style={styles.evidenceExplanationText}>
                {evaluatedResult.evidenceExplanation}
              </Text>
              <Text style={styles.provenanceDisclaimer}>
                PROVENANCE: SIMULATED PRACTICE MODEL • Non-Certifying Record
              </Text>
            </View>
          </View>
        )}

        <View style={styles.actionRow}>
          {evaluatedResult && (
            <Pressable
              onPress={handleReplayMission}
              style={({ pressed }) => [styles.replayButton, pressed && styles.pressedState]}
            >
              <Text style={styles.replayButtonText}>🔄 REPLAY</Text>
            </Pressable>
          )}

          <Pressable
            onPress={handleNext}
            style={({ pressed }) => [
              styles.nextButton,
              step.type === "choice" && selectedOptionIndex === null && styles.nextButtonDisabled,
              pressed && styles.pressedState,
            ]}
            disabled={step.type === "choice" && selectedOptionIndex === null}
          >
            <Text style={styles.nextButtonText}>
              {isLastStep ? "START OVER" : "CONTINUE MISSION →"}
            </Text>
          </Pressable>
        </View>
      </View>

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
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 80,
    backgroundColor: colors.background,
    maxWidth: 800,
    alignSelf: "center",
    width: "100%",
  },
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.text,
    letterSpacing: 2,
  },
  levelBadge: {
    backgroundColor: "rgba(139, 92, 246, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.4)",
  },
  levelBadgeText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.muted,
    marginTop: 2,
  },
  proHeaderPill: {
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  proHeaderPillActive: {
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    borderColor: "rgba(245, 158, 11, 0.4)",
  },
  proHeaderPillText: {
    color: colors.amber,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  // 3D HERO CARD
  heroCard3D: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 22,
    borderWidth: 1.5,
    borderColor: "rgba(139, 92, 246, 0.35)",
    marginBottom: 28,
    position: "relative",
    overflow: "hidden",
  },
  heroGlowAccent: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(139, 92, 246, 0.15)",
  },
  heroHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  heroTagBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(139, 92, 246, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  heroTagPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.emerald,
  },
  heroTagText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  heroMetaText: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 8,
  },
  heroDescription: {
    fontSize: 13,
    color: colors.muted,
    lineHeight: 19,
    marginBottom: 16,
  },
  heroProgressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  heroProgressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: colors.surfaceLight,
    borderRadius: 4,
    overflow: "hidden",
  },
  heroProgressFill: {
    height: "100%",
    backgroundColor: colors.cyan,
    borderRadius: 4,
  },
  heroProgressPercent: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.cyan,
    letterSpacing: 0.5,
  },
  heroSkillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 20,
  },
  heroSkillChip: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  heroSkillChipText: {
    fontSize: 11,
    color: colors.text,
    fontWeight: "600",
  },
  continueMissionBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  continueMissionBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1,
  },

  // MODULE GRID
  sectionHeadingRow: {
    marginBottom: 14,
  },
  sectionHeadingTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.text,
    letterSpacing: 1.2,
  },
  sectionHeadingSub: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  moduleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 28,
  },
  moduleCard: {
    width: "48%",
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    justifyContent: "space-between",
  },
  moduleIconContainer: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  moduleIconText: {
    fontSize: 22,
  },
  moduleTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.text,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  moduleDesc: {
    fontSize: 11,
    color: colors.muted,
    lineHeight: 15,
    marginBottom: 12,
  },
  moduleBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  moduleBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  // LUMI GUIDE
  lumiGuideCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 24,
  },
  lumiHeaderRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  lumiAvatar: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  lumiEmoji: {
    fontSize: 18,
  },
  lumiTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.amber,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  lumiText: {
    fontSize: 12,
    color: colors.text,
    lineHeight: 17,
  },
  lumiTakeawayBox: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
  },
  lumiTakeawayText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.cyan,
  },

  // SESSION PASSPORT SUMMARY
  sessionPassportCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 24,
  },
  sessionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sessionPassportTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.text,
  },
  viewPassportLink: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  viewPassportLinkText: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.primary,
  },
  sessionSkillGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  sessionSkillTag: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  sessionSkillName: {
    fontSize: 11,
    color: colors.muted,
  },
  sessionSkillScore: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.emerald,
  },

  // MISSION PLAYER
  missionTabRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },
  missionTab: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  missionTabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },
  missionTabText: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700",
  },
  missionTabTextActive: {
    color: "#FFFFFF",
  },
  playerSection: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  playerHeading: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 6,
  },
  playerDescription: {
    fontSize: 12,
    color: colors.muted,
    marginBottom: 16,
  },
  progressContainer: {
    height: 6,
    backgroundColor: colors.surfaceLight,
    borderRadius: 3,
    marginBottom: 6,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: colors.primary,
  },
  progressText: {
    fontSize: 11,
    color: colors.muted,
    marginBottom: 16,
  },
  stepCard: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  stepType: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 6,
  },
  stepDescription: {
    fontSize: 13,
    color: colors.muted,
    lineHeight: 18,
    marginBottom: 12,
  },
  optionsList: {
    gap: 10,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  selectedOptionCard: {
    borderColor: colors.primary,
    backgroundColor: "rgba(139, 92, 246, 0.1)",
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  radioCircleSelected: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  optionText: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
  selectedOptionText: {
    fontWeight: "700",
    color: colors.text,
  },
  feedbackCard: {
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.3)",
    marginBottom: 16,
  },
  feedbackTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.amber,
    marginBottom: 4,
  },
  feedbackBody: {
    fontSize: 12,
    color: colors.text,
    lineHeight: 17,
  },
  resultCard: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  resultBadgeRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  scoreBadge: {
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    alignItems: "center",
  },
  scoreLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: colors.muted,
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.emerald,
  },
  gradeBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    justifyContent: "center",
  },
  gradeExemplary: {
    backgroundColor: colors.emeraldGlow,
  },
  gradeProficient: {
    backgroundColor: colors.cyanGlow,
  },
  gradeText: {
    color: colors.text,
    fontWeight: "800",
    fontSize: 13,
  },
  resultTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 4,
  },
  resultText: {
    fontSize: 12,
    color: colors.muted,
    lineHeight: 17,
    marginBottom: 10,
  },
  recapBox: {
    backgroundColor: colors.surface,
    padding: 10,
    borderRadius: 8,
  },
  recapLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.muted,
  },
  recapValue: {
    fontSize: 11,
    color: colors.text,
  },
  evidenceContainer: {
    marginBottom: 16,
  },
  evidenceSectionTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 10,
  },
  evidenceCard: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  evidenceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  evidenceSkillName: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text,
  },
  levelProficient: {
    backgroundColor: colors.emeraldGlow,
  },
  levelDeveloping: {
    backgroundColor: colors.amberGlow,
  },
  evidenceDesc: {
    fontSize: 11,
    color: colors.muted,
  },
  evidenceExplanationBox: {
    marginTop: 10,
    padding: 12,
    backgroundColor: colors.surfaceLight,
    borderRadius: 10,
  },
  evidenceExplanationTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.primary,
    marginBottom: 4,
  },
  evidenceExplanationText: {
    fontSize: 11,
    color: colors.muted,
    lineHeight: 16,
    marginBottom: 6,
  },
  provenanceDisclaimer: {
    fontSize: 9,
    fontWeight: "700",
    color: colors.amber,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
  },
  replayButton: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  replayButtonText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
  nextButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  pressedState: {
    opacity: 0.85,
  },
});


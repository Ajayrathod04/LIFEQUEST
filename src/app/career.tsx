import { useFocusEffect, useRouter, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { colors, ModeAccents, Shadows } from "../constants/theme";
import { saveMissionResultToSession } from "../engine/missionEngine";
import type {
  AssessmentLabConfig,
  AssessmentRole,
  CompetencySkill,
  ObservableResult,
} from "../types/mission";
import { useProStatus } from "../hooks/useProStatus";
import { PaywallModal } from "../components/monetization/PaywallModal";

export type CareerCategory =
  | "all"
  | "aptitude"
  | "logical"
  | "mental"
  | "puzzles"
  | "sjt"
  | "personality"
  | "communication"
  | "technical"
  | "interview";

const categoriesList: { id: CareerCategory; title: string; icon: string }[] = [
  { id: "all", title: "All Pathways", icon: "🌐" },
  { id: "mental", title: "Mental Ability", icon: "🧠" },
  { id: "aptitude", title: "Aptitude & Math", icon: "📊" },
  { id: "logical", title: "Logical Reasoning", icon: "⚡" },
  { id: "puzzles", title: "Puzzle Lab", icon: "🧩" },
  { id: "sjt", title: "Situational Judgment", icon: "🛡️" },
  { id: "personality", title: "Workplace Style", icon: "🧑‍💼" },
  { id: "communication", title: "Communication", icon: "💬" },
  { id: "technical", title: "Technical Roles", icon: "💻" },
  { id: "interview", title: "Interview Prep", icon: "🎙️" },
];

const availableRoles: AssessmentRole[] = [
  "Senior Product Lead",
  "Fullstack Software Engineer",
  "Operations Lead",
  "Incident Response Lead",
];

const sampleLabConfigs: Record<string, AssessmentLabConfig> = {
  "Senior Product Lead": {
    id: "lab-prod-lead-001",
    title: "Senior Product Leadership Assessment",
    targetRole: "Senior Product Lead",
    mode: "scenario_judgment",
    estimatedMinutes: 6,
    requiredSkills: [
      "Decision Making",
      "Communication",
      "Prioritization",
      "Situational Judgment",
    ],
    challenges: [
      {
        id: "c-prod-1",
        title: "Challenge 1: High-Stakes Escalation Judgment (SJT)",
        prompt:
          "Friday 4:30 PM: A core analytics memory leak threatens Monday's enterprise debut ($150k renewal). Engineer needs 48h to patch; Client VP threatens cancellation if not live Monday 9 AM.",
        challengeType: "scenario",
        skillsEvaluated: ["Decision Making", "Situational Judgment"],
        options: [
          {
            id: "opt-1a",
            text: "Bypass safety tests and deploy immediately to meet Monday 9 AM deadline.",
            isOptimal: false,
            scoreImpact: 35,
            rationale: "Bypassing safety protocols risks catastrophic launch crash.",
          },
          {
            id: "opt-1b",
            text: "Schedule urgent call with Client VP, present technical risk data, and propose phased rollout (Core UI Monday, Analytics Wednesday).",
            isOptimal: true,
            scoreImpact: 95,
            rationale: "Proactive transparency preserves system stability while protecting client trust.",
          },
          {
            id: "opt-1c",
            text: "Wait until Monday morning to inform executive leadership.",
            isOptimal: false,
            scoreImpact: 40,
            rationale: "Weekend silence heightens anxiety and signals weak accountability.",
          },
        ],
      },
      {
        id: "c-prod-2",
        title: "Challenge 2: Multi-Feature Backlog Prioritization",
        prompt:
          "Rank these 3 competing engineering roadmap priorities for next sprint's sprint allocation:",
        challengeType: "prioritization",
        skillsEvaluated: ["Prioritization", "Problem Solving"],
        priorityItems: [
          { id: "p1", label: "P0 Security Patch for API Auth Vulnerability", correctRank: 1 },
          { id: "p2", label: "P1 Enterprise Client Requested Export Feature", correctRank: 2 },
          { id: "p3", label: "P2 Minor Cosmetic Refactor of Secondary Tabs", correctRank: 3 },
        ],
      },
      {
        id: "c-prod-3",
        title: "Challenge 3: Executive Stakeholder Communication",
        prompt:
          "Select the most effective communication tone when notifying executive board members of an unexpected 48-hour delivery shift:",
        challengeType: "communication",
        skillsEvaluated: ["Communication"],
        options: [
          {
            id: "comm-1",
            text: "'Engineering made mistakes so we can't launch on time. We'll try next week.'",
            isOptimal: false,
            scoreImpact: 30,
            rationale: "Blaming team members externally destroys executive trust.",
          },
          {
            id: "comm-2",
            text: "'We identified a telemetry anomaly in pre-flight testing. To protect 99.99% SLA stability, we are executing Contingency Plan B: Core UI launches Monday, Analytics module unlocks Wednesday. Audit log attached.'",
            isOptimal: true,
            scoreImpact: 98,
            rationale: "Data-backed, solution-oriented executive delivery.",
          },
        ],
      },
    ],
  },
  "Fullstack Software Engineer": {
    id: "lab-eng-001",
    title: "Fullstack Engineering & Debugging Assessment",
    targetRole: "Fullstack Software Engineer",
    mode: "debugging",
    estimatedMinutes: 5,
    requiredSkills: ["Debugging & Problem Solving", "Incident Response"],
    challenges: [
      {
        id: "c-eng-1",
        title: "Challenge 1: Code & Memory Leak Diagnostics",
        prompt:
          "Inspect the node memory log snippet below. Identify the root cause keyword fix needed:",
        challengeType: "debugging",
        skillsEvaluated: ["Debugging & Problem Solving"],
        codeOrLogSnippet:
          "FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory\n[14:32:01] EventListener leaking in websocket loop: socket.on('data', handler) without off() cleanup.",
        expectedKeywordFix: "cleanup",
      },
      {
        id: "c-eng-2",
        title: "Challenge 2: Production Incident Triage MCQ",
        prompt:
          "A database dead-lock spikes latency to 4.5s across API endpoints. What is the immediate first triage step?",
        challengeType: "mcq",
        skillsEvaluated: ["Incident Response"],
        options: [
          {
            id: "mcq-1a",
            text: "Re-index all database tables in production during peak traffic hours.",
            isOptimal: false,
            scoreImpact: 20,
            rationale: "Re-indexing during peak traffic amplifies database load.",
          },
          {
            id: "mcq-1b",
            text: "Enable query cache fallback & throttle long-running background cron workers immediately.",
            isOptimal: true,
            scoreImpact: 94,
            rationale: "Immediately sheds non-critical load and protects primary query execution.",
          },
        ],
      },
    ],
  },
};

export default function CareerQuestScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string }>();
  const { isPro, paywallVisible, paywallSource, showPaywall, hidePaywall } = useProStatus();

  const [activeCategory, setActiveCategory] = useState<CareerCategory>(
    (params.category as CareerCategory) || "all"
  );
  const [selectedRole, setSelectedRole] = useState<AssessmentRole>("Senior Product Lead");
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [debugInput, setDebugInput] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [labResults, setLabResults] = useState<ObservableResult[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (params.category) {
        setActiveCategory(params.category as CareerCategory);
      }
    }, [params.category])
  );

  const activeLab = sampleLabConfigs[selectedRole] ?? sampleLabConfigs["Senior Product Lead"];
  const challenge = activeLab.challenges[currentChallengeIndex];

  function handleSelectRole(role: AssessmentRole) {
    setSelectedRole(role);
    setCurrentChallengeIndex(0);
    setSelectedOptionId(null);
    setDebugInput("");
    setIsCompleted(false);
    setLabResults([]);
  }

  function handleOptionSelect(optId: string) {
    setSelectedOptionId(optId);
  }

  function handleNextChallenge() {
    let score = 70;
    let feedback = "Completed evaluation challenge.";
    let optText = "";

    if (
      challenge.challengeType === "scenario" ||
      challenge.challengeType === "mcq" ||
      challenge.challengeType === "communication"
    ) {
      const selectedObj = challenge.options?.find((o) => o.id === selectedOptionId);
      score = selectedObj?.scoreImpact ?? 70;
      feedback = selectedObj?.rationale ?? "Evaluated choice.";
      optText = selectedObj?.text ?? "";
    } else if (challenge.challengeType === "debugging") {
      const isCorrect = debugInput
        .toLowerCase()
        .includes(challenge.expectedKeywordFix ?? "cleanup");
      score = isCorrect ? 95 : 40;
      feedback = isCorrect
        ? "Correctly identified memory event listener cleanup defect!"
        : "Failed to locate root memory leak cleanup requirement.";
      optText = `Input: ${debugInput}`;
    } else if (challenge.challengeType === "prioritization") {
      score = 90;
      feedback = "Prioritization ranking evaluated correctly.";
      optText = "Ranked P0 Security -> P1 Feature -> P2 Cleanup";
    }

    const obsRes: ObservableResult = {
      challengeId: challenge.id,
      challengeTitle: challenge.title,
      selectedOptionId: selectedOptionId ?? undefined,
      debuggingInput: debugInput,
      score,
      feedback,
      evidenceStatus: "Simulated Model",
      observedCompetencies: challenge.skillsEvaluated.map((sk) => ({
        skill: sk,
        level: score >= 80 ? "Proficient" : "Developing",
        description: `Demonstrated ${score >= 80 ? "Proficient" : "Developing"} competency in ${challenge.title}.`,
      })),
    };

    const updatedResults = [...labResults, obsRes];
    setLabResults(updatedResults);

    if (currentChallengeIndex < activeLab.challenges.length - 1) {
      setCurrentChallengeIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setDebugInput("");
    } else {
      setIsCompleted(true);

      const mockResult = {
        missionId: activeLab.id,
        overallScore: Math.round(
          updatedResults.reduce((a, b) => a + b.score, 0) / updatedResults.length
        ),
        grade: "Exemplary" as const,
        summary: `Completed ${activeLab.title} with evaluated decision quality.`,
        selectedOptionText: optText,
        skillsDemonstrated: activeLab.requiredSkills,
        evidenceExplanation: `Observable candidate performance recorded across ${updatedResults.length} structured assessment challenges.`,
        skillEvidences: updatedResults.flatMap((r) => r.observedCompetencies),
        completedAt: Date.now(),
      };
      saveMissionResultToSession(mockResult, activeLab.title);
    }
  }

  function handleRestartLab() {
    setCurrentChallengeIndex(0);
    setSelectedOptionId(null);
    setDebugInput("");
    setIsCompleted(false);
    setLabResults([]);
  }

  const avgScore =
    labResults.length > 0
      ? Math.round(labResults.reduce((a, b) => a + b.score, 0) / labResults.length)
      : 90;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Brand Header */}
      <View style={styles.headerBar}>
        <View style={styles.domainBadge}>
          <Text style={styles.domainBadgeText}>CAREER & PLACEMENT QUEST</Text>
        </View>
        <Text style={styles.title}>Placement Readiness Ecosystem</Text>
        <Text style={styles.subtitle}>
          18 comprehensive capability pathways evaluating mental ability, quantitative aptitude, logical reasoning, situational judgment, and workplace simulations.
        </Text>
      </View>

      {/* Category Selection Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        {categoriesList.map((cat) => {
          const isSelected = activeCategory === cat.id;
          return (
            <Pressable
              key={cat.id}
              onPress={() => setActiveCategory(cat.id)}
              style={({ pressed }) => [
                styles.categoryTab,
                isSelected && styles.categoryTabActive,
                pressed && styles.pressedState,
              ]}
            >
              <Text style={styles.categoryIcon}>{cat.icon}</Text>
              <Text
                style={[
                  styles.categoryTabText,
                  isSelected && styles.categoryTabTextActive,
                ]}
              >
                {cat.title}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* PLACEMENT TEST BANK */}
      {(activeCategory === "all" || activeCategory === "aptitude") && (
        <View style={[styles.mentalAbilityCard, Shadows.card]}>
          <Text style={styles.mentalTagText}>📊 APTITUDE & MATH</Text>
          <Text style={styles.challengePrompt}>Percentage • Ratio • Profit/Loss • Number Series</Text>
        </View>
      )}

      {(activeCategory === "all" || activeCategory === "logical") && (
        <View style={[styles.mentalAbilityCard, Shadows.card]}>
          <Text style={styles.mentalTagText}>⚡ LOGICAL REASONING</Text>
          <Text style={styles.challengePrompt}>Coding/Decoding • Analogy • Sequence</Text>
        </View>
      )}

      {(activeCategory === "all" || activeCategory === "puzzles") && (
        <View style={[styles.mentalAbilityCard, Shadows.card]}>
          <Text style={styles.mentalTagText}>🧩 PUZZLE LAB</Text>
          <Text style={styles.challengePrompt}>Matrix • Pattern • Logic Puzzle</Text>
        </View>
      )}

      {(activeCategory === "all" || activeCategory === "sjt") && (
        <View style={[styles.mentalAbilityCard, Shadows.card]}>
          <Text style={styles.mentalTagText}>🛡️ SITUATIONAL JUDGMENT</Text>
          <Text style={styles.challengePrompt}>Workplace scenarios • Decision quality • Consequence evaluation</Text>
        </View>
      )}

      {(activeCategory === "all" || activeCategory === "personality") && (
        <View style={[styles.mentalAbilityCard, Shadows.card]}>
          <Text style={styles.mentalTagText}>💼 WORKPLACE</Text>
          <Text style={styles.challengePrompt}>Prioritization • Decision Making • Collaboration</Text>
        </View>
      )}

      {(activeCategory === "all" || activeCategory === "communication") && (
        <View style={[styles.mentalAbilityCard, Shadows.card]}>
          <Text style={styles.mentalTagText}>💬 COMMUNICATION</Text>
          <Text style={styles.challengePrompt}>Professional communication • Email • Workplace response</Text>
        </View>
      )}

      {(activeCategory === "all" || activeCategory === "interview") && (
        <View style={[styles.mentalAbilityCard, Shadows.card]}>
          <Text style={styles.mentalTagText}>🎙️ INTERVIEW PREP</Text>
          <Text style={styles.challengePrompt}>HR • Technical • Situational / STAR</Text>
        </View>
      )}
      {/* 1. MENTAL ABILITY HIGHLIGHT BOX (Visible Top-Level Category) */}
      {(activeCategory === "all" || activeCategory === "mental") && (
        <View style={[styles.mentalAbilityCard, Shadows.glowViolet]}>
          <View style={styles.mentalHeaderRow}>
            <View style={styles.mentalTag}>
              <Text style={styles.mentalTagText}>FIRST-CLASS COGNITIVE CATEGORY</Text>
            </View>
            <Text style={styles.mentalIcon}>🧠</Text>
          </View>

          <Text style={styles.mentalTitle}>Mental Ability & Cognitive Flexibility</Text>
          <Text style={styles.mentalDesc}>
            Evaluates mental arithmetic, spatial reasoning, working memory capacity, processing speed, visual pattern completion, and attention switching.
          </Text>

          <View style={styles.mentalChipGrid}>
            <View style={styles.mentalChip}>
              <Text style={styles.mentalChipText}>⚡ Processing Speed</Text>
            </View>
            <View style={styles.mentalChip}>
              <Text style={styles.mentalChipText}>🔄 Attention Switching</Text>
            </View>
            <View style={styles.mentalChip}>
              <Text style={styles.mentalChipText}>🧩 Spatial Reasoning</Text>
            </View>
            <View style={styles.mentalChip}>
              <Text style={styles.mentalChipText}>🔢 Working Memory</Text>
            </View>
          </View>
        </View>
      )}

      {/* 2. PERSONALITY DISCLAIMER NOTICE */}
      {(activeCategory === "all" || activeCategory === "personality") && (
        <View style={styles.personalityNoticeBox}>
          <Text style={styles.personalityNoticeTitle}>
            💡 WORKPLACE STYLE & PERSONALITY INDICATORS
          </Text>
          <Text style={styles.personalityNoticeText}>
            Scenario-based indicators evaluate work-style preferences, collaboration tendencies, communication tone, and risk approach. All outputs are educational/indicative and NOT a clinical or psychological diagnosis.
          </Text>
        </View>
      )}

      {/* Role Selection Bar */}
      <Text style={styles.sectionLabel}>Select Assessment Target Role:</Text>
      <View style={styles.roleTabRow}>
        {availableRoles.map((role) => {
          const isSelected = selectedRole === role;
          return (
            <Pressable
              key={role}
              onPress={() => handleSelectRole(role)}
              style={({ pressed }) => [
                styles.roleTab,
                isSelected && styles.roleTabActive,
                pressed && styles.pressedState,
              ]}
            >
              <Text
                style={[
                  styles.roleTabText,
                  isSelected && styles.roleTabTextActive,
                ]}
              >
                {role}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {!isCompleted ? (
        <View style={[styles.challengeCard, Shadows.card]}>
          <View style={styles.challengeHeader}>
            <Text style={styles.challengeMeta}>
              CHALLENGE {currentChallengeIndex + 1} OF {activeLab.challenges.length} •{" "}
              {challenge.challengeType.toUpperCase()}
            </Text>
            <Text style={styles.challengeTitle}>{challenge.title}</Text>
          </View>

          <Text style={styles.challengePrompt}>{challenge.prompt}</Text>

          {challenge.codeOrLogSnippet && (
            <View style={styles.codeSnippetBox}>
              <Text style={styles.codeSnippetText}>{challenge.codeOrLogSnippet}</Text>
            </View>
          )}

          {challenge.challengeType === "debugging" && (
            <View style={styles.debugSection}>
              <Text style={styles.inputLabel}>Enter Root Cause Keyword Fix:</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. cleanup, listener, unbind..."
                placeholderTextColor={colors.muted}
                value={debugInput}
                onChangeText={setDebugInput}
              />
            </View>
          )}

          {challenge.options && (
            <View style={styles.optionsList}>
              {challenge.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <Pressable
                    key={opt.id}
                    onPress={() => handleOptionSelect(opt.id)}
                    style={({ pressed }) => [
                      styles.optionCard,
                      isSelected && styles.optionCardSelected,
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
                        isSelected && styles.optionTextSelected,
                      ]}
                    >
                      {opt.text}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}

          {challenge.priorityItems && (
            <View style={styles.priorityList}>
              <Text style={styles.priorityInstruction}>
                Rank order confirmed for sprint backlog:
              </Text>
              {challenge.priorityItems.map((item, idx) => (
                <View key={item.id} style={styles.priorityItemCard}>
                  <View style={styles.priorityRankBadge}>
                    <Text style={styles.priorityRankText}>RANK {idx + 1}</Text>
                  </View>
                  <Text style={styles.priorityLabel}>{item.label}</Text>
                </View>
              ))}
            </View>
          )}

          <Pressable
            onPress={handleNextChallenge}
            disabled={
              challenge.challengeType !== "debugging" &&
              challenge.challengeType !== "prioritization" &&
              selectedOptionId === null
            }
            style={({ pressed }) => [
              styles.submitButton,
              challenge.challengeType !== "debugging" &&
                challenge.challengeType !== "prioritization" &&
                selectedOptionId === null &&
                styles.buttonDisabled,
              pressed && styles.pressedState,
            ]}
          >
            <Text style={styles.submitButtonText}>
              {currentChallengeIndex === activeLab.challenges.length - 1
                ? "Complete Assessment & View Observable Result →"
                : "Submit Challenge Response →"}
            </Text>
          </Pressable>
        </View>
      ) : (
        /* OBSERVABLE RESULTS VIEW */
        <View style={[styles.resultsCard, Shadows.card]}>
          <View style={styles.resultsHeaderRow}>
            <View style={styles.scoreBadge}>
              <Text style={styles.scoreLabel}>OVERALL ASSESSMENT SCORE</Text>
              <Text style={styles.scoreValue}>{avgScore}/100</Text>
            </View>
            <View style={styles.provenanceBadge}>
              <Text style={styles.provenanceBadgeText}>
                EVIDENCE PROVENANCE: SIMULATED ASSESSMENT MODEL
              </Text>
            </View>
          </View>

          <Text style={styles.resultsTitle}>
            Observable Candidate Performance Report
          </Text>
          <Text style={styles.resultsSubtitle}>
            Candidate: Current Session User • Role: {selectedRole}
          </Text>

          <View style={styles.evalList}>
            {labResults.map((res, i) => (
              <View key={i} style={styles.evalCard}>
                <View style={styles.evalHeader}>
                  <Text style={styles.evalTitle}>{res.challengeTitle}</Text>
                  <Text style={styles.evalScore}>{res.score}/100</Text>
                </View>
                <Text style={styles.evalFeedback}>{res.feedback}</Text>
              </View>
            ))}
          </View>

          <View style={styles.disclaimerCard}>
            <Text style={styles.disclaimerText}>
              DISCLAIMER: These results reflect observed decision quality in a simulated Assessment Lab. They demonstrate key competencies but do not replace official employment background checks.
            </Text>
          </View>

          <View style={styles.actionRow}>
            <Pressable
              onPress={() => router.push("/passport" as any)}
              style={({ pressed }) => [styles.passportButton, pressed && styles.pressedState]}
            >
              <Text style={styles.passportButtonText}>View Skill Passport →</Text>
            </Pressable>

            <Pressable
              onPress={handleRestartLab}
              style={({ pressed }) => [styles.restartButton, pressed && styles.pressedState]}
            >
              <Text style={styles.restartButtonText}>Retake Assessment</Text>
            </Pressable>
          </View>
        </View>
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
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 64,
    backgroundColor: colors.background,
    maxWidth: 800,
    alignSelf: "center",
    width: "100%",
  },
  headerBar: {
    marginBottom: 18,
  },
  domainBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(249, 115, 22, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(249, 115, 22, 0.35)",
    marginBottom: 8,
  },
  domainBadgeText: {
    color: colors.careerAccent,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 12,
    color: colors.muted,
    lineHeight: 18,
  },
  categoryScroll: {
    flexDirection: "row",
    marginBottom: 20,
  },
  categoryTab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginRight: 8,
  },
  categoryTabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },
  categoryIcon: {
    fontSize: 14,
  },
  categoryTabText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.muted,
  },
  categoryTabTextActive: {
    color: "#FFFFFF",
  },
  
  // MENTAL ABILITY CARD
  mentalAbilityCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1.5,
    borderColor: "rgba(59, 130, 246, 0.4)",
    marginBottom: 20,
  },
  mentalHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  mentalTag: {
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  mentalTagText: {
    color: colors.mentalAccent,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  mentalIcon: {
    fontSize: 20,
  },
  mentalTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 4,
  },
  mentalDesc: {
    fontSize: 12,
    color: colors.muted,
    lineHeight: 17,
    marginBottom: 12,
  },
  mentalChipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  mentalChip: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  mentalChipText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.text,
  },

  // PERSONALITY NOTICE
  personalityNoticeBox: {
    backgroundColor: "rgba(139, 92, 246, 0.1)",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.25)",
    marginBottom: 20,
  },
  personalityNoticeTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.primary,
    marginBottom: 4,
  },
  personalityNoticeText: {
    fontSize: 11,
    color: colors.muted,
    lineHeight: 16,
  },

  sectionLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 10,
  },
  roleTabRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  roleTab: {
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  roleTabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },
  roleTabText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.muted,
  },
  roleTabTextActive: {
    color: "#FFFFFF",
  },
  challengeCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  challengeHeader: {
    marginBottom: 12,
  },
  challengeMeta: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
  },
  challengePrompt: {
    fontSize: 13,
    color: colors.muted,
    lineHeight: 19,
    marginBottom: 16,
  },
  codeSnippetBox: {
    backgroundColor: "#0F172A",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  codeSnippetText: {
    fontFamily: "monospace",
    fontSize: 11,
    color: colors.cyan,
    lineHeight: 16,
  },
  debugSection: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    fontSize: 13,
  },
  optionsList: {
    gap: 10,
    marginBottom: 18,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  optionCardSelected: {
    borderColor: colors.primary,
    backgroundColor: "rgba(139, 92, 246, 0.1)",
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  radioCircleSelected: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  optionText: {
    flex: 1,
    fontSize: 12,
    color: colors.text,
    lineHeight: 17,
  },
  optionTextSelected: {
    fontWeight: "700",
  },
  priorityList: {
    gap: 8,
    marginBottom: 18,
  },
  priorityInstruction: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.muted,
    marginBottom: 6,
  },
  priorityItemCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.surfaceLight,
    borderRadius: 10,
    padding: 12,
  },
  priorityRankBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  priorityRankText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  priorityLabel: {
    fontSize: 12,
    color: colors.text,
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
  resultsCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  resultsHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  scoreBadge: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  scoreLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: colors.muted,
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.emerald,
  },
  provenanceBadge: {
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  provenanceBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    color: colors.amber,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 4,
  },
  resultsSubtitle: {
    fontSize: 11,
    color: colors.muted,
    marginBottom: 16,
  },
  evalList: {
    gap: 10,
    marginBottom: 16,
  },
  evalCard: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 10,
    padding: 12,
  },
  evalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  evalTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text,
  },
  evalScore: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.emerald,
  },
  evalFeedback: {
    fontSize: 11,
    color: colors.muted,
    lineHeight: 16,
  },
  disclaimerCard: {
    backgroundColor: colors.surfaceLight,
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  disclaimerText: {
    fontSize: 10,
    color: colors.muted,
    lineHeight: 15,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
  },
  passportButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  passportButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  restartButton: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  restartButtonText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "700",
  },
  pressedState: {
    opacity: 0.85,
  },
});

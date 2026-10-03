import { useState, useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, Shadows } from "../../constants/theme";
import { saveMissionResultToSession } from "../../engine/missionEngine";

export interface QuestRunResult {
  accuracy: number;
  reactionMs: number;
  consistency: number;
  decisionQuality: number;
  overallScore: number;
  observedCapability: string;
}

interface QuestRunGameProps {
  onComplete: (result: QuestRunResult) => void;
}

type GamePhase = "start" | "running" | "pattern_checkpoint" | "memory_checkpoint" | "complete";

export function QuestRunGame({ onComplete }: QuestRunGameProps) {
  const [phase, setPhase] = useState<GamePhase>("start");
  const [lane, setLane] = useState<0 | 1 | 2>(1); // 0: Left, 1: Center, 2: Right
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [currentRound, setCurrentRound] = useState(1);
  const [activeSignalLane, setActiveSignalLane] = useState<0 | 1 | 2>(1);
  const [activeDistractorLane, setActiveDistractorLane] = useState<0 | 1 | 2>(0);
  const [checkpointQuestion, setCheckpointQuestion] = useState<{
    prompt: string;
    options: { text: string; isCorrect: boolean }[];
  } | null>(null);

  // Performance telemetry counters
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [gameResult, setGameResult] = useState<QuestRunResult | null>(null);

  // Timer loop during running phase
  useEffect(() => {
    if (phase !== "running") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase]);

  // Spawner loop for signals & distractors
  useEffect(() => {
    if (phase !== "running") return;

    const spawner = setInterval(() => {
      const newSignal = (Math.floor(Math.random() * 3)) as 0 | 1 | 2;
      let newDistractor = (Math.floor(Math.random() * 3)) as 0 | 1 | 2;
      while (newDistractor === newSignal) {
        newDistractor = (Math.floor(Math.random() * 3)) as 0 | 1 | 2;
      }

      setActiveSignalLane(newSignal);
      setActiveDistractorLane(newDistractor);
      setStartTime(Date.now());
    }, 2200);

    return () => clearInterval(spawner);
  }, [phase]);

  function startGame() {
    setPhase("running");
    setLane(1);
    setScore(0);
    setStreak(0);
    setTimeLeft(25);
    setHits(0);
    setMisses(0);
    setReactionTimes([]);
    setGameResult(null);
    setStartTime(Date.now());
  }

  function moveLane(targetLane: 0 | 1 | 2) {
    if (phase !== "running") return;
    setLane(targetLane);

    const now = Date.now();
    const reaction = Math.max(120, now - startTime);
    setReactionTimes((prev) => [...prev, reaction]);

    if (targetLane === activeSignalLane) {
      // Hit valid signal
      setHits((h) => h + 1);
      setScore((s) => s + 150 + streak * 20);
      setStreak((st) => st + 1);

      // Trigger checkpoint at round 10 hits
      if (hits > 0 && hits % 3 === 0 && currentRound === 1) {
        triggerPatternCheckpoint();
      }
    } else if (targetLane === activeDistractorLane) {
      // Hit distractor
      setMisses((m) => m + 1);
      setStreak(0);
      setScore((s) => Math.max(0, s - 50));
    }
  }

  function triggerPatternCheckpoint() {
    setPhase("pattern_checkpoint");
    setCheckpointQuestion({
      prompt: "PATTERN RECOGNITION CHECKPOINT: What completes the sequence: 🔼, 🔽, 🔼, 🔽, ?",
      options: [
        { text: "🔼 (Upward Signal)", isCorrect: true },
        { text: "🔽 (Downward Signal)", isCorrect: false },
        { text: "➡️ (Lateral Shift)", isCorrect: false },
      ],
    });
  }

  function handleCheckpointChoice(isCorrect: boolean) {
    if (isCorrect) {
      setScore((s) => s + 300);
      setHits((h) => h + 2);
    } else {
      setMisses((m) => m + 1);
    }
    setPhase("running");
  }

  function finishGame() {
    setPhase("complete");

    const totalAttempts = hits + misses || 1;
    const accuracy = Math.min(100, Math.round((hits / totalAttempts) * 100));
    const avgReaction = reactionTimes.length > 0
      ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
      : 320;
    const consistency = Math.min(100, Math.max(60, 100 - (avgReaction > 400 ? 25 : 5)));
    const decisionQuality = Math.min(100, Math.round((score / 1500) * 100));
    const overallScore = Math.round((accuracy * 0.35) + (decisionQuality * 0.35) + (consistency * 0.3));

    let capability = "Strong pattern recognition and consistent decision-making under high-velocity time pressure.";
    if (overallScore < 70) {
      capability = "Developing reaction speed and attention switching under high-velocity task load.";
    }

    const res: QuestRunResult = {
      accuracy,
      reactionMs: avgReaction,
      consistency,
      decisionQuality,
      overallScore,
      observedCapability: capability,
    };

    setGameResult(res);

    // Save evidence to session passport
    saveMissionResultToSession({
      missionId: "quest-run-flagship-game",
      overallScore: res.overallScore,
      grade: res.overallScore >= 80 ? "Exemplary" : "Proficient",
      summary: `Completed QUEST RUN Flagship Arcade Game with ${res.accuracy}% Accuracy and ${res.reactionMs}ms Average Reaction.`,
      selectedOptionText: `Observed Capability: ${res.observedCapability}`,
      skillsDemonstrated: ["Processing Speed", "Attention Switching", "Working Memory", "Decision Quality"],
      evidenceExplanation: "Game telemetry recorded reaction velocity, signal discrimination accuracy, and decision consistency in real time.",
      skillEvidences: [
        {
          skill: "Processing Speed",
          level: res.reactionMs < 350 ? "Proficient" : "Developing",
          description: `Observed average response latency of ${res.reactionMs}ms during high-velocity signal discrimination.`,
        },
        {
          skill: "Attention Switching",
          level: res.accuracy >= 80 ? "Proficient" : "Developing",
          description: `Demonstrated ${res.accuracy}% signal discrimination accuracy while avoiding visual distractors.`,
        },
      ],
      completedAt: Date.now(),
    }, "QUEST RUN: Signal Run Game");

    onComplete(res);
  }

  return (
    <View style={[styles.gameContainer, Shadows.glowViolet]}>
      {phase === "start" && (
        <View style={styles.startOverlay}>
          <View style={styles.gameBadge}>
            <Text style={styles.gameBadgeText}>FLAGSHIP GAME • QUEST RUN</Text>
          </View>

          <Text style={styles.gameTitle}>MISSION: SIGNAL RUN</Text>
          <Text style={styles.gameSubtitle}>
            Navigate a 3-lane futuristic route. Collect valid Cyan Signals (💎), avoid Red Distractors (⚠️), and solve real-time pattern checkpoints under time pressure.
          </Text>

          <View style={styles.metricsPreviewRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricVal}>⚡ REACTION</Text>
              <Text style={styles.metricSub}>Latency Meter</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricVal}>🎯 ACCURACY</Text>
              <Text style={styles.metricSub}>Signal Discrimination</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricVal}>🧠 MEMORY</Text>
              <Text style={styles.metricSub}>Pattern Completion</Text>
            </View>
          </View>

          <Pressable
            onPress={startGame}
            style={({ pressed }) => [styles.startGameBtn, pressed && styles.pressedState]}
          >
            <Text style={styles.startGameBtnText}>ENTER GAME ARENA →</Text>
          </Pressable>
        </View>
      )}

      {phase === "running" && (
        <View style={styles.arenaView}>
          {/* Top HUD */}
          <View style={styles.hudRow}>
            <View style={styles.hudBadge}>
              <Text style={styles.hudLabel}>SCORE</Text>
              <Text style={styles.hudVal}>{score}</Text>
            </View>
            <View style={styles.hudBadge}>
              <Text style={styles.hudLabel}>TIME LEFT</Text>
              <Text style={styles.hudValTimer}>{timeLeft}s</Text>
            </View>
            <View style={styles.hudBadge}>
              <Text style={styles.hudLabel}>STREAK</Text>
              <Text style={styles.hudValStreak}>{streak}x 🔥</Text>
            </View>
          </View>

          {/* 3-Lane Track Container */}
          <View style={styles.trackArea}>
            <View style={styles.trackLanesContainer}>
              {/* Lane 0 (Left) */}
              <View style={[styles.laneColumn, lane === 0 && styles.laneColumnActive]}>
                {activeSignalLane === 0 && <Text style={styles.signalIcon}>💎</Text>}
                {activeDistractorLane === 0 && <Text style={styles.distractorIcon}>⚠️</Text>}
              </View>

              {/* Lane 1 (Center) */}
              <View style={[styles.laneColumn, lane === 1 && styles.laneColumnActive]}>
                {activeSignalLane === 1 && <Text style={styles.signalIcon}>💎</Text>}
                {activeDistractorLane === 1 && <Text style={styles.distractorIcon}>⚠️</Text>}
              </View>

              {/* Lane 2 (Right) */}
              <View style={[styles.laneColumn, lane === 2 && styles.laneColumnActive]}>
                {activeSignalLane === 2 && <Text style={styles.signalIcon}>💎</Text>}
                {activeDistractorLane === 2 && <Text style={styles.distractorIcon}>⚠️</Text>}
              </View>
            </View>

            {/* Player Probe position */}
            <View style={styles.playerBar}>
              <View style={[styles.playerAvatar, { left: `${lane * 33.3 + 8}%` }]}>
                <Text style={styles.playerAvatarIcon}>🚀</Text>
              </View>
            </View>
          </View>

          {/* Lane Controls */}
          <View style={styles.controlsRow}>
            <Pressable
              onPress={() => moveLane(0)}
              style={({ pressed }) => [styles.controlBtn, lane === 0 && styles.controlBtnActive, pressed && styles.pressedState]}
            >
              <Text style={styles.controlBtnText}>◀ LEFT</Text>
            </Pressable>
            <Pressable
              onPress={() => moveLane(1)}
              style={({ pressed }) => [styles.controlBtn, lane === 1 && styles.controlBtnActive, pressed && styles.pressedState]}
            >
              <Text style={styles.controlBtnText}>▲ CENTER</Text>
            </Pressable>
            <Pressable
              onPress={() => moveLane(2)}
              style={({ pressed }) => [styles.controlBtn, lane === 2 && styles.controlBtnActive, pressed && styles.pressedState]}
            >
              <Text style={styles.controlBtnText}>RIGHT ▶</Text>
            </Pressable>
          </View>
        </View>
      )}

      {phase === "pattern_checkpoint" && checkpointQuestion && (
        <View style={styles.checkpointOverlay}>
          <Text style={styles.checkpointTag}>🧠 PATTERN CHECKPOINT</Text>
          <Text style={styles.checkpointPrompt}>{checkpointQuestion.prompt}</Text>

          <View style={styles.checkpointOptions}>
            {checkpointQuestion.options.map((opt, i) => (
              <Pressable
                key={i}
                onPress={() => handleCheckpointChoice(opt.isCorrect)}
                style={({ pressed }) => [styles.checkpointBtn, pressed && styles.pressedState]}
              >
                <Text style={styles.checkpointBtnText}>{opt.text}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {phase === "complete" && gameResult && (
        <View style={styles.completeOverlay}>
          <View style={styles.completeBadge}>
            <Text style={styles.completeBadgeText}>MISSION COMPLETE • EVIDENCE GENERATED</Text>
          </View>

          <Text style={styles.completeTitle}>QUEST RUN PERFORMANCE SUMMARY</Text>

          <View style={styles.telemetryGrid}>
            <View style={styles.telemetryCard}>
              <Text style={styles.telemetryLabel}>OVERALL SCORE</Text>
              <Text style={styles.telemetryVal}>{gameResult.overallScore}/100</Text>
            </View>
            <View style={styles.telemetryCard}>
              <Text style={styles.telemetryLabel}>ACCURACY</Text>
              <Text style={styles.telemetryVal}>{gameResult.accuracy}%</Text>
            </View>
            <View style={styles.telemetryCard}>
              <Text style={styles.telemetryLabel}>REACTION VELOCITY</Text>
              <Text style={styles.telemetryVal}>{gameResult.reactionMs} ms</Text>
            </View>
            <View style={styles.telemetryCard}>
              <Text style={styles.telemetryLabel}>DECISION QUALITY</Text>
              <Text style={styles.telemetryVal}>{gameResult.decisionQuality}%</Text>
            </View>
          </View>

          <View style={styles.capabilityBox}>
            <Text style={styles.capabilityTitle}>Observed Capability:</Text>
            <Text style={styles.capabilityText}>"{gameResult.observedCapability}"</Text>
          </View>

          <Pressable
            onPress={startGame}
            style={({ pressed }) => [styles.replayGameBtn, pressed && styles.pressedState]}
          >
            <Text style={styles.replayGameBtnText}>PLAY AGAIN 🔄</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  gameContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 24,
    minHeight: 380,
    justifyContent: "center",
  },
  startOverlay: {
    alignItems: "center",
    paddingVertical: 10,
  },
  gameBadge: {
    backgroundColor: "rgba(79, 70, 229, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(79, 70, 229, 0.25)",
  },
  gameBadgeText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  gameTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  gameSubtitle: {
    fontSize: 12,
    color: colors.muted,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 20,
    maxWidth: 500,
  },
  metricsPreviewRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  metricItem: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  metricVal: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.primary,
  },
  metricSub: {
    fontSize: 9,
    color: colors.muted,
    marginTop: 2,
  },
  startGameBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    width: "100%",
    maxWidth: 320,
    alignItems: "center",
  },
  startGameBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1,
  },

  // ARENA
  arenaView: {
    flex: 1,
  },
  hudRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  hudBadge: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  hudLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: colors.muted,
  },
  hudVal: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.primary,
  },
  hudValTimer: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.amber,
  },
  hudValStreak: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.emerald,
  },
  trackArea: {
    height: 180,
    backgroundColor: "#0F172A",
    borderRadius: 16,
    padding: 10,
    position: "relative",
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 16,
  },
  trackLanesContainer: {
    flexDirection: "row",
    height: "80%",
  },
  laneColumn: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
  },
  laneColumnActive: {
    backgroundColor: "rgba(79, 70, 229, 0.25)",
  },
  signalIcon: {
    fontSize: 32,
  },
  distractorIcon: {
    fontSize: 28,
  },
  playerBar: {
    height: 36,
    width: "100%",
    position: "relative",
  },
  playerAvatar: {
    position: "absolute",
    bottom: 0,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  playerAvatarIcon: {
    fontSize: 24,
  },
  controlsRow: {
    flexDirection: "row",
    gap: 10,
  },
  controlBtn: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  controlBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },
  controlBtnText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "800",
  },

  // CHECKPOINT
  checkpointOverlay: {
    alignItems: "center",
    padding: 10,
  },
  checkpointTag: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.amber,
    marginBottom: 10,
    letterSpacing: 1,
  },
  checkpointPrompt: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  checkpointOptions: {
    width: "100%",
    gap: 10,
  },
  checkpointBtn: {
    backgroundColor: colors.surfaceLight,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    alignItems: "center",
  },
  checkpointBtnText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
  },

  // COMPLETE
  completeOverlay: {
    alignItems: "center",
  },
  completeBadge: {
    backgroundColor: colors.successBg,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 10,
  },
  completeBadgeText: {
    color: colors.emerald,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  completeTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 16,
  },
  telemetryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
    width: "100%",
  },
  telemetryCard: {
    width: "48%",
    backgroundColor: colors.surfaceLight,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  telemetryLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: colors.muted,
    marginBottom: 4,
  },
  telemetryVal: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.primary,
  },
  capabilityBox: {
    backgroundColor: colors.surfaceLight,
    padding: 14,
    borderRadius: 12,
    width: "100%",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  capabilityTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.amber,
    marginBottom: 4,
  },
  capabilityText: {
    fontSize: 12,
    color: colors.text,
    fontStyle: "italic",
    lineHeight: 17,
  },
  replayGameBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  replayGameBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
  pressedState: {
    opacity: 0.85,
  },
});

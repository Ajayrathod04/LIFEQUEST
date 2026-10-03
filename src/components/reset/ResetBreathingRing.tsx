import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, ModeAccents, Shadows } from "../../constants/theme";

export function ResetBreathingRing() {
  const [phase, setPhase] = useState<"ready" | "inhale" | "hold" | "exhale" | "complete">("ready");
  const [secondsLeft, setSecondsLeft] = useState(15);
  const [completedCount, setCompletedCount] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function startReset() {
    setPhase("inhale");
    setSecondsLeft(15);

    if (timerRef.current) clearInterval(timerRef.current);

    let currentSec = 15;
    timerRef.current = setInterval(() => {
      currentSec -= 1;
      setSecondsLeft(currentSec);

      if (currentSec > 11) {
        setPhase("inhale");
      } else if (currentSec > 8) {
        setPhase("hold");
      } else if (currentSec > 0) {
        setPhase("exhale");
      } else {
        if (timerRef.current) clearInterval(timerRef.current);
        setPhase("complete");
        setCompletedCount((prev) => prev + 1);
      }
    }, 1000);
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const ringScale =
    phase === "inhale" ? 1.25 : phase === "hold" ? 1.25 : phase === "exhale" ? 0.85 : 1.0;

  return (
    <View style={[styles.container, Shadows.card]}>
      {phase === "ready" && (
        <View style={styles.contentBox}>
          <View style={styles.outerRing}>
            <View style={styles.innerCircle}>
              <Text style={styles.circleIcon}>🫁</Text>
            </View>
          </View>
          <Text style={styles.promptTitle}>15-Second Cognitive Recalibration</Text>
          <Text style={styles.promptSub}>
            Take 15 seconds to sync your breath, lower cortisol, and restore executive focus before your next mission.
          </Text>

          <Pressable
            onPress={startReset}
            style={({ pressed }) => [styles.startButton, pressed && styles.pressed]}
          >
            <Text style={styles.startButtonText}>Begin 15s Micro Reset →</Text>
          </Pressable>
        </View>
      )}

      {(phase === "inhale" || phase === "hold" || phase === "exhale") && (
        <View style={styles.contentBox}>
          <View style={[styles.outerRing, { transform: [{ scale: ringScale }] }]}>
            <View style={styles.innerCircleActive}>
              <Text style={styles.timerText}>{secondsLeft}s</Text>
            </View>
          </View>

          <Text style={styles.phaseTitle}>
            {phase === "inhale" && "Inhale Deeply..."}
            {phase === "hold" && "Hold Focus..."}
            {phase === "exhale" && "Slow Controlled Exhale..."}
          </Text>

          <Text style={styles.phaseSub}>
            {phase === "inhale" && "Expand your chest and draw air steadily."}
            {phase === "hold" && "Maintain stillness and quiet your mind."}
            {phase === "exhale" && "Release all tension through a slow breath."}
          </Text>
        </View>
      )}

      {phase === "complete" && (
        <View style={styles.contentBox}>
          <View style={styles.outerRingComplete}>
            <View style={styles.innerCircleComplete}>
              <Text style={styles.circleIcon}>✨</Text>
            </View>
          </View>

          <Text style={styles.completeTitle}>Focus Restored • Recalibration Complete</Text>
          <Text style={styles.completeSub}>
            Your mind is clear and ready for your next real-world mission.
          </Text>

          <View style={styles.countBadge}>
            <Text style={styles.countText}>
              Session Resets Completed: {completedCount}
            </Text>
          </View>

          <Pressable
            onPress={startReset}
            style={({ pressed }) => [styles.replayButton, pressed && styles.pressed]}
          >
            <Text style={styles.replayButtonText}>🔄 Repeat 15s Reset</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    alignItems: "center",
    marginBottom: 24,
  },
  contentBox: {
    alignItems: "center",
    width: "100%",
  },
  outerRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: ModeAccents.reset.badgeBg,
    borderWidth: 2,
    borderColor: colors.resetAccent,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  innerCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.resetAccent,
    alignItems: "center",
    justifyContent: "center",
  },
  innerCircleActive: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  circleIcon: {
    fontSize: 36,
  },
  timerText: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  promptTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  promptSub: {
    fontSize: 14,
    color: colors.muted,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
    maxWidth: 360,
  },
  startButton: {
    backgroundColor: colors.resetAccent,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 28,
    alignItems: "center",
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  phaseTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.primary,
    marginBottom: 6,
    textAlign: "center",
  },
  phaseSub: {
    fontSize: 14,
    color: colors.muted,
    textAlign: "center",
  },
  outerRingComplete: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.successBg,
    borderWidth: 2,
    borderColor: colors.success,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  innerCircleComplete: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.success,
    alignItems: "center",
    justifyContent: "center",
  },
  completeTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  completeSub: {
    fontSize: 14,
    color: colors.muted,
    textAlign: "center",
    marginBottom: 16,
  },
  countBadge: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 20,
  },
  countText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "700",
  },
  replayButton: {
    backgroundColor: colors.resetAccent,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  replayButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  pressed: {
    opacity: 0.85,
  },
});

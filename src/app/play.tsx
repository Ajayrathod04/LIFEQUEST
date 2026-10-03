import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { QuestRunGame, type QuestRunResult } from "../components/play/QuestRunGame";
import { PlayBranchViewer } from "../components/play/PlayBranchViewer";
import { PlayHeader } from "../components/play/PlayHeader";
import { PlayOutcomeViewer } from "../components/play/PlayOutcomeViewer";
import { PlayStatsBar } from "../components/play/PlayStatsBar";
import { executiveCrisisScenario, quantumMeltdownScenario } from "../data/playSimulations";
import type {
  PlayChoiceOption,
  PlayScenario,
  PlaySimulationOutcome,
  PlaySimulationStats,
} from "../types/mission";
import { useProStatus } from "../hooks/useProStatus";
import { PaywallModal } from "../components/monetization/PaywallModal";
import { colors, ModeAccents, Shadows } from "../constants/theme";

export default function PlayScreen() {
  const { isPro, paywallVisible, paywallSource, showPaywall, hidePaywall } = useProStatus();

  const [activeTab, setActiveTab] = useState<"quest_run" | "simulation">("quest_run");
  const [activeScenario, setActiveScenario] = useState<PlayScenario>(executiveCrisisScenario);
  const [currentNodeId, setCurrentNodeId] = useState<string>(executiveCrisisScenario.startNodeId);
  const [stats, setStats] = useState<PlaySimulationStats>(executiveCrisisScenario.initialStats);
  const [lastImpact, setLastImpact] = useState<Partial<PlaySimulationStats> | null>(null);
  const [decisionHistory, setDecisionHistory] = useState<string[]>([]);
  const [activeOutcome, setActiveOutcome] = useState<PlaySimulationOutcome | null>(null);

  useFocusEffect(
    useCallback(() => {
      // Re-sync on focus if needed
    }, [])
  );

  function handleGameComplete(result: QuestRunResult) {
    // Game completed, results saved automatically
  }

  function handleSelectScenario(scen: PlayScenario, isProReq: boolean) {
    if (isProReq && !isPro) {
      showPaywall(scen.title);
      return;
    }
    setActiveScenario(scen);
    setCurrentNodeId(scen.startNodeId);
    setStats(scen.initialStats);
    setLastImpact(null);
    setDecisionHistory([]);
    setActiveOutcome(null);
  }

  function handleMakeChoice(choice: PlayChoiceOption) {
    const newStats: PlaySimulationStats = {
      trust: Math.min(100, Math.max(0, stats.trust + (choice.statImpact.trust ?? 0))),
      time: Math.min(100, Math.max(0, stats.time + (choice.statImpact.time ?? 0))),
      resources: Math.min(100, Math.max(0, stats.resources + (choice.statImpact.resources ?? 0))),
      reputation: Math.min(100, Math.max(0, stats.reputation + (choice.statImpact.reputation ?? 0))),
    };

    setStats(newStats);
    setLastImpact(choice.statImpact);
    setDecisionHistory((prev) => [...prev, choice.text]);

    if (choice.nextBranchNodeId.startsWith("outcome-")) {
      const outcome = activeScenario.outcomes[choice.nextBranchNodeId];
      setActiveOutcome(outcome ?? Object.values(activeScenario.outcomes)[0]);
    } else {
      setCurrentNodeId(choice.nextBranchNodeId);
    }
  }

  function handleReplay() {
    setCurrentNodeId(activeScenario.startNodeId);
    setStats(activeScenario.initialStats);
    setLastImpact(null);
    setDecisionHistory([]);
    setActiveOutcome(null);
  }

  const currentNode = activeScenario.nodes[currentNodeId];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <PlayHeader />

      {/* Main Mode Toggle: QUEST RUN Flagship Game vs Branching Simulation */}
      <View style={styles.modeToggleRow}>
        <Pressable
          onPress={() => setActiveTab("quest_run")}
          style={({ pressed }) => [
            styles.modeToggleTab,
            activeTab === "quest_run" && styles.modeToggleTabActive,
            pressed && styles.pressedState,
          ]}
        >
          <Text
            style={[
              styles.modeToggleText,
              activeTab === "quest_run" && styles.modeToggleTextActive,
            ]}
          >
            🎮 QUEST RUN (FLAGSHIP GAME)
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab("simulation")}
          style={({ pressed }) => [
            styles.modeToggleTab,
            activeTab === "simulation" && styles.modeToggleTabActive,
            pressed && styles.pressedState,
          ]}
        >
          <Text
            style={[
              styles.modeToggleText,
              activeTab === "simulation" && styles.modeToggleTextActive,
            ]}
          >
            🔀 CRISIS BRANCHING SIM
          </Text>
        </Pressable>
      </View>

      {activeTab === "quest_run" ? (
        <QuestRunGame onComplete={handleGameComplete} />
      ) : (
        <>
          {/* Scenario Selector Row */}
          <View style={styles.scenarioTabRow}>
            <Pressable
              onPress={() => handleSelectScenario(executiveCrisisScenario, false)}
              style={({ pressed }) => [
                styles.scenarioTab,
                activeScenario.id === executiveCrisisScenario.id && styles.scenarioTabActive,
                pressed && styles.pressedState,
              ]}
            >
              <Text
                style={[
                  styles.scenarioTabText,
                  activeScenario.id === executiveCrisisScenario.id && styles.scenarioTabTextActive,
                ]}
              >
                FREE: The Midnight Breach
              </Text>
            </Pressable>

            <Pressable
              onPress={() => handleSelectScenario(quantumMeltdownScenario, true)}
              style={({ pressed }) => [
                styles.scenarioTab,
                activeScenario.id === quantumMeltdownScenario.id && styles.scenarioTabActive,
                styles.scenarioTabPro,
                pressed && styles.pressedState,
              ]}
            >
              <Text
                style={[
                  styles.scenarioTabText,
                  activeScenario.id === quantumMeltdownScenario.id && styles.scenarioTabTextActive,
                ]}
              >
                🔒 PRO: Quantum Meltdown
              </Text>
            </Pressable>
          </View>

          <PlayStatsBar stats={stats} lastImpact={lastImpact} />

          {activeOutcome ? (
            <PlayOutcomeViewer
              outcome={activeOutcome}
              finalStats={stats}
              decisionHistory={decisionHistory}
              onReplay={handleReplay}
            />
          ) : (
            currentNode && (
              <PlayBranchViewer
                currentNode={currentNode}
                onMakeChoice={handleMakeChoice}
              />
            )
          )}
        </>
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
  modeToggleRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  modeToggleTab: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  modeToggleTabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },
  modeToggleText: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  modeToggleTextActive: {
    color: "#FFFFFF",
  },
  scenarioTabRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  scenarioTab: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    alignItems: "center",
  },
  scenarioTabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },
  scenarioTabPro: {
    borderColor: colors.surfaceBorder,
  },
  scenarioTabText: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700",
  },
  scenarioTabTextActive: {
    color: "#FFFFFF",
  },
  pressedState: {
    opacity: 0.85,
  },
});

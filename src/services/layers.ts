import { LayersReactNative } from "@layers/react-native";

export interface LayersExperimentState {
  experimentId: string;
  audience: string;
  hypothesis: string;
  variant: "personalized" | "generic";
  assignedAt: number;
}

const EXPERIMENT_ID = "exp_career_next_recommendation_v1";

let layersClient: LayersReactNative | null = null;

export async function initLayers(): Promise<void> {
  if (layersClient) return;

  const appId = process.env.EXPO_PUBLIC_LAYERS_APP_ID;

  if (!appId) {
    console.warn("[Layers] EXPO_PUBLIC_LAYERS_APP_ID is not available.");
    return;
  }

  layersClient = new LayersReactNative({
    appId,
    environment: "development",
  });

  await layersClient.init();

  console.log("[Layers] SDK initialized.");
}

export async function setLayersUser(userId: string): Promise<void> {
  if (!layersClient) await initLayers();
  if (!layersClient) return;

  await layersClient.setAppUserId(userId);
}

export function getLayersGrowthVariant(
  userId: string = "guest"
): "personalized" | "generic" {
  const charSum = userId
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return charSum % 2 === 0 ? "personalized" : "generic";
}

export async function logLayersGrowthSignal(
  eventName:
    | "recommendation_impression"
    | "recommendation_click"
    | "mission_return"
    | "mission_completion",
  variant: "personalized" | "generic",
  metadata: Record<string, unknown> = {}
): Promise<void> {
  if (!layersClient) await initLayers();
  if (!layersClient) return;

  await layersClient.track(eventName, {
    experimentId: EXPERIMENT_ID,
    variant,
    ...metadata,
    timestamp: Date.now(),
  });
}

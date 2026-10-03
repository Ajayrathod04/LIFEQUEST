import { useEffect } from "react";
import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "react-native";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import AppTabs from "@/components/app-tabs";
import { initRevenueCat } from "@/services/revenueCat";
import { initOneSignal } from "@/services/oneSignal";

// Prevent auto-hiding splash screen safely without throwing top-level uncaught JS exceptions
try {
  SplashScreen.preventAutoHideAsync().catch(() => {});
} catch (e) {
  console.warn("[Root Layout] SplashScreen preventAutoHideAsync notice:", e);
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    async function setupServices() {
      try {
        await initRevenueCat();
      } catch (err) {
        console.warn("[Root Layout] RevenueCat initialization notice:", err);
      }

      try {
        await initOneSignal();
      } catch (err) {
        console.warn("[Root Layout] OneSignal initialization notice:", err);
      }
    }

    setupServices();
  }, []);

  return (
    <ThemeProvider
      value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <AnimatedSplashOverlay />
      <AppTabs />
    </ThemeProvider>
  );
}

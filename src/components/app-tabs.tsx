import { Tabs } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/theme";

export default function AppTabs() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "#64748B",
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              <Text style={{ fontSize: 18, color: focused ? colors.primary : "#64748B" }}>
                🎯
              </Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="career"
        options={{
          title: "Career",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              <Text style={{ fontSize: 18, color: focused ? colors.careerAccent : "#64748B" }}>
                🚀
              </Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="play"
        options={{
          title: "Play",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              <Text style={{ fontSize: 18, color: focused ? colors.playAccent : "#64748B" }}>
                🎮
              </Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="passport"
        options={{
          title: "Passport",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              <Text style={{ fontSize: 18, color: focused ? colors.passportAccent : "#64748B" }}>
                🪪
              </Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              <Text style={{ fontSize: 18, color: focused ? colors.cyan : "#64748B" }}>
                ⚡
              </Text>
            </View>
          ),
        }}
      />
      {/* Hidden secondary screens so they don't clog tab bar */}
      <Tabs.Screen name="impact" options={{ href: null }} />
      <Tabs.Screen name="employer" options={{ href: null }} />
      <Tabs.Screen name="reset" options={{ href: null }} />
      <Tabs.Screen name="terms" options={{ href: null }} />
      <Tabs.Screen name="privacy" options={{ href: null }} />
      <Tabs.Screen name="impact-mission" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    height: 64,
    paddingBottom: 8,
    paddingTop: 6,
    elevation: 6,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  tabItem: {
    paddingVertical: 2,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  activeIconContainer: {
    backgroundColor: "rgba(79, 70, 229, 0.1)",
  },
});

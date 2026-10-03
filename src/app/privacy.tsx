import React from "react";
import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { colors, fonts, spacing } from "../constants/theme";

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>
        <Text style={styles.title}>LIFEQUEST Privacy Policy</Text>
        <Text style={styles.effectiveDate}>Effective Date: October 1, 2026</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>1. Information We Collect</Text>
        <Text style={styles.paragraph}>
          LIFEQUEST respects your privacy. We collect minimal operational data necessary to deliver simulation performance scoring, skill evidence recording, and subscription entitlements. This includes anonymous device identifiers, simulation progress logs, and subscription status parameters managed securely via RevenueCat.
        </Text>

        <Text style={styles.sectionTitle}>2. How We Use Information</Text>
        <Text style={styles.paragraph}>
          Your simulation data is used solely to calculate competency metrics, populate your portable Skill Passport and Impact Passport, and grant access to LIFEQUEST Pro premium scenarios. We do not sell your personal data or decision histories to third-party advertisers.
        </Text>

        <Text style={styles.sectionTitle}>3. Subscriptions & Payment Processing</Text>
        <Text style={styles.paragraph}>
          In-app purchases and subscription billing are processed securely through Apple App Store, Google Play Store, or RevenueCat SDK services. LIFEQUEST does not store or process payment card details on its servers.
        </Text>

        <Text style={styles.sectionTitle}>4. Data Storage & Security</Text>
        <Text style={styles.paragraph}>
          Simulation results and session passports are stored locally on your device or linked securely to your subscription ID. Standard security protocols and access controls are applied to protect your information against unauthorized access.
        </Text>

        <Text style={styles.sectionTitle}>5. Your Privacy Rights</Text>
        <Text style={styles.paragraph}>
          You may reset your session evidence log at any time using the RESET feature or clear locally cached app state within settings. You may also request data deletion by contacting our privacy team.
        </Text>

        <Text style={styles.sectionTitle}>6. Updates & Contact</Text>
        <Text style={styles.paragraph}>
          We may update this Privacy Policy from time to time. For any privacy questions, please email privacy@lifequest.app.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: spacing.md,
    paddingTop: 56,
    paddingBottom: spacing.xl,
    backgroundColor: colors.background,
    maxWidth: 800,
    alignSelf: "center",
    width: "100%",
  },
  header: {
    marginBottom: spacing.lg,
  },
  backButton: {
    alignSelf: "flex-start",
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: spacing.md,
  },
  backButtonText: {
    color: colors.muted,
    fontSize: 13,
    fontFamily: fonts.medium,
  },
  title: {
    fontSize: 26,
    fontFamily: fonts.bold,
    color: colors.text,
    marginBottom: 4,
  },
  effectiveDate: {
    fontSize: 13,
    color: colors.muted,
    fontFamily: fonts.regular,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.primary,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  paragraph: {
    fontSize: 14,
    color: "#D1D5DB",
    lineHeight: 22,
    fontFamily: fonts.regular,
  },
});

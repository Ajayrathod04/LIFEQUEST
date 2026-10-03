import React from "react";
import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { colors, fonts, spacing } from "../constants/theme";

export default function TermsOfServiceScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>
        <Text style={styles.title}>LIFEQUEST Terms of Service</Text>
        <Text style={styles.effectiveDate}>Effective Date: October 1, 2026</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.paragraph}>
          By accessing or using the LIFEQUEST application, simulation engine, and skill passport services ("Service"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.
        </Text>

        <Text style={styles.sectionTitle}>2. Educational & Simulation Use</Text>
        <Text style={styles.paragraph}>
          LIFEQUEST provides decision-making simulations, competency assessment tools, and skill passport evidence generation. All workplace, crisis management, and real-world impact scenarios are designed for skill demonstration, learning, and assessment purposes.
        </Text>

        <Text style={styles.sectionTitle}>3. Subscriptions & LIFEQUEST Pro</Text>
        <Text style={styles.paragraph}>
          Certain features, advanced scenarios, and expanded evidence analysis are available via LIFEQUEST Pro subscriptions. Subscriptions are billed on a recurring monthly or annual basis through the applicable mobile store or billing service provider (powered by RevenueCat). You may cancel your subscription at any time via store settings.
        </Text>

        <Text style={styles.sectionTitle}>4. User Evidence & Data Integrity</Text>
        <Text style={styles.paragraph}>
          Skill Evidence and Impact Records generated within LIFEQUEST reflect demonstrated decisions and verified simulation performance. Users must not attempt to alter, forge, or tamper with evidence timestamps or competency verifications.
        </Text>

        <Text style={styles.sectionTitle}>5. Limitation of Liability</Text>
        <Text style={styles.paragraph}>
          LIFEQUEST is provided "as is" without warranty of any kind. LIFEQUEST and its developers shall not be liable for direct, indirect, incidental, or consequential damages resulting from the use or inability to use the Service.
        </Text>

        <Text style={styles.sectionTitle}>6. Contact Information</Text>
        <Text style={styles.paragraph}>
          For inquiries regarding these Terms of Service or LIFEQUEST subscriptions, please contact support at support@lifequest.app.
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

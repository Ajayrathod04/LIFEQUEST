export const BottomTabInset = 70;
export const MaxContentWidth = 800;

export const Colors = {
  light: {
    text: "#0F172A",
    textSecondary: "#64748B",
    background: "#F8FAFC",
    backgroundElement: "#F1F5F9",
    backgroundSelected: "#EEF2FF",
    tint: "#4F46E5",
    icon: "#64748B",
    tabIconDefault: "#94A3B8",
    tabIconSelected: "#4F46E5",
    linkPrimary: "#4F46E5",
    link: "#4F46E5",
    card: "#FFFFFF",
    border: "#E2E8F0",
    primary: "#4F46E5",
    career: "#F97316",
    impact: "#10B981",
    safety: "#EF4444",
  },
  dark: {
    text: "#0F172A",
    textSecondary: "#64748B",
    background: "#F8FAFC",
    backgroundElement: "#F1F5F9",
    backgroundSelected: "#EEF2FF",
    tint: "#4F46E5",
    icon: "#64748B",
    tabIconDefault: "#94A3B8",
    tabIconSelected: "#4F46E5",
    linkPrimary: "#4F46E5",
    link: "#4F46E5",
    card: "#FFFFFF",
    border: "#E2E8F0",
    primary: "#4F46E5",
    career: "#F97316",
    impact: "#10B981",
    safety: "#EF4444",
  },
};

export type ThemeColor = keyof typeof Colors.light;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 20,
  six: 24,
  seven: 32,
  eight: 40,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  screenHorizontal: 16,
  screenTopPadding: 48,
  cardPadding: 18,
  sectionGap: 20,
};

export const Fonts = {
  regular: "System",
  medium: "System",
  bold: "System",
  mono: "monospace",
};

export const colors = {
  // Premium Light / Warm / Friendly palette
  background: "#F8FAFC",
  surface: "#FFFFFF",
  surfaceBorder: "#E2E8F0",
  surfaceLight: "#F1F5F9",
  surfaceHover: "#E2E8F0",
  primary: "#4F46E5",     // Indigo Primary
  primaryDark: "#4338CA",
  primaryGlow: "rgba(79, 70, 229, 0.12)",
  cyan: "#0284C7",        // Sky Blue
  cyanGlow: "rgba(2, 132, 199, 0.12)",
  amber: "#D97706",       // Amber Gold
  amberGlow: "rgba(217, 119, 6, 0.12)",
  emerald: "#10B981",     // Mint Emerald
  emeraldGlow: "rgba(16, 185, 129, 0.12)",
  text: "#0F172A",        // Deep Ink
  muted: "#64748B",       // Medium Ink
  subtle: "#94A3B8",      // Muted Subtitle Ink
  success: "#10B981",
  successBg: "#ECFDF5",
  warning: "#F59E0B",
  warningBg: "#FFFBEB",
  danger: "#EF4444",      // Coral Warning
  dangerBg: "#FEF2F2",

  // LIFEQUEST visual identity domain accents
  studentAccent: "#4F46E5",  // Indigo Action
  passportAccent: "#D97706", // Amber Gold Proof
  employerAccent: "#0284C7", // Executive Sky Blue
  impactAccent: "#10B981",   // Emerald Green
  playAccent: "#4F46E5",     // Indigo Action
  resetAccent: "#0284C7",    // Calming Light Blue
  careerAccent: "#F97316",   // Action / Career Orange
  solveAccent: "#7C3AED",    // Deep Purple
  mentalAccent: "#2563EB",   // Royal Blue
  puzzleAccent: "#0D9488",   // Teal

  rocketOrange: "#F97316",
  coralWarning: "#EF4444",
  impact: "#10B981",
  career: "#F97316",
  safety: "#EF4444",
};

export const ModeAccents = {
  student: {
    badgeBg: "#EEF2FF",
    badgeText: "#4338CA",
    border: "#C7D2FE",
    label: "STUDENT MODE • PRACTICE",
  },
  passport: {
    badgeBg: "#FEF3C7",
    badgeText: "#92400E",
    border: "#FDE68A",
    label: "SKILL PASSPORT • PROOF",
  },
  employer: {
    badgeBg: "#E0F2FE",
    badgeText: "#075985",
    border: "#BAE6FD",
    label: "EMPLOYER DEMO • OPPORTUNITY",
  },
  impact: {
    badgeBg: "#D1FAE5",
    badgeText: "#065F46",
    border: "#A7F3D0",
    label: "IMPACT PASSPORT • REAL-WORLD ACTION",
  },
  play: {
    badgeBg: "#EEF2FF",
    badgeText: "#4338CA",
    border: "#C7D2FE",
    label: "PLAY • GAMEPLAY SIMULATION",
  },
  reset: {
    badgeBg: "#E0F2FE",
    badgeText: "#0369A1",
    border: "#BAE6FD",
    label: "RESET • 15s FOCUS RECALIBRATION",
  },
};

export const BorderRadius = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  pill: 9999,
};

export const Shadows = {
  subtle: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  card: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  hover: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
  },
  glowViolet: {
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  glowCyan: {
    shadowColor: "#0284C7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  glowEmerald: {
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
};

export const ButtonSizes = {
  sm: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 },
  md: { paddingVertical: 12, paddingHorizontal: 18, borderRadius: 12 },
  lg: { paddingVertical: 16, paddingHorizontal: 24, borderRadius: 16 },
};

export const IconContainers = {
  sm: { width: 32, height: 32, borderRadius: 8 },
  md: { width: 44, height: 44, borderRadius: 12 },
  lg: { width: 56, height: 56, borderRadius: 16 },
  xl: { width: 64, height: 64, borderRadius: 20 },
};

export const spacing = Spacing;
export const fonts = Fonts;
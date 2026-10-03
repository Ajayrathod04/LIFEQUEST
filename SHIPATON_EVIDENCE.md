# LIFEQUEST — Shipaton Submission Evidence Document

## 1. RevenueCat Integration
- **Project ID**: `4feb80ee`
- **Entitlement Identifier**: `lifequest_pro` (LIFEQUEST Pro)
- **Products**: `monthly` ($rc_monthly), `yearly` ($rc_annual)
- **Offering Identifier**: `default`
- **Paywall Status**: Connected to `default` offering; Terms URL & Privacy URL configured to live public endpoints (`https://ajayrathod04.github.io/LIFEQUEST/terms` and `https://ajayrathod04.github.io/LIFEQUEST/privacy`).
- **Premium Features**: Unlocks PRO Career scenarios (e.g. *Global Tech Merger & Regulatory Crisis*), deep evidence breakdown, advanced Play simulations, and expanded Skill/Impact Passports.
- **Judge Access**: Integrated in `src/services/revenueCat.ts` via `setJudgeAccessState(true)` toggle, enabling hackathon judges to evaluate all PRO features without incurring real store charges.

## 2. OneSignal Integration
- **Service Module**: `src/services/oneSignal.ts`
- **App ID**: Configurable via `EXPO_PUBLIC_ONESIGNAL_APP_ID`.
- **Integration**: Cross-platform SDK initialization supporting Android, iOS, and Web fallback.
- **Retention Loop**: 
  - *Trigger*: `scheduleMissionRetentionReminder(missionTitle)`
  - *Payload*: `"Your LIFEQUEST mission is waiting. Continue where you left off."`
  - *Flow*: Mission started → user leaves → reminder sent → return to app → mission completed → evidence logged.
- **Status**: FULLY INTEGRATED IN APP CODE. Live push delivery requires valid OneSignal REST API key setup in dashboard.

## 3. Layers Growth Loop
- **Service Module**: `src/services/layers.ts`
- **Experiment ID**: `exp_career_next_recommendation_v1`
- **Audience**: Users who complete a LIFEQUEST Career mission.
- **Hypothesis**: A personalized next-mission recommendation produces higher return and completion rates than generic recommendations.
- **Experiment Structure**: Deterministic 50/50 variant split (`personalized` vs `generic`).
- **Logged Telemetry**: `recommendation_impression`, `recommendation_click`, `mission_return`, `mission_completion`.
- **Status**: CODE & TELEMETRY INTEGRATED. Measured results are NOT fabricated; ready for live cohort signal collection.

## 4. Stripe Funnel Vision
- **Status**: NOT COMPLETED
- **Rationale**: Preserved native store billing and RevenueCat SDK integrity. Web-to-app Stripe backend checkout was not configured to prevent payment contract destabilization.

## 5. Production Release & Web Deployment
- **Live Web Production App**: `https://ajayrathod04.github.io/LIFEQUEST/`
- **Terms of Service URL**: `https://ajayrathod04.github.io/LIFEQUEST/terms`
- **Privacy Policy URL**: `https://ajayrathod04.github.io/LIFEQUEST/privacy`
- **Android / iOS App Package**: `com.anonymous.lifequest` (Expo SDK 57 static & web export live; native APK/IPA generation requires cloud EAS build credentials).

## 6. Product Growth & Analytics
- **Telemetry Service**: `src/services/analytics.ts`
- **Tracked Events**: `app_open`, `mission_started`, `mission_completed`, `career_completed`, `passport_viewed`, `employer_started`, `impact_started`, `play_started`, `reset_used`, `paywall_viewed`, `pro_purchase_started`, `pro_purchase_completed`, `restore_purchase`.
- **Growth Loop**: New User → Free Mission → Situational Decision → Competency Feedback → Skill Passport Evidence → Pro Upgrade Trigger.

## 7. Social Impact & Peace Prize Rationale
- **Core Mission**: LIFEQUEST democratizes decision-making practice and real-world competency verification across career escalations, consumer fraud protection (Scam Investigator), legal awareness, field technician diagnostics, women's transit safety, and community solar energy optimization.
- **Evidence Integrity**: All skill and impact records link decision data to verified competency metrics without unsupported claims.

## 8. Design & User Experience
- **Visual Design System**: Custom dark mode glassmorphism UI built with curated HSL color tokens (`src/constants/theme.ts`), crisp typography, responsive card layouts, and accessible contrast.
- **Key Screens**: Home Hub, Career Escalation, Scam Investigator, FieldGuide Diagnostics, Skill Passport, Impact Passport, Employer Assessment, Play Branching Simulator, Reset Breathing Focus, and RevenueCat Paywall.

## 9. Build in Public Story & Timeline
- **Phase 1**: Initial Concept & Mission Engine Architecture
- **Phase 2**: Career Escalation & SOLVE Scam Investigator Packs
- **Phase 3**: Skill Passport & Employer Assessment Engine
- **Phase 4**: Impact Engine & Sustainability Verification
- **Phase 5**: PLAY Branching Simulation & RESET Micro-Interactions
- **Phase 6**: RevenueCat In-App Purchases & PRO Entitlement Integration
- **Phase 7**: ShipKit Integrations (OneSignal Retention, Layers Growth Loop, Analytics Telemetry)
- **Phase 8**: Public Web Deployment to GitHub Pages & Paywall Legal Endpoint Verification

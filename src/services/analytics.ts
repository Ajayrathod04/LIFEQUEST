export type AnalyticsEvent =
  | "app_open"
  | "mission_started"
  | "mission_completed"
  | "career_completed"
  | "passport_viewed"
  | "employer_started"
  | "impact_started"
  | "play_started"
  | "reset_used"
  | "paywall_viewed"
  | "pro_purchase_started"
  | "pro_purchase_completed"
  | "restore_purchase"
  | string;

export interface EventLogEntry {
  event: AnalyticsEvent;
  params?: Record<string, any>;
  timestamp: number;
}

const inMemoryEventLog: EventLogEntry[] = [];

/**
 * Log a structured product analytics event for growth & usage insight.
 */
export function trackEvent(event: AnalyticsEvent, params: Record<string, any> = {}): void {
  const entry: EventLogEntry = {
    event,
    params,
    timestamp: Date.now(),
  };

  inMemoryEventLog.push(entry);

  if (__DEV__) {
    console.log(`[Analytics Service] Event: ${event}`, params);
  }
}

/**
 * Retrieve recorded session analytics log.
 */
export function getAnalyticsEventLog(): EventLogEntry[] {
  return [...inMemoryEventLog];
}

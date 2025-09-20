export interface StatsEvent {
  timestamp: Date;
  userAgent?: string;
  language?: string;
  platform?: string;
  screenResolution?: string;
  windowSize?: string;
  timezone?: string;
  referrer?: string;
  pathname?: string;
}

export interface Stats {
  type: "Understand" | "Website visit";
  events: StatsEvent[];
  createdAt: Date;
  updatedAt: Date;
}

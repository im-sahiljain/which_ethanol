"use client";

import { useEffect } from "react";
import type { StatsEvent } from "@/lib/models/stats";

export function VisitTracker() {
  const collectBrowserData = (): StatsEvent => {
    return {
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      windowSize: `${window.innerWidth}x${window.innerHeight}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      referrer: document.referrer,
      pathname: window.location.pathname,
    };
  };

  useEffect(() => {
    const recordVisit = async () => {
      try {
        const event = collectBrowserData();
        await fetch("/api/stats", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "Website visit",
            event,
          }),
        });
      } catch (error) {
        console.error("Error recording visit:", error);
      }
    };

    recordVisit();
  }, []);

  return null;
}

"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import type { StatsEvent } from "@/lib/models/stats";

export function DisclaimerDialog() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(true);
  const [hasAcknowledged, setHasAcknowledged] = useState(false);

  useEffect(() => {
    setMounted(true);
    const acknowledged = localStorage.getItem("disclaimerAcknowledged");
    if (acknowledged) {
      setHasAcknowledged(true);
      setOpen(false);
    }
  }, []);

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

  const handleAcknowledge = async () => {
    try {
      const event = collectBrowserData();
      await fetch("/api/stats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "Understand",
          event,
        }),
      });
    } catch (error) {
      console.error("Error recording stats:", error);
    }

    localStorage.setItem("disclaimerAcknowledged", "true");
    setHasAcknowledged(true);
    setOpen(false);
  };

  // Don't render anything until after mounting to prevent hydration issues
  if (!mounted) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        // Allow closing via the close button
        if (!isOpen && hasAcknowledged) {
          setOpen(false);
        }
      }}
    >
      <DialogContent className="max-w-2xl" showCloseButton={hasAcknowledged}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Disclaimer</DialogTitle>
          <DialogDescription asChild>
            <div className="mt-4 space-y-4 text-base">
              <p>
                This website was created to compile ethanol compatibility
                information for vehicles operating on Indian roads. While we
                strive for accuracy, this data is gathered from various online
                sources using <span className="text-primary font-bold">AI</span>{" "}
                and should be used as a{" "}
                <span className="text-red-500 font-bold">reference only </span>.
              </p>
              <p>
                For your vehicle&apos;s safety and optimal performance, we
                strongly recommend:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li className="text-left">
                  Verifying compatibility with your vehicle manufacturer
                  directly
                </li>
                <li className="text-left">
                  Consulting your vehicle&apos;s user manual for official
                  specifications
                </li>
                <li className="text-left">
                  Cross-referencing with authorized service centers
                </li>
              </ul>
            </div>
            {/* <div className="border-t pt-4 mt-6">
              <p className="font-medium mb-3">Help us improve our database:</p>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="inline-flex items-center gap-2"
                >
                  <ThumbsUp className="h-4 w-4" />
                  Confirm Data Accuracy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="inline-flex items-center gap-2"
                >
                  <ThumbsDown className="h-4 w-4" />
                  Report Inaccuracy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="inline-flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  Submit Feedback
                </Button>
              </div>
            </div> */}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end mt-4">
          <Button onClick={handleAcknowledge}>I Understand</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

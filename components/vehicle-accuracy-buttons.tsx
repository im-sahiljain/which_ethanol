import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

async function handleAccuracyReport(
  resultId: string,
  type: "confirm" | "report"
) {
  try {
    const response = await fetch("/api/accuracy-report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ resultId, type }),
    });

    if (!response.ok) {
      throw new Error("Failed to submit report");
    }

    toast({
      title:
        type === "confirm" ? "Data accuracy confirmed" : "Inaccuracy reported",
      description:
        type === "confirm"
          ? "Thank you for confirming the data accuracy!"
          : "Thank you for reporting the inaccuracy. We will review it.",
    });
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to submit report. Please try again.",
      variant: "destructive",
    });
  }
}

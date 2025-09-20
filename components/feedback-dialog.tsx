"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle } from "lucide-react";

interface FeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  resultId: string;
  onFeedbackSubmit?: () => void;
}

export function FeedbackDialog({
  isOpen,
  onClose,
  resultId,
  onFeedbackSubmit,
}: FeedbackDialogProps) {
  const [selectedFuels, setSelectedFuels] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [showInaccuracyForm, setShowInaccuracyForm] = useState(false);

  const handleAccuracyClick = async (type: "confirm" | "report") => {
    if (type === "confirm") {
      try {
        const response = await fetch("/api/accuracy-report", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resultId,
            type: "confirm",
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to submit report");
        }
        onFeedbackSubmit?.();
        onClose();
      } catch (error) {
        console.error("Error submitting report:", error);
      }
    } else {
      setShowInaccuracyForm(true);
    }
  };

  const handleInaccuracySubmit = async () => {
    try {
      const response = await fetch("/api/accuracy-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resultId,
          type: "report",
          inaccuracies: selectedFuels,
          comment: comment.trim() || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit report");
      }
      onFeedbackSubmit?.();
      onClose();
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[80vw] md:max-w-md">
        <DialogHeader>
          <DialogTitle>Your Feedback Matters</DialogTitle>
          <DialogDescription>
            Help us maintain accurate data by confirming or reporting
            inaccuracies in this vehicle information.
          </DialogDescription>
        </DialogHeader>

        {!showInaccuracyForm ? (
          <div className="flex flex-col gap-4">
            <Button
              variant="outline"
              className="w-full py-6"
              onClick={() => handleAccuracyClick("confirm")}
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              This Information is Accurate
            </Button>
            <Button
              variant="outline"
              className="w-full py-6"
              onClick={() => handleAccuracyClick("report")}
            >
              <AlertCircle className="h-5 w-5 mr-2" />
              Report Inaccuracy
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-3">
              <Label className="text-base">
                What information is inaccurate?
              </Label>
              <div className="grid grid-cols-3 gap-4">
                {["E5", "E10", "E20"].map((fuel) => (
                  <div key={fuel} className="flex items-center space-x-2">
                    <Checkbox
                      id={fuel}
                      checked={selectedFuels.includes(fuel)}
                      onCheckedChange={(checked) => {
                        setSelectedFuels(
                          checked
                            ? [...selectedFuels, fuel]
                            : selectedFuels.filter((f) => f !== fuel)
                        );
                      }}
                    />
                    <Label htmlFor={fuel}>{fuel}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">Additional details (optional)</Label>
              <Textarea
                id="comment"
                placeholder="Please explain what is incorrect..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowInaccuracyForm(false)}
              >
                Back
              </Button>
              <Button
                onClick={handleInaccuracySubmit}
                disabled={selectedFuels.length === 0}
              >
                Submit Report
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

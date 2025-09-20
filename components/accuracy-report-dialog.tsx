import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
interface AccuracyReportDialogProps {
  resultId: string;
  isOpen: boolean;
  onClose: () => void;
  type: "confirm" | "report";
}

const fuelTypes = ["E5", "E10", "E20"];

export function AccuracyReportDialog({
  resultId,
  isOpen,
  onClose,
  type,
}: AccuracyReportDialogProps) {
  const [loading, setLoading] = useState(false);
  const [selectedFuels, setSelectedFuels] = useState<string[]>([]);
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/accuracy-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resultId,
          type,
          inaccuracies: type === "report" ? selectedFuels : undefined,
          comment:
            type === "report" && comment.trim() ? comment.trim() : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit report");
      }

      onClose();
    } catch (error) {
      console.error("Failed to submit report:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === "confirm" ? "Confirm Data Accuracy" : "Report Inaccuracy"}
          </DialogTitle>
          <DialogDescription>
            {type === "confirm"
              ? "Are you sure you want to confirm that this data is accurate?"
              : "Please select which fuel types have inaccurate data and provide any additional comments."}
          </DialogDescription>
        </DialogHeader>

        {type === "report" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select inaccurate fuel types:</Label>
              <div className="space-y-2">
                {fuelTypes.map((fuel) => (
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
              <Label htmlFor="comment">Additional comments:</Label>
              <Textarea
                id="comment"
                placeholder="Please describe what is inaccurate..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : type === "confirm" ? (
              <CheckCircle className="h-4 w-4 mr-2" />
            ) : (
              <AlertCircle className="h-4 w-4 mr-2" />
            )}
            {type === "confirm" ? "Confirm Accuracy" : "Submit Report"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

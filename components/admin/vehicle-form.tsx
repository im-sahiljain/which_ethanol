"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import type { AdminVehicleFormData } from "@/lib/models/admin";

interface VehicleFormProps {
  vehicle?: AdminVehicleFormData;
}

export function VehicleForm({ vehicle }: VehicleFormProps) {
  const [formData, setFormData] = useState({
    brand: vehicle?.brand || "",
    model: vehicle?.model || "",
    engineVariant: vehicle?.engineVariant || "",
    yearOfManufacture: vehicle?.yearOfManufacture || new Date().getFullYear(),
    fuelCompatibility: {
      E5: vehicle?.fuelCompatibility.E5 || false,
      E10: vehicle?.fuelCompatibility.E10 || false,
      E20: vehicle?.fuelCompatibility.E20 || false,
    },
    verificationStatus: vehicle?.verificationStatus || "pending",
    source: vehicle?.source || "",
    sourceLink: vehicle?.sourceLink || "",
    notes: vehicle?.notes || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const url = vehicle
        ? `/api/admin/vehicles/${vehicle._id}`
        : "/api/admin/vehicles";
      const method = vehicle ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(
          vehicle
            ? "Vehicle updated successfully!"
            : "Vehicle created successfully!"
        );
        if (!vehicle) {
          // Reset form for new vehicle
          setFormData({
            brand: "",
            model: "",
            engineVariant: "",
            yearOfManufacture: new Date().getFullYear(),
            fuelCompatibility: { E5: false, E10: false, E20: false },
            verificationStatus: "pending",
            source: "",
            sourceLink: "",
            notes: "",
          });
        }
        setTimeout(() => router.push("/admin"), 2000);
      } else {
        setError(data.error || "Operation failed");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFuelCompatibilityChange = (
    fuelType: "E5" | "E10" | "E20",
    checked: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      fuelCompatibility: {
        ...prev.fuelCompatibility,
        [fuelType]: checked,
      },
    }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.push("/admin")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{vehicle ? "Edit Vehicle" : "Add New Vehicle"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Brand *</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => handleInputChange("brand", e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model *</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => handleInputChange("model", e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="engineVariant">Engine Variant *</Label>
                <Input
                  id="engineVariant"
                  value={formData.engineVariant}
                  onChange={(e) =>
                    handleInputChange("engineVariant", e.target.value)
                  }
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year of Manufacture *</Label>
                <Input
                  id="year"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  value={formData.yearOfManufacture}
                  onChange={(e) =>
                    handleInputChange(
                      "yearOfManufacture",
                      Number.parseInt(e.target.value)
                    )
                  }
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label>Fuel Compatibility *</Label>
              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="e5"
                    checked={formData.fuelCompatibility.E5}
                    onCheckedChange={(checked) =>
                      handleFuelCompatibilityChange("E5", checked as boolean)
                    }
                    disabled={loading}
                  />
                  <Label htmlFor="e5">E5 (5% Ethanol)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="e10"
                    checked={formData.fuelCompatibility.E10}
                    onCheckedChange={(checked) =>
                      handleFuelCompatibilityChange("E10", checked as boolean)
                    }
                    disabled={loading}
                  />
                  <Label htmlFor="e10">E10 (10% Ethanol)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="e20"
                    checked={formData.fuelCompatibility.E20}
                    onCheckedChange={(checked) =>
                      handleFuelCompatibilityChange("E20", checked as boolean)
                    }
                    disabled={loading}
                  />
                  <Label htmlFor="e20">E20 (20% Ethanol)</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="verificationStatus">Verification Status</Label>
              <Select
                value={formData.verificationStatus}
                onValueChange={(value) =>
                  handleInputChange("verificationStatus", value)
                }
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="unverified">Unverified</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="source">Source *</Label>
              <Input
                id="source"
                value={formData.source}
                onChange={(e) => handleInputChange("source", e.target.value)}
                required
                disabled={loading}
                placeholder="e.g., Toyota Official Documentation"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sourceLink">Source Link</Label>
              <Input
                id="sourceLink"
                type="url"
                value={formData.sourceLink}
                onChange={(e) =>
                  handleInputChange("sourceLink", e.target.value)
                }
                disabled={loading}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                disabled={loading}
                rows={3}
                placeholder="Additional information about fuel compatibility..."
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50 text-green-800">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {vehicle ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {vehicle ? "Update Vehicle" : "Create Vehicle"}
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin")}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

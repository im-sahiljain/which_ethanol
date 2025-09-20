"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Fuel,
  Calendar,
  Settings,
  Loader2,
  Search,
  Car,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FeedbackDialog } from "@/components/feedback-dialog";
import type {
  VehicleBrands,
  VehicleData,
  VehicleSearchFilters,
  ModelNames,
} from "@/lib/models/vehicle";
import { useVehicleData } from "@/hooks/useVehicleData";

interface VehicleResultsProps {
  vehicle_fact: VehicleData[];
  loading: boolean;
}

export function VehicleResults({
  vehicle_fact: vehicles,
  loading,
}: VehicleResultsProps) {
  const [ratingLoading, setRatingLoading] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<{ [key: string]: boolean }>({});
  const [hasClosedPopup, setHasClosedPopup] = useState<{ [key: string]: boolean }>({});

  // Auto-show popup after delay
  useEffect(() => {
    if (!loading && vehicles && vehicles.length > 0) {
      const firstVehicleId = vehicles[0]._id?.toString();
      if (firstVehicleId && !feedbackSubmitted[firstVehicleId] && !hasClosedPopup[firstVehicleId]) {
        const timer = setTimeout(() => {
          setSelectedVehicle(firstVehicleId);
        }, 7000); // 7 seconds delay
        return () => clearTimeout(timer);
      }
    }
  }, [loading, vehicles, feedbackSubmitted, hasClosedPopup]);

  const handleFeedbackClick = (resultId: string) => {
    setSelectedVehicle(resultId);
  };

  const handleFeedbackSubmit = (vehicleId: string) => {
    setFeedbackSubmitted(prev => ({ ...prev, [vehicleId]: true }));
    setSelectedVehicle(null);
  };

  const handlePopupClose = () => {
    if (selectedVehicle) {
      setHasClosedPopup(prev => ({ ...prev, [selectedVehicle]: true }));
    }
    setSelectedVehicle(null);
  };

  const {
    brands,
    models,
    years,
    loadModels,
    loadBrands,
    loadYears,
    loading: vehicleLoading,
  } = useVehicleData();

  useEffect(() => {
    loadModels();
    loadBrands();
  }, [loadModels, loadBrands]);
  const handleRating = async (vehicleId: string, rating: "up" | "down") => {
    setRatingLoading(vehicleId);
    try {
      const response = await fetch("/api/vehicles/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicleId, rating }),
      });

      if (response.ok) {
        // Refresh the results to show updated ratings
        window.location.reload();
      }
    } catch (error) {
      console.error("Rating failed:", error);
    } finally {
      setRatingLoading(null);
    }
  };

  const isAllowedFuelType = (fuelTypes: string): boolean => {
    // Convert input "E5,E10" → ["E5", "E10"]
    const types = fuelTypes.split(",").map((t) => t.trim());

    // Define which fuels should return true
    const allowed = new Set(["E5", "E10"]);

    // Return true if ANY type is in allowed list
    return types.some((t) => allowed.has(t));
  };

  // Helper function: check if a given fuel type is supported
  const isFuelSupported = (fuelTypes: string, type: string): boolean => {
    return fuelTypes
      .split(",")
      .map((t) => t.trim())
      .includes(type);
  };

  const getVerificationIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getVerificationColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardContent className="py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Searching Database</h3>
            <p className="text-muted-foreground">
              Finding compatible vehicles...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!vehicles || vehicles.length === 0) {
    return (
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardContent className="py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-muted/50 rounded-2xl mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Results Found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              We couldn&apos;t find any vehicles matching your search. Please
              check that:
            </p>
            <ul className="text-muted-foreground max-w-md mx-auto mt-4 space-y-2 text-left list-disc list-inside">
              <li>The model name is spelled correctly</li>
              <li>The year selected is valid for this model</li>
              <li>Try searching without the year to see all available years</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Ensure vehicles is always an array
  const vehicleArray = Array.isArray(vehicles) ? vehicles : [];

  const getVehicalName = (vehicle: VehicleData) => {
    // Find the model first
    const model = models.find(
      (m) => m._id.toString() === vehicle.model_id?.toString()
    );
    if (!model) return "Unknown Brand Unknown Model";

    // Then find the brand for that model
    const brand = brands.find(
      (b) => b._id.toString() === model.brand_id.toString()
    );

    const brandName = brand ? brand.brand_name : "Unknown Brand";
    const modelName = model.model_name || "Unknown Model";

    return `${brandName}    ${modelName} `;
  };

  const getModelName = (modelId: string) => {
    const model = models.find((m) => m._id.toString() === modelId);
    return model ? model.model_name : "Unknown Model";
  };

  const getBrnadName = (brandId: string) => {
    const brand = brands.find((b) => b._id.toString() === brandId);
    return brand ? brand.brand_name : "Unknown Brand";
  };

  return (
    <div className="space-y-8">
      {/* <div className="flex items-center justify-between p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Search Results</h2>
          <p className="text-muted-foreground mt-1">
            Found {total} compatible vehicle{total !== 1 ? "s" : ""} matching
            your criteria
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle className="h-4 w-4 text-green-600" />
          Verified data
        </div>
      </div> */}

      <div className="grid gap-6">
        {vehicleArray.map((vehicle) => (
          <Card
            key={vehicle._id?.toString()}
            className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-xl hover:border-primary/20 transition-all duration-300 group"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {/* {vehicle.brand_id?.toString()} {vehicle.model_id.toString()} */}
                    <div className="flex items-center gap-2">
                      <Car className="h-6 w-6 text-primary" />
                      {getVehicalName(vehicle)}
                    </div>
                    {/* {getBrnadName(vehicle.brand_id.toString())} {getModelName(vehicle.model_id.toString())} */}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">{vehicle.year}</span>
                    </div>
                    {/* <div className="flex items-center gap-1">
                      <Settings className="h-4 w-4" />
                      <span>{vehicle.powertrain_id.toString()}</span>
                    </div> */}
                  </div>
                </div>
                {/* <Badge
                  className={`${getVerificationColor(
                    vehicle.verification_id.toString()
                  )} flex items-center gap-1.5 px-3 py-1.5 font-medium`}
                >
                  {getVerificationIcon(vehicle.verification_id.toString())}
                  {vehicle.verification_id.toString()}
                </Badge> */}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* <div className="p-4 bg-muted/30 rounded-xl border border-border/30">
                <div className="flex items-center gap-2 mb-3">
                  <Fuel className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold text-foreground">
                    Fuel Compatibility
                  </h4>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div
                    className={`p-3 rounded-lg text-center transition-all ${
                      vehicle.fuel_blends_supported
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-red-50 text-red-600 border border-red-200"
                    }`}
                  >
                    <div className="font-semibold">E5</div>
                    <div className="text-xs mt-1">
                      {vehicle.fuel_blends_supported
                        ? "Compatible"
                        : "Not Compatible"}
                    </div>
                  </div>
                  <div
                    className={`p-3 rounded-lg text-center transition-all ${
                      vehicle.fuel_blends_supported
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-red-50 text-red-600 border border-red-200"
                    }`}
                  >
                    <div className="font-semibold">E10</div>
                    <div className="text-xs mt-1">
                      {vehicle.fuel_blends_supported
                        ? "Compatible"
                        : "Not Compatible"}
                    </div>
                  </div>
                  <div
                    className={`p-3 rounded-lg text-center transition-all ${
                      vehicle.fuel_blends_supported
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-red-50 text-red-600 border border-red-200"
                    }`}
                  >
                    <div className="font-semibold">E20</div>
                    <div className="text-xs mt-1">
                      {vehicle.fuel_blends_supported
                        ? "Compatible"
                        : "Not Compatible"}
                    </div>
                  </div>
                </div>
              </div> */}

              <div className="p-4 bg-muted/30 rounded-xl border border-border/30">
                <div className="flex items-center gap-2 mb-3">
                  <Fuel className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold text-foreground">
                    Fuel Compatibility
                  </h4>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {["E5", "E10", "E20"].map((fuel) => {
                    const supported = isFuelSupported(
                      vehicle.fuel_blends_supported,
                      fuel
                    );
                    return (
                      <div
                        key={fuel}
                        className={`p-3 rounded-lg text-center transition-all ${
                          supported
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-red-50 text-red-600 border border-red-200"
                        }`}
                      >
                        <div className="font-semibold">{fuel}</div>
                        <div className="text-xs mt-1">
                          {supported ? "Compatible" : "Not Compatible"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-center pt-4">
                {feedbackSubmitted[vehicle._id?.toString() || ''] ? (
                  <div className="text-center text-green-600 font-medium py-2">
                    Thanks for your feedback and support! 🙏
                  </div>
                ) : (
                  !hasClosedPopup[vehicle._id?.toString() || ''] && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        handleFeedbackClick(vehicle._id?.toString() || "")
                      }
                      className="w-full max-w-sm"
                    >
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Give Feedback on Data Accuracy
                    </Button>
                  )
                )}
              </div>

              {/* {vehicle.notes && (
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Additional Notes
                  </h4>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    {vehicle.notes}
                  </p>
                </div>
              )} */}

              {/* <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium">Source:</span>
                  <span>{vehicle.source}</span>
                  {vehicle.sourceLink && (
                    <a
                      href={vehicle.sourceLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span className="text-xs">View Source</span>
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground">
                    Was this helpful?
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRating(vehicle._id!, "up")}
                      disabled={ratingLoading === vehicle._id}
                      className="flex items-center gap-1.5 hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-colors"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span className="font-medium">
                        {vehicle.rating.thumbsUp}
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRating(vehicle._id!, "down")}
                      disabled={ratingLoading === vehicle._id}
                      className="flex items-center gap-1.5 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
                    >
                      <ThumbsDown className="h-4 w-4" />
                      <span className="font-medium">
                        {vehicle.rating.thumbsDown}
                      </span>
                    </Button>
                  </div>
                </div>
              </div> */}
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedVehicle && (
        <FeedbackDialog
          resultId={selectedVehicle}
          isOpen={true}
          onClose={handlePopupClose}
          onFeedbackSubmit={() => handleFeedbackSubmit(selectedVehicle)}
        />
      )}
    </div>
  );
}

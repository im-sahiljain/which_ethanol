"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VehicleResults } from "./vehicle-results";
import {
  ModelNames,
  type VehicleBrands,
  type VehicleData,
  type VehicleSearchFilters,
} from "@/lib/models/vehicle";

export function VehicleSearch() {
  const [filters, setFilters] = useState<VehicleSearchFilters>({});
  const [brands, setBrands] = useState<string>(" ");
  const [allBrands, setAllBrands] = useState<VehicleBrands[]>([]);
  const [allModels, setAllModels] = useState<ModelNames[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [years, setYears] = useState<VehicleData[]>([]);
  const [results, setResults] = useState<VehicleData[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [total, setTotal] = useState(0);

  // Load brands on component mount
  useEffect(() => {
    loadBrands();
  }, []);

  // Load models when brand changes
  useEffect(() => {
    if (filters.brand?.toString()) {
      loadModels(filters.brand);
    } else {
      setModels([]);
      setYears([]);
    }
  }, [filters.brand]);

  // Load years when model changes
  useEffect(() => {
    if (filters.brand && filters.model) {
      loadYears(filters.model);
    } else {
      setYears([]);
    }
  }, [filters.brand, filters.model]);

  const loadBrands = async () => {
    try {
      const response = await fetch("/api/vehicles/brands");
      const data = await response.json();
      setAllBrands(data.brands || []);
    } catch (error) {
      console.error("Failed to load brands:", error);
    }
  };

  const loadModels = async (brand_id: string) => {
    try {
      const response = await fetch(`/api/vehicles/models?brand_id=${brand_id}`);
      const data = await response.json();
      setAllModels(data.models || []);
    } catch (error) {
      console.error("Failed to load models:", error);
    }
  };

  const loadYears = async (model_id: string) => {
    try {
      // console.log("Loading years for model_id:", model_id);
      const response = await fetch(`/api/vehicles/years?model_id=${model_id}`);
      const data = await response.json();
      setYears(data.years || []);
    } catch (error) {
      console.error("Failed to load years:", error);
    }
  };

  const handleSearch = async () => {
    setLoading(true);

    try {
      // Validate required fields
      if (!filters.model) {
        throw new Error("Please select a model");
      }

      const searchParams = new URLSearchParams();
      searchParams.set("model", filters.model);
      if (filters.yearOfManufacture) {
        searchParams.set("year", filters.yearOfManufacture.toString());
      }

      const response = await fetch(`/api/vehicles/search?${searchParams}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Search failed");
      }

      // Even if the response is ok, check if we got any results
      if (!data || (Array.isArray(data) && data.length === 0)) {
        throw new Error("No vehicles found matching your criteria");
      }

      const searchResults = Array.isArray(data) ? data : [data];
      setResults(searchResults);
      setTotal(searchResults.length);
      setHasSearched(true);

      // Record search event for each result
      try {
        await Promise.all(
          searchResults.map((result) =>
            fetch("/api/stats/searches", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                vehicleYearFactId: result._id,
              }),
            })
          )
        );
      } catch (error) {
        console.error("Error recording search event:", error);
      }
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
      setTotal(0);
      setHasSearched(true); // Still show the no results message
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFilters({});
    setResults([]);
    setHasSearched(false);
    setTotal(0);
    setModels([]);
    setYears([]);
  };

  return (
    <div className="space-y-8">
      <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-xl">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Search className="h-6 w-6 text-primary" />
            </div>
            Search Vehicle Database
          </CardTitle>
          <p className="text-muted-foreground">
            Enter your vehicle details to find fuel compatibility information
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Brand
              </label>
              <Select
                value={filters.brand || ""}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    brand: value,
                    model: undefined,
                    yearOfManufacture: undefined,
                  }))
                }
              >
                <SelectTrigger className="h-12 bg-background border-border/50 hover:border-primary/50 transition-colors w-full">
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {allBrands.map((brand) => (
                    <SelectItem
                      key={brand._id.toString()}
                      value={brand._id.toString()}
                    >
                      {brand.brand_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Model
              </label>
              <Select
                value={filters.model || ""}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    model: value,
                    yearOfManufacture: undefined,
                  }))
                }
                disabled={!filters.brand}
              >
                <SelectTrigger className="h-12 bg-background border-border/50 hover:border-primary/50 transition-colors disabled:opacity-50 w-full">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {allModels.map((model) => (
                    <SelectItem
                      key={model._id.toString()}
                      value={model._id.toString()}
                    >
                      {model.model_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Year
              </label>
              <Select
                value={filters.yearOfManufacture?.toString() || ""}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    yearOfManufacture: Number.parseInt(value),
                  }))
                }
                disabled={!filters.model}
              >
                <SelectTrigger className="h-12 bg-background border-border/50 hover:border-primary/50 transition-colors disabled:opacity-50 w-full">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {[...new Set(years.map((fact) => fact.year))]
                    .sort((a, b) => b - a)
                    .map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Filter className="w-3 h-3 text-primary" />
                Fuel Type
              </label>
              <Select
                value={filters.fuelType || ""}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    fuelType: value as "E5" | "E10" | "E20",
                  }))
                }
              >
                <SelectTrigger className="h-12 bg-background border-border/50 hover:border-primary/50 transition-colors">
                  <SelectValue placeholder="Any fuel type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="E5">E5 (5% Ethanol)</SelectItem>
                  <SelectItem value="E10">E10 (10% Ethanol)</SelectItem>
                  <SelectItem value="E20">E20 (20% Ethanol)</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border/50">
            <Button
              onClick={handleSearch}
              disabled={loading}
              className="flex-1 sm:flex-none h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-5 w-5" />
                  Search
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              className="h-12 border-border/50 hover:bg-muted/50 px-6 bg-transparent"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {hasSearched && (
        <VehicleResults
          vehicle_fact={results}
          // total={total}
          loading={loading}
        />
      )}
    </div>
  );
}

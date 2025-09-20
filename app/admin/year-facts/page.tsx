"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import type { VehicleData } from "@/lib/models/vehicle";
import { useVehicleData } from "@/hooks/useVehicleData";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BrandsPage() {
  // const [brands, setBrands] = useState<VehicleBrands[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [open, setOpen] = useState(false); // State to control dialog open/close
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [selectedModel, setSelectedModel] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");

  const [facts, setFacts] = useState<VehicleData[]>([]);
  // const [duplicateGroups, setDuplicateGroups] = useState<{
  //   [key: string]: {
  //     modelName: string;
  //     year: number;
  //     count: number;
  //     entries: VehicleData[];
  //   };
  // }>({});

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
    loadModels(), loadBrands();
  }, []);

  const exportDuplicatesToExcel = () => {
    // First, find all model-year combinations that have duplicates
    const duplicateGroups = facts.reduce((acc, fact) => {
      const model = models.find(
        (m) => m._id.toString() === fact.model_id.toString()
      );
      const brand = brands.find(
        (b) => b._id.toString() === model?.brand_id.toString()
      );
      const key = `${fact.model_id}-${fact.year}`;

      if (!acc[key]) {
        acc[key] = {
          count: 1,
          modelName: model?.model_name || "N/A",
          brandName: brand?.brand_name || "N/A",
          year: fact.year,
          fuel_blends_supported: fact.fuel_blends_supported,
          E20_compliant: fact.E20_compliant,
          entries: [fact],
        };
      } else {
        acc[key].count++;
        acc[key].entries.push(fact);
      }
      return acc;
    }, {} as Record<string, any>);

    // Filter only the groups that have duplicates and create Excel rows
    const duplicateData = Object.values(duplicateGroups)
      .filter((group) => group.count > 1)
      .map((group) => ({
        "Brand Name": group.brandName,
        "Model Name": group.modelName,
        Year: group.year,
        "Number of Duplicates": group.count,
        "Fuel Blends Supported": group.fuel_blends_supported,
        "E20 Compliant": group.E20_compliant,
        "Document IDs": group.entries
          .map((e: any) => e._id?.toString())
          .join(", "),
      }));

    if (duplicateData.length === 0) {
      alert("No duplicate entries found!");
      return;
    }

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(duplicateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Duplicates");

    // Generate file name with current date
    const date = new Date().toISOString().split("T")[0];
    const fileName = `duplicate_entries_${date}.xlsx`;

    // Save file
    XLSX.writeFile(wb, fileName);
  };

  useEffect(() => {
    const fetchFacts = async () => {
      try {
        const response = await fetch("/api/vehicles/vehicle-year-facts");
        const data = await response.json();
        if (response.ok) {
          setFacts(data);
        }
      } catch (error) {
        console.error("Failed to load brands:", error);
      }
    };

    fetchFacts();
  }, []);

  // Find and log duplicate entries
  useEffect(() => {
    const duplicates = facts.reduce((acc, fact) => {
      const model = models.find(
        (m) => m._id.toString() === fact.model_id.toString()
      );
      const key = `${fact.model_id}-${fact.year}`;
      if (!acc[key]) {
        acc[key] = {
          count: 1,
          modelName: model?.model_name,
          year: fact.year,
          entries: [fact],
        };
      } else {
        acc[key].count++;
        acc[key].entries.push(fact);
      }
      return acc;
    }, {} as Record<string, { count: number; modelName: string | undefined; year: number; entries: typeof facts }>);

    // Log only the duplicates
    Object.entries(duplicates)
      .filter(([_, data]) => data.count > 1)
      .forEach(([key, data]) => {
        console.log(`Duplicate found for ${data.modelName} (${data.year}):`);
        console.log("Count:", data.count);
        console.log("Entries:", data.entries);
        console.log("---");
      });
  }, [facts, models]);

  // console.log("count of models", models.length);
  const handleDelete = async (brandId: string) => {
    if (!confirm("Are you sure you want to delete this brand?")) return;

    try {
      const response = await fetch(`/api/admin/brands/${brandId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await loadBrands(); // Reload the brands list
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete brand");
      }
    } catch (error) {
      console.error("Failed to delete brand:", error);
      alert("Failed to delete brand. Please try again.");
    }
  };

  if (vehicleLoading) {
    return <div className="p-4">Loading All Models...</div>;
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        <header className="bg-primary text-primary-foreground shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Vehicle Year Facts</h1>
            <Button
              onClick={() => router.push("/admin/brands/add")}
              className="disabled:opacity-50"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Model
            </Button>
          </div>
        </header>
        <Button variant="outline" onClick={() => router.push("/admin")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <main className="container mx-auto px-4 py-8">
          {/* Duplicate Groups Section */}
          {selectedModel !== "all" && selectedYear !== "all" && (
            <div className="mb-6">
              {(() => {
                const filtered = facts.filter(
                  (fact) =>
                    fact.model_id.toString() === selectedModel &&
                    fact.year.toString() === selectedYear
                );

                if (filtered.length > 1) {
                  const model = models.find(
                    (m) => m._id.toString() === selectedModel
                  );
                  return (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Duplicate Entries Found</AlertTitle>
                      <AlertDescription>
                        Found {filtered.length} entries for {model?.model_name}{" "}
                        (Year: {selectedYear})
                        <div className="mt-2">
                          <strong>Documents:</strong>
                          <ul className="list-disc pl-6 mt-1">
                            {filtered.map((item) => (
                              <li key={item._id?.toString()}>
                                ID: {item._id?.toString()} | E20 Compliant:{" "}
                                {item.E20_compliant} | Fuel Blends:{" "}
                                {item.fuel_blends_supported}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </AlertDescription>
                    </Alert>
                  );
                }
                return null;
              })()}
            </div>
          )}
          <div className="flex justify-between items-center mb-6">
            <Button
              onClick={exportDuplicatesToExcel}
              variant="outline"
              className="mb-4"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Export Duplicates to Excel
            </Button>
          </div>
          <div className="flex gap-4 mb-6">
            <div className="w-1/3">
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  {brands.map((brand) => (
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
            <div className="w-1/3">
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Models</SelectItem>
                  {models
                    .filter(
                      (model) =>
                        selectedBrand === "all" ||
                        model.brand_id.toString() === selectedBrand
                    )
                    .map((model) => (
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
            <div className="w-1/3">
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {Array.from(
                    new Set(facts.map((fact) => fact.year.toString()))
                  )
                    .sort((a, b) => parseInt(b) - parseInt(a))
                    .map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>_id</TableHead>
                  <TableHead>Model Name</TableHead>
                  <TableHead>Brand Name</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Fuel Blends Supported</TableHead>
                  <TableHead>E20 Compliant</TableHead>
                  <TableHead>Duplicate</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {facts
                  .filter((vehicle) => {
                    const model = models.find(
                      (m) => m._id.toString() === vehicle.model_id.toString()
                    );
                    const brand = brands.find(
                      (b) => b._id.toString() === model?.brand_id.toString()
                    );

                    const matchesBrand =
                      selectedBrand === "all" ||
                      model?.brand_id.toString() === selectedBrand;
                    const matchesModel =
                      selectedModel === "all" ||
                      vehicle.model_id.toString() === selectedModel;
                    const matchesYear =
                      selectedYear === "all" ||
                      vehicle.year.toString() === selectedYear;

                    return matchesBrand && matchesModel && matchesYear;
                  })
                  .map((vehicle: VehicleData) => {
                    const model = models.find(
                      (m) => m._id.toString() === vehicle.model_id.toString()
                    );
                    const brand = brands.find(
                      (b) => b._id.toString() === model?.brand_id.toString()
                    );

                    return (
                      <TableRow
                        key={vehicle._id?.toString()}
                        onClick={() => {
                          // setSelectedVehicle(vehicle);
                          // setOpen(true);
                        }}
                        className="cursor-pointer"
                      >
                        <TableCell className="font-medium">
                          {vehicle._id?.toString()}
                        </TableCell>
                        <TableCell>{model?.model_name || "N/A"}</TableCell>
                        <TableCell>{brand?.brand_name || "N/A"}</TableCell>
                        <TableCell>{vehicle.year}</TableCell>
                        <TableCell>{vehicle.fuel_blends_supported}</TableCell>
                        <TableCell>{vehicle.E20_compliant}</TableCell>
                        <TableCell>
                          {(() => {
                            const duplicates = facts.filter(
                              (f) =>
                                f.model_id.toString() ===
                                  vehicle.model_id.toString() &&
                                f.year === vehicle.year
                            );
                            const isDuplicate = duplicates.length > 1;
                            return isDuplicate ? (
                              <div className="flex items-center">
                                <span className="h-2 w-2 bg-red-500 rounded-full mr-2"></span>
                                <span className="text-red-500 font-medium">
                                  {duplicates.length} entries
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                                <span className="text-green-500 font-medium">
                                  No
                                </span>
                              </div>
                            );
                          })()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="mr-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(
                                `/admin/vehicles/edit/${vehicle._id?.toString()}`
                              );
                            }}
                          >
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            // onClick={(e) => {
                            //   e.stopPropagation();
                            //   handleDelete(vehicle._id?.toString());
                            // }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
    </>
  );
}

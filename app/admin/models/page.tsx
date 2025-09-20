"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import type { VehicleBrands } from "@/lib/models/vehicle";
import { format } from "date-fns";
import { useVehicleData } from "@/hooks/useVehicleData";
import { Dialog } from "@/components/ui/dialog";
import { VehicleDetailsModal } from "@/components/admin/vehicle-details-modal";

export default function BrandsPage() {
  // const [brands, setBrands] = useState<VehicleBrands[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [open, setOpen] = useState(false); // State to control dialog open/close
  const [selectedModel, setSelectedModel] = useState<(typeof models)[0] | null>(
    null
  ); // State to track selected model

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
            <h1 className="text-2xl font-bold">Models</h1>
            <Button onClick={() => router.push("/admin/brands/add")}>
              <Plus className="mr-2 h-4 w-4" /> Add Model
            </Button>
          </div>
        </header>
        <Button variant="outline" onClick={() => router.push("/admin")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <main className="container mx-auto px-4 py-8">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Model _id</TableHead>
                  <TableHead>Model Name</TableHead>
                  <TableHead>Brand _id</TableHead>
                  <TableHead>Brand Name</TableHead>
                  <TableHead>vehicle_category</TableHead>
                  <TableHead>start_year</TableHead>
                  <TableHead>start_year</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {models.map((model) => (
                  <TableRow
                    key={model._id.toString()}
                    onClick={() => {
                      setSelectedModel(model);
                      setOpen(true);
                    }}
                    className="cursor-pointer"
                  >
                    <TableCell className="font-medium">
                      {model._id.toString()}
                    </TableCell>
                    <TableCell>{model.model_name}</TableCell>
                    <TableCell>{model.brand_id.toString()}</TableCell>
                    <TableCell>
                      {
                        brands.find(
                          (brand) =>
                            brand._id.toString() === model.brand_id.toString()
                        )?.brand_name
                      }
                    </TableCell>
                    <TableCell>{model.vehicle_category}</TableCell>
                    <TableCell>{model.start_year}</TableCell>
                    <TableCell>{model.end_year || "Present"}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-2"
                        onClick={() =>
                          router.push(
                            `/admin/models/edit/${model._id.toString()}`
                          )
                        }
                      >
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(model._id.toString())}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>

      <VehicleDetailsModal
        // model={models}
        vehicle={selectedModel}
        // vehicle={null}
        isOpen={open}
        onClose={() => {
          setOpen(false);
          setSelectedModel(null);
        }}
      />
    </>
  );
}

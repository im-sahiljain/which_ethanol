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
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { VehicleBrands } from "@/lib/models/vehicle";
import { format } from "date-fns";

export default function BrandsPage() {
  const [brands, setBrands] = useState<VehicleBrands[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      const response = await fetch("/api/vehicles/brands");
      const data = await response.json();
      if (data.brands) {
        setBrands(data.brands);
      }
    } catch (error) {
      console.error("Failed to load brands:", error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return <div className="p-4">Loading brands...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Brands</h1>
          <Button onClick={() => router.push("/admin/brands/add")}>
            <Plus className="mr-2 h-4 w-4" /> Add Brand
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Brand _id</TableHead>
                <TableHead>Brand Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brands.map((brand) => (
                <TableRow key={brand._id.toString()}>
                  <TableCell>{brand._id.toString()}</TableCell>
                  <TableCell className="font-medium">
                    {brand.brand_name}
                  </TableCell>
                  <TableCell>{brand.type}</TableCell>
                  <TableCell>
                    {brand.created_at
                      ? format(new Date(brand.created_at), "do MMM yyyy")
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(`/admin/brands/edit/${brand._id}`)
                        }
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(brand._id.toString())}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}

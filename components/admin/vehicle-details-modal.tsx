"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ModelNames, VehicleData } from "@/lib/models/vehicle";

interface VehicleDetailsModalProps {
  // model: ModelNames[] | null;
  // selectedModel: ModelNames | null;
  vehicle: ModelNames | null;
  isOpen: boolean;
  onClose: () => void;
}

export function VehicleDetailsModal({
  vehicle,
  isOpen,
  onClose,
}: VehicleDetailsModalProps) {
  // console.log("vehicle in modal", vehicle);
  if (!vehicle) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogDescription></DialogDescription>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Vehicle Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="font-semibold">ID</p>
            {/* <p>{vehicle._id}</p> */}
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="font-semibold">Brand</p>
            {/* <p>{vehicle.brand.brand_name}</p> */}
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="font-semibold">Model</p>
            {/* <p>{vehicle.model.model_name}</p> */}
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="font-semibold">Year</p>
            {/* <p>{vehicle.year}</p> */}
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="font-semibold">Fuel Blends Supported</p>
            {/* <p>{vehicle.fuel_blends_supported}</p> */}
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="font-semibold">E20 Compliant</p>
            {/* <p>{vehicle.E20_compliant}</p> */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

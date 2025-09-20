import { ObjectId } from "mongodb";

export interface VehicleBrands {
  _id: ObjectId;
  brand_name: string;
  type: "Car" | "Two-Wheeler";
  country: string;
  created_at?: Date;
}

export interface ModelNames {
  _id: ObjectId;
  brand_id: ObjectId;
  model_name: string;
  vehicle_category: string;
  start_year: number;
  end_year: number;
}

export interface VehicleData {
  _id?: ObjectId;
  brand_id: ObjectId;
  model_id: ObjectId;
  powertrain_id: ObjectId;
  transmission_id: ObjectId;
  brand: string;
  model: string;
  year: number;
  yearOfManufacture: number;
  fuel_blends_supported: string; // e.g., "E5,E10"
  E20_compliant: "YES" | "NO"; // explicitly matches your data
  verification_id: ObjectId;
  verificationStatus: "verified" | "pending" | "unverified";
  createdAt: Date;
  updatedAt: Date;
  rating?: {
    thumbsUp: number;
    thumbsDown: number;
  };
}

export interface VehicleSearchFilters {
  brand?: string;
  model?: string;
  yearOfManufacture?: number;
  fuelType?: "E5" | "E10" | "E20";
}

export interface VehicleRating {
  vehicleId: string;
  userId?: string;
  rating: "up" | "down";
  timestamp: Date;
}

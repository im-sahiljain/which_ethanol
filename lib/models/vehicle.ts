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

// export interface VehicleData {
//   _id?: string;
//   brand: string;
//   model: string;
//   engineVariant: string;
//   yearOfManufacture: number;
//   fuelCompatibility: {
//     E5: boolean;
//     E10: boolean;
//     E20: boolean;
//   };
//   verificationStatus: "verified" | "pending" | "unverified";
//   source: string;
//   sourceLink?: string;
//   notes?: string;
//   rating: {
//     thumbsUp: number;
//     thumbsDown: number;
//   };
//   createdAt: Date;
//   updatedAt: Date;
// }

export interface VehicleData {
  _id?: ObjectId;
  brand_id: ObjectId;
  model_id: ObjectId;
  powertrain_id: ObjectId;
  transmission_id: ObjectId;
  year: number;
  fuel_blends_supported: string; // e.g., "E5,E10"
  E20_compliant: "YES" | "NO"; // explicitly matches your data
  verification_id: ObjectId;
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

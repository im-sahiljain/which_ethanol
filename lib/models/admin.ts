import { ObjectId } from "mongodb";

export interface AdminUser {
  _id?: string;
  username: string;
  email: string;
  passwordHash: string;
  role?: "admin" | "super_admin";
  createdAt?: Date;
  updatedAt?: Date;
  lastLogin?: Date;
}

export interface AdminSession {
  _id?: string;
  adminId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AdminVehicleFormData {
  _id?: string | ObjectId;
  brand: string;
  model: string;
  engineVariant: string;
  yearOfManufacture: number;
  fuelCompatibility: {
    E5: boolean;
    E10: boolean;
    E20: boolean;
  };
  verificationStatus: "verified" | "pending" | "unverified";
  source: string;
  sourceLink?: string;
  notes?: string;
  rating?: {
    thumbsUp: number;
    thumbsDown: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

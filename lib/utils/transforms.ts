import { ObjectId } from "mongodb";
import type { VehicleData } from "../models/vehicle";
import type { AdminVehicleFormData } from "../models/admin";
import { getDatabase } from "../mongodb";

export async function transformToFormData(
  vehicle: VehicleData
): Promise<AdminVehicleFormData> {
  const db = await getDatabase();

  // Fetch brand data
  const brand = await db
    .collection("brands")
    .findOne({ _id: vehicle.brand_id });

  // Fetch model data
  const model = await db
    .collection("models")
    .findOne({ _id: vehicle.model_id });

  // Fetch powertrain data for engine variant
  const powertrain = await db
    .collection("powertrains")
    .findOne({ _id: vehicle.powertrain_id });

  // Fetch verification data
  const verification = await db
    .collection("verifications")
    .findOne({ _id: vehicle.verification_id });

  return {
    _id: vehicle._id,
    brand: brand?.brand_name || "",
    model: model?.model_name || "",
    engineVariant: powertrain?.variant_name || "",
    yearOfManufacture: vehicle.year,
    fuelCompatibility: {
      E5: vehicle.fuel_blends_supported.includes("E5"),
      E10: vehicle.fuel_blends_supported.includes("E10"),
      E20: vehicle.E20_compliant === "YES",
    },
    verificationStatus: verification?.status || "pending",
    source: verification?.source || "",
    sourceLink: verification?.source_link || "",
    notes: verification?.notes || "",
  };
}

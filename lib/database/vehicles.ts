import { getDatabase } from "../mongodb";
import type {
  VehicleBrands,
  ModelNames,
  VehicleData,
  VehicleSearchFilters,
} from "../models/vehicle";
import { ObjectId } from "mongodb";

export async function getVehicles(
  filters: VehicleSearchFilters = {},
  limit = 50,
  skip = 0
) {
  const db = await getDatabase();
  const collection = db.collection<VehicleData>("vehicles");

  const query: any = {};

  if (filters.brand) {
    query.brand = { $regex: filters.brand, $options: "i" };
  }

  if (filters.model) {
    query.model = { $regex: filters.model, $options: "i" };
  }

  if (filters.yearOfManufacture) {
    query.yearOfManufacture = filters.yearOfManufacture;
  }

  if (filters.fuelType) {
    query[`fuelCompatibility.${filters.fuelType}`] = true;
  }

  const vehicles = await collection
    .find(query)
    .sort({ brand: 1, model: 1, yearOfManufacture: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();

  const total = await collection.countDocuments(query);

  return { vehicles, total };
}

export async function getVehicleById(id: string) {
  const db = await getDatabase();
  const collection = db.collection<VehicleData>("vehicles");

  return await collection.findOne({ _id: new ObjectId(id) });
}

export async function createVehicle(
  vehicleData: Omit<VehicleData, "_id" | "createdAt" | "updatedAt">
) {
  const db = await getDatabase();
  const collection = db.collection<VehicleData>("vehicles");

  const newVehicle = {
    ...vehicleData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await collection.insertOne(newVehicle);
  return result.insertedId;
}

export async function updateVehicle(id: string, updates: Partial<VehicleData>) {
  const db = await getDatabase();
  const collection = db.collection<VehicleData>("vehicles");

  const result = await collection.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...updates,
        updatedAt: new Date(),
      },
    }
  );

  return result.modifiedCount > 0;
}

export async function deleteVehicle(id: string) {
  const db = await getDatabase();
  const collection = db.collection<VehicleData>("vehicles");

  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

export async function updateVehicleRating(
  vehicleId: string,
  rating: "up" | "down"
) {
  const db = await getDatabase();
  const collection = db.collection<VehicleData>("vehicles");

  const updateField = rating === "up" ? "rating.thumbsUp" : "rating.thumbsDown";

  const result = await collection.updateOne(
    { _id: new ObjectId(vehicleId) },
    {
      $inc: { [updateField]: 1 },
      $set: { updatedAt: new Date() },
    }
  );

  return result.modifiedCount > 0;
}

// export async function getBrands() {
//   const db = await getDatabase()
//   const collection = db.collection<VehicleData>("vehicles")

//   const brands = await collection.distinct("brand")
//   return brands.sort()
// }

// export async function getBrands() {
//   const db = await getDatabase();
//   const collection = db.collection<VehicleBrands>("brands");
//   const brands = await collection.distinct("brand_name");
//   console.log("brands in getBrands:", brands);
//   console.log(typeof brands);
//   console.log(Array.isArray(brands));
//   console.log(typeof brands);
//   // console.log(Array.isArray(brands) brands);
//   return brands.sort();
// }

export async function getBrands(): Promise<VehicleBrands[]> {
  const db = await getDatabase();
  const collection = db.collection<VehicleBrands>("brands");

  // return the full documents, sorted by brand_name
  const brands = await collection.find().sort({ brand_name: 1 }).toArray();

  return brands;
}

export async function getAllModels(): Promise<ModelNames[]> {
  const db = await getDatabase();
  const collection = db.collection<ModelNames>("models");
  const models = await collection.find().sort({ model_name: 1 }).toArray();
  return models;
}

// export async function getModelsByBrand(brand: string) {
//   const db = await getDatabase();
//   const collection = db.collection<VehicleData>("vehicles");

//   const models = await collection.distinct("model", { brand });
//   return models.sort();
// }

export async function getModelsByBrand(
  brand_id: ObjectId
): Promise<ModelNames[]> {
  const db = await getDatabase();
  const collection = db.collection<ModelNames>("models");
  const models = await collection
    .find({ brand_id: brand_id })
    .sort({ model_name: 1 })
    .toArray();
  return models;
}

// export async function getYearsByBrandAndModel(brand: string, model: string) {
//   const db = await getDatabase();
//   const collection = db.collection<VehicleData>("vehicles");

//   const years = await collection.distinct("yearOfManufacture", {
//     brand,
//     model,
//   });
//   return years.sort((a, b) => b - a); // Sort descending (newest first)
// }

// export async function getYearsByBrandAndModel(
//   model_id: ObjectId
// ): Promise<VehicleData[]> {
//   console.log("model_id in getYearsByBrandAndModel", model_id);
//   const db = await getDatabase();
//   const collection = db.collection<VehicleData>("vehicle_year_facts");

//   const vehicleYearFacts = await collection
//     .find({
//       model_id: model_id,
//     })
//     .toArray();
//   console.log("vehicleYearFacts in getYearsByBrandAndModel", vehicleYearFacts);
//   return vehicleYearFacts.sort((a, b) => b.year - a.year);
// }

export async function getYearsByBrandAndModel(
  model_id: string | ObjectId
): Promise<VehicleData[]> {
  const db = await getDatabase();
  const collection = db.collection<VehicleData>("vehicle_year_facts");

  // Ensure model_id is an ObjectId
  const modelObjectId =
    typeof model_id === "string" ? new ObjectId(model_id) : model_id;
  console.log("Querying with modelObjectId:", modelObjectId);

  const vehicleYearFacts = await collection
    .find({ model_id: modelObjectId })
    .sort({ year: -1 })
    .toArray();

  return vehicleYearFacts;
}

export async function getVehicleFacts(): Promise<VehicleData[]> {
  const db = await getDatabase();
  const collection = db.collection<VehicleData>("vehicle_year_facts");

  const vehicleFacts = await collection
    .aggregate([
      {
        $lookup: {
          from: "brands",
          localField: "brand_id",
          foreignField: "_id",
          as: "brand",
        },
      },
      {
        $unwind: "$brand",
      },
      {
        $lookup: {
          from: "models",
          localField: "model_id",
          foreignField: "_id",
          as: "model",
        },
      },
      {
        $unwind: "$model",
      },
      {
        $project: {
          _id: 1,
          model_id: "$model_id",
          powertrain_id: "$powertrain_id",
          transmission_id: "$transmission_id",
          year: 1,
          fuel_blends_supported: 1,
          E20_compliant: 1,
          "brand.brand_name": 1,
          "model.model_name": 1,
        },
      },
    ])
    .toArray();

  return vehicleFacts as VehicleData[];
}

import { getDatabase } from "../mongodb";
import type { VehicleData } from "../models/vehicle";

export interface DashboardStats {
  totalVehicles: number;
  verifiedRecords: number;
  pendingRecords: number;
  unverifiedRecords: number;
  totalRatings: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  type: "vehicle_added" | "vehicle_updated" | "vehicle_rated";
  description: string;
  timestamp: Date;
  vehicleInfo?: {
    brand: string;
    model: string;
    year: number;
  };
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const db = await getDatabase();
  const vehiclesCollection = db.collection<VehicleData>("vehicles");

  // Get total vehicles
  const totalVehicles = await vehiclesCollection.countDocuments();

  // Get verification status counts
  const verifiedRecords = await vehiclesCollection.countDocuments({
    verificationStatus: "verified",
  });
  const pendingRecords = await vehiclesCollection.countDocuments({
    verificationStatus: "pending",
  });
  const unverifiedRecords = await vehiclesCollection.countDocuments({
    verificationStatus: "unverified",
  });

  // Get total ratings
  const ratingsPipeline = [
    {
      $group: {
        _id: null,
        totalThumbsUp: { $sum: "$rating.thumbsUp" },
        totalThumbsDown: { $sum: "$rating.thumbsDown" },
      },
    },
  ];

  const ratingsResult = await vehiclesCollection
    .aggregate(ratingsPipeline)
    .toArray();
  const totalRatings = ratingsResult[0]
    ? ratingsResult[0].totalThumbsUp + ratingsResult[0].totalThumbsDown
    : 0;

  // Get recent activity (last 10 updated vehicles)
  const recentVehicles = await vehiclesCollection
    .find({})
    .sort({ updatedAt: -1 })
    .limit(10)
    .toArray();

  const recentActivity: ActivityItem[] = recentVehicles.map((vehicle) => ({
    type: "vehicle_updated",
    description: `${vehicle.brand} ${vehicle.model} (${vehicle.yearOfManufacture}) was updated`,
    timestamp: vehicle.updatedAt,
    vehicleInfo: {
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.yearOfManufacture,
    },
  }));

  return {
    totalVehicles,
    verifiedRecords,
    pendingRecords,
    unverifiedRecords,
    totalRatings,
    recentActivity,
  };
}

export async function getVehiclesByStatus(
  status: "verified" | "pending" | "unverified",
  limit = 20
) {
  const db = await getDatabase();
  const collection = db.collection<VehicleData>("vehicles");

  return await collection
    .find({ verificationStatus: status })
    .sort({ updatedAt: -1 })
    .limit(limit)
    .toArray();
}

export async function getBrandStats() {
  const db = await getDatabase();
  const collection = db.collection<VehicleData>("vehicles");

  const pipeline = [
    {
      $group: {
        _id: "$brand",
        count: { $sum: 1 },
        verified: {
          $sum: {
            $cond: [{ $eq: ["$verificationStatus", "verified"] }, 1, 0],
          },
        },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ];

  return await collection.aggregate(pipeline).toArray();
}

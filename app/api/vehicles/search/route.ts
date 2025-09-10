import { type NextRequest, NextResponse } from "next/server";
import { getVehicles } from "@/lib/database/vehicles";
import type { VehicleData, VehicleSearchFilters } from "@/lib/models/vehicle";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const filters: VehicleSearchFilters = {};

    if (searchParams.get("model")) {
      filters.model = searchParams.get("model")!;
    }

    if (searchParams.get("year")) {
      filters.yearOfManufacture = Number.parseInt(searchParams.get("year")!);
    }

    console.log("filters in GET", filters);

    const db = await getDatabase();
    const collection = db.collection<VehicleData>("vehicle_year_facts");

    const modelObjectId =
      typeof filters.model === "string"
        ? new ObjectId(filters.model)
        : filters.model;

    console.log("Querying with modelObjectId:", modelObjectId);

    const result = await collection
      .find({
        model_id: modelObjectId,
        year: filters.yearOfManufacture,
      })
      .toArray();

    console.log("result in search get", result);

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Failed to search vehicles" },
      { status: 500 }
    );
  }
}

// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url);

//     const filters: VehicleSearchFilters = {};

//     // if (searchParams.get("brand")) {
//     //   filters.brand = searchParams.get("brand")!
//     // }

//     if (searchParams.get("model")) {
//       filters.model = searchParams.get("model")!;
//     }

//     if (searchParams.get("year")) {
//       filters.yearOfManufacture = Number.parseInt(searchParams.get("year")!);
//     }

//     console.log("filters in GET", filters);

//     // if (searchParams.get("fuelType")) {
//     //   filters.fuelType = searchParams.get("fuelType") as "E5" | "E10" | "E20"
//     // }

//     const db = await getDatabase();
//     const collection = db.collection<VehicleData>("vehicle_year_facts");

//     const modelObjectId =
//       typeof filters.model === "string"
//         ? new ObjectId(filters.model)
//         : filters.model;
//     console.log("Querying with modelObjectId:", modelObjectId);

//     const result = await collection.find({
//       model_id: modelObjectId,
//       year: filters.yearOfManufacture,
//     });

//     // const limit = Number.parseInt(searchParams.get("limit") || "50");
//     // const skip = Number.parseInt(searchParams.get("skip") || "0");

//     // const result = await getVehicles(filters, limit, skip);

//     return NextResponse.json(result);
//   } catch (error) {
//     console.error("Search API error:", error);
//     return NextResponse.json(
//       { error: "Failed to search vehicles" },
//       { status: 500 }
//     );
//   }
// }

import { type NextRequest, NextResponse } from "next/server";
import { getVehicles } from "@/lib/database/vehicles";
import type { VehicleData, VehicleSearchFilters } from "@/lib/models/vehicle";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Validate required parameters
    const model = searchParams.get("model");
    const year = searchParams.get("year");

    if (!model) {
      return NextResponse.json(
        { error: "Model parameter is required" },
        { status: 400 }
      );
    }

    // Convert and validate year if provided
    let yearNumber: number | undefined;
    if (year) {
      yearNumber = Number.parseInt(year);
      if (isNaN(yearNumber)) {
        return NextResponse.json(
          { error: "Invalid year parameter" },
          { status: 400 }
        );
      }
    }

    try {
      const modelObjectId = new ObjectId(model);

      const db = await getDatabase();
      const collection = db.collection<VehicleData>("vehicle_year_facts");

      const query: any = { model_id: modelObjectId };
      if (yearNumber) {
        query.year = yearNumber;
      }

      const result = await collection.find(query).toArray();

      if (!result || result.length === 0) {
        return NextResponse.json(
          { error: "No vehicles found matching the criteria" },
          { status: 404 }
        );
      }

      // Return all matching results, not just the first one
      return NextResponse.json(result);
    } catch (error) {
      if (error instanceof Error && error.message.includes("ObjectId")) {
        return NextResponse.json(
          { error: "Invalid model ID format" },
          { status: 400 }
        );
      }
      throw error; // Re-throw to be caught by outer catch
    }
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

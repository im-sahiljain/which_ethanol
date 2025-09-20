import { type NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { VehicleData } from "@/lib/models/vehicle";

export async function GET() {
  try {
    const db = await getDatabase();
    const collection = db.collection<VehicleData>("vehicle_year_facts");

    const data = await collection.find({}).toArray();

    // Return the array directly
    return NextResponse.json(data);
  } catch (error) {
    console.error("Years API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch years" },
      { status: 500 }
    );
  }
}

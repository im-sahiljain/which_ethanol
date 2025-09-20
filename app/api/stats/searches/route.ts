import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import type { Search } from "@/lib/models/searches";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { vehicleYearFactId } = body;

    if (!vehicleYearFactId) {
      return NextResponse.json(
        { error: "Missing vehicleYearFactId" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection<Search>("searches");

    const now = new Date();

    // Add timestamp to the array for this vehicleYearFactId
    const result = await collection.findOneAndUpdate(
      { vehicleYearFactId },
      {
        $push: { timestamps: now },
      },
      {
        upsert: true,
        returnDocument: "after",
      }
    );

    if (!result) {
      throw new Error("Failed to update search stats");
    }

    return NextResponse.json({ success: true, stats: result });
  } catch (error) {
    console.error("Error recording search stats:", error);
    return NextResponse.json(
      { error: "Failed to record search stats" },
      { status: 500 }
    );
  }
}

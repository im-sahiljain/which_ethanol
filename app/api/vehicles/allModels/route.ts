import { ObjectId } from "mongodb";
import { type NextRequest, NextResponse } from "next/server";
import { getAllModels, getModelsByBrand } from "@/lib/database/vehicles";

export async function GET(request: NextRequest) {
  try {
    const models = await getAllModels();
    return NextResponse.json({ models });
  } catch (error) {
    console.error("Models API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch all models" },
      { status: 500 }
    );
  }
}

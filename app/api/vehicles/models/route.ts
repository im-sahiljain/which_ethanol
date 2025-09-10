import { ObjectId } from "mongodb";
import { type NextRequest, NextResponse } from "next/server";
import { getModelsByBrand } from "@/lib/database/vehicles";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const brand_id = searchParams.get("brand_id");
    if (!brand_id) {
      return NextResponse.json(
        { error: "Brand parameter is required" },
        { status: 400 }
      );
    }

    const objectId = new ObjectId(brand_id);
    const models = await getModelsByBrand(objectId);

    return NextResponse.json({ models });
  } catch (error) {
    console.error("Models API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch models" },
      { status: 500 }
    );
  }
}

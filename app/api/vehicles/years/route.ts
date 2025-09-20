import { type NextRequest, NextResponse } from "next/server";
import { getYearsByBrandAndModel } from "@/lib/database/vehicles";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const modelId = searchParams.get("model_id");
    // console.log("Year Get Model Id", modelId);
    if (!modelId) {
      return NextResponse.json(
        { error: "Brand and model parameters are required" },
        { status: 400 }
      );
    }

    const modelObjId = new ObjectId(modelId);
    const years = await getYearsByBrandAndModel(modelObjId);
    return NextResponse.json({ years });
  } catch (error) {
    console.error("Years API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch years" },
      { status: 500 }
    );
  }
}

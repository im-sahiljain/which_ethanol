import { type NextRequest, NextResponse } from "next/server";
import { getVehicleFacts } from "@/lib/database/vehicles";
import { verifyAdminToken } from "@/lib/database/admin";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("admin_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const admin = await verifyAdminToken(token);
    if (!admin) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const vehicles = await getVehicleFacts();
    return NextResponse.json(vehicles);
  } catch (error) {
    console.error("Admin all-vehicles API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch vehicles" },
      { status: 500 }
    );
  }
}

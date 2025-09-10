import { type NextRequest, NextResponse } from "next/server";
import { getDashboardStats } from "@/lib/database/stats";
import { verifyAdminToken } from "@/lib/database/admin";
import { getVehicleFacts } from "@/lib/database/vehicles";

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

    // const stats = await getDashboardStats()
    const stats = await getVehicleFacts();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Stats API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}

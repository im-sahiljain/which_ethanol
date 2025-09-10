import { type NextRequest, NextResponse } from "next/server"
import { verifyAdminToken } from "@/lib/database/admin"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("admin_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const admin = await verifyAdminToken(token)

    if (!admin) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    return NextResponse.json({ admin })
  } catch (error) {
    console.error("Admin me API error:", error)
    return NextResponse.json({ error: "Failed to get admin info" }, { status: 500 })
  }
}

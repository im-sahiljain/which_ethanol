import { type NextRequest, NextResponse } from "next/server"
import { logoutAdmin } from "@/lib/database/admin"

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("admin_token")?.value

    if (token) {
      await logoutAdmin(token)
    }

    const response = NextResponse.json({ success: true })
    response.cookies.delete("admin_token")

    return response
  } catch (error) {
    console.error("Logout API error:", error)
    return NextResponse.json({ error: "Logout failed" }, { status: 500 })
  }
}

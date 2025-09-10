import { type NextRequest, NextResponse } from "next/server"
import { authenticateAdmin } from "@/lib/database/admin"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

    const result = await authenticateAdmin(username, password)

    if (!result) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    return NextResponse.json({
      admin: result.admin,
      token: result.token,
    })
  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { verifyAdminToken } from "../database/admin"

export async function requireAdmin(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  const admin = await verifyAdminToken(token)
  if (!admin) {
    const response = NextResponse.redirect(new URL("/admin/login", request.url))
    response.cookies.delete("admin_token")
    return response
  }

  return null // Continue to the protected route
}

export async function getAdminFromRequest(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value

  if (!token) {
    return null
  }

  return await verifyAdminToken(token)
}

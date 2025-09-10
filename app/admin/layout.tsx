import type React from "react"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { verifyAdminToken } from "@/lib/database/admin"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")?.value

  // Allow access to login page without authentication
  if (!token) {
    return <>{children}</>
  }

  const admin = await verifyAdminToken(token)
  if (!admin) {
    redirect("/admin/login")
  }

  return <>{children}</>
}

import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { verifyAdminToken } from "@/lib/database/admin"
import { getVehicleById } from "@/lib/database/vehicles"
import { VehicleForm } from "@/components/admin/vehicle-form"

interface EditVehiclePageProps {
  params: Promise<{ id: string }>
}

export default async function EditVehiclePage({ params }: EditVehiclePageProps) {
  const { id } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")?.value

  if (!token) {
    redirect("/admin/login")
  }

  const admin = await verifyAdminToken(token)
  if (!admin) {
    redirect("/admin/login")
  }

  const vehicle = await getVehicleById(id)
  if (!vehicle) {
    redirect("/admin")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Edit Vehicle</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <VehicleForm vehicle={vehicle} />
      </main>
    </div>
  )
}

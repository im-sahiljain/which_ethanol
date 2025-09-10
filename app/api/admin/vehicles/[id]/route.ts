import { type NextRequest, NextResponse } from "next/server"
import { getVehicleById, updateVehicle, deleteVehicle } from "@/lib/database/vehicles"
import { verifyAdminToken } from "@/lib/database/admin"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const token = request.cookies.get("admin_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const admin = await verifyAdminToken(token)
    if (!admin) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const vehicle = await getVehicleById(id)
    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 })
    }

    return NextResponse.json(vehicle)
  } catch (error) {
    console.error("Get vehicle API error:", error)
    return NextResponse.json({ error: "Failed to fetch vehicle" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const token = request.cookies.get("admin_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const admin = await verifyAdminToken(token)
    if (!admin) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const updates = await request.json()

    // Validate required fields if provided
    const requiredFields = ["brand", "model", "engineVariant", "yearOfManufacture", "source"]
    for (const field of requiredFields) {
      if (updates[field] !== undefined && !updates[field]) {
        return NextResponse.json({ error: `${field} cannot be empty` }, { status: 400 })
      }
    }

    // Validate fuel compatibility if provided
    if (updates.fuelCompatibility) {
      const { fuelCompatibility } = updates
      if (!fuelCompatibility.E5 && !fuelCompatibility.E10 && !fuelCompatibility.E20) {
        return NextResponse.json({ error: "At least one fuel compatibility must be selected" }, { status: 400 })
      }
    }

    const success = await updateVehicle(id, updates)
    if (!success) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update vehicle API error:", error)
    return NextResponse.json({ error: "Failed to update vehicle" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const token = request.cookies.get("admin_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const admin = await verifyAdminToken(token)
    if (!admin) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const success = await deleteVehicle(id)
    if (!success) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete vehicle API error:", error)
    return NextResponse.json({ error: "Failed to delete vehicle" }, { status: 500 })
  }
}

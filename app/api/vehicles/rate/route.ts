import { type NextRequest, NextResponse } from "next/server"
import { updateVehicleRating } from "@/lib/database/vehicles"

export async function POST(request: NextRequest) {
  try {
    const { vehicleId, rating } = await request.json()

    if (!vehicleId || !rating || !["up", "down"].includes(rating)) {
      return NextResponse.json({ error: "Invalid vehicleId or rating" }, { status: 400 })
    }

    const success = await updateVehicleRating(vehicleId, rating)

    if (!success) {
      return NextResponse.json({ error: "Failed to update rating" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Rating API error:", error)
    return NextResponse.json({ error: "Failed to update rating" }, { status: 500 })
  }
}

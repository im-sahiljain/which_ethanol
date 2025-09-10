// import { type NextRequest, NextResponse } from "next/server";
// import { getVehicles, createVehicle } from "@/lib/database/vehicles";
// import { verifyAdminToken } from "@/lib/database/admin";

// export async function POST(request: NextRequest) {
//   try {
//     const token = request.cookies.get("admin_token")?.value;

//     if (!token) {
//       return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
//     }

//     const admin = await verifyAdminToken(token);
//     if (!admin) {
//       return NextResponse.json({ error: "Invalid token" }, { status: 401 });
//     }

//     const vehicleData = await request.json();

//     // Validate required fields
//     const requiredFields = [
//       "brand",
//       "model",
//       "engineVariant",
//       "yearOfManufacture",
//       "source",
//     ];
//     for (const field of requiredFields) {
//       if (!vehicleData[field]) {
//         return NextResponse.json(
//           { error: `${field} is required` },
//           { status: 400 }
//         );
//       }
//     }

//     // Ensure at least one fuel compatibility is selected
//     const { fuelCompatibility } = vehicleData;
//     if (
//       !fuelCompatibility.E5 &&
//       !fuelCompatibility.E10 &&
//       !fuelCompatibility.E20
//     ) {
//       return NextResponse.json(
//         { error: "At least one fuel compatibility must be selected" },
//         { status: 400 }
//       );
//     }

//     // Add rating initialization
//     const newVehicleData = {
//       ...vehicleData,
//       rating: { thumbsUp: 0, thumbsDown: 0 },
//     };

//     const vehicleId = await createVehicle(newVehicleData);
//     return NextResponse.json({ success: true, vehicleId });
//   } catch (error) {
//     console.error("Create vehicle API error:", error);
//     return NextResponse.json(
//       { error: "Failed to create vehicle" },
//       { status: 500 }
//     );
//   }
// }

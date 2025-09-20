// "use client"

// import { useState, useEffect } from "react"
// import {
//   Table,
//   TableHeader,
//   TableRow,
//   TableHead,
//   TableBody,
//   TableCell,
// } from "@/components/ui/table"
// import { Card, CardContent } from "@/components/ui/card"
// import { VehicleDetailsModal } from "./vehicle-details-modal"
// import type { VehicleData } from "@/lib/models/vehicle"

// export function VehicleListTable() {
//   const [vehicles, setVehicles] = useState<VehicleData[]>([])
//   const [loading, setLoading] = useState(true)
//   const [selectedVehicle, setSelectedVehicle] = useState<VehicleData | null>(null)
//   const [isModalOpen, setIsModalOpen] = useState(false)

//   useEffect(() => {
//     const fetchVehicles = async () => {
//       setLoading(true)
//       try {
//         const response = await fetch("/api/admin/all-vehicles")
//         if (response.ok) {
//           const data = await response.json()
//           setVehicles(data)
//         }
//       } catch (error) {
//         console.error("Failed to fetch vehicles:", error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchVehicles()
//   }, [])

//   const handleRowClick = (vehicle: VehicleData) => {
//     setSelectedVehicle(vehicle)
//     setIsModalOpen(true)
//   }

//   const handleCloseModal = () => {
//     setIsModalOpen(false)
//     setSelectedVehicle(null)
//   }

//   if (loading) {
//     return (
//       <Card>
//         <CardContent className="py-8">
//           <div className="text-center text-muted-foreground">Loading vehicles...</div>
//         </CardContent>
//       </Card>
//     )
//   }

//   return (
//     <>
//       <Card>
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Brand</TableHead>
//               <TableHead>Model</TableHead>
//               <TableHead>Year</TableHead>
//               <TableHead>Fuel Blends</TableHead>
//               <TableHead>E20 Compliant</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {vehicles.map((vehicle) => (
//               <TableRow key={vehicle._id} onClick={() => handleRowClick(vehicle)} className="cursor-pointer">
//                 <TableCell>{vehicle.brand.brand_name}</TableCell>
//                 <TableCell>{vehicle.model.model_name}</TableCell>
//                 <TableCell>{vehicle.year}</TableCell>
//                 <TableCell>{vehicle.fuel_blends_supported}</TableCell>
//                 <TableCell>{vehicle.E20_compliant}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </Card>
//       <VehicleDetailsModal
//         vehicle={selectedVehicle}
//         isOpen={isModalOpen}
//         onClose={handleCloseModal}
//       />
//     </>
//   )
// }

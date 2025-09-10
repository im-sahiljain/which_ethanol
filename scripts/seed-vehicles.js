// Sample data seeding script for vehicle fuel compatibility database
import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
const client = new MongoClient(uri)

const sampleVehicles = [
  {
    brand: "Toyota",
    model: "Camry",
    engineVariant: "2.5L 4-Cylinder",
    yearOfManufacture: 2023,
    fuelCompatibility: { E5: true, E10: true, E20: false },
    verificationStatus: "verified",
    source: "Toyota Official Documentation",
    sourceLink: "https://toyota.com/fuel-specs",
    notes: "Standard gasoline engine compatible with E5 and E10",
    rating: { thumbsUp: 0, thumbsDown: 0 },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    brand: "Honda",
    model: "Civic",
    engineVariant: "1.5L Turbo",
    yearOfManufacture: 2022,
    fuelCompatibility: { E5: true, E10: true, E20: true },
    verificationStatus: "verified",
    source: "Honda Technical Manual",
    sourceLink: "https://honda.com/specifications",
    notes: "Turbocharged engine with flex-fuel capability",
    rating: { thumbsUp: 0, thumbsDown: 0 },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    brand: "Ford",
    model: "F-150",
    engineVariant: "3.5L EcoBoost V6",
    yearOfManufacture: 2023,
    fuelCompatibility: { E5: true, E10: true, E20: true },
    verificationStatus: "verified",
    source: "Ford Owner Manual",
    sourceLink: "https://ford.com/support/manuals",
    notes: "EcoBoost engine supports higher ethanol blends",
    rating: { thumbsUp: 0, thumbsDown: 0 },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    brand: "BMW",
    model: "3 Series",
    engineVariant: "2.0L TwinPower Turbo",
    yearOfManufacture: 2021,
    fuelCompatibility: { E5: true, E10: true, E20: false },
    verificationStatus: "pending",
    source: "BMW Service Documentation",
    notes: "Premium fuel recommended, limited ethanol compatibility",
    rating: { thumbsUp: 0, thumbsDown: 0 },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    brand: "Chevrolet",
    model: "Silverado",
    engineVariant: "5.3L V8",
    yearOfManufacture: 2022,
    fuelCompatibility: { E5: true, E10: true, E20: true },
    verificationStatus: "verified",
    source: "GM Technical Bulletin",
    sourceLink: "https://gm.com/technical-docs",
    notes: "FlexFuel capable V8 engine",
    rating: { thumbsUp: 0, thumbsDown: 0 },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

async function seedDatabase() {
  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db("vehicle_fuel_db")
    const collection = db.collection("vehicles")

    // Clear existing data
    await collection.deleteMany({})
    console.log("Cleared existing vehicle data")

    // Insert sample data
    const result = await collection.insertMany(sampleVehicles)
    console.log(`Inserted ${result.insertedCount} sample vehicles`)

    // Create indexes for better performance
    await collection.createIndex({ brand: 1, model: 1, yearOfManufacture: -1 })
    await collection.createIndex({ brand: 1 })
    await collection.createIndex({ model: 1 })
    await collection.createIndex({ yearOfManufacture: -1 })
    await collection.createIndex({ verificationStatus: 1 })

    console.log("Created database indexes")
    console.log("Database seeding completed successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await client.close()
  }
}

seedDatabase()

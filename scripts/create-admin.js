// Script to create the first admin user
import { MongoClient } from "mongodb"
import bcrypt from "bcryptjs"

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
const client = new MongoClient(uri)

async function createFirstAdmin() {
  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db("vehicle_fuel_db")
    const collection = db.collection("admins")

    // Check if any admin exists
    const existingAdmin = await collection.findOne({})
    if (existingAdmin) {
      console.log("Admin user already exists!")
      return
    }

    // Create first admin
    const passwordHash = await bcrypt.hash("admin123", 12)

    const adminUser = {
      username: "admin",
      email: "admin@fuelcheck.com",
      passwordHash,
      role: "super_admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await collection.insertOne(adminUser)
    console.log("First admin user created successfully!")
    console.log("Username: admin")
    console.log("Password: admin123")
    console.log("Please change the password after first login!")
  } catch (error) {
    console.error("Error creating admin:", error)
  } finally {
    await client.close()
  }
}

createFirstAdmin()

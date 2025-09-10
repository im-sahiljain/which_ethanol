import { MongoClient, ObjectId } from "mongodb";
import fs from "fs";

// === CONFIGURATION ===
const MONGODB_URI = "mongodb+srv://whichEthanol:WhichEthanol@cluster.7qwu2ui.mongodb.net/?retryWrites=true&w=majority&appName=Cluster";
const DATABASE_NAME = "Which_Ethanol";
const COLLECTION_NAME = "brands";
const JSON_FILE_PATH = "/home/sahil/project/vehicle-fuel-app/data/mongo_brands.json"; // Path to your JSON file

async function main() {
    // Read and parse JSON file
    const rawData = fs.readFileSync(JSON_FILE_PATH, "utf-8");
    let documents = JSON.parse(rawData);

    // Ensure documents is an array
    if (!Array.isArray(documents)) {
        documents = [documents];
    }

    // Overwrite _id with generated ObjectId
    documents = documents.map(doc => ({
        ...doc,
        _id: new ObjectId()
    }));

    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Insert documents
    const result = await collection.insertMany(documents);
    console.log(`Inserted ${result.insertedCount} documents.`);

    await client.close();
}

main().catch(err => {
    console.error("Error uploading data:", err);
    process.exit(1);
});
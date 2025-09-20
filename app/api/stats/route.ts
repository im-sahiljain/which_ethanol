import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import type { Stats } from "@/lib/models/stats";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, event } = body;

    if (!type || !event) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection<Stats>("stats");

    // Find existing stats document for this type or create new one
    const now = new Date();
    const result = await collection.findOneAndUpdate(
      { type },
      {
        $push: { events: event },
        $setOnInsert: { createdAt: now },
        $set: { updatedAt: now },
      },
      {
        upsert: true,
        returnDocument: "after",
      }
    );

    if (!result) {
      throw new Error("Failed to update stats");
    }

    return NextResponse.json({ success: true, stats: result });
  } catch (error) {
    console.error("Error recording stats:", error);
    return NextResponse.json(
      { error: "Failed to record stats" },
      { status: 500 }
    );
  }
}

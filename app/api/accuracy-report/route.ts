import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import {
  IAccuracyReport,
  IAccuracyEvent,
  COLLECTION_NAME,
} from "@/lib/models/accuracy";

export async function POST(request: Request) {
  try {
    const { resultId, type, inaccuracies, comment } = await request.json();

    if (!resultId || !type || !["confirm", "report"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid request parameters" },
        { status: 400 }
      );
    }

    // For now, we'll use a placeholder userId. In a real app, this would come from auth
    const userId = "anonymous";

    const db = await getDatabase();
    const accuracyReports = db.collection<IAccuracyReport>(COLLECTION_NAME);

    const newEvent: IAccuracyEvent = {
      timestamp: new Date(),
      userId,
      type: type as "confirm" | "report",
      inaccuracies: type === "report" ? inaccuracies : undefined,
      comment: type === "report" ? comment : undefined,
    };

    // Try to update existing report
    const result = await accuracyReports.findOneAndUpdate(
      { resultId },
      {
        $push: { events: newEvent },
        $set: { lastUpdated: new Date() },
      },
      {
        upsert: true,
        returnDocument: "after",
      }
    );

    console.log("Accuracy report updated:", result);

    return NextResponse.json(
      {
        message: "Accuracy report submitted successfully",
        report: result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting accuracy report:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to submit accuracy report",
      },
      { status: 500 }
    );
  }
}

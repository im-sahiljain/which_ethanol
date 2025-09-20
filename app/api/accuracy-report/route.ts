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

    if (
      !resultId ||
      !type ||
      !["confirm", "report", "not-sure"].includes(type)
    ) {
      return NextResponse.json(
        { error: "Invalid request parameters" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const accuracyReports = db.collection<IAccuracyReport>(COLLECTION_NAME);

    const newEvent: IAccuracyEvent = {
      timestamp: new Date(),
      type: type as "confirm" | "report" | "not-sure",
      inaccuracies: type === "report" ? inaccuracies : undefined,
      comment: type === "report" ? comment : undefined,
    };

    const update: any = {
      $push: { events: newEvent },
      $set: { lastUpdated: new Date() },
    };

    switch (type) {
      case "confirm":
        update.$inc = { accurate: 1 };
        break;
      case "report":
        update.$inc = { notAccurate: 1 };
        break;
      case "not-sure":
        update.$inc = { notSure: 1 };
        break;
    }

    // Try to update existing report
    const result = await accuracyReports.findOneAndUpdate(
      { resultId },
      update,
      {
        upsert: true,
        returnDocument: "after",
      }
    );

    // console.log("Accuracy report updated:", result);

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

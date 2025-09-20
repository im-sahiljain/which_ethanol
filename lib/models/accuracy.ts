import { ObjectId } from "mongodb";

export interface IAccuracyEvent {
  timestamp: Date; // when the user clicked
  userId: string; // who clicked
  type: "confirm" | "report"; // accuracy type
  inaccuracies?: string[]; // e.g., ["E5", "E10"]
  comment?: string; // user's comment about the inaccuracy
}

export interface IAccuracyReport {
  _id?: ObjectId;
  resultId: string; // which result this is for
  events: IAccuracyEvent[]; // array of clicks
  lastUpdated: Date; // for quick sorting/filtering
}

export const COLLECTION_NAME = "accuracy_reports";

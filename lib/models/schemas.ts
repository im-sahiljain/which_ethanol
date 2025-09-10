import mongoose, { Document, Model, Schema } from "mongoose";

const vehicleSchema = new Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  engineVariant: { type: String, required: true },
  yearOfManufacture: { type: Number, required: true },
});

const Vehicle =
  mongoose.models.Vehicle || mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;

export const brandSchema = new mongoose.Schema({
  brand_name: { type: String, required: true },
  type: { type: String, required: true },
  country: { type: String, required: true },
});

export const Brands =
  mongoose.models.Brand || mongoose.model("brands", brandSchema);

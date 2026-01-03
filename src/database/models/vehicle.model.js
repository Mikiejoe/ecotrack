import { Schema, model } from "mongoose";
const vehicleSchema = new Schema(
  {
    vin: { type: String, required: true, unique: true, index: true },
    make: { type: String, required: true },
    modelName: { type: String, required: true },
    year: { type: Number, required: true },
    status: {
      type: String,
      enum: ["active", "maintenance", "retired"],
      default: "active",
    },
    lastTemperature: { type: Number, default: 0 },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true },
    },
  },
  { timestamps: true }
);
vehicleSchema.index({ location: "2dsphere" });
export const VehicleModel = model("Vehicle", vehicleSchema);

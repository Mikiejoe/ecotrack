import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Types.ObjectId,
      ref: "Vehicle",
    },
    driver: {
      type: mongoose.Types.ObjectId,
      ref: "Driver",
    },
    destination: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true },
    },
    currentPoint:{
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number]},
    },
    startPoint: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true },
    },
    status: {
      type: String,
      enum: ["completed", "in-progress", "forfeited"],
      default: "in-progress",
    },
  },
  {
    timestamps: true,
  }
);

export const TripModel = new mongoose.model("Trip", tripSchema);

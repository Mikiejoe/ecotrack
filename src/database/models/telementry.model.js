import mongoose from "mongoose";

const telementrySchema = new mongoose.Schema(
  {
    temperature: {
      type: Number,
      default: 0,
    },
    fuel: {
      type: Number,
      default: 0,
    },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true },
    },
    vehicle: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const alertsSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    vehicle: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const TelementryModel = mongoose.model("Telementry", telementrySchema);
export const AlertModel = mongoose.model("Alert",alertsSchema)
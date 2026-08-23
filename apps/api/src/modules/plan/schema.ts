import { Schema, model } from "mongoose";

const PlanSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      enum: ["TRIAL", "BASIC", "PRO", "ENTERPRISE"],
    },
    name: { type: String, required: true }, // e.g. "Pro Tier"
    description: { type: String, default: "" },
    limits: {
      maxEmployees: { type: Number, required: true, default: 5 }, // -1 for unlimited
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Plan = model("Plan", PlanSchema);
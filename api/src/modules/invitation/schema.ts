import mongoose from "mongoose";

const invitationSchema = new mongoose.Schema(
  {
    tenantId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "manager", "team-leader", "employee"],
      default: "employee",
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    invitedBy: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expires in 7 days
    },
  },
  { timestamps: true }
);

invitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const InvitationModel = mongoose.model("Invitation", invitationSchema);
import { Schema, model, Types } from "mongoose";
import { NotificationType } from "./interfaces";

const notificationSchema = new Schema(
  {
    tenantId: {
      type: Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },

    recipientId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    actorId: {
      type: Types.ObjectId,
      ref: "User",
    },

    entityType: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },

    entityId: {
      type: String,
      required: false,
      default: null,
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    readAt: Date,
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({
  recipientId: 1,
  isRead: 1,
  createdAt: -1,
});

export default model("Notification", notificationSchema);
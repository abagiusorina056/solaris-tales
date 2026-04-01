import mongoose, { Schema, model, models } from "mongoose";

const NotificationSchema = new Schema(
  {
    subject: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    senderId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true
    },
    recipientId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,

    },
    type: {
      type: String,
      enum: ["order", "admin", "request", "system"],
      default: "system"
    },
    isRead: {
      type: Boolean,
      default: false
    },
    referenceLink: {
      type: String,
    },
  },
  { timestamps: true }
);

NotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 });

export const Notification = models.Notification || model("Notification", NotificationSchema);
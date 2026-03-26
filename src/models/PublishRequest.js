import mongoose, { Schema, model, models } from "mongoose";

const PublishRequestSchema = new Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",  
    },
    phoneNumber: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    pdfDocument: {
      type: String,
      required: true
    },
    status: {
      type: String,
      default: "pending"
    }
  },
  {timestamps: true}
)

export const PublishRequest = models.PublishRequest || model("PublishRequest", PublishRequestSchema);
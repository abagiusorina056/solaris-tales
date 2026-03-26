import mongoose, { Schema, model, models } from "mongoose";

const StartReviewSchema = new Schema(
  {
    reviewerId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    review: {
      type: String,
      required: true
    },
    bookId: {
      type: mongoose.Types.ObjectId,
      ref: "Book",
      required: true
    }
  },
  {timestamps: true}
)

export const StarReview = models.StarReview || model("StarReview", StartReviewSchema);
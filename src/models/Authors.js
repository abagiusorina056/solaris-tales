import mongoose, { Schema, model, models } from "mongoose";

const AuthorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      index: true
    },
    slug: {
      type: String,
      required: true,
      unique: true
    },
    rating: {
      type: String,
      default: "0",
    },
    numberOfRatings: {
      type: Number,
      default: 0,
    }, 
    bio: {
      type: String,
    },
    image: {
      type: String,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    }
  },
  { timestamps: true }
);

export const Author = models.Author || model("Author", AuthorSchema);
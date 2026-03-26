import mongoose, { Schema, model, models } from "mongoose";

const BookSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    authorId: {
      type: mongoose.Types.ObjectId,
      ref: "Author",
      required: true
    },
    description: {
      type: String,
      required: true
    },
    image: {
      type: String,
    },
    bookFragments: {
      type: String,
    },
    price: {
      type: String,
      required: true
    },
    releaseDate: {
      type: Date,
      required: true
    },
    reviews: {
      type: Array,
    },
    starReviews: {
      type: Array,
    },
    discount: {
      type: String,
    }
  },
  { timestamps: true }
);

export const Book = models.Book || model("Book", BookSchema);
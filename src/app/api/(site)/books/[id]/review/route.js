export const runtime = "nodejs";

import { connectDB } from "@src/lib/mongodb";
import { Author } from "@src/models/Authors";
import { Book } from "@src/models/Book";
import { StarReview } from "@src/models/StarReview";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    await connectDB();
  
    const { id } = await params;
    const { review, reviewerId, authorId } = await req.json();

    const existingReview = await StarReview.findOne({ bookId: id, reviewerId }).lean();
  
    const newReview = await StarReview.findOneAndUpdate(
      { bookId: id, reviewerId },
      { bookId: id, reviewerId, review },
      { new: true, upsert: true }
    );

    await Book.findByIdAndUpdate(id, { $addToSet: { starReviews: newReview._id } });

    const numericScore = parseFloat(review);
    let authorUpdatePipeline;

    if (!existingReview) {
      authorUpdatePipeline = [
        {
          $set: {
            rating: {
              $toString: {
                $round: [
                  {
                    $divide: [
                      { $add: [{ $multiply: [{ $toDouble: "$rating" }, "$numberOfRatings"] }, numericScore] },
                      { $add: ["$numberOfRatings", 1] }
                    ]
                  },
                  1
                ]
              }
            },
            numberOfRatings: { $add: ["$numberOfRatings", 1] }
          }
        }
      ];
    } else {
      const oldScore = parseFloat(existingReview.review);
      
      if (oldScore === numericScore) {
        return NextResponse.json({ message: "No change needed" }, { status: 200 });
      }

      authorUpdatePipeline = [
        {
          $set: {
            rating: {
              $toString: {
                $round: [
                  {
                    $divide: [
                      {
                        $add: [
                          { $subtract: [{ $multiply: [{ $toDouble: "$rating" }, "$numberOfRatings"] }, oldScore] },
                          numericScore
                        ]
                      },
                      { $cond: [{ $gt: ["$numberOfRatings", 0] }, "$numberOfRatings", 1] }
                    ]
                  },
                  1
                ]
              }
            }
          }
        }
      ];
    }

    const authorResult = await Author.collection.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(authorId) },
      authorUpdatePipeline,
      { returnDocument: "after" }
    );

    global.io.emit("new-review", { 
      newReview, 
      newRating: authorResult.rating 
    });

    return NextResponse.json({ message: "Ok" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 });
  }
}

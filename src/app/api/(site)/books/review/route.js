export const runtime = "nodejs";

import { connectDB } from "@src/lib/mongodb";
import { Book } from "@src/models/Book";
import { StarReview } from "@src/models/StarReview";
import { User } from "@src/models/User";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  try {
    
    await connectDB();
  
    const { bookId, review, reviewerId, authorId } = await req.json();
  
    const starReview = await StarReview.findOne({ bookId, reviewerId });
  
    if (starReview) {
      const updatedReview = await StarReview.findOneAndUpdate(
        { bookId, reviewerId },
        {
          bookId,
          reviewerId,
          review,
        },
        { new: true, upsert: true }
      )
    } else {
      const newReview = await StarReview.create({
        bookId,
        review,
        reviewerId
      })
      const updatedBook = await Book.findByIdAndUpdate(
        bookId,
        {
          $push: { starReviews: newReview._id }
        },
        { new: true }
      );
    }
    const allAuthorBooks = await Book.find({ authorId })
    let reviews = []
    allAuthorBooks.forEach(book => {
      for (let r of book?.starReviews) {
        reviews.push(r)
      }
    })
    
    const allReviews = await StarReview.find({ _id: { $in: reviews } })
    let sum = 0
    allReviews.forEach(item => sum += parseInt(item?.review))
    const newAuthorRating = (sum / allReviews?.length).toFixed(1)

    const updatedAuthorRating = await User.findByIdAndUpdate(authorId,  { 
      rating: newAuthorRating.toString() 
    }, { new: true })
    
    global.io.emit("new-review", { bookId, review, reviewerId, newAuthorRating });

    const res = NextResponse.json({ message: "Ok" }, { status: 201 });
    return res
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Server error", details: error },
      { status: 500 }
    );
  }
}

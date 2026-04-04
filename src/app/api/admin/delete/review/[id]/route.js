import { NextResponse } from "next/server";
import { connectDB } from "@src/lib/mongodb";
import { StarReview } from "@src/models/StarReview";
import { User } from "@src/models/User";
import { Notification } from "@src/models/Notification";
import { ensureAdmin } from "@src/lib/auth-server";
import { Book } from "@src/models/Book";
import { Author } from "@src/models/Authors";

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const adminEnsurance = await ensureAdmin();
    if (!adminEnsurance) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    const { id } = await params;

    const review = await StarReview.findById(id);
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const ratingValueToDelete = review.rating;
    const bookId = review.bookId;

    await StarReview.findByIdAndDelete(id);

    const book = await Book.findByIdAndUpdate(
      bookId,
      { $pull: { starReviews: id } }
    );

    if (book?.authorId) {
      const author = await Author.findById(book.authorId);
      
      if (author) {
        const oldRating = author.rating || 0;
        const oldTotal = author.numberOfRatings || 0;

        if (oldTotal <= 1) {
          author.rating = 0;
          author.numberOfRatings = 0;
        } else {
          const newTotal = oldTotal - 1;
          const newRating = ((oldRating * oldTotal) - ratingValueToDelete) / newTotal;
          
          author.rating = Number(newRating.toFixed(2)); 
          author.numberOfRatings = newTotal;
        }
        await author.save();
      }
    }

    global.io.emit("reviewDeleted", [id]);
    
    const adminUsers = await User.find({ role: "admin" }).distinct("_id");
    const newNotification = await Notification.create({
      senderId: adminUsers[0],
      recipientId: review.reviewerId,
      type: "system",
      subject: "Recenzie stearsa",
      content: "O recenzie de-a ta a fost stearsa de catre admin",
    });
    
    global.io.emit("newNotification", newNotification);
    
    return NextResponse.json({ message: "Review deleted and rating updated" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { connectDB } from "@src/lib/mongodb";
import { StarReview } from "@src/models/StarReview";
import { Author } from "@src/models/Authors";
import { ensureAdmin } from "@src/lib/auth-server";
import { Book } from "@src/models/Book";

export async function DELETE(req) {
  try {
    await connectDB();
    if (!(await ensureAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { ids } = await req.json();

    const reviews = await StarReview.find({ _id: { $in: ids } });
    if (reviews.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const bookIds = [...new Set(reviews.map(r => r.bookId))];
    const books = await Book.find({ _id: { $in: bookIds } }).select("authorId");

    const bookToAuthorMap = {};
    books.forEach(b => { bookToAuthorMap[b._id.toString()] = b.authorId?.toString(); });

    const authorUpdates = {}; 

    reviews.forEach(r => {
      const authorId = bookToAuthorMap[r.bookId.toString()];
      if (!authorId) return;

      if (!authorUpdates[authorId]) {
        authorUpdates[authorId] = { pointsRemoved: 0, countRemoved: 0, reviewerIds: new Set() };
      }
      authorUpdates[authorId].pointsRemoved += r.rating;
      authorUpdates[authorId].countRemoved += 1;
      authorUpdates[authorId].reviewerIds.add(r.reviewerId.toString());
    });

    for (const authorId in authorUpdates) {
      const author = await Author.findById(authorId);
      if (!author) continue;

      const { pointsRemoved, countRemoved } = authorUpdates[authorId];
      const oldTotal = author.numberOfRatings || 0;
      const oldRating = author.rating || 0;

      if (oldTotal <= countRemoved) {
        author.rating = 0;
        author.numberOfRatings = 0;
      } else {
        const newTotal = oldTotal - countRemoved;
        const newRating = ((oldRating * oldTotal) - pointsRemoved) / newTotal;
        author.rating = Number(newRating.toFixed(2));
        author.numberOfRatings = newTotal;
      }
      await author.save();
    }

    await StarReview.deleteMany({ _id: { $in: ids } });
    await Book.updateMany({ _id: { $in: bookIds } }, { $pull: { starReviews: { $in: ids } } });

    const adminId = await User.findOne({ role: "admin" }).distinct("_id");
    
    const uniqueReviewers = [...new Set(reviews.map(r => r.reviewerId.toString()))];
    
    for (const revId of uniqueReviewers) {
      const userReviewCount = reviews.filter(r => r.reviewerId.toString() === revId).length;
      
      const newNotification = await Notification.create({
        senderId: adminId[0],
        recipientId: revId,
        type: "system",
        subject: userReviewCount === 1 ? "Recenzie stearsa" : "Recenzii sterse",
        content: userReviewCount === 1 
          ? "O recenzie de-a ta a fost stearsa de catre admin."
          : `Un numar de ${userReviewCount} recenzii au fost sterse de catre admin.`,
      });
      global.io.emit("newNotification", newNotification);
    }

    global.io.emit("reviewsDeleted", ids);
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
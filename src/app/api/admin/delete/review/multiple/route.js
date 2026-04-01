import { NextResponse } from "next/server";
import { connectDB } from "@src/lib/mongodb";
import { StarReview } from "@src/models/StarReview";
import { Author } from "@src/models/Authors";

export async function DELETE(req) {
  try {
    await connectDB();
    
    const { ids } = await res.json()

    const reviews = StarReview.find({
      _id: { $in: ids }
    })
    if (reviews.length === 0) {
      return NextResponse.json({ error: "Nicio recenzie nu a fost gasita" }, { status: 404 });
    }

    await StarReview.deleteMany({
      _id: { $in: ids }
    })

    global.io.emit("reviewsDeleted", ids)

    const userMap = reviews.reduce((acc, r) => {
      if (!acc[r.reviewerId]) acc[r.reviewerId] = [];
      acc[r.reviewerId].push(r.review);

      return acc;
    }, {});

    const adminId = await User.find({ role: "admin" }).distinct("_id");

    for (const authorId in authorMap) {
      const author = await Author.findById(authorId);

      const review = userMap[authorId];
      const count = review.length;
      
      const content = count === 1 
        ? `Recenzia ta a fost stearsa de catre admin.`
        : `Unele recenzii facute de tine au fost sterse de catre admin.`;

      const newNotification = await Notification.create({
        senderId: adminId,
        recipientId: author.userId,
        type: "system",
        subject: count === 1 ? "Recenzie stearsa" : "Recenzii sterse",
        content: content,
      });

      global.io.emit("newNotification", newNotification);
    }

    const res = NextResponse.json({ reviews }, { status: 201 });
    return res;
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Server error", details: error },
      { status: 500 }
    );
  }
}
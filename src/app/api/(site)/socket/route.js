import { Server } from "socket.io";
import { connectDB } from "@src/lib/mongodb";
import { User } from "@src/models/User";
import { Book } from "@src/models/Book";
import { StarReview } from "@src/models/StarReview";

let io;

export async function GET(req) {
  if (!io) {
    io = new Server();

    await connectDB();

    // Watch reviews
    StarReview.watch().on("change", (change) => {
      io.emit("reviews:update", change);
    });

    // Watch users
    User.watch().on("change", (change) => {
      io.emit("users:update", change);
    });

    // Watch books
    Book.watch().on("change", (change) => {
      io.emit("books:update", change);
    });
  }

  return new Response("socket running");
}

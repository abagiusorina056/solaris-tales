import { cookies } from "next/headers";
import { connectDB } from "@src/lib/mongodb";
import { Book } from "@src/models/Book";
import BookView from "./BookView";
import { StarReview } from "@src/models/StarReview";
import { User } from "@src/models/User";

const BookPage = async ({ params }) => {
  const { id } = await params

  return (
    <BookView id={id} />
  );
}

export default BookPage
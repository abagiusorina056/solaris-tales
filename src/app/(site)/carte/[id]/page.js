import { connectDB } from "@src/lib/mongodb";
import BookView from "./BookView";
import { Book } from "@src/models/Book";
import mongoose from "mongoose";
import { notFound } from "next/navigation";

const BookPage = async ({ params }) => {
  const { id } = await params

  const isValidId = mongoose.Types.ObjectId.isValid(id);

  if (!isValidId) {
    return notFound(); 
  }

  await connectDB()
  const exists = await Book.exists({ _id: id })
  
  if (!exists) {
    return notFound()
  }

  return (
    <BookView id={id} />
  );
}

export default BookPage
import { connectDB } from "@src/lib/mongodb";
import AuthorView from "./AuthorView";
import { Author } from "@src/models/Authors";
import mongoose from "mongoose";
import { notFound } from "next/navigation";

const BookPage = async ({ params }) => {
  const { id } = await params

  const isValidId = mongoose.Types.ObjectId.isValid(id);
  
  if (!isValidId) {
    return notFound(); 
  }

  await connectDB()
  const exists = await Author.exists({ _id: id })
  
  if (!exists) {
    return notFound()
  }

  return (
    <AuthorView id={id} />
  );
}

export default BookPage
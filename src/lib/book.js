import { toast } from "sonner";
import { redirect } from "next/navigation";
import { uploadImage } from "./utils";

export const addBook = async (bookData, author, authorId) => {
  const {
    title,
    description,
    image,
    bookFragments,
    price,
    releaseDate
  } = bookData

  const uploadedUrl = await uploadImage(image);

  const res = await fetch("/api/book/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title,
      author,
      authorId,
      description,
      image: uploadedUrl,
      bookFragments,
      price,
      releaseDate
    }),
  });

  const data = await res.json();
  if (data.error) {
    toast.error(data.error)
  } else {
    toast.success("Carte adaugata cu success")
    redirect("/profil")
  }
}

export const starReviewBook = async (bookId, review, reviewerId, authorId) => {
  const res = await fetch(`/api/books/${bookId}/review`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      bookId,
      review,
      reviewerId,
      authorId
    }),
  });

  const data = await res.json();
  return data;
}

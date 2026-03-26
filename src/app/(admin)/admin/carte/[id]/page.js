import BookView from "./BookView";

const BookPage = async ({ params }) => {
  const { id } = await params

  return (
    <BookView id={id} />
  );
}

export default BookPage
import AuthorView from "./AuthorView";

const BookPage = async ({ params }) => {
  const { id } = await params

  return (
    <AuthorView id={id} />
  );
}

export default BookPage
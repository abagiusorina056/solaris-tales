import { ensureAdmin } from "@src/lib/auth-server";
import { connectDB } from "@src/lib/mongodb";
import { Book } from "@src/models/Book";

export async function GET(request, { params }) {
  await connectDB()

  const adminEnsurance = await ensureAdmin();
  if (!adminEnsurance) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params

  const book = await Book.findById(id)

  if (!book) {
    return new Response(JSON.stringify({ error: "Book not found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return Response.json({ books: book })
}
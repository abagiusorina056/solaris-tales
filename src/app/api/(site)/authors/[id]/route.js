import "server-only"
import { connectDB } from "@src/lib/mongodb";
import { User } from "@src/models/User";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server"
import { Author } from "@src/models/Authors";

export const dynamic = "force-dynamic"

export async function GET(req, { params }) {
  try {
    await connectDB()

    const { id } = await params

    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search") || ""
    const page = Number(searchParams.get("page") || 1)
    const pageSize = 8

    const author = await Author.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "authorId",
          as: "books",
        },
      },
      {
        $lookup: {
          from: "starreviews",
          localField: "books.starReviews",
          foreignField: "_id",
          as: "reviews",
        },
      },
      {
        $facet: {
          paginatedData: [
            { $unwind: "$books" },
            { $match: { "books.title": { $regex: search, $options: "i" } } },
            {
              $group: {
                _id: "$_id",
                authorDoc: { $first: "$$ROOT" }, 
                filteredBooks: { $push: "$books" },
              },
            },
            {
              $project: {
                authorDoc: 1,
                books: { $slice: ["$filteredBooks", (page - 1) * pageSize, pageSize] },
                totalCount: { $size: "$filteredBooks" },
              },
            },
          ],
        },
      },
      {
        $project: {
          author: {
            $mergeObjects: [
              { $arrayElemAt: ["$paginatedData.authorDoc", 0] },
              { books: { $arrayElemAt: ["$paginatedData.books", 0] } },
            ],
          },
          total: { $arrayElemAt: ["$paginatedData.totalCount", 0] },
        },
      },
    ]);
    if (!author[0]) {
      return new Response(JSON.stringify({ error: "Author not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return Response.json({
      authors: author[0].author,
      total: author[0].total,
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Server error", details: error },
      { status: 500 }
    );
  }
}
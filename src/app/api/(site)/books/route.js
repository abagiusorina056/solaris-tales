import { connectDB } from "@src/lib/mongodb"
import { Book } from "@src/models/Book"

export async function GET(req) {
  await connectDB();
  
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || 1);
  const pageSize = 8;
  const sortField = searchParams.get("sortField") || "createdAt";
  const sortOrder = parseInt(searchParams.get("sortOrder")) || -1;
  
  const search = searchParams.get("search") || "";
  const genre = searchParams.get("genre") || "";
  const discount = searchParams.get("discount") || "false";
  const min = parseFloat(searchParams.get("minPrice") || 0);
  const max = parseFloat(searchParams.get("maxPrice") || 9999);

  const matchQuery = {};
  if (search) {
    matchQuery.$or = [
      { title: { $regex: search, $options: "i" } },
      { author: { $regex: search, $options: "i" } }
    ];
  }
  if (genre) matchQuery.genre = genre;

  const results = await Book.aggregate([
    {
      $addFields: {
        priceNumeric: { $toDouble: "$price" },
        ratingNumeric: { $toDouble: { $ifNull: ["$rating", 0] } },
        discountPercent: { $toInt: { $ifNull: ["$discount", "0"] } }
      }
    },
    {
      $facet: {
        globalBounds: [
          { $group: { _id: null, min: { $min: "$priceNumeric" }, max: { $max: "$priceNumeric" } } }
        ],
        totalCount: [
          { 
            $match: { 
              ...matchQuery, 
              priceNumeric: { $gte: min, $lte: max },
              ...(discount === "true" ? { discountPercent: { $gt: 0 } } : {})
            } 
          },
          { $count: "count" }
        ],
        books: [
          { 
            $match: { 
              ...matchQuery, 
              priceNumeric: { $gte: min, $lte: max },
              ...(discount === "true" ? { discountPercent: { $gt: 0 } } : {})
            } 
          },
          { $sort: { 
              [
                sortField === "price" ? "priceNumeric" :
                sortField === "rating" ? "ratingNumeric" :
                sortField
              ]: sortOrder 
            } 
          },
          {
            $lookup: {
              from: "starreviews",
              localField: "_id",
              foreignField: "bookId",
              as: "reviews",
            }
          },
          { $skip: (page - 1) * pageSize },
          { $limit: pageSize }
        ],
      }
    }
  ]);

  const data = results[0];
  
  return Response.json({
    books: data.books || [],
    total: data.totalCount[0]?.count || 0,
    globalMin: data.globalBounds[0]?.min || 0,
    globalMax: data.globalBounds[0]?.max || 1000
  });
}
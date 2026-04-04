import { connectDB } from "@src/lib/mongodb";
import { Book } from "@src/models/Book";
import { User } from "@src/models/User";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  try {
    await connectDB();

    const { userId, bookId, action } = await req.json();

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const index = user.bagProducts.findIndex(
      (item) => item.productId.toString() === bookId
    );

    if (action === "add") {
      if (index !== -1) {
        user.bagProducts[index].quantity += 1;
      } else {
        user.bagProducts.push({
          productId: bookId,
          quantity: 1,
        });
      }
    }

    if (action === "remove") {
      if (index !== -1) {
        user.bagProducts[index].quantity -= 1;
      }
    }

    if (action === "delete") {
      user.bagProducts.splice(index, 1);
    }

    await user.save();
    const productIds = await (user?.bagProducts || []).map(item => item.productId);
    const quantities = {};
    (user?.bagProducts || []).forEach(item => {
      quantities[item?.productId] = item?.quantity;
    });
    const bagContent = await Book.find({ _id: { $in: productIds || [] } }).lean();
      const total = bagContent.reduce((sum, product) => {
      const quantity = quantities[product?._id] ?? 1;
      const price = Number(product?.price) || 0;

      return sum + price * quantity;
    }, 0);

    global.io.emit("bag", { 
      newQuantities: quantities,
      newTotal: total
    });

    return NextResponse.json({ status: 201 });

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Server error", details: error },
      { status: 500 }
    );
  }
}

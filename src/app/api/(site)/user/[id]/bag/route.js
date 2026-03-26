import { connectDB } from "@src/lib/mongodb";
import { Book } from "@src/models/Book";
import { User } from "@src/models/User";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const { bookId, action } = await req.json();

    let updatedUser;

    if (action === "add") {
      updatedUser = await User.findOneAndUpdate(
        { _id: id, "bagProducts.productId": bookId },
        { $inc: { "bagProducts.$.quantity": 1 } },
        { new: true }
      );

      if (!updatedUser) {
        updatedUser = await User.findByIdAndUpdate(
          id,
          { $push: { bagProducts: { productId: bookId, quantity: 1 } } },
          { new: true }
        );
      }
    } else if (action === "remove") {
      updatedUser = await User.findOneAndUpdate(
        { _id: id, "bagProducts.productId": bookId },
        { $inc: { "bagProducts.$.quantity": -1 } },
        { new: true }
      );
      
      await User.updateOne(
        { _id: id },
        { $pull: { bagProducts: { quantity: { $lte: 0 } } } }
      );
    } else if (action === "delete") {
      updatedUser = await User.findByIdAndUpdate(
        id,
        { $pull: { bagProducts: { productId: bookId } } },
        { new: true }
      );
    }

    if (!updatedUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const bagProducts = updatedUser.bagProducts || [];
    const productIds = bagProducts.map(p => p.productId);
    

    const quantities = {};
    bagProducts.forEach(p => { quantities[p.productId.toString()] = p.quantity; });

    const bagContent = await Book.find({ _id: { $in: productIds } }).lean();

    const total = bagContent.reduce((sum, product) => {
      const qty = quantities[product._id.toString()] || 0;
      const price = Number(product.price) || 0;
      return sum + (price * qty);
    }, 0);

    global.io.emit("bag", { 
      newBagContent: bagContent, 
      newQuantities: quantities,
      newTotal: total.toFixed(2)
    });

    return NextResponse.json({ message: "Success" }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 });
  }
}

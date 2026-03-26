import { connectDB } from "@src/lib/mongodb";
import { Author } from "@src/models/Authors";
import { Order } from "@src/models/Order";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const { id } = await params
    const { newData } = await req.json();

    const updatedOrder = await Order.findByIdAndUpdate(id, newData, { new: true })
    if (!updatedOrder) {
      return NextResponse.json({ error: "Autorul nu a fost gasit" }, { status: 404 })
    }
    
    global.io.emit("orderUpdated", updatedOrder);

    return NextResponse.json({ messaage: "Comanda actualizata" }, { status: 201 });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Server error", details: error },
      { status: 500 }
    );
  }
}
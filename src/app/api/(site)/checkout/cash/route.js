import Stripe from 'stripe';
import { connectDB } from "@src/lib/mongodb";
import { Order } from "@src/models/Order";
import { User } from "@src/models/User";
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import { Notification } from '@src/models/Notification';

const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY);

export async function POST(req) {
  await connectDB();
  
  const { 
    products, 
    userId, 
    email, 
    name,
    shippingAdress,
    billingAdress,
    phone,
    price,
    shippingMethod
  } = await req.json();

  const newOrderId = new mongoose.Types.ObjectId()

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $set: { bagProducts: [], madeFirstCommand: true },
      $addToSet: { orders: newOrderId },
      $inc: { fidelityPoints: Math.floor((price - 20) / 10) }
    },
    { new: true }
  );
  if (!updatedUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const lastOrder = await Order
    .findOne({ slug: { $regex: /^ORD-/ } })
    .sort({ _id: -1 });

  let slugNumber = 1;

  if (lastOrder) {
    slugNumber = parseInt(lastOrder?.slug.split("-")[1]) + 1;
  }

  const slug = `ORD-${slugNumber}`;

  const newOrder = await Order.create({
    _id: newOrderId,
    senderId: userId,
    products: products.map(item => ({
      bookId: item.bookId,
      quantity: item.quantity
    })),
    price: price.toString(),
    shippingMethod: shippingMethod,
    paymentMethod: "cash",
    shippingAdress,
    billingAdress,
    phone,
    name,
    email,
    slug
  });

  global.io.emit("order-placed")

  const adminId = await User.find({ role: "admin" }).distinct("_id");
  const newNotification = await Notification.create({
    senderId: userId,
    recipientId: adminId[0],
    type: "order",
    subject: "Comanda noua",
    content: "O noua comanda a fost plasata ",
    referenceLink: `/admin/comanda/${newOrder.id}`
  })

  global.io.emit("newNotification", newNotification)


  return Response.json({ url: `/comanda/${newOrder._id}` });
}
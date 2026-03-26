import Stripe from 'stripe';
import { connectDB } from "@src/lib/mongodb";
import { Order } from "@src/models/Order";
import { User } from "@src/models/User";
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY);

export async function POST(req) {
  const { sessionId } = await req.json();
  await connectDB();

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== 'paid') {
    return Response.json({ error: "Payment not verified" }, { status: 400 });
  }

  const existingOrder = await Order.findOne({ stripeSessionId: sessionId });
  if (existingOrder) {
    return Response.json({ orderId: existingOrder._id });
  }

  const { 
    userId, 
    cart,
    name,
    shippingAdress,
    billingAdress,
    phone,
    email
  } = session.metadata;
  const cartItems = JSON.parse(cart);

  const orderTotal = session.amount_total / 100
  const newOrderId = new mongoose.Types.ObjectId()

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $set: { bagProducts: [], madeFirstCommand: true },
      $addToSet: { orders: newOrderId },
      $inc: { fidelityPoints: Math.floor(orderTotal / 10) }
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
    stripeSessionId: sessionId,
    products: cartItems.map(item => ({
      bookId: item.bookId,
      quantity: item.quantity
    })),
    price: orderTotal,
    shippingMethod: session.shipping_cost.amount_total > 0 ? "courier" : "easybox",
    paymentMethod: "card",
    shippingAdress,
    billingAdress,
    phone,
    name,
    email,
    slug
  });

  global.io.emit("order-placed")

  return Response.json({ orderId: newOrder._id });
}
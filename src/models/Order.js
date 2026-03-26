import mongoose, { Schema, model, models } from "mongoose";

const OrderSchema = new Schema(
  {
    senderId: {
      type: mongoose.Types.ObjectId,
      ref: "User"
    },
    name: {
      type: String,
      required: true,
    },
    shippingAdress: {
      type: String,
      required: true
    },
    billingAdress: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    shippingMethod: {
      type: String,
      enum: ["courier", "easybox"],
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "transfer"],
      required: true
    },
    products: [
      {
        bookId: {
          type: mongoose.Types.ObjectId,
          ref: "Book"
        },
        quantity: {
          type: Number,
          required: true
        }
      }
    ],
    price: {
      type: String,
      required: true
    },
    status: {
      type: String,
      default: "processing"
    },
    stripeSessionId: {
      type: String,
    },
    slug: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export const Order = models.Order || model("Order", OrderSchema);
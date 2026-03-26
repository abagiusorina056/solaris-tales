import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    profileImage: {
      type: String,
      default: ""
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true
    },
    instagram: {
      type: String,
      default: ""
    },
    facebook: {
      type: String,
      default: ""
    },
    bio: {
      type: String,
      default: ""
    },
    dob: {
      type: Date,
    },
    bagProducts: [
      {
        productId: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: "Book" 
        },
        quantity: { type: Number, 
          required: true, 
          default: 1 
        }
      }
    ],
    favorites: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Book" }
    ],
    orders: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Order" }
    ],
    role: {
      type: String,
      enum: ["admin", "author", "user"],
      default: "user"
    },
    isSubscribed: {
      type: Boolean,
      default: false
    },
    madeFirstCommand: {
      type: Boolean,
      default: false
    },
    fidelityPoints: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export const User = models.User || model("User", UserSchema);
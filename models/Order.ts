import mongoose, { Schema, models } from "mongoose";
import type { Types } from "mongoose";

const orderSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    paypalOrderId: { type: String, required: true },
    amount: { type: Number, required: true },
    quantity: { type: Number, default: 1 },
    shippingCost: { type: Number, default: 0 },
    buyerEmail: { type: String },
    buyerName: { type: String },
    shippingAddress: {
      fullName: String,
      line1: String,
      line2: String,
      city: String,
      state: String,
      postalCode: String,
      countryCode: String,
    },
    status: { type: String, default: "PENDING" },
  },
  { timestamps: true }
);

export type OrderDoc = {
    _id: string;
    productId: Types.ObjectId; // ✅ better than string //productId: string; // or mongoose.Types.ObjectId
    paypalOrderId: string;
    amount: number;
    quantity: number;
    shippingCost: number;
    buyerEmail?: string;
    buyerName?: string;
    shippingAddress?: {
      fullName?: string;
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      countryCode?: string;
    };
    status?: string;
    createdAt?: Date;
    updatedAt?: Date;
  };
  

  export default (models.Order as mongoose.Model<OrderDoc>) ||
    mongoose.model<OrderDoc>("Order", orderSchema);


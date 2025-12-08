import { Document, model, Schema, Types } from "mongoose";
export interface IOrder extends Document {
  cartId: Types.ObjectId;
  userId: Types.ObjectId;
  tableId?: Types.ObjectId;
  deleveryAddress?: string;
  deliveryOptions?: string;
  totalPrice: number;
  status: string;
  typeOfPayment?: string;
  bookingTime?: Date;
  timeOrdered?: Date;
}
const orderSchema = new Schema<IOrder>(
  {
    cartId: {
      type: Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tableId: {
      type: Schema.Types.ObjectId,
      ref: "Table",
    },
    totalPrice: { type: Number },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      required: true,
      default: "pending",
    },
    deleveryAddress: { type: String },
    deliveryOptions: {
      type: String,
      enum: ["delivery", "pickup", "dine-in"],
      default: "dine-in",
    },
    typeOfPayment: {
      type: String,
      enum: ["cash", "card", "momo"],
    },
    bookingTime: {
      type: Date,
    },
    timeOrdered: { type: Date, default: Date.now },
  },
  { timestamps: true, collection: "orders" }
);
const Order = model<IOrder>("Order", orderSchema);
export default Order;

import { Document, model, Schema, Types } from "mongoose";
import { generateRandomNumber } from "../helpers/generate.helper";
export interface IOrder extends Document {
  orderId: string;
  userId: Types.ObjectId;
  tableId?: Types.ObjectId;
  totalPrice: number;
  status: string;
  typeOfPayment?: string;
  payed: boolean;
}
const orderSchema = new Schema<IOrder>(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      default: () => `ORD-${Date.now()}-${generateRandomNumber(10)}`,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tableId: { type: Schema.Types.ObjectId, ref: "Table" },
    totalPrice: { type: Number, required: true },
    status: { type: String, required: true, default: "pending" },
    typeOfPayment: { type: String },
    payed: { type: Boolean, required: true, default: false },
  },
  { timestamps: true, collection: "orders" }
);
const Order = model<IOrder>("Order", orderSchema);
export default Order;

import { Document, model, Schema } from "mongoose";
import { generateRandomNumber } from "../helpers/generate.helper";
export interface IOrder extends Document {
  orderId: string;
  userId: string;
  tableId?: string;
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
    userId: { type: String, required: true },
    tableId: { type: String },
    totalPrice: { type: Number, required: true },
    status: { type: String, required: true, default: "pending" },
    typeOfPayment: { type: String },
    payed: { type: Boolean, required: true, default: false },
  },
  { timestamps: true, collection: "orders" }
);
const Order = model<IOrder>("Order", orderSchema);
export default Order;

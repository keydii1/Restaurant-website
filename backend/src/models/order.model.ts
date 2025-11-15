import { Document, model, Schema } from "mongoose";
export interface IOrder extends Document {
  userId: string;
  items: {
    dishId: string;
    quantity: number;
    price: number;
  }[];
  tableId?: string;
  totalPrice: number;
  status: string;
}
const orderSchema = new Schema<IOrder>(
  {
    userId: { type: String, required: true },
    items: [
      {
        dishId: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
    status: { type: String, required: true, default: "pending" },
  },
  { timestamps: true, collection: "orders" }
);
const Order = model<IOrder>("Order", orderSchema);
export default Order;

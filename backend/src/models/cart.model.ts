import { Document, model, Schema } from "mongoose";

export interface ICart extends Document {
  userId: string;
  items: {
    dishId: string;
    quantity: number;
  }[];
  totalPrice: number;
}

const cartSchema = new Schema<ICart>(
  {
    userId: { type: String, required: true },
    items: [
      {
        dishId: { type: String, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
  },
  { timestamps: true, collection: "carts" }
);

const Cart = model<ICart>("Cart", cartSchema);

export default Cart;

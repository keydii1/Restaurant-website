import { Document, model, Schema, Types } from "mongoose";

export interface ICart extends Document {
  userId: Types.ObjectId;
  items: {
    dishId: Types.ObjectId;
    quantity: number;
  }[];
  totalPrice: number;
}

const cartSchema = new Schema<ICart>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        dishId: { type: Schema.Types.ObjectId, ref: "Dish", required: true },
        quantity: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
  },
  { timestamps: true, collection: "carts" }
);

const Cart = model<ICart>("Cart", cartSchema);

export default Cart;

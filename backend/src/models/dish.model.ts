import { Schema, model, Document, Types } from "mongoose";

interface IDish extends Document {
  name: string;
  description: string;
  price: number;
  deleted: boolean;
  discount: number;
  image: string;
  categoryId: Types.ObjectId;
  status: string;
  finalPrice: number;
  rating: number;
  bestSeller?: boolean;
  ingredients?: string[];
  prepareTime?: number;
}
const dishSchema = new Schema<IDish>(
  {
    name: { type: String, required: true },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      default: 0,
    },
    deleted: { type: Boolean, default: false },
    discount: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      default: "",
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    status: { type: String, default: "inactive" },
    finalPrice: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    bestSeller: { type: Boolean, default: false },
    prepareTime: { type: Number, default: 10 },
    ingredients: { type: [String], default: [] },
  },
  { collection: "dishes", timestamps: true }
);

const Dish = model<IDish>("Dish", dishSchema);
export default Dish;

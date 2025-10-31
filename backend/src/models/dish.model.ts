import { Schema, model, Document } from "mongoose";

interface IDish extends Document {
  title: string;
  description: string;
  price: number;
  discount: number;
  images: string[];
  categoryId: string;
  status: string;
  finalPrice: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

const dishSchema = new Schema<IDish>(
  {
    title: { type: String, required: true },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    images: {
      type: [String],
      default: [],
    },
    categoryId: { type: String, required: true },
    status: { type: String, required: true },
    finalPrice: { type: Number, required: true },
    rating: { type: Number, default: 0 },
  },
  { collection: "dishes", timestamps: true }
);

const Dish = model<IDish>("Dish", dishSchema);
export default Dish;


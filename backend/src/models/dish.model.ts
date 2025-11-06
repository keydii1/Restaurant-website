import { Schema, model, Document } from "mongoose";

interface IDish extends Document {
  name: string;
  description: string;
  price: number;
  discount: number;
  images: string;
  category: string;
  status: string;
  finalPrice: number;
  rating: number;
  position?: number;
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
    discount: {
      type: Number,
      default: 0,
    },
    images: {
      type: String,
      default: "",
    },
    category: { type: String, default: "" },
    status: { type: String, default: "inactive" },
    finalPrice: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
  },
  { collection: "dishes", timestamps: true }
);

const Dish = model<IDish>("Dish", dishSchema);
export default Dish;

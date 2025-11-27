import { Schema, Document, model, Collection } from "mongoose";
interface ICategory extends Document {
  name: String;
  description: String;
  deleted: Boolean;
  status: String;
  images: String;
}
const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    deleted: { type: Boolean, default: false },
    status: { type: String },
    images: { type: String, default: "" },
  },
  { collection: "categories", timestamps: true }
);
const Category = model<ICategory>("Category", categorySchema);
export default Category;

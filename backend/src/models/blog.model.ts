import { Document, model, Schema } from "mongoose";

export interface IBlog extends Document {
  title: string;
  image?: string;
  content: string;
  deleted?: boolean;
}
const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    image: { type: String },
    content: { type: String, required: true },
    deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: "blogs",
  }
);
const Blog = model<IBlog>("Blog", blogSchema);
export default Blog;

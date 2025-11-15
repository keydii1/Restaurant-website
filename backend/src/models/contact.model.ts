import { Document, model, Schema } from "mongoose";

export interface IContact extends Document {
  name: string;
  email: string;
  message: string;
  status?: "Pending" | "Reviewed" | "Resolved";
  deleted?: boolean;
}

const ContactSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, default: "Pending" },
    deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: "contacts",
  }
);

const Contact = model<IContact>("Contact", ContactSchema);
export default Contact;

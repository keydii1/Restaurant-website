import { Document, Schema, model } from "mongoose";
interface IDiscount extends Document {
  code: string;
  description: string;
  percentage: number;
  validFrom: Date;
  validTo: Date;
  active: boolean;
  deleted?: boolean;
}
const discountSchema: Schema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    percentage: { type: Number, required: true },
    validFrom: { type: Date, required: true },
    validTo: { type: Date, required: true },
    deleted: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    collection: "discounts",
  }
);
const Discount = model<IDiscount>("Discount", discountSchema);
export default Discount;

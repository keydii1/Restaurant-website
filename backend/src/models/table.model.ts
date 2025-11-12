import { model, Schema, Document } from "mongoose";
interface ITable extends Document {
  tableNumber: number;
  maximumCapacity: number;
  status: "available" | "occupied" | "reserved";
  position: string;
}
const tableSchema: Schema = new Schema(
  {
    tableNumber: { type: Number, required: true, unique: true },
    maximumCapacity: { type: Number, required: true },
    status: {
      type: String,
      enum: ["available", "occupied", "reserved"],
      required: true,
    },
    position: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: "tables",
  }
);

const Table = model<ITable>("Table", tableSchema);
export default Table;

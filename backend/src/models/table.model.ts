import { model, Schema, Document } from "mongoose";
interface ITable extends Document {
  tableNumber: number;
  tableName?: string;
  maximumCapacity: number;
  status: "available" | "occupied" | "reserved";
  position: string;
  deleted: boolean;
  orderTime?: Date;
  finishedTime?: Date;
}

const tableSchema: Schema = new Schema(
  {
    tableNumber: { type: Number, required: true, unique: true },
    tableName: { type: String },
    maximumCapacity: { type: Number, required: true },
    status: {
      type: String,
      enum: ["available", "occupied", "reserved"],
      default: "available",
    },
    position: { type: String, required: true },
    deleted: { type: Boolean, default: false },
    orderTime: { type: Date },
    finishedTime: { type: Date },
  },
  {
    timestamps: true,
    collection: "tables",
  }
);

const Table = model<ITable>("Table", tableSchema);
export default Table;

import { Document, Schema, model } from "mongoose";
interface IRole extends Document {
  name: String;
  description: String;
  permisstion: Array<String>;
  deleted: Boolean;
}
const roleSchema = new Schema<IRole>(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    permisstion: { type: [String], default: [] },
    deleted: { type: Boolean, default: false },
  },
  { collection: "roles", timestamps: true }
);
const Role = model<IRole>("Role", roleSchema);
export default Role;

import { Document, model, Schema } from "mongoose";

export interface IAccount extends Document {
  username: string;
  email: string;
  password: string;
  role_id?: string;
  avatar?: string;
  deleted: boolean;
  token?: string;
  status?: string;
}

const accountSchema = new Schema<IAccount>({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role_id: { type: String },
  avatar: { type: String },
  deleted: { type: Boolean, default: false },
  token: { type: String },
  status: { type: String, default: "active" },
});

export const Account = model<IAccount>("Account", accountSchema);
export default Account;

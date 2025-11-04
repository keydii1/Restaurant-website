import { Document, model, Schema } from "mongoose";

export interface IAccount extends Document {
  username: string;
  email: string;
  password: string;
}

const accountSchema = new Schema<IAccount>({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

export const Account = model<IAccount>("Account", accountSchema);
export default Account;

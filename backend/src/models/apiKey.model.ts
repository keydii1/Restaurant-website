import { Document, model, Schema } from "mongoose";

export interface IApiKey extends Document {
  userId: string;
  publicKey: string;
  privateKey: string;
}
const apiKeySchema = new Schema<IApiKey>(
  {
    userId: { type: String, required: true, ref: "users" },
    publicKey: { type: String, required: true },
    privateKey: { type: String, required: true },
  },
  { collection: "apiKeys", timestamps: true }
);
export const ApiKeyModel = model<IApiKey>("ApiKey", apiKeySchema);
export default ApiKeyModel;

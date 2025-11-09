import { Document, model, Schema } from "mongoose";
export interface IOTP extends Document {
  userId: string;
  code: string;
  expiresAt: Date;
  used: boolean;
}
const otpSchema = new Schema<IOTP>(
  {
    userId: { type: String, required: true, ref: "users" },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    used: { type: Boolean, default: false },
  },
  { collection: "otps", timestamps: true }
);

// TTL index: MongoDB automatically deletes document when current time exceeds expiresAt
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OTP = model<IOTP>("OTP", otpSchema);
export default OTP;

import mongoose, { Document, Schema } from 'mongoose';

export interface IOtp extends Document {
  email: string;
  otp: string;
  createdAt: Date;
}

const OtpSchema: Schema<IOtp> = new Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, index: { expires: '10m' } }, // OTP expires in 10 minutes
});

const Otp = mongoose.models.Otp || mongoose.model<IOtp>('Otp', OtpSchema);
export default Otp;

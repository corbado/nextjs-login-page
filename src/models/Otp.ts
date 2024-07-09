import mongoose, { Document, Schema } from "mongoose";

// Interface defining the OTP document structure
export interface IOtp extends Document {
  email?: string; // Optional email field
  phoneNumber?: string; // Optional phone number field
  otp: string; // OTP value
  createdAt: Date; // Creation timestamp
}

// Define the OTP schema
const OtpSchema: Schema<IOtp> = new Schema({
  email: { type: String }, // Email field
  phoneNumber: { type: String }, // Phone number field
  otp: { type: String, required: true }, // OTP field (required)
  createdAt: { type: Date, default: Date.now, index: { expires: "10m" } }, // Creation timestamp with 10-minute expiry
});

// Ensure at least one of email or phoneNumber is provided
OtpSchema.path("email").validate(function (value) {
  return this.email || this.phoneNumber;
}, "Email or phone number is required");

// Create or reuse the OTP model
const Otp = mongoose.models.Otp || mongoose.model<IOtp>("Otp", OtpSchema);
export default Otp;

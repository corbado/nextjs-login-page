import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import Otp from "@/models/Otp";

// API route handler for verifying OTP
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Connect to the MongoDB database
  await dbConnect();

  // Extract email, phone number, and OTP from the request body
  const { email, phoneNumber, otp } = req.body;

  // Validate input: Ensure either email or phone number, and OTP are provided
  if ((!email && !phoneNumber) || !otp) {
    return res
      .status(400)
      .json({ message: "Email or phone number and OTP are required" });
  }

  // Find OTP record by email or phone number
  const otpRecord = email
    ? await Otp.findOne({ email }) // Find by email if email is provided
    : await Otp.findOne({ phoneNumber }); // Find by phone number if phone number is provided

  // Check if OTP record exists
  if (!otpRecord) {
    return res.status(400).json({ message: "OTP not found or expired" });
  }

  // Compare provided OTP with the hashed OTP in the database
  const isMatch = bcrypt.compareSync(otp, otpRecord.otp);

  // If OTP does not match, return an error
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  // Delete the OTP record after successful verification
  if (email) {
    await Otp.deleteOne({ email });
  } else if (phoneNumber) {
    await Otp.deleteOne({ phoneNumber });
  }

  // Respond with a success message
  return res.status(200).json({ message: "OTP verified successfully" });
}

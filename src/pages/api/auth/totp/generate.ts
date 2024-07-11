import { NextApiRequest, NextApiResponse } from "next";
import speakeasy from "speakeasy";
import qrcode from "qrcode";

// Define the function to handle 2FA generation
const generate2FA = (_req: NextApiRequest, res: NextApiResponse) => {
  // Generate a secret key for the 2FA
  const secret = speakeasy.generateSecret({
    length: 20,
    name: "Time-based One-Time Password (2FA)",
  });

  // Check if the OTPAuth URL was generated successfully
  if (secret.otpauth_url) {
    // Convert the OTPAuth URL into a QR code
    qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
      // Handle error in QR code generation
      if (err) {
        res.status(500).json({ error: "Error generating QR code" });
      } else {
        // Send the secret and QR code data back to the client
        res.status(200).json({ secret: secret.base32, qrCode: data_url });
      }
    });
  } else {
    // Handle error in generating the OTPAuth URL
    res.status(500).json({ error: "Error generating OTP auth URL" });
  }
};

export default generate2FA;

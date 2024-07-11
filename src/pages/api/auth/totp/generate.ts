import { NextApiRequest, NextApiResponse } from "next";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import Totp from "../../../../models/Totp";
import connectDb from "../../../../lib/mongodb";

const generate2FA = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDb();

  const { email } = req.body;

  const secret = speakeasy.generateSecret({
    length: 20,
    name: "Time-based One-time Password",
  });

  const user = await Totp.findOne({ email });

  if (user && user.twoFactorEnabled) {
    res.status(400).json({ error: "2FA already enabled" });
    return;
  }

  if (secret.otpauth_url) {
    qrcode.toDataURL(secret.otpauth_url, async (err, data_url) => {
      if (err) {
        res.status(500).json({ error: "Error generating QR code" });
      } else {
        await Totp.updateOne(
          { email },
          { email, secret: secret.base32, twoFactorEnabled: false },
          { upsert: true }
        );
        res.status(200).json({ secret: secret.base32, qrCode: data_url });
      }
    });
  } else {
    res.status(500).json({ error: "Error generating OTP auth URL" });
  }
};

export default generate2FA;

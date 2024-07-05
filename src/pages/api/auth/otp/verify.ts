import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import Otp from '@/models/Otp';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  const otpRecord = await Otp.findOne({ email });

  if (!otpRecord) {
    return res.status(400).json({ message: 'OTP not found or expired' });
  }

  const isMatch = bcrypt.compareSync(otp, otpRecord.otp);

  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  await Otp.deleteOne({ email }); // OTP can only be used once

  return res.status(200).json({ message: 'OTP verified successfully' });
}

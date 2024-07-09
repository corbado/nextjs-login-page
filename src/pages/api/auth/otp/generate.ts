import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer'; 
import bcrypt from 'bcryptjs'; 
import Otp from '@/models/Otp'; 
import dbConnect from '@/lib/mongodb';

// Function to generate a 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Function to create an Ethereal email account for testing purposes
const createEtherealAccount = async () => {
  // Create a test account using Ethereal
  let testAccount = await nodemailer.createTestAccount();

  // Configure the transporter using the test account
  return nodemailer.createTransport({
    host: testAccount.smtp.host, 
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

// Function to send an email with the OTP
const sendEmail = async (email: string, otp: string) => {
  // Create the transporter for sending the email
  let transporter = await createEtherealAccount();

  // Define the email options
  const mailOptions = {
    from: 'app@test.com', // Sender address
    to: email, // Recipient address
    subject: 'Your OTP Code', // Subject line
    text: `Your OTP code is ${otp}`, // Plain text body
  };

  // Send the email and log the preview URL
  let info = await transporter.sendMail(mailOptions);
  console.log('Email Preview URL: %s', nodemailer.getTestMessageUrl(info));
};

// API route handler for generating and sending OTP
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect(); // Connect to the MongoDB database

  const { email } = req.body; // Extract the email from the request body

  // Check if email is provided
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const otp = generateOtp(); // Generate a 6-digit OTP
  const hashedOtp = bcrypt.hashSync(otp, 10); // Hash the OTP using bcrypt

  // Create a new OTP record in the database
  const newOtp = new Otp({ email, otp: hashedOtp });
  await newOtp.save();

  // Send the OTP to the provided email address
  await sendEmail(email, otp);

  // Respond with a success message
  return res.status(200).json({ message: 'OTP sent successfully' });
}

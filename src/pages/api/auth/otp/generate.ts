import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import Otp from "@/models/Otp";
import dbConnect from "@/lib/mongodb";
import twilio from "twilio";

// Function to generate a 6-digit OTP
const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

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
    from: "app@test.com", // Sender address
    to: email, // Recipient address
    subject: "Your OTP Code", // Subject line
    text: `Your OTP code is ${otp}`, // Plain text body
  };

  // Send the email and log the preview URL
  let info = await transporter.sendMail(mailOptions);
  console.log("Email Preview URL: %s", nodemailer.getTestMessageUrl(info));
};

// Function to send an SMS with the OTP
const sendSms = async (phoneNumber: string, otp: string) => {
  // Create a Twilio client
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  // Send the OTP via SMS
  await client.messages.create({
    body: `Your OTP code is ${otp}`, // Message body
    from: process.env.TWILIO_PHONE_NUMBER, // Sender phone number
    to: phoneNumber, // Recipient phone number
  });
};

// API route handler for generating and sending OTP
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Connect to the MongoDB database
  await dbConnect();

  // Extract email, phone number, and delivery method from the request body
  const { email, phoneNumber, deliveryMethod } = req.body;

  // Validate input
  if (!email && !phoneNumber) {
    return res
      .status(400)
      .json({ message: "Email or phone number is required" });
  }
  if (!deliveryMethod || !["email", "sms"].includes(deliveryMethod)) {
    return res
      .status(400)
      .json({ message: "Valid delivery method is required" });
  }

  // Generate a 6-digit OTP and hash it
  const otp = generateOtp();
  const hashedOtp = bcrypt.hashSync(otp, 10);

  // Create a new OTP record in the database
  const newOtp = new Otp({
    email: deliveryMethod === "email" ? email : undefined, // Store email if the delivery method is email
    phoneNumber: deliveryMethod === "sms" ? phoneNumber : undefined, // Store phone number if the delivery method is SMS
    otp: hashedOtp, // Store the hashed OTP
  });
  await newOtp.save();

  // Send the OTP via the selected delivery method
  if (deliveryMethod === "email" && email) {
    await sendEmail(email, otp); // Send OTP via email
  } else if (deliveryMethod === "sms" && phoneNumber) {
    await sendSms(phoneNumber, otp); // Send OTP via SMS
  } else {
    return res
      .status(400)
      .json({
        message: "Invalid delivery method or missing contact information",
      });
  }

  // Respond with a success message
  return res.status(200).json({ message: "OTP sent successfully" });
}

import { NextApiRequest, NextApiResponse } from "next";
import connectDb from "../../../../lib/mongodb";
import Totp from "../../../../models/Totp";

const checkTOTPStatus = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDb();

  const { email } = req.body;

  const user = await Totp.findOne({ email });

  if (user) {
    res.status(200).json({ totpEnabled: user.totpEnabled });
  } else {
    res.status(404).json({ error: "User not found" });
  }
};

export default checkTOTPStatus;

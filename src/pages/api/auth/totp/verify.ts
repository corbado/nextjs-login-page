import { NextApiRequest, NextApiResponse } from 'next';
import speakeasy from 'speakeasy';

const verify2FA = (req: NextApiRequest, res: NextApiResponse) => {
  // Extract the token and secret from the request body
  const { token, secret } = req.body;
  
  // Verify the token using speakeasy
  const verified = speakeasy.totp.verify({
    secret,          // The shared secret key
    encoding: 'base32', 
    token,           // The TOTP token provided by the user
  });

  // Send the verification result back to the client
  res.status(200).json({ verified });
};

// Export the function as the default export of the module
export default verify2FA;

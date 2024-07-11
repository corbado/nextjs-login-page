"use client";
import Image from 'next/image';
import { useState } from 'react';

export default function TwoFactorAuth() {
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [token, setToken] = useState('');
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');

  const generateQrCode = async () => {
    const res = await fetch('/api/auth/totp/generate');
    const data = await res.json();
    setQrCode(data.qrCode);
    setSecret(data.secret);
    setToken('');
    setVerified(false);
    setError('');
  };

  const verifyToken = async () => {
    const res = await fetch('/api/auth/totp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, secret }),
    });
    const data = await res.json();
    if (data.verified) {
      setVerified(true);
      setError('');
    } else {
      setVerified(false);
      setError('Invalid Token. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Two-Factor Authentication</h1>
        {!verified && (
          <>
            {!qrCode && (
              <button 
                onClick={generateQrCode}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 w-full"
              >
                Generate QR Code
              </button>
            )}
            {qrCode && (
              <div>
                <div className="mb-4 text-center">
                  <Image src={qrCode} alt="QR Code" width={200} height={200} className="mx-auto" />
                  <p className="mt-2">1. Scan this QR code with your authenticator app.</p>
                  <p className="mt-2">2. Enter the code from the app below.</p> 
                </div>
                <div className="mb-4">
                  <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Enter the code from the app"
                    className="border rounded py-2 px-3 text-gray-700 w-full"
                  />
                  <button 
                    onClick={verifyToken}
                    className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4 w-full"
                  >
                    Verify code
                  </button>
                </div>
                {error && <p className="text-red-500 text-center">{error}</p>}
              </div>
            )}
          </>
        )}
        {verified && (
          <div className="border border-green-500 bg-green-100 p-4 rounded-lg mt-4 text-center">
            <h2 className="text-xl font-bold text-green-700">2FA Verified Successfully!</h2>
            <p className="mt-2 text-green-700">Your two-factor authentication is now enabled.</p>
          </div>
        )}
      </div>
    </div>
  );
}

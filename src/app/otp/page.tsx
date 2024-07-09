"use client";
import { useState } from 'react';

const OtpPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleGenerateOtp = async () => {
    if (!email) {
      setMessage('Email is required');
      setIsSuccess(false);
      return;
    }
    if (!validateEmail(email)) {
      setMessage('Invalid email format');
      setIsSuccess(false);
      return;
    }

    const res = await fetch('/api/auth/otp/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const result = await res.json();
    setMessage(result.message);
    if (res.status === 200) {
      setIsOtpSent(true);
      setIsSuccess(true);
    } else {
      setIsSuccess(false);
    }
  };

  const handleVerifyOtp = async () => {
    const res = await fetch('/api/auth/otp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });
    const result = await res.json();
    setMessage(result.message);
    if (res.status === 200) {
      setIsOtpVerified(true);
      setIsSuccess(true);
    } else {
      setIsSuccess(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-semibold mb-6 text-center">OTP Authentication</h1>
        {!isOtpSent ? (
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded mb-4"
            />
            <button
              onClick={handleGenerateOtp}
              className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
            >
              Generate OTP
            </button>
          </div>
        ) : (
          <div>
            {!isOtpVerified ? (
              <div>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded mb-4"
                />
                <button
                  onClick={handleVerifyOtp}
                  className="w-full bg-blue-500 text-white p-3 rounded"
                >
                  Verify OTP
                </button>
              </div>
            ) : (
              <div className="text-center">
                <h2 className="text-xl font-semibold text-green-500">Welcome</h2>
              </div>
            )}
          </div>
        )}
        {message && (
          <p
            className={`text-center mt-4 ${
              isSuccess ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default OtpPage;

"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function TwoFactorAuth() {
  const [email, setEmail] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [emailError, setEmailError] = useState("");

  // Check the 2FA status when the email changes
  useEffect(() => {
    const check2FAStatus = async () => {
      if (email) {
        const res = await fetch("/api/auth/totp/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        setTwoFactorEnabled(data.twoFactorEnabled);
      }
    };

    check2FAStatus();
  }, [email]);

  // Handle login process
  const handleLogin = async () => {
    if (!email) {
      setEmailError("Email is required");
      return;
    }
    setEmailError("");
    setLoggedIn(true);
  };

  // Generate QR code for 2FA setup
  const generateQrCode = async () => {
    const res = await fetch("/api/auth/totp/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setQrCode(data.qrCode);
    setToken("");
    setVerified(false);
    setError("");
  };

  // Verify the token entered by the user
  const verifyToken = async () => {
    const res = await fetch("/api/auth/totp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token }),
    });
    const data = await res.json();
    if (data.verified) {
      setVerified(true);
      setError("");
      setTwoFactorEnabled(true);
    } else {
      setVerified(false);
      setError("Invalid Token. Please try again.");
    }
  };

  // Handle logout process
  const handleLogout = () => {
    window.location.href = "http://localhost:3000/totp";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-xl font-bold mb-4 text-center">
          Time-based One-Time Passwords Login
        </h1>
        {/* Render login form if the user is not logged in */}
        {!loggedIn && (
          <>
            {emailError && (
              <p className="text-red-500 text-center mb-1">{emailError}</p>
            )}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="border rounded py-2 px-3 text-gray-700 w-full mb-4"
            />
            <button
              onClick={handleLogin}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 w-full"
            >
              Login with TOTP
            </button>
          </>
        )}
        {/* Show the generate QR code button if the user is logged in but 2FA is not enabled */}
        {loggedIn && !twoFactorEnabled && !qrCode && (
          <button
            onClick={generateQrCode}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 w-full"
          >
            Generate QR Code
          </button>
        )}
        {/* Show the token input and verify button if 2FA is enabled but not yet verified */}
        {loggedIn && twoFactorEnabled && !verified && !qrCode && (
          <>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter the code from the app"
              className="border rounded py-2 px-3 text-gray-700 w-full mb-4"
            />
            <button
              onClick={verifyToken}
              className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded mb-4 w-full"
            >
              Verify Code
            </button>
            {error && <p className="text-red-500 text-center">{error}</p>}
          </>
        )}
        {/* Show the QR code and token input fields for verification if not yet verified */}
        {qrCode && !verified && (
          <>
            <div className="mb-4 text-center">
              <Image
                src={qrCode}
                alt="QR Code"
                width={200}
                height={200}
                className="mx-auto"
              />
              <p className="mt-2">
                1. Scan this QR code with your authenticator app.
              </p>
              <p className="mt-2">2. Enter the code from the app.</p>
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
          </>
        )}
        {/* Show the 2FA enabled card and logout button if verification is successful */}
        {verified && twoFactorEnabled && (
          <>
            <div className="border border-green-500 bg-green-100 p-4 rounded-lg text-center mt-8 mb-4">
              <h5 className="font-bold text-green-700">Your TOTP is enabled</h5>
            </div>
            <button
              onClick={handleLogout}
              className="bg-blue-200 hover:bg-blue-400 font-bold py-2 px-4 rounded mt-4 w-full"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}

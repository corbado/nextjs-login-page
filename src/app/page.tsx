// pages/index.js

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-6">Welcome to Our App</h1>
        <p className="mb-4">Choose a login method:</p>
        <div className="flex flex-col space-y-4">
          <Link href="/totp">
            <p className="bg-white border border-blue-500 text-blue-500 font-bold py-2 px-4 rounded hover:bg-blue-400 hover:text-white">
              TOTP-based Authentication
            </p>
          </Link>
          <Link href="/otp">
            <p className="bg-white border border-blue-500 text-blue-500 font-bold py-2 px-4 rounded hover:bg-blue-400 hover:text-white">
              OTP-based Authentication via Email/SMS
            </p>
          </Link>
          <Link href="/googleLogin">
            <p className="bg-white border border-blue-500 text-blue-500 font-bold py-2 px-4 rounded hover:bg-blue-400 hover:text-white">
              Google-based Authentication
            </p>
          </Link>
          <Link href="/password/login">
            <p className="bg-white border border-blue-500 text-blue-500 font-bold py-2 px-4 rounded hover:bg-blue-400 hover:text-white">
              Email&Password-based Authentication
            </p>
          </Link>
          <Link href="/password/signup">
            <p className="bg-white border border-blue-500 text-blue-500 font-bold py-2 px-4 rounded hover:bg-blue-400 hover:text-white">
              Signup
            </p>
          </Link>
          
        </div>
      </div>
    </div>
  );
}

"use client";
import { signIn } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";

function SignInButton() {
  return (
    <button
      onClick={() => signIn("google", { prompt: "select_account" })}
      className="flex items-center justify-center px-4 py-2 rounded border-gray-900 border hover:bg-blue-100"
    >
      <FaGoogle className="mr-2" />
      Sign in with Google
    </button>
  );
}

export default SignInButton;

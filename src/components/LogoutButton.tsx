"use client";
import { signOut } from "next-auth/react";

function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/googleLogin" })}
      className="px-4 py-2 bg-blue-300 rounded hover:bg-blue-400"
    >
      Logout
    </button>
  );
}

export default LogoutButton;

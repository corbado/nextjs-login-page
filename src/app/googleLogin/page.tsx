"use client";
import { useSession } from "next-auth/react";
import SignInButton from "../../components/SignInButton";
import LogoutButton from "../../components/LogoutButton";

function GoogleLoginPage() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-semibold mb-4">
            Welcome, {session.user?.name}!
          </h1>
          <LogoutButton />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-semibold mb-4">Social Login</h1>
        <SignInButton />
      </div>
    </div>
  );
}

export default GoogleLoginPage;

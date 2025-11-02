"use client";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md text-center w-80">
        <h1 className="text-xl font-semibold mb-4">Welcome to Calendar</h1>
        <p className="text-gray-500 mb-6">Sign in to continue</p>
        <button
          onClick={() => signIn("google")}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

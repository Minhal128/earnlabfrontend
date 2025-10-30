"use client";
import React from 'react';
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  // Use Clerk's prebuilt SignIn UI which will display configured OAuth providers
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F1220]">
      <div className="w-full max-w-md p-6">
        <SignIn routing="path" path="/sign-in" redirectUrl="/home" />
      </div>
    </div>
  );
}

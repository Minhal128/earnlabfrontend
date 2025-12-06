"use client";
import React from 'react';
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  // Use Clerk's prebuilt SignUp UI for Facebook OAuth redirects
  // Google OAuth is handled directly in the modals
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F1220]">
      <div className="w-full max-w-md p-6">
        <SignUp routing="path" path="/sign-up" redirectUrl="/home" />
      </div>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import SignInModal from "@/Components/HomePage/SigninModal";

export default function SignInPage() {
  const router = useRouter();

  return (
    <SignInModal
      isOpen={true}
      onClose={() => router.push("/landing")}
      onForgotPassword={() => router.push("/sign-in")}
      onSignUp={() => router.push("/signup")}
    />
  );
}

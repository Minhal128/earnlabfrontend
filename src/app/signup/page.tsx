"use client";

import { useRouter } from "next/navigation";
import SignupModal from "@/Components/HomePage/SignupModal";

export default function SignUpPage() {
  const router = useRouter();

  return (
    <SignupModal
      isOpen={true}
      onClose={() => router.push("/landing")}
      onSignIn={() => router.push("/signin")}
    />
  );
}

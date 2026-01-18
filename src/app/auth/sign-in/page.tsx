"use client";

import { useEffect } from "react";
import { signIn } from "next-auth/react";
import { Spinner } from "@/components/ui/spinner";

export default function SignInPage() {
  useEffect(() => {
    const handleSignIn = async () => {
      try {
        await signIn("zendesk");
      } catch (error) {
        console.error("Sign in error:", error);
      }
    };

    handleSignIn();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner />
    </div>
  );
}

"use client";

import LogoLoader from "@/components/logo-loader";
import { signIn } from "next-auth/react";
import { useEffect } from "react";

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
    <>
      <LogoLoader />
      <p className="text-muted-foreground">Redirecting you to Zendesk</p>
    </>
  );
}

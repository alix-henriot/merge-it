"use client";

import { useEffect } from "react";
import { signIn } from "next-auth/react";
import { LogoLoader } from "@/components/logo-loader";

export default function SignInPage() {
  useEffect(() => {
    signIn("zendesk").catch((err) => console.error("Sign in error:", err));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <LogoLoader />
      <p className="mt-4 text-muted-foreground">Redirecting to Zendesk...</p>
    </div>
  );
}
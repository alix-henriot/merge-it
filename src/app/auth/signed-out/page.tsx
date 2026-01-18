"use client";

import { Button } from "@/components/ui/button";
import { useZendesk } from "@/hooks/use-zendesk";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useMessage from "@rottitime/react-hook-message-event";
import { Spinner } from "@/components/ui/spinner";

export default function AuthPage() {
  const { subdomain } = useZendesk();
  const router = useRouter();
  const { status, update } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!subdomain) return;
    const setCookie = async () =>
      await fetch("/api/set-subdomain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subdomain }),
      });
    setCookie();
  }, [subdomain]);

  useMessage("authenticate", (send, payload) => {
    const { success } = payload;
    if (!success) {
      setIsLoading(false);
      setError("Authentication failed");
    } else {
      update().then(() => router.push("/zendesk/sidebar"));
    }
  });

  const handleSignIn = async () => {
    if (!subdomain) {
      setError("No subdomain available");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const width = 500;
      const height = 300;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const callbackUrl = encodeURIComponent(`${window.location.origin}/auth/callback`);
      const authUrl = `/auth/sign-in?callbackUrl=${callbackUrl}`;

      const popup = window.open(
        authUrl,
        "zendesk-oauth",
        `width=${width},height=${height},left=${left},top=${top},popup=yes`
      );

      if (!popup || popup.closed || typeof popup.closed === "undefined") {
        setError("Popup blocked. Please allow popups for this site.");
        setIsLoading(false);
        return;
      }

      const pollTimer = setInterval(() => {
        if (popup.closed) {
          clearInterval(pollTimer);
          setTimeout(() => {
            if (isLoading) {
              setIsLoading(false);
            }
          }, 500);
        }
      }, 500);
    } catch (err) {
      console.error("Sign in error:", err);
      setError("Failed to sign in. Please try again.");
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center space-y-2 p-3 bg-background">
      <h2>Link your Zendesk account to start using Merge it</h2>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button variant="outline" onClick={handleSignIn} disabled={isLoading}>
        {isLoading ? <Spinner /> : "Sign in with Zendesk"}
      </Button>
    </div>
  );
}

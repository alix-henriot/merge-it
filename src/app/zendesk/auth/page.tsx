"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import useMessage from "@rottitime/react-hook-message-event";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useZendesk } from "@/hooks/use-zendesk";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AuthSidebarPage() {
  const router = useRouter();
  const { subdomain } = useZendesk();
  const { status, update } = useSession();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Persist Zendesk subdomain for API usage
   */
  useEffect(() => {
    if (!subdomain) return;

    fetch("/api/subdomain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subdomain }),
    }).catch(() => {
      // non-blocking
    });
  }, [subdomain]);

  /**
   * Listen for OAuth result from popup
   */
  useMessage("authenticate", (_, payload) => {
    if (!payload?.success) {
      setIsLoading(false);
      setError("Authentication failed. Please try again.");
      return;
    }

    update().then(() => router.push("/zendesk/sidebar"));
  });

  const handleSignIn = useCallback(() => {
    if (!subdomain) {
      setError("Zendesk subdomain not detected.\nPlease ensure this page is opened from Zendesk.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const width = 520;
    const height = 340;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const callbackUrl = encodeURIComponent(`${window.location.origin}/auth/callback`);
    const authUrl = `/auth/sign-in?callbackUrl=${callbackUrl}`;

    const popup = window.open(
      authUrl,
      "zendesk-oauth",
      `width=${width},height=${height},left=${left},top=${top},popup=yes`
    );

    if (!popup) {
      setError("Popup blocked. Please allow popups for this app.");
      setIsLoading(false);
      return;
    }

    const poll = setInterval(() => {
      if (popup.closed) {
        clearInterval(poll);
        setTimeout(() => setIsLoading(false), 400);
      }
    }, 500);
  }, [subdomain]);

  if (status === "loading") {
    return (
      <div className="flex h-full items-center justify-center p-3">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex h-full items-center justify-center p-3">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-xl font-semibold">
            Connect Zendesk
          </CardTitle>
          <CardDescription>
            Sign in to link your Zendesk account and start using Merge it.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleSignIn}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Spinner className="h-4 w-4" />
                Signing in…
              </span>
            ) : (
              "Sign in with Zendesk"
            )}
          </Button>
        </CardContent>

        <CardFooter className="text-xs text-muted-foreground text-center">
          Secure OAuth authentication via Zendesk
        </CardFooter>
      </Card>
    </div>
  );
}

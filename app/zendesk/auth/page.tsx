"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import useMessage from "@rottitime/react-hook-message-event";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { useZendesk } from "~/hooks/use-zendesk";
import { History, Merge, MessagesSquare, Unplug } from "lucide-react";
import Image from "next/image";
import { useResize } from "~/hooks/use-resize";

interface Feature {
  icon: React.ElementType;
  description: string;
}

const features: Feature[] = [
  { icon: History, description: "Check user’s ticket history" },
  { icon: Merge, description: "Merge tickets in a single click" },
  { icon: MessagesSquare, description: "See other ticket messages" },
];

export default function AuthSidebarPage() {
  const router = useRouter();
  const { subdomain, currentUser } = useZendesk();
  const { status, update } = useSession();
  const containerRef = useRef<HTMLDivElement>(null);
  const { resizeToContent } = useZendesk();
  useResize(containerRef, resizeToContent);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!subdomain) return;

    fetch("/api/subdomain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subdomain }),
    }).catch(console.error);
  }, [subdomain]);

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
      setError("Zendesk subdomain not detected. Please open this page from Zendesk.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const popup = window.open("/auth/sign-in", "zendesk-oauth");

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
      <div className="flex h-full items-center justify-center p-4">
        <Spinner aria-label="Loading session" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative p-6">
      <h2 className="text-3xl font-nohemi font-semibold text-primary mb-6">
        Welcome onboard, {currentUser?.name.split(" ").slice(0, -1).join(" ")}
      </h2>

      <span className="absolute top-4 right-4 w-6 h-6">
        <Image src="/logo.svg" alt="Merge It Logo" fill />
      </span>

      <div className="flex flex-col space-y-4 p-5 rounded-xl text-sm bg-muted text-muted-foreground mb-6">
        {features.map(({ icon: Icon, description }, idx) => (
          <div key={idx} className="flex items-center space-x-3">
            <span className="p-2 border rounded-full flex items-center justify-center w-8 h-8">
              <Icon className="w-4 h-4" />
            </span>
            <p>{description}</p>
          </div>
        ))}
      </div>

      <Button
        size="lg"
        className="w-full flex items-center justify-center gap-2"
        onClick={handleSignIn}
        disabled={isLoading}
        aria-busy={isLoading}
      >
        {isLoading ? (
          <>
            <Spinner className="h-4 w-4" /> Authenticating...
          </>
        ) : (
          <>
            <Unplug className="w-4 h-4" /> Connect your Zendesk
          </>
        )}
      </Button>

      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
      <p className="mt-1 text-xs text-muted-foreground">
        Merge It uses secure authentication via Zendesk OAuth.
      </p>
    </div>
  );
}
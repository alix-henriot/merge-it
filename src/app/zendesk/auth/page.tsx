"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import useMessage from "@rottitime/react-hook-message-event";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useZendesk } from "@/hooks/use-zendesk";
import { History, Merge, MessagesSquare, Unplug } from "lucide-react";
import Image from "next/image";

export default function AuthSidebarPage() {
  const router = useRouter();
  const { subdomain, resizeToContent, currentUser } = useZendesk();
  const { status, update } = useSession();
  const containerRef = useRef<HTMLDivElement>(null);
  

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

   useEffect(() => {
    const id = requestAnimationFrame(() => {
      resizeToContent(containerRef.current);
    });

    return () => cancelAnimationFrame(id);
  }, []);

  
    useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(() => {
      resizeToContent(containerRef.current);
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [resizeToContent]);

  /**
   * Persist Zendesk subdomain for API usage
   */
  useEffect(() => {
    if (!subdomain) return;

    fetch("/api/subdomain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subdomain }),
    })
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
    const authUrl = `/auth/sign-in`;

    const popup = window.open(
      authUrl,
      "zendesk-oauth",
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
    <div ref={containerRef} className="relative p-4">
      <h2 className="text-3xl font-nohemi font-semibold text-primary mb-5">
        Welcome <br/>
        onboard, {" "}
        {currentUser?.name.split(" ").slice(0, -1).join(" ")}
      </h2>
      <span className="absolute top-4 right-4 aspect-square w-6">
        <Image src="/logo.svg" className="" alt="Merge it Logo" fill/>
      </span>
      <div className="flex flex-col space-y-5 p-5 pb-6 rounded-xl text-sm bg-muted text-muted-foreground mb-6">
        <div className="flex flex-row space-x-3 items-center">
          <span className="p-2 border rounded-full aspect-square max-w-8">
            <History className="size-full"/>
          </span>
          <p>Check user’s ticket history</p>
        </div>
        <div className="flex flex-row space-x-3 items-center">
          <span className="p-2 border rounded-full aspect-square max-w-8">
            <Merge className="size-full"/>
          </span>
          <p>Merge tickets in a single click</p>
        </div>
        <div className="flex flex-row space-x-3 items-center">
          <span className="p-2 border rounded-full aspect-square max-w-8">
            <MessagesSquare className="size-full"/>
          </span>
          <p>See other tickets messages</p>
        </div>
      </div>

      <Button size="lg" className="w-full"
      onClick={handleSignIn}
            disabled={isLoading}
      > 
        {isLoading ? (<><Spinner className="h-4 w-4" /> {"Authenticatiion requested"}</>)
            :
          (<><Unplug/> {"Connect your Zendesk"}</>)}</Button>
      <span className="text-xs text-danger">{error}</span>
      <span className="text-xs text-muted-foreground">Merge It uses secure authentication via Zendesk OAuth.</span>
    </div>
  );
}

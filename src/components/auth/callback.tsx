"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import useMessage from "@rottitime/react-hook-message-event";
import { LogoLoader } from "../logo-loader";

export function Callback() {
  const { status } = useSession();
  const { sendToParent } = useMessage("authenticate");
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current || status === "loading") return;
    hasRun.current = true;

    const searchParams = new URLSearchParams(window.location.search);
    const error = searchParams.get("error");
    const success = status === "authenticated" && !error;

    sendToParent({ type: "authenticate", payload: { success, error } });

    if (window.opener) {
      setTimeout(() => window.close(), 300);
    } else {
      window.location.replace(success ? "/" : "/login");
    }
  }, [status, sendToParent]);

  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <LogoLoader />
      <p className="mt-4 text-muted-foreground">
        {status === "loading"
          ? "Finalizing connection..."
          : status === "authenticated"
          ? "Successfully authenticated!"
          : "Authentication failed."}
      </p>
    </div>
  );
}
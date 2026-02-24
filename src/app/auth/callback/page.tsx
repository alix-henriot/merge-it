"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import useMessage from "@rottitime/react-hook-message-event";
import LogoLoader from "@/components/logo-loader";

export default function CallbackPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const { sendToParent } = useMessage("authenticate");

  useEffect(() => {
    if (window.opener) {
      sendToParent({
        type: "authenticate",
        payload: { success: true },
      });

      setTimeout(() => {
        window.close();
      }, 2000);
    } else {
      window.location.href = "/";
    }
  }, [error, sendToParent]);

  return (
    <>
      <LogoLoader />
      <p className="text-muted-foreground">
        {error ? "Authentication failed" : "Successfully authenticated"}
      </p>
    </>
  );
}

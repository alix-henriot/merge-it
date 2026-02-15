"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import useMessage from "@rottitime/react-hook-message-event";
import { Spinner } from "@/components/ui/spinner";

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
      }, 1000);
    } else {
      window.location.href = "/";
    }
  }, [error, sendToParent]);

  return (
    <Suspense fallback={"Could not read Search Paramters"}>
      {error ? "Did not work out" : <Spinner/>}
    </Suspense>
  );
}

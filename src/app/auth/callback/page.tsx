"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import useMessage from "@rottitime/react-hook-message-event";
import { CircleX } from "lucide-react";
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
  }, [error]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-4">
      {error ? <CircleX className="text-red-600" /> : <Spinner />}
    </div>
  );
}

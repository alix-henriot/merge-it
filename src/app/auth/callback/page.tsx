"use client";

import { Suspense } from "react";
import { LogoLoader } from "@/components/logo-loader";
import { Callback } from "@/components/auth/callback";

export default function CallbackPage() {
  return (
    <Suspense fallback={<LogoLoader />}>
      <Callback />
    </Suspense>
  );
}

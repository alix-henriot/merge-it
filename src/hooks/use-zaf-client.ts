"use client";

import { useEffect, useState } from "react";
import type { ZAFClient } from "zafclient";
import { getZafClient } from "@/lib/zaf-client";

export function useZafClient() {
  const [client, setClient] = useState<ZAFClient | null>(null);

  useEffect(() => {
    let mounted = true;

    getZafClient().then((instance) => {
      if (mounted) {
        setClient(instance);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  return client;
}

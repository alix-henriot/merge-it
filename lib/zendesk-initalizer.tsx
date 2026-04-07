"use client";

import Script from "next/script";
import { useZendesk } from "~/hooks/use-zendesk";

export function ZendeskInitializer() {
  const { setClient } = useZendesk();

  const handleReady = () => {
    if (window.ZAFClient) {
      const client = window.ZAFClient.init();
      setClient(client);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleError = (e: any) => {
    throw new Error(`Zendesk Client not available`, e);
  };
  return (
    <Script
      src="https://static.zdassets.com/zendesk_app_framework_sdk/2.0/zaf_sdk.min.js"
      async
      strategy="afterInteractive"
      onReady={handleReady}
      onError={handleError}
    />
  );
}

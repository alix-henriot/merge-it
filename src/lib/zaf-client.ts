import type { ZAFClient } from "zafclient";

declare global {
  interface Window {
    ZAFClient: {
      init: () => ZAFClient;
    };
  }
}

let client: ZAFClient | null = null;
let sdkLoading: Promise<void> | null = null;

function loadZafSdk(): Promise<void> {
  if (sdkLoading) return sdkLoading;

  sdkLoading = new Promise((resolve, reject) => {
    if (window.ZAFClient) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://static.zdassets.com/zendesk_app_framework_sdk/2.0/zaf_sdk.min.js";
    script.async = true;

    script.onload = () => resolve();
    script.onerror = reject;

    document.body.appendChild(script);
  });

  return sdkLoading;
}

export async function getZafClient(): Promise<ZAFClient> {
  if (client) return client;

  await loadZafSdk();

  client = window.ZAFClient.init();
  client.invoke("resize", { width: "100%", height: "400px" });

  return client;
}

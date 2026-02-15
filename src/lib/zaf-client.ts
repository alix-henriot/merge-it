import type { ZAFClient } from "zafclient";

let client: ZAFClient | null = null;
let clientPromise: Promise<ZAFClient> | null = null;
let sdkLoading: Promise<void> | null = null;

function loadZafSdk(): Promise<void> {
  if (sdkLoading) return sdkLoading;

  sdkLoading = new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("ZAF SDK cannot load on the server"));
      return;
    }

    if ((window as Window).ZAFClient) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://static.zdassets.com/zendesk_app_framework_sdk/2.0/zaf_sdk.min.js";
    script.async = true;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Zendesk App Framework SDK"));

    document.body.appendChild(script);
  });

  return sdkLoading;
}

export function getZafClient(): Promise<ZAFClient> {
  if (client) {
    return Promise.resolve(client);
  }

  if (clientPromise) {
    return clientPromise;
  }

  clientPromise = (async () => {
    await loadZafSdk();

    const ZAF = (window as Window).ZAFClient;
    if (!ZAF || typeof ZAF.init !== "function") {
      throw new Error("ZAFClient SDK not available");
    }

    const instance = ZAF.init() as ZAFClient;

    instance.invoke("resize", { width: "100%", height: "400px" });

    client = instance;
    return instance;
  })();

  return clientPromise;
}

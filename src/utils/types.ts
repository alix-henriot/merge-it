import { ZAFClientStatic } from "zafclient";

declare global {
  interface Window {
    ZAFClient: ZAFClientStatic | undefined;
  }
}

export {};

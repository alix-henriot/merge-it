"use client";

import { createContext, useContext } from "react";
import { useZendesk as useZendeskInternal } from "./use-zendesk";

const ZendeskContext = createContext<ReturnType<typeof useZendeskInternal> | null>(null);

export function ZendeskProvider({ children }: { children: React.ReactNode }) {
  const zendesk = useZendeskInternal();
  return (
    <ZendeskContext.Provider value={zendesk}>
      {children}
    </ZendeskContext.Provider>
  );
}

export function useZendesk() {
  const ctx = useContext(ZendeskContext);
  if (!ctx) throw new Error("useZendesk must be used inside ZendeskProvider");
  return ctx;
}

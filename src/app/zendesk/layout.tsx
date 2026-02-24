"use client";

import { ZendeskProvider } from "@/hooks/use-zendesk";
import { ZendeskInitializer } from "@/lib/zendesk-initalizer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ZendeskProvider>
      <ZendeskInitializer />
      {children}
    </ZendeskProvider>
  );
}

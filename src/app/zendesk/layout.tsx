"use client";

import { ZendeskProvider } from "@/hooks/use-zendesk";

export default function layout({children}: {
    children: React.ReactNode
}) {
  return (
    <ZendeskProvider>
        {children}
    </ZendeskProvider>
  )
}
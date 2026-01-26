"use client";

import { ZendeskProvider } from '@/hooks/zendesk-context'

export default function layout({children}: {
    children: React.ReactNode
}) {
  return (
    <ZendeskProvider>
        {children}
    </ZendeskProvider>
  )
}
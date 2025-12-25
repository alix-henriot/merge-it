"use client";

import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { Ticket } from "node-zendesk/clients/core/tickets";
import { useState } from "react";

export default function TicketCopyButton({ id }: Ticket) {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(String(id));
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy ticket ID", err);
    }
  };

  return (
    <Button
      size="xs"
      className="p-0 hover:bg-transparent"
      aria-label={`Copy ticket #${id}`}
      variant="ghost"
      onClick={handleCopy}
      disabled={copied}
    >
      #{id}
      {copied ? <Check className="size-2.5 text-green-500" /> : <Copy className="size-2.5" />}
    </Button>
  );
}

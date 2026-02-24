"use client";

import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { Ticket } from "node-zendesk/clients/core/tickets";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function TicketCopyButton({ id }: Ticket) {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(String(id));
      setCopied(true);

      setTimeout(() => setCopied(false), 500);
    } catch (err) {
      console.error("Failed to copy ticket ID", err);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="xs"
          className="p-0"
          aria-label={`Copy ticket #${id}`}
          variant="ghost"
          onClick={handleCopy}
          disabled={copied}
        >
          {copied ? "Copied" : `#${id}`}
          <Copy className="size-2.5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Copy #{id}</TooltipContent>
    </Tooltip>
  );
}

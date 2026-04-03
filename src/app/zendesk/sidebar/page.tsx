"use client";

import TicketCard from "@/components/ticket/ticket-card";
import { mergeTickets } from "@/lib/zendesk/merge";
import { useRef } from "react";
import { Ticket } from "node-zendesk/clients/core/tickets";
import { useInstances } from "@/hooks/use-instances";
import { Button } from "@/components/ui/button";
import { useZendesk } from "@/hooks/use-zendesk";
import { LogoLoader } from "@/components/logo-loader";
import { TicketMergeFormValues } from "@/components/ticket/ticket-merge-form";
import { toast } from "sonner";
import { useResize } from "@/hooks/use-resize";

export default function Page() {
  const {
    client,
    currentUser,
    assignees,
    tickets,
    activeTicket,
    setTickets,
    resizeToContent,
    nextPage,
    getNextPage,
  } = useZendesk();
  const { spreadTicketUpdate } = useInstances(setTickets);

  const containerRef = useRef<HTMLDivElement>(null);
  useResize(containerRef, resizeToContent);

  const handleMerge = async (sourceId: number, targetId: number, values: TicketMergeFormValues) => {
    if (!client || !currentUser) {
      throw new Error("Client not ready");
    }

    let previous: Ticket | undefined;

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== sourceId) return t;

        previous = t;
        return {
          ...t,
          isMerging: false,
          status: "closed",
          assignee: currentUser,
        };
      })
    );

    try {
      const response = toast.promise(mergeTickets({ sourceId, targetId: targetId, ...values }), {
        loading: "Merging ticket…",
        success: (result) => `Ticket #${result.mergedFrom} merged into #${result.mergedInto}`,
        error: (err) => err.message ?? "Merge failed",
      });
      const result = await response.unwrap();
      spreadTicketUpdate({
        id: result.mergedFrom,
        data: {
          isMerging: false,
          status: "closed",
          assignee: currentUser,
        },
      });
      return result;
    } catch (error) {
      if (previous) {
        setTickets((prev) => prev.map((t) => (t.id === sourceId ? previous! : t)));
      }

      throw error;
    }
  };

  const handleRedirect: (id: number) => Promise<void> = async (id: number) =>
    await client?.invoke("routeTo", "ticket", id);

  const isActiveTicketClosed = activeTicket?.status === "closed";

  const assigneeMap = new Map(assignees.map((u) => [u.id, u]));

  return (
    <div
      ref={containerRef}
      className="w-full flex flex-col p-1.5 space-y-2 bg-background max-h-[450] overflow-y-auto"
    >
      {tickets.length === 0 ? (
        <LogoLoader className="mx-auto w-24 text-primary" />
      ) : (
        <>
          {tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              active={activeTicket!}
              isActiveTicketClosed={isActiveTicketClosed}
              handleMerge={handleMerge}
              onRedirect={handleRedirect}
              assignee={ticket.assignee_id ? assigneeMap.get(ticket.assignee_id) : undefined}
            />
          ))}
          {nextPage && (
            <Button onClick={getNextPage} variant="secondary">
              See more
            </Button>
          )}
        </>
      )}
    </div>
  );
}

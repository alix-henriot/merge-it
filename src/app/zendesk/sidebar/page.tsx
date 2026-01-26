"use client";

import TicketCard from "@/components/ticket/ticket-card";
import { mergeTickets } from "@/lib/zendesk/merge";
import TicketCardSkeleton from "@/components/ticket/ticket-card-skeleton";
import { useTicketCommentsCache } from "@/hooks/use-ticket-comments-cache";
import { useZendesk } from "@/hooks/zendesk-context";
import { Suspense } from "react";
import { Ticket } from "node-zendesk/clients/core/tickets";
import { useInstances } from "@/hooks/use-instances";
import { Button } from "@/components/ui/button";
import { createTicket } from "@/lib/zendesk/tickets";

export default function SidebarPage() {

  const { client, currentUser, assignees, tickets, activeTicket, setTickets } = useZendesk();

  const { setUpdateTicket } = useInstances();

  const { commentsByTicket, authorsByTicket, loadIfNeeded, invalidate } = useTicketCommentsCache();


  const handleMerge = async (sourceTicketId: number) => {
    if (!client || !currentUser) {
      throw new Error("Client not ready");
    }

    let previous: Ticket | undefined;

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== sourceTicketId) return t;

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
      const { ["ticket.id"]: activeId } = await client.get(["ticket.id"]);
      await mergeTickets(sourceTicketId, Number(activeId));
      invalidate(sourceTicketId);
      setUpdateTicket({
        id: sourceTicketId,
        data: {
          isMerging: false,
          status: "closed",
          assignee: currentUser,
        },
      });   
    } catch (error) {
      if (previous) {
        setTickets((prev) => prev.map((t) => (t.id === sourceTicketId ? previous! : t)));
      }

      throw error;
    };
  };

  const handleRedirect: (id: number) => Promise<void> = async (id: number) =>
    await client?.invoke("routeTo", "ticket", id);

  const isActiveTicketClosed = activeTicket?.status === "closed";

  const handleCreateTicket = async () => {
    
    try {
      await createTicket()
    } catch (error) {
      console.log(error)
    }
  }

  const assigneeMap = new Map(assignees.map((u) => [u.id, u]));

  return (
    <div className="w-full flex flex-col space-y-2 bg-background overflow-y-auto">
      {
        process.env.NODE_ENV === "development" && (
          <Button variant="outline" onClick={handleCreateTicket}>Create ticket</Button>
        )
      }
      <Suspense fallback={<TicketCardSkeleton />}>
        {tickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            active={ticket.id === activeTicket?.id}
            isActiveTicketClosed={isActiveTicketClosed}
            handleMerge={handleMerge}
            onRedirect={handleRedirect}
            comments={commentsByTicket[ticket.id] ?? []}
            authors={authorsByTicket[ticket.id] ?? new Map()}
            onHoverLoadComments={loadIfNeeded}
            assignee={ticket.assignee_id ? assigneeMap.get(ticket.assignee_id) : undefined}
          />
        ))}
      </Suspense>
    </div>
  );
}

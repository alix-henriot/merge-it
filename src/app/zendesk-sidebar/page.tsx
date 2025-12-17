"use client";

import { useEffect, useState } from "react";
import { useZafClient } from "@/hooks/use-zaf-client";
import type { Ticket } from "node-zendesk/clients/core/tickets";
import { Spinner } from "@/components/ui/spinner";
import TicketCard from "@/components/ticket/ticket-card";
import { getRequesterTickets } from "../actions/zendesk/tickets";
import { mergeTickets } from "../actions/zendesk/merge";

export default function SidebarPage() {
  const client = useZafClient();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!client) return;

    const fetchRequesterTickets = async () => {
      try {
        const data = await client.get(["ticket.requester.id"]);

        const requesterId = Number(data["ticket.requester.id"]);

        const { tickets } = await getRequesterTickets(requesterId);
        setTickets(tickets);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequesterTickets();
  }, [client]);

  const handleMerge = async (sourceTicketId: number): Promise<{ success: boolean }> => {
    setLoading(true);
    try {
      const data = await client?.get("ticket.id");
      if (!data) return { success: false };
      const targetTicketId = Number(data["ticket.id"]);
      const res = await mergeTickets(sourceTicketId, targetTicketId);

      return res;
    } catch (err) {
      console.error(err);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col p-3 space-y-2 bg-background overflow-y-auto">
      {loading && <Spinner />}

      {tickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} handleMerge={handleMerge} />
      ))}
    </div>
  );
}

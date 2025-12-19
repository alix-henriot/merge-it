"use client";

import { useEffect, useState } from "react";
import { useZafClient } from "@/hooks/use-zaf-client";
import type { Ticket } from "node-zendesk/clients/core/tickets";
import { Spinner } from "@/components/ui/spinner";
import TicketCard from "@/components/ticket/ticket-card";
import { getRequesterTickets } from "../actions/zendesk/tickets";
import { mergeTickets } from "../actions/zendesk/merge";
import { getUser } from "../actions/zendesk/user";

export default function SidebarPage() {
  const client = useZafClient();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeTicketId, setActiveTicketId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!client) return;

    const fetchRequesterTickets = async () => {
      try {
        const data = await client.get(["ticket.requester.id", "ticket.id"]);

        const requesterId = Number(data["ticket.requester.id"]);
        const ticketId = Number(data["ticket.id"]);

        setActiveTicketId(ticketId);

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

  const handleMerge = async (sourceTicketId: number) => {
    setLoading(true);
    try {
      const data = await client?.get("ticket.id");
      if (!data) throw new Error("Could not get active ticket ID");
      const currentActiveTicketId = Number(data["ticket.id"]);
      const response = await mergeTickets(sourceTicketId, currentActiveTicketId);

      // Remove the merged ticket from the array
      setTickets((prevTickets) => prevTickets.filter((ticket) => ticket.id !== sourceTicketId));

      return response;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col p-3 space-y-2 bg-background overflow-y-auto">
      {loading && <Spinner />}

      {tickets.map((ticket) => (
        <TicketCard 
          key={ticket.id} 
          ticket={ticket} 
          handleMerge={handleMerge}
          isActive={activeTicketId === ticket.id}
        />
      ))}
    </div>
  );
}

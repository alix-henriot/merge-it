import { useEffect, useState } from "react";
import { ZAFClient } from "zafclient";
import { User } from "node-zendesk/clients/core/users";
import { getZafClient } from "@/lib/zaf-client";
import { Ticket } from "node-zendesk/clients/core/tickets";
import { TicketWithAssignee } from "~/types/zendesk";

export function useZendesk() {
  const [client, setClient] = useState<ZAFClient | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [subdomain, setSubdomain] = useState<string | null>(null);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [assignees, setAssignees] = useState<User[]>([]);

  /** Initialize ZAF client */
  useEffect(() => {
    let mounted = true;

    getZafClient().then((instance) => {
      if (mounted) setClient(instance);
    });

    return () => {
      mounted = false;
    };
  }, []);

  /** Fetch current user */
  useEffect(() => {
    if (!client) return;

    let mounted = true;

    client.get(["currentUser"]).then(({ currentUser }) => {
      if (mounted) setCurrentUser(currentUser as unknown as User);
    });

    return () => {
      mounted = false;
    };
  }, [client]);

  /** Get active ticket */
  useEffect(() => {
    if (!client) return;

    let mounted = true;

    client.get(["ticket"]).then(({ ticket }) => {
      if (mounted) setActiveTicket(ticket as unknown as Ticket);
    });

    return () => {
      mounted = false;
    };
  }, [client]);

  /** Fetch account context */
  useEffect(() => {
    if (!client) return;

    let mounted = true;

    client.context().then(({ account }) => {
      if (mounted) setSubdomain(account.subdomain);
    });

    return () => {
      mounted = false;
    };
  }, [client]);

  /** Fetch requester tickets */
  useEffect(() => {
    if (!client || !currentUser || !activeTicket) return;

    let mounted = true;

    client
      .request({
        url: `/api/v2/users/${(activeTicket.requester as Partial<User>)?.id}/tickets/requested.json`,
        type: "GET",
        data: {
          sort_by: "created_at",
          sort_order: "desc",
        },
      })
      .then(({ tickets }) => {
        if (mounted) {
          setTickets(tickets);
        }
      });

    return () => {
      mounted = false;
    };
  }, [client, currentUser, activeTicket]);

  /** Fetch tcikets assignees */
  useEffect(() => {
    if (!client || !tickets) return;

    let mounted = true;

    const ids = Array.from(
      new Set(
        tickets.map((t) => t.assignee_id).filter((id): id is number => typeof id === "number")
      )
    );

    client
      .request({
        url: `/api/v2/users/show_many.json?ids=${ids}`,
        type: "GET",
        //data: { ids },
      })
      .then(({ users }) => {
        if (mounted) {
          setAssignees(users);
        }
      });

    return () => {
      mounted = false;
    };
  }, [client, tickets]);

  return {
    assignees,
    client,
    currentUser,
    subdomain,
    tickets,
    setTickets,
    activeTicket,
  };
}

"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { ZAFClient } from "zafclient";
import { User } from "node-zendesk/clients/core/users";
import { Ticket } from "node-zendesk/clients/core/tickets";
import { TicketWithAssignee } from "~/types/zendesk";

type ZendeskState = {
  client: ZAFClient | null;
  setClient: React.Dispatch<React.SetStateAction<ZAFClient | null>>;
  currentUser: User | null;
  subdomain: string | null;
  activeTicket: Ticket | null;
  tickets: TicketWithAssignee[];
  nextPage: string | null;
  assignees: User[];
  setTickets: React.Dispatch<React.SetStateAction<TicketWithAssignee[]>>;
  getNextPage: () => void;
  resizeToContent: (el?: HTMLElement | null) => void;
};

const ZendeskContext = createContext<ZendeskState | null>(null);

export function ZendeskProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<ZAFClient | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [subdomain, setSubdomain] = useState<string | null>(null);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [tickets, setTickets] = useState<TicketWithAssignee[]>([]);
  const [assignees, setAssignees] = useState<User[]>([]);
  const [nextPage, setNextPage] = useState<string | null>(null);

  const resizeToContent = (el?: HTMLElement | null) => {
    if (!client || !el) return;

    const height = el.clientHeight;

    client.invoke("resize", {
      width: "100%",
      height: `${height}px`,
    });
  };

  useEffect(() => {
    if (!client) return;
    let mounted = true;

    client.get(["currentUser"]).then(({ currentUser }) => {
      if (mounted) {
        setCurrentUser(currentUser as unknown as User);
      }
    });

    return () => {
      mounted = false;
    };
  }, [client]);

  useEffect(() => {
    if (!client) return;
    let mounted = true;

    client.get(["ticket"]).then(({ ticket }) => {
      if (mounted) {
        setActiveTicket(ticket as unknown as Ticket);
      }
    });

    return () => {
      mounted = false;
    };
  }, [client]);

  useEffect(() => {
    if (!client) return;
    let mounted = true;

    client.context().then(({ account }) => {
      if (mounted) {
        setSubdomain(account.subdomain);
      }
    });

    return () => {
      mounted = false;
    };
  }, [client]);

  /* ---------------- requester tickets ---------------- */

  useEffect(() => {
    if (!client || !currentUser || !activeTicket) return;
    let mounted = true;

    client
      .request({
        url: `/api/v2/users/${(activeTicket.requester as User)?.id}/tickets/requested.json`,
        type: "GET",
        data: {
          sort_by: "created_at",
          sort_order: "desc",
          per_page: 4,
        },
      })
      .then(({ tickets, next_page }) => {
        if (mounted) {
          setTickets(tickets);
          setNextPage(next_page);
        }
      });

    return () => {
      mounted = false;
    };
  }, [client, currentUser, activeTicket]);

  function getNextPage() {
    if (!client || !nextPage || !activeTicket) return;

    client
      .request({
        url: nextPage,
        type: "GET",
        data: {
          sort_by: "created_at",
          sort_order: "desc",
          per_page: 4,
        },
      })
      .then(({ tickets, next_page }) => {
        setTickets((prev) => [...prev, ...tickets]);
        setNextPage(next_page);
      });
  }

  useEffect(() => {
    if (!client || tickets.length === 0) return;
    let mounted = true;

    const ids = Array.from(
      new Set(
        tickets.map((t) => t.assignee_id).filter((id): id is number => typeof id === "number")
      )
    );

    if (!ids.length) return;

    client
      .request({
        url: `/api/v2/users/show_many.json?ids=${ids.join(",")}`,
        type: "GET",
      })
      .then(({ users }) => mounted && setAssignees(users));

    return () => {
      mounted = false;
    };
  }, [client, tickets]);

  /* ---------------- context value ---------------- */

  const value: ZendeskState = {
    client,
    setClient,
    currentUser,
    subdomain,
    activeTicket,
    tickets,
    nextPage,
    getNextPage,
    assignees,
    setTickets,
    resizeToContent,
  };

  return <ZendeskContext.Provider value={value}>{children}</ZendeskContext.Provider>;
}

/* ------------------------------------------------------------------ */
/* Hook */
/* ------------------------------------------------------------------ */

export function useZendesk() {
  const ctx = useContext(ZendeskContext);
  if (!ctx) {
    throw new Error("useZendesk must be used inside ZendeskProvider");
  }
  return ctx;
}

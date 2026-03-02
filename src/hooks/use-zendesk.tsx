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

/**
 * Internal React context storing Zendesk runtime state.
 * @internal
 */
const ZendeskContext = createContext<ZendeskState | null>(null);


/**
 * Provides Zendesk runtime state to the application.
 *
 * Responsibilities:
 * - Initializes Zendesk context data (user, ticket, subdomain)
 * - Fetches requester ticket history
 * - Handles pagination
 * - Resolves assignee identities
 * - Exposes iframe resize helper
 *
 * Must wrap any component using {@link useZendesk}.
 *
 * @param children React subtree requiring Zendesk context
 *
 * @example
 * ```tsx
 * <ZendeskProvider>
 *   <App />
 * </ZendeskProvider>
 * ```
 */

export function ZendeskProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<ZAFClient | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [subdomain, setSubdomain] = useState<string | null>(null);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [tickets, setTickets] = useState<TicketWithAssignee[]>([]);
  const [assignees, setAssignees] = useState<User[]>([]);
  const [nextPage, setNextPage] = useState<string | null>(null);


  /**
   * Resizes the Zendesk iframe to match the height of a given element.
   *
   * Useful when rendering dynamic content inside sidebar apps
   * where Zendesk does not automatically adjust iframe height.
   *
   * @param el Element used to calculate height
   */
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

  /**
   * Fetches the next page of requester tickets.
   *
   * Appends results to the existing ticket list.
   * Does nothing if pagination cursor is missing.
   */
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


/**
 * Access the Zendesk application context.
 *
 * Provides runtime access to:
 * - Client
 * - Current user
 * - Active ticket
 * - Requester ticket history
 * - Assignees
 * - Pagination helpers
 *
 * @throws Error if used outside {@link ZendeskProvider}
 *
 * @returns {ZendeskState} Zendesk context state
 *
 * @example
 * ```ts
 * const { activeTicket, tickets, getNextPage } = useZendesk();
 * ```
 */
export function useZendesk() {
  const ctx = useContext(ZendeskContext);
  if (!ctx) {
    throw new Error("useZendesk must be used inside ZendeskProvider");
  }
  return ctx;
}

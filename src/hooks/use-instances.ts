"use client";
import { useEffect } from "react";
import { useSessionStorage } from "usehooks-ts";
import { TicketWithAssignee } from "~/types/zendesk";
import { useZendesk } from "./use-zendesk";


type TicketUpdate = {
  id: number;
  data: Partial<TicketWithAssignee>;
};

/**
 * Synchronizes ticket updates across multiple running instances of the app
 * (for example when rendered inside multiple Zendesk iframes).
 *
 * This hook uses the [`sessionStorage API`](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)
 * as a lightweight broadcast mechanism to propagate ticket updates between instances.
 *
 * When a ticket is updated in one instance, the update is written to session storage.
 * All other instances listening to the same storage key automatically receive
 * the update and merge it into their local state.
 *
 * @returns {{
 *  spreadTicketUpdate: (value: TicketUpdate | null) => void
 * }} An object containing a function used to broadcast ticket updates to all other instances.
 *
 * @public
 *
 * @example
 * ```ts
 * const { spreadTicketUpdate } = useInstances();
 *
 * spreadTicketUpdate({
 *   id: 123,
 *   data: { status: "open" }
 * });
 * ```
 *
 * This will update ticket `123` across all mounted instances of the app.
 */

export function useInstances() {
  const [updateTicket, setUpdateTicket] = useSessionStorage<TicketUpdate | null>(
    "ticket-update",
    null
  );

  const { setTickets } = useZendesk();

  useEffect(() => {
    if (!updateTicket) return;

    const { id, data } = updateTicket;

    setTickets((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              ...data,
            }
          : t
      )
    );
  }, [updateTicket, setTickets]);

  return {
    spreadTicketUpdate: setUpdateTicket,
  };
}

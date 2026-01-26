import { useEffect } from "react";
import { useSessionStorage } from "usehooks-ts";
import { TicketWithAssignee } from "~/types/zendesk";
import { useZendesk } from "./use-zendesk";

/**
 * This Hook allows to update simultaneously all instances of the app on Zendesk via session storage.
 */

type TicketUpdate = {
  id: number;
  data: Partial<TicketWithAssignee>;
};

export function useInstances() {
  const [updateTicket, setUpdateTicket] =
    useSessionStorage<TicketUpdate | null>("ticket-update", null);

  const { setTickets } = useZendesk();

  // React to updates coming from OTHER iframes
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
    setUpdateTicket,
  };
}

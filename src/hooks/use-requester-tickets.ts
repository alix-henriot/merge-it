import { useEffect, useState } from "react";
import { getRequesterTickets } from "@/app/actions/zendesk/tickets";
import { getManyUsers } from "@/app/actions/zendesk/users";
import { ZAFClient } from "zafclient";
import { TicketWithAssignee } from "@/utils/types";

export function useRequesterTickets(client: ZAFClient | null) {
  const [tickets, setTickets] = useState<TicketWithAssignee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!client) return;

    let cancelled = false;

    (async () => {
      try {
        const { ticket: active } = await client.get(["ticket"]);

        const requesterTickets = await getRequesterTickets(active.requester.id);

        const assigneeIds = Array.from(
          new Set(
            requesterTickets
              .map((t) => t.assignee_id)
              .filter((id): id is number => typeof id === "number")
          )
        );

        const users = assigneeIds.length ? await getManyUsers(assigneeIds) : [];
        const assigneeMap = new Map(users.map((u) => [u.id, u]));

        const enriched = requesterTickets.map((t) => ({
          ...t,
          active: t.id === active.id,
          assignee: t.assignee_id ? assigneeMap.get(t.assignee_id) : undefined,
        }));

        if (!cancelled) setTickets(enriched);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [client]);

  return { tickets, setTickets, loading };
}

"use client";
import { useCallback, useRef, useState } from "react";
import { TicketComment } from "node-zendesk/clients/core/tickets";
import { User } from "node-zendesk/clients/core/users";
import { getTicketComments } from "@/lib/zendesk/comments";
import { getManyUsers } from "@/lib/zendesk/users";

export function useTicketCommentsCache() {
  const commentsCache = useRef<Record<number, TicketComment[]>>({});
  const authorsCache = useRef<Record<number, Map<number, User>>>({});

  const [commentsByTicket, setComments] = useState<Record<number, TicketComment[]>>({});
  const [authorsByTicket, setAuthors] = useState<Record<number, Map<number, User>>>({});

  const loadIfNeeded = useCallback(async (ticketId: number) => {
    if (commentsCache.current[ticketId]) return;

    const comments = await getTicketComments(ticketId);
    const authorIds = Array.from(new Set(comments.map((c) => c.author_id)));
    const users = authorIds.length ? await getManyUsers(authorIds) : [];

    const authors = new Map(users.map((u) => [u.id, u]));

    commentsCache.current[ticketId] = comments;
    authorsCache.current[ticketId] = authors;

    setComments((prev) => ({ ...prev, [ticketId]: comments }));
    setAuthors((prev) => ({ ...prev, [ticketId]: authors }));
  }, []);

  const invalidate = useCallback((ticketId: number) => {
    delete commentsCache.current[ticketId];
    delete authorsCache.current[ticketId];

    setComments((prev) => {
      const next = { ...prev };
      delete next[ticketId];
      return next;
    });

    setAuthors((prev) => {
      const next = { ...prev };
      delete next[ticketId];
      return next;
    });
  }, []);

  return {
    commentsByTicket,
    authorsByTicket,
    loadIfNeeded,
    invalidate,
  };
}

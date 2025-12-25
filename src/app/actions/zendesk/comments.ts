"use server";

import { auth } from "@/auth";
import { createClient } from "@/lib/zendesk";
import { Ticket, TicketComment } from "node-zendesk/clients/core/tickets";

export async function getTicketComments(id: number): Promise<TicketComment[]> {
  if (!id) {
    throw new Error("Ticket ID is required");
  }

  const session = await auth();

  if (!session?.zendeskAccessToken) {
    throw new Error("Not authenticated with Zendesk");
  }

  const client = createClient(session.zendeskAccessToken);

  try {
    return await client.tickets.getComments(id);
  } catch (error) {
    console.error("Zendesk error:", error);
    throw new Error("Failed to fetch Ticket comments");
  }
}

"use server";

import { auth } from "@/lib/auth";
import { TicketComment } from "node-zendesk/clients/core/tickets";
import { client } from "./client";

export async function getTicketComments(id: number): Promise<TicketComment[]> {
  if (!id) {
    throw new Error("Ticket ID is required");
  }

  const session = await auth();

  if (!session) {
    throw new Error("Not authenticated with Zendesk");
  }
  const zendesk = client(session);

  try {
    return await zendesk.tickets.getComments(id);
  } catch (error) {
    console.error("Zendesk error:", error);
    throw error;
  }
}

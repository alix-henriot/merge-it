"use server";

import { auth } from "@/lib/auth";
import { TicketComment } from "node-zendesk/clients/core/tickets";
import { client } from "./client";
import { numberify } from "@/utils/numberify";

export async function getTicketComments(id: number | string): Promise<TicketComment[]> {
  if (!id) {
    throw new Error("Ticket ID is required");
  }

  id = numberify(id);

  const session = await auth();

  if (!session) {
    throw new Error("Not authenticated with Zendesk");
  }
  const zendesk = client(session);

  try {
    return await zendesk.tickets.getComments(id);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const message: string = error?.message ?? "";

    if (message.includes("Zendesk Error (401)")) {
      throw new Error("Invalid Zendesk Credentials");
    }

    if (message.includes("Zendesk Error (404)")) {
      throw new Error("Ticket not found");
    }

    console.error("Unexpected Zendesk failure", error);
    throw new Error("Merge failed due to a system error");
  }
}

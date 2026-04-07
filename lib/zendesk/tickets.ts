"use server";

import { auth } from "~/lib/auth";
import { Ticket } from "node-zendesk/clients/core/tickets";
import { client } from "./client";

export async function createTicket(): Promise<{ response: object; result: Ticket }> {
  const session = await auth();

  if (!session) {
    throw new Error("Not authenticated with Zendesk");
  }

  const zendesk = client(session);

  try {
    return await zendesk.tickets.create({
      ticket: {
        subject: "Newly generated ticket",
        comment: { body: "Some question" },
        requester: { name: "Alix Customer", email: "alix.henriot@outlook.fr" },
      },
    });
  } catch (error) {
    console.error("Zendesk ticket creation error:", error);
    throw error;
  }
}

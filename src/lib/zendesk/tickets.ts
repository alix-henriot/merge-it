"use server";

import { auth } from "@/lib/auth";
import { Ticket } from "node-zendesk/clients/core/tickets";
import { client } from "./client";

export async function getRequesterTickets(id: number): Promise<Ticket[]> {
  if (!id) {
    throw new Error("User ID is required");
  }

  const session = await auth();

  if (!session) {
    throw new Error("Not authenticated with Zendesk");
  }

  const zendesk = client(session);

  try {
    //⚠️ Returned type for client.requests.listByUser(userId) has been manually overwritten from Promise<object[]> to Promise<Ticket[]> to remove type error. This should be fixed later on
    return (await zendesk.requests.listByUser(id, { sort_order: "desc" })).slice(0, 4);
  } catch (error) {
    console.error("Zendesk requester tickets error:", error);
    throw new Error("Failed to fetch requester tickets");
  }
}

export async function createTicket(id: number): Promise<{ response: object; result: Ticket }> {
  if (!id) {
    throw new Error("User ID is required");
  }

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

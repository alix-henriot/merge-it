"use server";

import { zendeskClient } from "@/lib/zendesk";

export async function getRequesterTickets(userId: number) {
  if (!userId) {
    throw new Error("userId is required");
  }

  try {
    //⚠️ Returned type for client.requests.listByUser(userId) has been manually overwritten from Promise<object[]> to Promise<Ticket[]> to remove type error. This should be fixed later on
    const response = await zendeskClient.requests.listByUser(userId);
    return { tickets: response };
  } catch (error) {
    console.error("Zendesk requester tickets error:", error);
    throw new Error("Failed to fetch requester tickets");
  }
}

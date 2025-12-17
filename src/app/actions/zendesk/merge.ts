"use server";

import { zendeskClient } from "@/lib/zendesk";

export async function mergeTickets(sourceTicketId: number, targetTicketId: number) {
  if (!sourceTicketId || !targetTicketId) {
    throw new Error("sourceTicketId and targetTicketId are required");
  }

  try {
    await zendeskClient.tickets.merge(targetTicketId, {
      ids: [sourceTicketId],
      source_comment_is_public: false,
      target_comment_is_public: false,
      //source_comment: `Ticket has been merged in Ticket#${targetTicketId}.`,
      //target_comment: `Ticket#${sourceTicketId} was merged in this ticket.`,
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Zendesk merge error:", error);
    throw new Error("Failed to merge tickets");
  }
}

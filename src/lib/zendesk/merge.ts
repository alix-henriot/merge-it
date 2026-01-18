"use server";

import { auth } from "@/lib/auth";
import { client } from "./client";

export async function mergeTickets(sourceTicketId: number, targetTicketId: number): Promise<void> {
  if (!Number.isInteger(sourceTicketId) || !Number.isInteger(targetTicketId)) {
    throw new Error("Invalid Ticket IDs");
  }

  if (sourceTicketId === targetTicketId) {
    throw new Error("Cannot merge a Ticket into itself");
  }

  const session = await auth();

  if (!session) {
    throw new Error("Not authenticated with Zendesk");
  }

  const zendesk = client(session);

  try {
    //⚠️ merge() response type to be updated in forked node zendesk!!
    await zendesk.tickets.merge(targetTicketId, {
      ids: [sourceTicketId],
      source_comment_is_public: false,
      target_comment_is_public: false,
      source_comment: `This ticket was merged into Ticket #${targetTicketId}.`,
      target_comment: `Ticket #${sourceTicketId} was merged into this ticket.`,
    });
  } catch (error) {
    console.error(
      `Zendesk merge failed (source=${sourceTicketId}, target=${targetTicketId})`,
      error
    );
    throw error;
  }
}

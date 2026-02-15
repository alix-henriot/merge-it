"use server";

import { auth } from "@/lib/auth";
import { client } from "./client";

type MergeTicketsProps = {
  sourceTicketId: number | string;
  targetTicketId: number | string;
  source_comment_is_public?: boolean;
  target_comment_is_public?: boolean;
  source_comment?: string;
  target_comment?: string;
}

export type MergeTicketsResult = {
  mergedInto: number;
  mergedFrom: number;
};


export async function mergeTickets({
  sourceTicketId,
  targetTicketId,
  source_comment_is_public,
  target_comment_is_public,
  source_comment,
  target_comment
}: MergeTicketsProps): Promise<MergeTicketsResult> {
  
  if (!sourceTicketId || !targetTicketId) {
    throw new Error("Ticket IDs are required");
  }

  const sourceId =
  typeof sourceTicketId === "string"
    ? Number(sourceTicketId)
    : sourceTicketId;

  const targetId =
  typeof targetTicketId === "string"
    ? Number(targetTicketId)
    : targetTicketId;

  if (sourceId === targetId) {
    throw new Error("Cannot merge a Ticket into itself");
  }

  const session = await auth();

  if (!session) {
    throw new Error("Not authenticated with Zendesk");
  }

  const zendesk = client(session);

  try {
    await zendesk.tickets.merge(targetId, {
      ids: [sourceId],
      source_comment_is_public: source_comment_is_public ?? false,
      target_comment_is_public: target_comment_is_public ?? false,
      source_comment: source_comment ?? `This ticket was merged into Ticket #${targetId}.`,
      target_comment: target_comment ?? `Ticket #${sourceId} was merged into this ticket.`,
    });
    return {
      mergedInto: targetId,
      mergedFrom: sourceId,
};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const message: string = error?.message ?? "";

    if (message.includes("Zendesk Error (401)")) {
      throw new Error("Invalid Zendesk Credentials");
    }

    if (message.includes("Zendesk Error (422)")) {
      throw new Error("Tickets cannot be merged");
    }
  //Missing coverage ⬇
  console.error("Unexpected Zendesk failure", error);
  //Missing coverage ⬇
  throw new Error("Merge failed due to a system error");
  }
};
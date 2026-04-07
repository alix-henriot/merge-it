"use server";

import { auth } from "~/lib/auth";
import { client } from "./client";
import { numberify } from "~/utils/numberify";

type MergeTicketsProps = {
  sourceId: number | string;
  targetId: number | string;
  source_comment_is_public?: boolean;
  target_comment_is_public?: boolean;
  source_comment?: string;
  target_comment?: string;
};

export type MergeTicketsResult = {
  mergedInto: number;
  mergedFrom: number;
};

export async function mergeTickets({
  sourceId,
  targetId,
  source_comment_is_public,
  target_comment_is_public,
  source_comment,
  target_comment,
}: MergeTicketsProps): Promise<MergeTicketsResult> {
  if (!sourceId || !targetId) {
    throw new Error("Ticket IDs are required");
  }

  const source = numberify(sourceId);
  const target = numberify(targetId);

  if (sourceId === targetId) {
    throw new Error("Cannot merge a Ticket into itself");
  }

  const session = await auth();

  if (!session) {
    throw new Error("Not authenticated with Zendesk");
  }

  const zendesk = client(session);

  try {
    await zendesk.tickets.merge(target, {
      ids: [source],
      source_comment_is_public: source_comment_is_public ?? false,
      target_comment_is_public: target_comment_is_public ?? false,
      source_comment: source_comment ?? `This ticket was merged into Ticket #${target}.`,
      target_comment: target_comment ?? `Ticket #${source} was merged into this ticket.`,
    });
    return {
      mergedInto: target,
      mergedFrom: source,
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
}

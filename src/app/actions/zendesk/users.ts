"use server";

import { auth } from "@/auth";
import { createClient } from "@/lib/zendesk";
import { User } from "node-zendesk/clients/core/users";

export async function getManyUsers(ids: number[]): Promise<User[]> {
  if (!ids) {
    throw new Error("User ID is required");
  }

  const session = await auth();

  if (!session?.zendeskAccessToken) {
    throw new Error("Not authenticated with Zendesk");
  }

  const client = createClient(session.zendeskAccessToken);

  try {
    const response = await client.users.showMany(ids);
    return response.result;
  } catch (error) {
    console.error("Zendesk error:", error);
    throw new Error("Failed to fetch user");
  }
}

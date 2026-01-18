"use server";

import { auth } from "@/lib/auth";
import { User } from "node-zendesk/clients/core/users";
import { client } from "./client";

export async function getManyUsers(ids: number[]): Promise<User[]> {
  if (!ids) {
    throw new Error("User ID is required");
  }

  const session = await auth();

  if (!session) {
    throw new Error("Not authenticated with Zendesk");
  }

  const zendesk = client(session);

  try {
    const response = await zendesk.users.showMany(ids);
    return response.result;
  } catch (error) {
    console.error("Zendesk error:", error);
    throw error;
  }
}

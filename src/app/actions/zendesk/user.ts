"use server";

import { zendeskClient } from "@/lib/zendesk";
import { User } from "node-zendesk/clients/core/users";

export async function getUser(id: number): Promise<User> {
  if (!id) {
    throw new Error("User id is required");
  }

  try {

    const response = await zendeskClient.users.show(id)
    console.log(response.result)
    return response.result;
  } catch (error) {
    console.error("Zendesk error:", error);
    throw new Error("Failed to fetch user");
  }
}

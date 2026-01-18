import { User } from "node-zendesk/clients/core/users";

export function isAgent(user?: User) {
  return user?.role === "agent" || user?.role === "admin";
}

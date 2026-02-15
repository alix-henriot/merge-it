import { createClient } from "node-zendesk";
import { Session } from "next-auth";

export const client = (session: Session) => {
  return createClient({
    subdomain: session.subdomain,
    token: session.accessToken,
    oauth: true,
    username: session.user.email,
  });
}

import { createClient } from "node-zendesk";
import { Session } from "next-auth";

export function client(session: Session) {
  console.log(session)
  return createClient({
    subdomain: session.subdomain ?? process.env.ZENDESK_SUBDOMAIN, //WIP
    token: session.accessToken,
    oauth: true,
    username: session.user?.email as string,
  });
}

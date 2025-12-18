import zendesk from "node-zendesk";

export const zendeskClient = zendesk.createClient({
  username: process.env.ZENDESK_EMAIL,
  token: process.env.ZENDESK_API_TOKEN,
  subdomain: process.env.ZENDESK_SUBDOMAIN,
});

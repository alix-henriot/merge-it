import { ZendeskProfile } from "next-auth";
import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers";

export function Zendesk<P extends ZendeskProfile>(
  config: OAuthUserConfig<ZendeskProfile> & { subdomain?: string }
): OAuthConfig<ZendeskProfile> {
  if (!process.env.ZENDESK_CLIENT_ID || !process.env.ZENDESK_CLIENT_SECRET) {
    throw new Error("ZENDESK_CLIENT_ID and ZENDESK_CLIENT_SECRET must be set");
  }

  const baseUrl = config.subdomain
    ? `https://${config.subdomain}.zendesk.com`
    : "https://zendesk.com";
  const apiBaseUrl = config.subdomain ? `${baseUrl}/api/v2` : "https://zendesk.com";

  return {
    id: "zendesk",
    name: "Zendesk",
    type: "oauth",
    clientId: process.env.ZENDESK_CLIENT_ID,
    clientSecret: process.env.ZENDESK_CLIENT_SECRET,
    authorization: {
      url: `${baseUrl}/oauth/authorizations/new`,
      params: { scope: "read write" },
    },
    token: `${baseUrl}/oauth/tokens`,
    userinfo: `${apiBaseUrl}/users/me.json`,
    profile(profile: ZendeskProfile) {
      const user = profile.user;
      if (!user) throw new Error("Invalid Zendesk profile");

      return {
        id: String(user.id),
        name: user.name ?? "",
        email: user.email ?? "",
      };
    },
  };
}
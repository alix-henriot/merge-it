import NextAuth from "next-auth";
import { ZendeskProfile } from "next-auth";
import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers";


export default function Zendesk<P extends ZendeskProfile>(
  config: OAuthUserConfig<ZendeskProfile> & {
    subdomain?: string;
  }
): OAuthConfig<ZendeskProfile> {
  const baseUrl = `https://${config?.subdomain}.zendesk.com`;
  const apiBaseUrl = config?.subdomain ? `${baseUrl}/api/v2` : "https://zendesk.com";

  return {
    id: "zendesk",
    name: "zendesk",
    type: "oauth",
    clientId: process.env.ZENDESK_CLIENT_ID!,
    clientSecret: process.env.ZENDESK_CLIENT_SECRET!,
    authorization: {
      url: `${baseUrl}/oauth/authorizations/new`,
      params: {
        scope: "read write",
      },
    },
    token: `${baseUrl}/oauth/tokens`,
    userinfo: `${apiBaseUrl}/users/me.json`,
    profile(profile: ZendeskProfile) {
      const user = profile.user;

      return {
        id: String(user.id),
        name: user.name,
        email: user.email,
      };
    },
  };
}

export const { handlers, signIn, signOut, auth } = NextAuth(async (req) => {
  const subdomain = req?.cookies.get("subdomain")?.value;

  return {
    providers: [Zendesk({ subdomain })],
    pages: {
      signIn: "zendesk/auth",
    },
    callbacks: {
      async jwt({ token, account }) {
        if (account && req) {
          const subdomain = req.cookies.get("subdomain")?.value;

          token.accessToken = account.access_token;
          token.subdomain = subdomain;
        }

        return token;
      },
      async session({ session, token }) {
        session.accessToken = token.accessToken as string;
        session.subdomain = token.subdomain as string;
        return session;
      },

      async redirect() {
        return "/auth/callback";
      },
      authorized: async ({ auth }) => {
        return !!auth;
      },
    },
    session: { strategy: "jwt" },
    cookies: {
      sessionToken: {
        name: "__Secure-next-auth.session-token",
        options: {
          sameSite: "none",
          httpOnly: false,
          secure: true,
        },
      },
    },
  };
});

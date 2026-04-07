import NextAuth from "next-auth";
import { Zendesk } from "./zendesk/oauth-provider";

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
      authorized: async ({ auth }) => {return !!auth;},
    },
    session: { strategy: "jwt" },
    cookies: {
      sessionToken: {
        name: "__Secure-next-auth.session-token",
        options: {
          sameSite: "none",
          httpOnly: true,
          secure: true,
        },
      },
    },
  };
});

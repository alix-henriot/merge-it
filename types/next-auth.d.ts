import "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    subdomain: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    subdomain?: string;
  }
}

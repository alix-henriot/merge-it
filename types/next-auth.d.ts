import "next-auth";

declare module "next-auth" {
  interface ZendeskProfile  {
  id: number;
  name: string;
  email: string;
}
  interface Session {
    accessToken: string;
    subdomain: string;
    user: ZendeskProfile;
  }

  interface Account extends Account {
    access_token: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    subdomain: string;
  }
}

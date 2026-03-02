import { Zendesk } from "@/lib/zendesk/oauth-provider";

beforeAll(() => {
  process.env.ZENDESK_CLIENT_ID = "test-client-id";
  process.env.ZENDESK_CLIENT_SECRET = "test-client-secret";
})

describe("Zendesk OAuth Provider Unit Test Suites", () => {
  it("should throw if env vars are missing", () => {
    const oldClientId = process.env.ZENDESK_CLIENT_ID;
    const oldClientSecret = process.env.ZENDESK_CLIENT_SECRET;
    delete process.env.ZENDESK_CLIENT_ID;
    delete process.env.ZENDESK_CLIENT_SECRET;
    expect(() => Zendesk({ subdomain: "d3v-merge-it" })).toThrow("ZENDESK_CLIENT_ID and ZENDESK_CLIENT_SECRET must be set");
    process.env.ZENDESK_CLIENT_ID = oldClientId;
    process.env.ZENDESK_CLIENT_SECRET = oldClientSecret;
  });

  it("should return correct URLs for subdomain", () => {
    const config = Zendesk({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
      subdomain: "d3v-merge-it"
    });
    expect(config.authorization.url).toBe("https://d3v-merge-it.zendesk.com/oauth/authorizations/new");
    expect(config.token).toBe("https://d3v-merge-it.zendesk.com/oauth/tokens");
    expect(config.userinfo).toBe("https://d3v-merge-it.zendesk.com/api/v2/users/me.json");
  });

  it("should return correct URLs when no subdomain", () => {
    const config = Zendesk({
      clientId: "test-client-id",
      clientSecret: "test-client-secret"
    });
    expect(config.authorization.url).toBe("https://zendesk.com/oauth/authorizations/new");
    expect(config.token).toBe("https://zendesk.com/oauth/tokens");
    expect(config.userinfo).toBe("https://zendesk.com/users/me.json");
  });

  it("should throw if profile.user is missing", () => {
    const config = Zendesk({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
      subdomain: "d3v-merge-it"
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => config.profile({} as any)).toThrow("Invalid Zendesk profile");
  });

  it("should return correct profile values", () => {
    const config = Zendesk({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
      subdomain: "d3v-merge-it"
    });
    const profile = {
      user: {
        id: 123,
        name: "Test User",
        email: "test@example.com"
      }
    };
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = config.profile(profile as any);
    expect(result).toEqual({
      id: "123",
      name: "Test User",
      email: "test@example.com"
    });
  });
});
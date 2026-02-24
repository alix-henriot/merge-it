jest.mock("../lib/auth", () => ({
  auth: jest.fn(),
}));

import { getTicketComments } from "@/lib/zendesk/comments";
import { auth } from "@/lib/auth";

const mockedAuth = auth as jest.Mock;

beforeAll(() => {
  mockedAuth.mockResolvedValue({
    user: {
      name: process.env.TEST_USER_NAME!,
      email: process.env.TEST_USER_EMAIL!,
    },
    expires: process.env.TEST_SESSION_EXPIRES!,
    accessToken: process.env.ZENDESK_TEST_TOKEN!,
    subdomain: process.env.ZENDESK_TEST_SUBDOMAIN!,
  });
});

describe("getTicketComments Unit Test Suites", () => {
  it("should throw missing credentials", async () => {
    mockedAuth.mockResolvedValueOnce(null);

    await expect(getTicketComments(1)).rejects.toThrow("Not authenticated with Zendesk");
  });

  it("should throw an invalid credentials", async () => {
    mockedAuth.mockResolvedValueOnce({
      user: {
        name: process.env.TEST_USER_NAME!,
        email: process.env.TEST_USER_EMAIL!,
      },
      expires: process.env.TEST_SESSION_EXPIRES!,
      accessToken: "WRONG_TOKEN",
      subdomain: process.env.ZENDESK_TEST_SUBDOMAIN!,
    });

    await expect(getTicketComments(1)).rejects.toThrow("Invalid Zendesk Credentials");
  });

  it("should not find ticket", async () => {
    // @ts-expect-error testing runtime validation
    await expect(getTicketComments(undefined)).rejects.toThrow("Ticket ID is required");
  });

  it("should not find ticket", async () => {
    await expect(getTicketComments(123456)) // Ticket 123456 does not exists
      .rejects.toThrow("Ticket not found");
  });
});

jest.mock("../lib/auth", () => ({
  auth: jest.fn(),
}));

import { mergeTickets } from "@/lib/zendesk/merge";
import { auth } from "@/lib/auth";
import { createTicket } from "@/lib/zendesk/tickets";

const mockedAuth = auth as jest.Mock;

let tickets: number[] = [];

beforeAll(async () => {
  mockedAuth.mockResolvedValue({
    user: {
      name: process.env.TEST_USER_NAME!,
      email: process.env.TEST_USER_EMAIL!,
    },
    expires: process.env.TEST_SESSION_EXPIRES!,
    accessToken: process.env.ZENDESK_TEST_TOKEN!,
    subdomain: process.env.ZENDESK_TEST_SUBDOMAIN!,
  });

  const created: number[] = [];

  for (let i = 0; i < 4; i++) {
    try {
      const ticketCreated = await createTicket();
      created.push(Number(ticketCreated.result.id));
    } catch (error) {
      throw new Error(`Failed to create ticket: ${error}`);
    }
  }

  tickets = created;
}, 60_000);

describe("MergeTickets Unit Test Suites", () => {
  it("should throw an invalid Ticket ID error", async () => {
    await expect(
      mergeTickets({
        sourceTicketId: tickets[0],
        targetTicketId: tickets[0],
      })
    ).rejects.toThrow("Cannot merge a Ticket into itself");
  });

  it("should throw an invalid Ticket ID error", async () => {
    await expect(
      mergeTickets({
        // @ts-expect-error testing runtime validation
        sourceTicketId: undefined,
        targetTicketId: tickets[0],
      })
    ).rejects.toThrow("Ticket IDs are required");

    await expect(
      mergeTickets({
        sourceTicketId: tickets[0],
        // @ts-expect-error testing runtime validation
        targetTicketId: undefined,
      })
    ).rejects.toThrow("Ticket IDs are required");
    await expect(
      mergeTickets({
        // @ts-expect-error testing runtime validation
        sourceTicketId: undefined,
        // @ts-expect-error testing runtime validation
        targetTicketId: undefined,
      })
    ).rejects.toThrow("Ticket IDs are required");
  });

  it("should throw missing credentials", async () => {
    mockedAuth.mockResolvedValueOnce(null);

    await expect(
      mergeTickets({
        sourceTicketId: tickets[0],
        targetTicketId: tickets[1],
      })
    ).rejects.toThrow("Not authenticated with Zendesk");
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

    await expect(
      mergeTickets({
        sourceTicketId: tickets[0],
        targetTicketId: tickets[1],
      })
    ).rejects.toThrow("Invalid Zendesk Credentials");
  });

  it("should throw an invalid request from Zendesk API when tickets are not mergeable", async () => {
    await expect(
      mergeTickets({
        // Below are tickets ID that are closed and therefore can't be merged.
        sourceTicketId: 2,
        targetTicketId: 1,
      })
    ).rejects.toThrow("Tickets cannot be merged");
  });

  it("should resolve when IDs are numbers and mergeable", async () => {
    await expect(
      mergeTickets({
        sourceTicketId: tickets[0],
        targetTicketId: tickets[1],
      })
    ).resolves.toEqual({
      mergedFrom: tickets[0],
      mergedInto: tickets[1],
    });
  });

  it("should resolve when IDs are string and mergeable", async () => {
    await expect(
      mergeTickets({
        sourceTicketId: String(tickets[2]),
        targetTicketId: String(tickets[3]),
      })
    ).resolves.toEqual({
      mergedFrom: tickets[2],
      mergedInto: tickets[3],
    });
  });
});

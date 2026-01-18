import { Ticket } from "node-zendesk/clients/core/tickets";
import { User } from "node-zendesk/clients/core/users";

export type TicketWithAssignee = Ticket & {
  assignee?: User;
  active?: boolean;
  isMerging?: boolean;
};

export type TicketGetResponse = {
  ticket: Ticket;
};

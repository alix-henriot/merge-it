import { Card, CardAction, CardDescription, CardHeader } from "@/components/ui/card";
import { Ticket } from "node-zendesk/clients/core/tickets";
import TicketTitle from "./ticket-title";
import StatusBadge from "./status-badge";
import TicketButtonGroup from "./ticket-button-group";

type TicketCardProps = {
  ticket: Ticket;
  handleMerge: (ticketId: number) => Promise<{ success: boolean }>;
};

export default function TicketCard({ ticket, handleMerge }: TicketCardProps) {
  return (
    <Card className="border-none p-3 px-0">
      <CardHeader>
        <TicketTitle {...ticket} />
        <CardDescription className="flex items-start gap-1.5 text-sm">
          <StatusBadge {...ticket} />
          <div className="line-clamp-1 flex gap-2 font-medium">#{ticket.id}</div>
        </CardDescription>
        <CardAction>
          <TicketButtonGroup {...ticket} handleMerge={handleMerge} />
        </CardAction>
      </CardHeader>
    </Card>
  );
}

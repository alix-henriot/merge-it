import { CardTitle } from "../ui/card";
import { useZafClient } from "@/hooks/use-zaf-client";
import { Ticket } from "node-zendesk/clients/core/tickets";

export default function TicketTitle({ id, subject }: Ticket) {
  const client = useZafClient();

  const handleClick = async () => await client?.invoke("routeTo", "ticket", id);

  return (
    <CardTitle
      onClick={handleClick}
      className="text-sm truncate font-medium hover:underline hover:cursor-pointer"
    >
      {subject}
    </CardTitle>
  );
}

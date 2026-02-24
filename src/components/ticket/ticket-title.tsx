import { memo } from "react";
import { CardTitle } from "../ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import type { TicketComment } from "node-zendesk/clients/core/tickets";
import type { User } from "node-zendesk/clients/core/users";
import TicketComments from "./ticket-comments";

interface Props {
  id: number;
  subject: string;
  isActive?: boolean;
  comments: TicketComment[];
  authors: Map<number, User>;
  onHoverLoadComments: (ticketId: number) => void;
  onRedirect: (id: number) => Promise<void>;
}

function TicketTitle({
  id,
  subject,
  isActive,
  comments,
  authors,
  onHoverLoadComments,
  onRedirect,
}: Props) {
  return (
    <HoverCard
      openDelay={300}
      closeDelay={100}
      onOpenChange={(open) => {
        if (open && !isActive && comments.length === 0) {
          onHoverLoadComments(id);
        }
      }}
    >
      <HoverCardTrigger asChild>
        <CardTitle
          onClick={() => onRedirect(id)}
          className="flex items-baseline gap-2 text-sm truncate font-nohemi leading-loose hover:underline hover:cursor-pointer"
        >
          {subject}
        </CardTitle>
      </HoverCardTrigger>

      {!isActive && (
        <HoverCardContent align="start" className="max-h-44 overflow-scroll">
          <TicketComments comments={comments} authors={authors} />
        </HoverCardContent>
      )}
    </HoverCard>
  );
}

export default memo(TicketTitle);

import { memo } from "react";
import { CardTitle } from "../ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { decodeHtmlEntities } from "@/utils/decode-html";
import { formatDate } from "@/utils/format-date";
import { isAgent } from "@/utils/is-agent";
import type { TicketComment } from "node-zendesk/clients/core/tickets";
import type { User } from "node-zendesk/clients/core/users";
import { Spinner } from "../ui/spinner";
import { CircleArrowDown, CircleArrowUp } from "lucide-react";
import TicketComments from "./ticket-comments";

interface Props {
  id: number;
  subject: string;
  active?: boolean;
  satisfaction_rating?: { score?: string };
  comments: TicketComment[];
  authors: Map<number, User>;
  onHoverLoadComments: (ticketId: number) => void;
  onRedirect: (id: number) => Promise<void>;
}

function TicketTitle({
  id,
  subject,
  active,
  satisfaction_rating,
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
        if (open && !active && comments.length === 0) {
          onHoverLoadComments(id);
        }
      }}
    >
      <HoverCardTrigger asChild>
        <CardTitle
          onClick={() => onRedirect(id)}
          className="text-sm truncate font-medium hover:underline hover:cursor-pointer"
        >
          {satisfaction_rating?.score === "good" && <CircleArrowUp className="mr-2 text-green-500"/>}
          {satisfaction_rating?.score === "bad" && <CircleArrowDown className="mr-2 text-red-500"/>}
          {subject}
        </CardTitle>
      </HoverCardTrigger>

      {!active && (
        <HoverCardContent align="start" className="max-h-44 overflow-scroll">
          <TicketComments comments={comments} authors={authors}/>
        </HoverCardContent>
      )}
    </HoverCard>
  );
}

export default memo(TicketTitle);

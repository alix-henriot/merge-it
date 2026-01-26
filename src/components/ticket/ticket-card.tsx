import {
  Card,
  CardAction,
  CardHeader,
} from "@/components/ui/card";
import TicketTitle from "./ticket-title";
import StatusBadge from "./status-badge";
import { TicketWithAssignee } from "~/types/zendesk";
import TicketCopyButton from "./ticket-copy-button";
import TicketMergeButton from "./ticket-merge-button";
import { TicketComment } from "node-zendesk/clients/core/tickets";
import { User } from "node-zendesk/clients/core/users";
import { memo } from "react";
import { formatDate } from "@/utils/format-date";

interface Props {
  ticket: TicketWithAssignee;
  isActiveTicketClosed?: boolean;
  comments: TicketComment[];
  authors: Map<number, User>;
  assignee?: User;
  active?: boolean;
  onHoverLoadComments: (ticketId: number) => void;
  handleMerge: (ticketId: number) => Promise<void>;
  onRedirect: (id: number) => Promise<void>;
}

function TicketCard({
  ticket,
  isActiveTicketClosed,
  comments,
  authors,
  assignee,
  active,
  onHoverLoadComments,
  handleMerge,
  onRedirect,
}: Props) {

  const disabled = !active && !isActiveTicketClosed && ticket.status !== "closed";

  return (
    <Card
      className={
        active
          ? "relative bg-accent text-accent-foreground border-none gap-0 py-3 shadow-none"
          : "relative gap-0 py-3 shadow-none"
      }
    >
      <CardHeader className="pl-4 pr-3 grid-rows-2 [.border-b]:pb-0">
        <TicketTitle
          id={ticket.id}
          subject={ticket.subject!}
          active={active}
          comments={comments}
          authors={authors}
          onHoverLoadComments={onHoverLoadComments}
          onRedirect={onRedirect}
        />
        <CardAction className="">
          <TicketMergeButton
            id={ticket.id}
            status={ticket.status!}
            isMerging={ticket.isMerging}
            handleMerge={handleMerge}
            disabled={!disabled}
            active={active}
            isActiveTicketClosed={isActiveTicketClosed}
          />
        </CardAction>
        <div className="flex items-baseline gap-2 text-xs text-muted-foreground truncate">
          <StatusBadge {...ticket} />
          <span>{formatDate(ticket.created_at)}</span>
          <span>{assignee?.name}</span>
        </div>
        <CardAction className="row-start-2">
          <TicketCopyButton {...ticket} />
        </CardAction>
      </CardHeader>
    </Card>
  );
}

export default memo(TicketCard);

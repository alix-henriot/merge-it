import { Card, CardAction, CardHeader } from "~/components/ui/card";
import TicketTitle from "./ticket-title";
import StatusBadge from "./status-badge";
import { TicketWithAssignee } from "~/types/zendesk";
import TicketCopyButton from "./ticket-copy-button";
import TicketMergeButton from "./ticket-merge-button";
import { TicketComment } from "node-zendesk/clients/core/tickets";
import { User } from "node-zendesk/clients/core/users";
import { memo } from "react";
import { formatDate } from "~/utils/format-date";
import { MergeTicketsResult } from "~/lib/zendesk/merge";
import { TicketMergeFormValues } from "./ticket-merge-form";
import { CircleArrowDown, CircleArrowUp, Clock } from "lucide-react";

interface Props {
  ticket: TicketWithAssignee;
  isActiveTicketClosed?: boolean;
  comments: TicketComment[];
  authors: Map<number, User>;
  assignee?: User;
  active: TicketWithAssignee;
  isActive?: boolean;
  loadComments: (ticketId: number) => void;
  handleMerge: (
    sourceId: number,
    targetId: number,
    values: TicketMergeFormValues
  ) => Promise<MergeTicketsResult>;
  onRedirect: (id: number) => Promise<void>;
}

function TicketCard({
  ticket,
  isActiveTicketClosed,
  comments,
  active,
  authors,
  assignee,
  loadComments,
  handleMerge,
  onRedirect,
}: Props) {
  const isActive = active.id === ticket.id;

  const disabled = !isActive && !isActiveTicketClosed && ticket.status !== "closed" || "solved";

  return (
    <Card
      className={
        isActive
          ? "relative bg-primary text-primary-foreground gap-0 py-2.5 shadow-md"
          : "relative gap-0 py-2.5 shadow-none"
      }
    >
      <CardHeader className="pl-4 pr-3 grid-rows-2 [.border-b]:pb-0">
        <TicketTitle
          id={ticket.id}
          subject={ticket.subject!}
          isActive={isActive}
          comments={comments}
          authors={authors}
          onHoverLoadComments={loadComments}
          onRedirect={onRedirect}
        />
        <CardAction className="">
          <TicketMergeButton
            id={ticket.id}
            status={ticket.status!}
            isMerging={ticket.isMerging}
            handleMerge={handleMerge}
            disabled={!disabled}
            isActive={isActive}
            isActiveTicketClosed={isActiveTicketClosed}
          />
        </CardAction>
        <div className="flex items-baseline gap-2 text-xs truncate">
          <StatusBadge {...ticket} />
          {(ticket.satisfaction_rating as { score?: string })?.score === "good" && (
            <CircleArrowUp className="size-3 text-green-500" />
          )}
          {(ticket.satisfaction_rating as { score?: string })?.score === "bad" && (
            <CircleArrowDown className="size-3 text-red-500" />
          )}
          {(ticket.satisfaction_rating as { score?: string })?.score === "offered" && (
            <Clock className="size-3" />
          )}
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

import { memo } from "react";
import { CardTitle } from "../ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { decodeHtmlEntities } from "@/utils/decode-html";
import { isAgent } from "@/utils/is-agent";
import type { TicketComment } from "node-zendesk/clients/core/tickets";
import type { User } from "node-zendesk/clients/core/users";
import { Spinner } from "../ui/spinner";

interface Props {
  id: number;
  subject: string;
  active?: boolean;
  comments: TicketComment[];
  authors: Map<number, User>;
  onHoverLoadComments: (ticketId: number) => void;
  onRedirect: (id: number) => Promise<void>;
}

function TicketTitle({
  id,
  subject,
  active,
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
          {subject}
        </CardTitle>
      </HoverCardTrigger>

      {!active && (
        <HoverCardContent side="bottom" align="start" className="max-h-48 w-screen overflow-scroll">
          <div className="space-y-2">
            {comments.length === 0 && (
              <p className="text-sm text-muted-foreground">
                <Spinner />
              </p>
            )}

            {comments.map((comment) => {
              const author = authors.get(comment.author_id);
              const agent = isAgent(author);

              const bubbleClass = comment.public
                ? agent
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary text-secondary-foreground"
                : "border border-warning-ring bg-warning text-warning-foreground";

              return (
                <div key={comment.id} className={`flex ${agent ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-md px-3 py-2 text-xs ${bubbleClass}`}>
                    <p className="mb-1 text-[11px] font-medium opacity-70">
                      {author?.name ?? "Unknown"}
                      {!comment.public && " · Internal note"}
                    </p>

                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                      {decodeHtmlEntities(comment.plain_body)}
                    </p>

                    <p className="mt-1 text-[10px] opacity-50 text-right">
                      {new Date(comment.created_at).toLocaleString(undefined, {
                        month: "short",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </HoverCardContent>
      )}
    </HoverCard>
  );
}

export default memo(TicketTitle);

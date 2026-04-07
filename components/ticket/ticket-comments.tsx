import { cn } from "~/lib/cn";
import { Spinner } from "../ui/spinner";
import { formatDate } from "~/utils/format-date";
import { isAgent } from "~/utils/is-agent";
import { TicketComment } from "node-zendesk/clients/core/tickets";
import { User } from "node-zendesk/clients/core/users";

interface Props {
  className?: string;
  comments: TicketComment[];
  authors: Map<number, User>;
}

export default function TicketComments({ className, comments, authors }: Props) {

  return (
    <div className={cn(className, "space-y-2")}>
      {comments.length === 0 && <Spinner className="mx-auto" />}
      {comments.map((comment) => {
        const author = authors.get(comment.author_id);
        const agent = isAgent(author);

        const bubbleClass = comment.public
          ? agent
            ? "bg-muted text-muted-foreground"
            : "bg-public text-public-foreground"
          : "border border-internal-ring bg-internal text-muted-foreground";

        return (
          <div key={comment.id} className={`flex ${agent ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-9/10 rounded-md px-3 py-2 text-xs ${bubbleClass} text-wrap`}>
              <p className="mb-1 text-[11px] font-medium opacity-70">
                {author?.name ?? "Unknown"}
                {!comment.public && " · Internal note"}
              </p>

              <p className="text-sm">{comment.body}</p>

              <p className="mt-1 text-[10px] opacity-50 text-right">
                {formatDate(comment.created_at)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

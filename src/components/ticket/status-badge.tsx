import { cn } from "@/lib/cn";
import { cva } from "class-variance-authority";
import { Badge } from "@/components/ui/badge";
import { Ticket } from "node-zendesk/clients/core/tickets";

const badgeStatus = cva(
  "text-background capitalize font-semibold",
  {
    variants: {
      status: {
        new: "bg-warning",
        open: "bg-danger",
        pending: "bg-info",
        hold: "bg-blue-900",
        closed: "bg-foreground",
        solved: "bg-foreground",
      },
    },
  }
);

export default function StatusBadge({ status }: Pick<Ticket, "status">) {
  return (
    <Badge variant="outline" className={cn(badgeStatus({ status }))}>
      {status}
    </Badge>
  );
}

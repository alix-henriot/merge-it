import { cn } from "@/lib/cn";
import { cva } from "class-variance-authority";
import { Badge } from "@/components/ui/badge";
import { Ticket } from "node-zendesk/clients/core/tickets";

const badgeStatus = cva(
  "text-white capitalize font-normal",
  {
    variants: {
      status: {
        new: "bg-warning",
        open: "bg-danger",
        pending: "bg-info",
        hold: "bg-blue-900",
        closed: "bg-gray-800",
        solved: "bg-gray-800",
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

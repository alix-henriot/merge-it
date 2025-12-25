import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Ticket } from "node-zendesk/clients/core/tickets";

const STATUS_COLOR_MAP: Record<string, string> = {
  new: "bg-yellow-800",
  open: "bg-red-800",
  pending: "bg-blue-800",
  hold: "bg-blue-900",
  closed: "bg-gray-800",
  solved: "bg-gray-800",
};

const BASE_STYLES = "text-white capitalize font-normal";

export default function StatusBadge({ status }: Ticket) {
  const bgColor = STATUS_COLOR_MAP[status || "closed"] || STATUS_COLOR_MAP.closed;

  return (
    <Badge variant="outline" className={cn(bgColor, BASE_STYLES)}>
      {status}
    </Badge>
  );
}

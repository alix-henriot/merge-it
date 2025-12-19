"use client"
import { ButtonGroup } from "../ui/button-group";
import { Button } from "../ui/button";
import { Merge, MoreHorizontalIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Ticket } from "node-zendesk/clients/core/tickets";
import { toast } from "sonner";

type TicketMergeProps = Ticket & {
  handleMerge: (ticketId: number) => Promise<{ success: boolean }>;
};

export default function TicketButtonGroup({ id, handleMerge }: TicketMergeProps) {
  //const [loading, setLoading] = useState<boolean>(false)
  return (
    <ButtonGroup>
      <Button
        className="cursor-pointer"
        variant="outline"
        size="sm"
        aria-label="Merge ticket"
        onClick={() => {
          toast.promise(handleMerge(id), {
            loading: "Merging...",
            success: () => `Ticket #${id} has been merged into ticket successfully`,
            error: () => `Failed to merge`,
          });
        }}
      >
        <Merge className="h-4 w-4" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" aria-label="More Options">
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuGroup>
            <DropdownMenuItem>Nothing else</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}

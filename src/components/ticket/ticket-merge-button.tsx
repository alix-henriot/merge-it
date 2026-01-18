"use client";
import { Button } from "../ui/button";
import { Merge } from "lucide-react";
import { Spinner } from "../ui/spinner";
import { Status } from "node-zendesk/clients/core/tickets";
import { toast } from "sonner";

type TicketMergeProps = {
  id: number;
  status: Status;
  isMerging?: boolean;
  disabled: boolean;
  handleMerge: (ticketId: number) => Promise<void>;
};

export default function TicketMergeButton({
  id,
  status,
  isMerging = false,
  disabled,
  handleMerge,
}: TicketMergeProps) {
  const onMerge = () => {
    if (isMerging) return;

    const promise = handleMerge(id);

    toast.promise(promise, {
      loading: "Merging ticket…",
      success: `Ticket #${id} merged successfully`,
      error: (err) => err.message ?? "Merge failed",
    });
  };

  return (
    <Button
      variant="outline"
      size="xs"
      aria-label="Merge ticket"
      disabled={disabled || status === "closed"}
      onClick={onMerge}
    >
      {isMerging ? <Spinner className="size-3.5" /> : <Merge className="size-3.5" />}
      Merge
    </Button>
  );
}

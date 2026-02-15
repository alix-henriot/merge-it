"use client";
import { Button } from "../ui/button";
import { Merge } from "lucide-react";
import { Spinner } from "../ui/spinner";
import { Status } from "node-zendesk/clients/core/tickets";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Kbd } from "../ui/kbd";
import { MergeTicketsResult } from "@/lib/zendesk/merge";

type TicketMergeProps = {
  id: number;
  status: Status;
  isMerging?: boolean;
  disabled: boolean;
  active?: boolean;
  isActiveTicketClosed?: boolean;
  handleMerge: (ticketId: number) => Promise<MergeTicketsResult>;
};

export default function TicketMergeButton({
  id,
  status,
  isMerging = false,
  disabled,
  active = false,
  isActiveTicketClosed = false,
  handleMerge,
}: TicketMergeProps) {
  const shouldHide =
    status === "closed" || active || isActiveTicketClosed;
  const isVisible = isMerging || !shouldHide;

  const onMerge = () => {
    if (isMerging) return;

    const promise = handleMerge(id);

    toast.promise(promise, {
      loading: "Merging ticket…",
      success: (result) => `Ticket #${result.mergedFrom} merged into #${result.mergedInto}`,
      error: (err) => err.message ?? "Merge failed",
    });
  };

  if (!isVisible) return null;

  return (
    
    <Dialog>
  <DialogTrigger
  asChild
  >
    <Button
      variant="default"
      size="xs"
      aria-label="Merge ticket"
      disabled={disabled || isMerging}
    >
      {isMerging ? <Spinner className="size-3.5" /> : <Merge className="size-3.5" />}
      Merge
    </Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm  merge?</DialogTitle>
      <DialogDescription>Press <Kbd>esc</Kbd> to cancel.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button onClick={onMerge}>Merge <Kbd>M</Kbd></Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
  );
}

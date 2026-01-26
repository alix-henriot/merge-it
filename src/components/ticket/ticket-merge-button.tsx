"use client";
import { Button } from "../ui/button";
import { Merge } from "lucide-react";
import { Spinner } from "../ui/spinner";
import { Status } from "node-zendesk/clients/core/tickets";
import { toast } from "sonner";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

type TicketMergeProps = {
  id: number;
  status: Status;
  isMerging?: boolean;
  disabled: boolean;
  active?: boolean;
  isActiveTicketClosed?: boolean;
  handleMerge: (ticketId: number) => Promise<void>;
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
      success: `Ticket #${id} merged successfully`,
      error: (err) => err.message ?? "Merge failed",
    });
  };

  if (!isVisible) return null;

  return (
    
    <Drawer direction="top">
  <DrawerTrigger
  asChild
  >
    <Button
      variant="outline"
      size="xs"
      aria-label="Merge ticket"
      disabled={disabled || isMerging}
    >
      {isMerging ? <Spinner className="size-3.5" /> : <Merge className="size-3.5" />}
      Merge
    </Button>
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Confirm  merge?</DrawerTitle>
      <DrawerDescription>This action cannot be undone.</DrawerDescription>
    </DrawerHeader>
    <DrawerFooter>
      <Button variant="outline" onClick={onMerge}>Merge</Button>
      <DrawerClose asChild>
        <Button variant="ghost">Cancel</Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
  );
}

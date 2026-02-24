"use client";
import { Button } from "../ui/button";
import { Merge } from "lucide-react";
import { Spinner } from "../ui/spinner";
import { Status } from "node-zendesk/clients/core/tickets";
import {
  ExpandableScreen,
  ExpandableScreenContent,
  ExpandableScreenTrigger,
} from "@/components/ui/expandable-screen";
import { MergeTicketsResult } from "@/lib/zendesk/merge";
import TicketMergeForm, { TicketMergeFormValues } from "./ticket-merge-form";

type TicketMergeProps = {
  id: number;
  status: Status;
  isMerging?: boolean;
  disabled: boolean;
  isActive?: boolean;
  isActiveTicketClosed?: boolean;
  handleMerge: (
    sourceId: number,
    targetId: number,
    values: TicketMergeFormValues
  ) => Promise<MergeTicketsResult>;
};

export default function TicketMergeButton({
  id,
  status,
  isMerging = false,
  disabled,
  isActive = false,
  isActiveTicketClosed = false,
  handleMerge,
}: TicketMergeProps) {
  const shouldHide = status === "closed" || isActive || isActiveTicketClosed;
  const isVisible = isMerging || !shouldHide;

  if (!isVisible) return null;

  return (
    <ExpandableScreen
      layoutId={`expandable-card-${id}`}
      contentRadius="20px"
      animationDuration={0.15}
    >
      <ExpandableScreenTrigger>
        <Button
          variant="default"
          size="xs"
          aria-label="Merge ticket"
          disabled={disabled || isMerging}
        >
          {isMerging ? <Spinner className="size-3.5" /> : <Merge className="size-3.5" />}
          Merge
        </Button>
      </ExpandableScreenTrigger>
      <ExpandableScreenContent showCloseButton={false} className="p-5 bg-primary">
        <TicketMergeForm onSubmit={handleMerge} id={id} />
      </ExpandableScreenContent>
    </ExpandableScreen>
  );
}

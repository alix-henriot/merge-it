import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "~/components/ui/form";
import { Merge } from "lucide-react";
import { useExpandableScreen } from "../ui/expandable-screen";
import StatusBadge from "./status-badge";
import { MergeTicketsResult } from "~/lib/zendesk/merge";
import { useZendesk } from "~/hooks/use-zendesk";

const formSchema = z.object({
  source_comment: z.string(),
  target_comment: z.string(),
  source_comment_is_public: z.boolean(),
  target_comment_is_public: z.boolean(),
});

export type TicketMergeFormValues = z.infer<typeof formSchema>;

type Props = {
  onSubmit: (
    sourceId: number,
    targetId: number,
    values: TicketMergeFormValues
  ) => Promise<MergeTicketsResult>;
  id: number;
};

export default function TicketMergeForm({ onSubmit, id }: Props) {
  const { collapse } = useExpandableScreen();
  const { activeTicket: target } = useZendesk();

  const form = useForm<TicketMergeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      source_comment: `This request was closed and merged into request #${target?.id}.`,
      target_comment: `Request #${id} was closed and merged into this request.`,
      source_comment_is_public: false,
      target_comment_is_public: false,
    },
  });
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => onSubmit(id, target?.id as number, values))}
          className="flex flex-col justify-between h-full text-sm space-y-3"
        >
          <div className="bg-muted p-3 rounded-lg space-y-2">
            <div className="flex justify-between">
              <FormDescription className="text-sm font-nohemi">Ticket #{id}</FormDescription>{" "}
              <StatusBadge status="closed" />
            </div>

            <FormField
              control={form.control}
              name="source_comment"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea {...field} className="h-12 text-sm" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="source_comment_is_public"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel className="text-xs">Requester and CCs can see this comment</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} size="sm" />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <Merge className="rotate-180 text-white mx-auto size-4" />

          <div className="bg-muted p-3 rounded-lg space-y-2">
            <div className="flex justify-between">
              <FormDescription className="text-sm font-nohemi">{`Current ticket (Ticket #${target?.id})`}</FormDescription>{" "}
              <StatusBadge status={target?.status} />
            </div>

            <FormField
              control={form.control}
              name="target_comment"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea {...field} className="h-12 text-sm" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="target_comment_is_public"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel className="text-xs">Requester and CCs can see this comment</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} size="sm" />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-1">
            <Button type="submit" variant="secondary" className="w-full">
              Confirm
            </Button>
            <Button
              variant="ghost"
              type="reset"
              className="w-full text-background"
              onClick={collapse}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}

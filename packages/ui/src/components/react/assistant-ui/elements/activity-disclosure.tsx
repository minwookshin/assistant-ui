"use client";

import type { ReactNode } from "react";
import { ChevronRightIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

export type ActivityStatus =
  | "running"
  | "awaiting-input"
  | "completed"
  | "failed"
  | "cancelled";

export type ActivityDisclosureProps = {
  status: ActivityStatus;
  /** Localized state description, e.g. "Working" or "Stopped". */
  statusLabel: string;
  /** Formatted from persisted run timing by the caller, not a mount-time clock. */
  durationLabel?: string;
  latestActivity?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Only explicitly classified activity belongs here. Render the answer separately. */
  children: ReactNode;
  /** Approval, clarification, and recovery controls stay outside the disclosure. */
  attention?: ReactNode;
  className?: string;
};

export function ActivityDisclosure({
  status,
  statusLabel,
  durationLabel,
  latestActivity,
  open,
  onOpenChange,
  children,
  attention,
  className,
}: ActivityDisclosureProps) {
  return (
    <div
      data-slot="activity-disclosure"
      data-status={status}
      className={cn("flex min-w-0 flex-col gap-2", className)}
    >
      <Collapsible open={open} onOpenChange={onOpenChange}>
        <CollapsibleTrigger className="group/trigger text-muted-foreground hover:text-foreground focus-visible:ring-ring flex max-w-full items-center gap-1.5 rounded-md py-1 text-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2">
          <ChevronRightIcon
            aria-hidden="true"
            className="size-3.5 shrink-0 transition-transform duration-150 group-data-open/trigger:rotate-90 group-data-panel-open/trigger:rotate-90 motion-reduce:transition-none"
          />
          <span className="text-start tabular-nums">
            {durationLabel ? `${statusLabel} ${durationLabel}` : statusLabel}
          </span>
        </CollapsibleTrigger>
        {!open && latestActivity && (
          <p className="text-muted-foreground ps-5 text-sm break-words">
            {latestActivity}
          </p>
        )}
        <CollapsibleContent>
          <div className="border-border ms-1.5 flex flex-col gap-3 border-s ps-3.5 pt-2">
            {children}
          </div>
        </CollapsibleContent>
      </Collapsible>
      {/* Streaming tokens and ticking durations must not repeatedly interrupt speech. */}
      <span role="status" aria-atomic="true" className="sr-only">
        {statusLabel}
      </span>
      {attention}
    </div>
  );
}

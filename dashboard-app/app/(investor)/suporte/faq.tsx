"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { FAQ } from "@/lib/copy";
import { PendingContractNote } from "@/components/ui";
import { TODO_CONTRACT } from "@/lib/copy";

export function Faq() {
  return (
    <Accordion.Root type="single" collapsible className="divide-y divide-brand-line/60">
      {FAQ.map((item, i) => (
        <Accordion.Item key={i} value={`item-${i}`}>
          <Accordion.Header>
            <Accordion.Trigger className="group flex w-full items-center justify-between gap-4 py-4 text-left">
              <span className="text-sm font-medium text-brand-white">
                {item.q}
              </span>
              <ChevronDown
                size={17}
                className="shrink-0 text-brand-muted transition-transform group-data-[state=open]:rotate-180"
              />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden pb-5">
            <div className="space-y-3">
              {item.a.map((p, j) => (
                <p key={j} className="text-sm leading-relaxed text-brand-soft">
                  {p}
                </p>
              ))}
              {item.pendingContract ? (
                <PendingContractNote>{TODO_CONTRACT}</PendingContractNote>
              ) : null}
            </div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}

"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

/** Diálogo padrão do portal (Radix): foco preso, Esc fecha, título acessível. */
export function Modal({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  width = 460,
  children,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  trigger: React.ReactNode;
  title: string;
  description: string;
  width?: number;
  children: React.ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-brand-white/50" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-brand-line bg-brand-surface p-6 focus:outline-none"
          style={{ width: `min(92vw, ${width}px)` }}
        >
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-sm font-semibold text-brand-white">
                {title}
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-xs text-brand-muted">
                {description}
              </Dialog.Description>
            </div>
            <Dialog.Close
              aria-label="Fechar"
              className="rounded-lg p-1.5 text-brand-muted hover:bg-brand-raised hover:text-brand-white"
            >
              <X size={16} />
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

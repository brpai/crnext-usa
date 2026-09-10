"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/components/ui";
import { assetUrl } from "@/lib/base";

export function Gallery({
  photos,
  label,
}: {
  photos: string[];
  label: string;
}) {
  const [index, setIndex] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  const go = React.useCallback(
    (delta: number) =>
      setIndex((i) => (i + delta + photos.length) % photos.length),
    [photos.length]
  );

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go]);

  if (!photos.length) return null;

  return (
    <div className="space-y-3">
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <button
            type="button"
            className="block w-full overflow-hidden rounded-2xl border border-brand-line bg-brand-raised"
            aria-label={`Ampliar foto ${index + 1} de ${photos.length} — ${label}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={assetUrl(photos[index])}
              alt={`${label} — foto ${index + 1} de ${photos.length}`}
              className="aspect-[8/5] w-full object-cover"
            />
          </button>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-brand-white/60" />
          <Dialog.Content className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 focus:outline-none">
            <Dialog.Title className="sr-only">{`Fotos — ${label}`}</Dialog.Title>
            <Dialog.Description className="sr-only">
              Use as setas do teclado para navegar entre as fotos.
            </Dialog.Description>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={assetUrl(photos[index])}
              alt={`${label} — foto ${index + 1} de ${photos.length}`}
              className="max-h-[80vh] w-auto max-w-full rounded-xl"
            />

            <div className="mt-5 flex items-center gap-4">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Foto anterior"
                className="rounded-full border border-brand-line bg-brand-surface p-2.5 text-brand-white hover:border-brand-muted"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="tabular text-sm text-brand-soft">
                {index + 1} / {photos.length}
              </span>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Próxima foto"
                className="rounded-full border border-brand-line bg-brand-surface p-2.5 text-brand-white hover:border-brand-muted"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <Dialog.Close
              aria-label="Fechar"
              className="absolute right-4 top-4 rounded-full border border-brand-line bg-brand-surface p-2.5 text-brand-white hover:border-brand-muted"
            >
              <X size={18} />
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <ul className="flex gap-2">
        {photos.map((src, i) => (
          <li key={src} className="flex-1">
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Ver foto ${i + 1}`}
              aria-pressed={i === index}
              className={cn(
                "block w-full overflow-hidden rounded-lg border transition-colors",
                i === index
                  ? "border-brand-accent"
                  : "border-brand-line hover:border-brand-muted"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={assetUrl(src)}
                alt=""
                aria-hidden="true"
                className="aspect-[8/5] w-full object-cover"
                loading="lazy"
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

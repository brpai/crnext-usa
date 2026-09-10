import { Card, Skeleton } from "@/components/ui";

/** Estado de carregamento das telas — mesmo esqueleto para todas. */
export function PageSkeleton({ cards = 4 }: { cards?: number }) {
  return (
    <div className="space-y-7" role="status" aria-label="Carregando">
      <div className="space-y-3">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: cards }).map((_, i) => (
          <Card key={i} className="p-5">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="mt-3 h-7 w-36" />
            <Skeleton className="mt-3 h-3 w-40" />
          </Card>
        ))}
      </div>
      <Card className="p-5">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-4 h-[220px] w-full" />
      </Card>
    </div>
  );
}

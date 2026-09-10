import { MOCK_VEHICLES } from "@/lib/data/mock/vehicles";
import { VehicleDetail } from "./vehicle-detail";

/**
 * Export estático: cada VIN vira uma página pré-gerada.
 *
 * TODO(supabase): com backend real e estoque mudando todo dia, ou este app
 * passa a ter servidor (e a rota vira dinâmica), ou o build roda a cada sync
 * de inventário. A tela em si (VehicleDetail) não muda em nenhum dos casos.
 */
export function generateStaticParams() {
  return MOCK_VEHICLES.map((v) => ({ id: v.id }));
}

export default function VehicleDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <VehicleDetail id={params.id} />;
}

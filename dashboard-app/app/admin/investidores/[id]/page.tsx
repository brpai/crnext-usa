import { MOCK_INVESTORS } from "@/lib/data/mock/investors";
import { InvestorDetail } from "./investor-detail";

/** Export estático: uma página por investidor. */
export function generateStaticParams() {
  return MOCK_INVESTORS.map((i) => ({ id: i.id }));
}

export default function AdminInvestorDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <InvestorDetail id={params.id} />;
}

import type { Vehicle, VehicleCost } from "../types";
import { MOCK_VEHICLES } from "./mock/vehicles";
import { MOCK_COSTS } from "./mock/costs";

/**
 * Acesso a veículos.
 *
 * TODO(supabase): substituir o corpo destas funções por consultas ao Postgres.
 * As assinaturas são o contrato — nenhum componente muda.
 *   listVehicles()      → select * from vehicles order by purchase_date desc
 *   getVehicle(id)      → select * from vehicles where id = $1
 *   getVehicleCosts(id) → select * from vehicle_costs where vehicle_id = $1
 */

export async function listVehicles(): Promise<Vehicle[]> {
  return [...MOCK_VEHICLES].sort((a, b) =>
    a.purchaseDate < b.purchaseDate ? 1 : -1
  );
}

export async function getVehicle(id: string): Promise<Vehicle | null> {
  return MOCK_VEHICLES.find((v) => v.id === id) ?? null;
}

export async function getVehicleCosts(vehicleId: string): Promise<VehicleCost[]> {
  return MOCK_COSTS.filter((c) => c.vehicleId === vehicleId).sort((a, b) =>
    a.date < b.date ? -1 : 1
  );
}

export async function listVehiclesByIds(ids: string[]): Promise<Vehicle[]> {
  const set = new Set(ids);
  return MOCK_VEHICLES.filter((v) => set.has(v.id));
}

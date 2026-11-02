import { api } from "../lib/api-client";
import type { Dashboard } from "../types";

export async function getDashboard() {
  const data = await api<{ dashboard: Dashboard }>("/dashboard");
  return data.dashboard;
}

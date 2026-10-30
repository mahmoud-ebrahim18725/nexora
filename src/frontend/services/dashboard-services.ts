import apiClient from "../lib/api-client";
import type { Dashboard } from "@/frontend/types/dashboard";

export async function getDashboard(): Promise<Dashboard> {
  const response = await apiClient.get<{ dashboard: Dashboard }>(
    "/api/dashboard",
  );

  return response.dashboard;
}
import { api, fetchAll } from "../lib/api-client";
import type { Pagination, Role, TeamMember } from "../types";

export const TEAM_PAGE_SIZE = 20;

export function listTeam(page: number) {
  return api<{ members: TeamMember[]; pagination: Pagination }>(
    `/team/members?page=${page}&limit=${TEAM_PAGE_SIZE}`,
  );
}

export function listAllTeam() {
  return fetchAll<TeamMember>(
    "/team/members",
    (data: { members: TeamMember[]; pagination: Pagination }) => ({
      items: data.members,
      total: data.pagination.total,
    }),
  );
}

export function changeTeamRole(id: number, role: Exclude<Role, "owner">) {
  return api(`/team/members/${id}/role`, { method: "PATCH", body: { role } });
}

export function removeTeamMember(id: number) {
  return api(`/team/members/${id}`, { method: "DELETE" });
}

export function createInvitation(body: {
  email: string;
  role: Exclude<Role, "owner">;
}) {
  return api<{ invitation: { id: number; token: string } }>("/invitations", {
    method: "POST",
    body,
  });
}

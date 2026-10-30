import apiClient from "../lib/api-client";
import type {
  AcceptInvitationInput,
  Invitation,
  Role,
  TeamMember,
} from "@/frontend/types/team";

export async function listTeamMembers(): Promise<TeamMember[]> {
  const response = await apiClient.get<{ members: TeamMember[] }>(
    "/api/team/members",
  );
  return response.members;
}

export async function changeTeamMemberRole(
  memberId: number,
  role: Exclude<Role, "owner">,
): Promise<void> {
  await apiClient.patch(`/api/team/members/${memberId}/role`, { role });
}

export async function removeTeamMember(memberId: number): Promise<void> {
  await apiClient.delete(`/api/team/members/${memberId}`);
}

export async function createInvitation(input: {
  email: string;
  role: Exclude<Role, "owner">;
}): Promise<Invitation> {
  const response = await apiClient.post<{ invitation: Invitation }>(
    "/api/invitations",
    input,
  );
  return response.invitation;
}

export async function acceptInvitation(
  input: AcceptInvitationInput,
): Promise<void> {
  await apiClient.post("/api/invitations/accept", input);
}

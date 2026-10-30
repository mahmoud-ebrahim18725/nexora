export type Role = "owner" | "admin" | "member";

export type TeamMember = {
  id: number;
  name: string;
  email: string;
  role: Role;
};

export type Invitation = {
  id: number;
  token: string;
};

export type AcceptInvitationInput = {
  id: number;
  token: string;
  name: string;
  password: string;
};

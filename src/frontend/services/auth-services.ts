import { api } from "../lib/api-client";

export function login(body: { email: string; password: string }) {
  return api("/auth/login", { method: "POST", body });
}

export function register(body: {
  companyName: string;
  name: string;
  email: string;
  password: string;
}) {
  return api("/auth/register", { method: "POST", body });
}

export function logout() {
  return api("/auth/logout", { method: "POST" });
}

export function acceptInvitation(body: {
  id: string;
  token: string;
  name: string;
  password: string;
}) {
  return api("/invitations/accept", { method: "POST", body });
}

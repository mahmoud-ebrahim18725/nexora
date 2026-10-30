import apiClient from "../lib/api-client";

import type {RegisterInput, logInInput} from "@/frontend/types/auth";

export async function logIn(input: logInInput): Promise<string> {
  return apiClient.post<string>("/api/auth/login", input);
}

export async function register(input: RegisterInput): Promise<string> {
  return apiClient.post<string>("/api/auth/register", input);
}

export async function logout(): Promise<void> {
  await apiClient.post("/api/auth/logout", {});
}
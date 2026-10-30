import apiClient from "../lib/api-client";
import type {
  CreateProjectInput,
  ProjectDetails,
  ProjectMember,
  ProjectRole,
  ProjectSummary,
  UpdateProjectInput,
} from "@/frontend/types/project";

export async function listProjects(): Promise<ProjectSummary[]> {
  const response = await apiClient.get<{ projects: ProjectSummary[] }>(
    "/api/projects",
  );
  return response.projects;
}

export async function createProject(
  input: CreateProjectInput,
): Promise<ProjectSummary> {
  const response = await apiClient.post<{ project: ProjectSummary }>(
    "/api/projects",
    input,
  );
  return response.project;
}

export async function getProject(id: number): Promise<ProjectDetails> {
  return apiClient.get<ProjectDetails>(`/api/projects/${id}`);
}

export async function updateProject(
  id: number,
  input: UpdateProjectInput,
): Promise<ProjectDetails> {
  return apiClient.patch<ProjectDetails>(`/api/projects/${id}`, input);
}

export async function deleteProject(id: number): Promise<void> {
  await apiClient.delete(`/api/projects/${id}`);
}

export async function listProjectMembers(
  projectId: number,
): Promise<ProjectMember[]> {
  const response = await apiClient.get<{ members: ProjectMember[] }>(
    `/api/projects/${projectId}/members`,
  );
  return response.members;
}

export async function addProjectMember(
  projectId: number,
  input: { userId: number; role?: ProjectRole },
): Promise<void> {
  await apiClient.post(`/api/projects/${projectId}/members`, input);
}

export async function changeProjectMemberRole(
  projectId: number,
  input: { userId: number; role: ProjectRole },
): Promise<void> {
  await apiClient.patch(`/api/projects/${projectId}/members`, input);
}

export async function removeProjectMember(
  projectId: number,
  userId: number,
): Promise<void> {
  await apiClient.delete(`/api/projects/${projectId}/members`, { userId });
}

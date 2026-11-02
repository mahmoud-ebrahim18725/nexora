import { api, fetchAll } from "../lib/api-client";
import type {
  Pagination,
  Project,
  ProjectMember,
  ProjectRole,
  ProjectStatus,
} from "../types";

export const PROJECTS_PAGE_SIZE = 9;

export function listProjects(page: number, status?: ProjectStatus) {
  const filter = status ? `&status=${status}` : "";
  return api<{ projects: Project[]; pagination: Pagination }>(
    `/projects?page=${page}&limit=${PROJECTS_PAGE_SIZE}${filter}`,
  );
}

export async function getProject(id: number) {
  const data = await api<{ project: Project }>(`/projects/${id}`);
  return data.project;
}

export function createProject(body: { name: string; description?: string }) {
  return api<{ project: Project }>("/projects", { method: "POST", body });
}

export function updateProject(
  id: number,
  body: {
    name?: string;
    description?: string | null;
    status?: ProjectStatus;
  },
) {
  return api(`/projects/${id}`, { method: "PATCH", body });
}

export function deleteProject(id: number) {
  return api(`/projects/${id}`, { method: "DELETE" });
}

export function listProjectMembers(projectId: number) {
  return fetchAll<ProjectMember>(
    `/projects/${projectId}/members`,
    (data: { members: ProjectMember[]; pagination: Pagination }) => ({
      items: data.members,
      total: data.pagination.total,
    }),
  );
}

export function addProjectMember(
  projectId: number,
  body: { userId: number; role: ProjectRole },
) {
  return api(`/projects/${projectId}/members`, { method: "POST", body });
}

export function changeProjectMemberRole(
  projectId: number,
  body: { userId: number; role: ProjectRole },
) {
  return api(`/projects/${projectId}/members`, { method: "PATCH", body });
}

export function removeProjectMember(projectId: number, userId: number) {
  return api(`/projects/${projectId}/members`, {
    method: "DELETE",
    body: { userId },
  });
}

export type ProjectStatus = "planning" | "active" | "completed" | "archived";

export type ProjectRole = "manager" | "member";

export type ProjectSummary = {
  id: number;
  name: string;
  status: ProjectStatus;
};

export type ProjectDetails = {
  id: number;
  name: string;
  description: string | null;
  status: ProjectStatus;
  membersCount: number;
  tasksCount: number;
};

export type ProjectMember = {
  id: number;
  name: string;
  email: string;
  projectRole: ProjectRole;
};

export type CreateProjectInput = {
  name: string;
  description?: string;
};

export type UpdateProjectInput = {
  name?: string;
  description?: string;
  status?: ProjectStatus;
};

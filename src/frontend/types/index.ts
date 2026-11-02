export type Role = "owner" | "admin" | "member";
export type ProjectRole = "manager" | "member";
export type ProjectStatus = "planning" | "active" | "completed" | "archived";
export type TaskStatus = "todo" | "in_progress" | "completed";
export type TaskPriority = "low" | "medium" | "high";

export type Pagination = {
  page: number;
  limit: number;
  total: number;
};

export type CurrentUser = {
  id: number;
  name: string;
  email: string;
  role: Role;
  companyName: string;
};

export type Project = {
  id: number;
  name: string;
  description: string | null;
  status: ProjectStatus;
  tasksCount: number;
  membersCount: number;
};

export type ProjectMember = {
  id: number;
  name: string;
  email: string;
  projectRole: ProjectRole;
};

export type Task = {
  id: number;
  title: string;
  description: string | null;
  priority: TaskPriority;
  assignedTo: number | null;
  dueDate: string | null;
  status: TaskStatus;
};

export type Comment = {
  id: number;
  content: string;
  createdAt: string;
  user: { id: number; name: string } | null;
};

export type TeamMember = {
  id: number;
  name: string;
  email: string;
  role: Role;
};

export type Dashboard = {
  projects: {
    total: number;
    byStatus: Record<string, number>;
    recent: {
      id: number;
      name: string;
      status: ProjectStatus;
      tasksCount?: number;
      projectRole?: ProjectRole;
    }[];
  };
  tasks: {
    total: number;
    byStatus: Record<string, number>;
    overdue: number;
  };
};

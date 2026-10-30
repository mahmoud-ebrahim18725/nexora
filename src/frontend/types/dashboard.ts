export type DashboardProjectStatus = Record<string, number>;

export type DashboardTaskStatus = Record<string, number>;

export type OwnerRecentProject = {
  id: number;
  name: string;
  status: string;
  tasksCount: number;
};

export type UserRecentProject = {
  id: number;
  name: string;
  status: string;
  projectRole: string;
};

export type Dashboard = {
  projects: {
    total: number;
    byStatus: DashboardProjectStatus;
    recent: OwnerRecentProject[] | UserRecentProject[];
  };
  tasks: {
    total: number;
    byStatus: DashboardTaskStatus;
    overdue: number;
  };
};
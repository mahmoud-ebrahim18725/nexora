import { requireAuth } from "@/backend/auth";
import { AppError } from "@/backend/errors/app-error";
import { ROLES, ERROR_CODES } from "@/backend/constants";
import {
  countCompanyProjects,
  countMemberProjects,
  getProjectCountsByStatus,
  getProjectCountsByStatusForMember,
  countCompanyTasks,
  countMemberTasks,
  getTaskCountsByStatus,
  getTaskCountsByStatusForMember,
  countOverdueCompanyTasks,
  countOverdueMemberTasks,
  getRecentCompanyProjects,
  getRecentMemberProjects,
} from "@/backend/repositories/dashboard-repository";

function toStatusCounts(items: { status: string; _count: { status: number } }[]) {
  return items.reduce(
    (acc, item) => {
      acc[item.status] = item._count.status;
      return acc;
    },
    {} as Record<string, number>,
  );
}

export async function getDashboard() {
  const user = await requireAuth();
  if (user.role === ROLES.OWNER) {
    const [
      projectsTotal,
      projectsByStatus,
      tasksTotal,
      tasksByStatus,
      overdue,
      recentProjects,
    ] = await Promise.all([
      countCompanyProjects(user.companyId),
      getProjectCountsByStatus(user.companyId),
      countCompanyTasks(user.companyId),
      getTaskCountsByStatus(user.companyId),
      countOverdueCompanyTasks(user.companyId),
      getRecentCompanyProjects(user.companyId),
    ]);
    return {
      projects: {
        total: projectsTotal,
        byStatus: toStatusCounts(projectsByStatus),
        recent: recentProjects.map((project) => ({
          id: project.id,
          name: project.name,
          status: project.status,
          tasksCount: project._count.tasks,
        })),
      },
      tasks: {
        total: tasksTotal,
        byStatus: toStatusCounts(tasksByStatus),
        overdue,
      },
    };
  }
  if (user.role === ROLES.MEMBER || user.role === ROLES.ADMIN) {
    const [
      projectsTotal,
      projectsByStatus,
      tasksTotal,
      tasksByStatus,
      overdue,
      recentProjects,
    ] = await Promise.all([
      countMemberProjects(user.id),
      getProjectCountsByStatusForMember(user.id),
      countMemberTasks(user.id),
      getTaskCountsByStatusForMember(user.id),
      countOverdueMemberTasks(user.id),
      getRecentMemberProjects(user.id),
    ]);
    return {
      projects: {
        total: projectsTotal,
        byStatus: toStatusCounts(projectsByStatus),
        recent: recentProjects.map((project) => ({
          id: project.id,
          name: project.name,
          status: project.status,
          projectRole: project.projectMembers[0].projectRole,
        })),
      },
      tasks: {
        total: tasksTotal,
        byStatus: toStatusCounts(tasksByStatus),
        overdue,
      },
    };
  }
  throw new AppError("Forbidden", 403, ERROR_CODES.FORBIDDEN);
}

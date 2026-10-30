import { prisma } from "@/backend/lib/prisma";
import { TASK_STATUS } from "@/backend/constants";


export function countCompanyProjects(companyId: number) {
  return prisma.project.count({
    where: {
      companyId,
    },
  });
}

export function countMemberProjects(userId: number) {
  return prisma.projectMember.count({
    where: {
      userId,
    },
  });
}

export function getProjectCountsByStatus(companyId: number) {
  return prisma.project.groupBy({
    by: ["status"],
    where: {
      companyId,
    },
    _count: {
      status: true,
    },
  });
}

export function getProjectCountsByStatusForMember(userId: number) {
  return prisma.project.groupBy({
    by: ["status"],
    where: {
      projectMembers: {
        some: {
          userId,
        },
      },
    },
    _count: {
      status: true,
    },
  });
}

export function getRecentCompanyProjects(companyId: number) {
  return prisma.project.findMany({
    where: {
      companyId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
    select: {
      id: true,
      name: true,
      status: true,
      _count: {
        select: {
          tasks: true,
        },
      },
    },
  });
}

export function getRecentMemberProjects(userId: number) {
  return prisma.project.findMany({
    where: {
      projectMembers: {
        some: {
          userId,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
    select: {
      id: true,
      name: true,
      status: true,
      projectMembers: {
        where: {
          userId,
        },
        select: {
          projectRole: true,
        },
      },
    },
  });
}

export function countCompanyTasks(companyId: number) {
  return prisma.task.count({
    where: {
      project: {
        companyId,
      },
    },
  });
}

export function countMemberTasks(userId: number) {
  return prisma.task.count({
    where: {
      project: {
        projectMembers: {
          some: {
            userId,
          },
        },
      },
    },
  });
}

export function getTaskCountsByStatus(companyId: number) {
  return prisma.task.groupBy({
    by: ["status"],
    where: {
      project: {
        companyId,
      },
    },
    _count: {
      status: true,
    },
  });
}

export function getTaskCountsByStatusForMember(userId: number) {
  return prisma.task.groupBy({
    by: ["status"],
    where: {
      project: {
        projectMembers: {
          some: {
            userId,
          },
        },
      },
    },
    _count: {
      status: true,
    },
  });
}

export function countOverdueCompanyTasks(companyId: number) {
  return prisma.task.count({
    where: {
      project: {
        companyId,
      },
      dueDate: {
        lt: new Date(),
      },
      status: {
        not: TASK_STATUS.COMPLETED,
      },
    },
  });
}

export function countOverdueMemberTasks(userId: number) {
  return prisma.task.count({
    where: {
      project: {
        projectMembers: {
          some: {
            userId,
          },
        },
      },
      dueDate: {
        lt: new Date(),
      },
      status: {
        not: TASK_STATUS.COMPLETED,
      },
    },
  });
}


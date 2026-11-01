import { prisma } from "@/backend/lib/prisma";
import { requireAuth } from "@/backend/auth";
import { ROLES, ERROR_CODES, PROJECT_ROLES } from "@/backend/constants";
import { AppError } from "@/backend/errors/app-error";
import {
  findProjectById,
  findProjectMember,
  managersCount,
  findProjectManager,
} from "@/backend/repositories";

function deleteMembership(userId: number, projectId: number) {
  return prisma.$transaction([
    prisma.task.updateMany({
      where: {
        projectId: projectId,
        assignedTo: userId,
      },
      data: {
        assignedTo: null,
      },
    }),
    prisma.projectMember.delete({
      where: {
        userId_projectId: {
          userId: userId,
          projectId: projectId,
        },
      },
    }),
  ]);
}

export async function removeProjectMember(userId: number, projectId: number) {
  const currentUser = await requireAuth();
  const project = await findProjectById(projectId, currentUser.companyId);
  if (!project) {
    throw new AppError("Project not found", 404, ERROR_CODES.NOT_FOUND);
  }
  const member = await findProjectMember(userId, projectId);
  if (!member) {
    throw new AppError("Member not found", 404, ERROR_CODES.NOT_FOUND);
  }
  if (currentUser.role === ROLES.OWNER) {
    if (member.projectRole === PROJECT_ROLES.MANAGER) {
      const managers = await managersCount(projectId);
      if (managers <= 1) {
        throw new AppError(
          "Cannot remove last manager",
          409,
          ERROR_CODES.CONFLICT,
        );
      }
    }
    await deleteMembership(userId, projectId);
    return "Member removed successfully";
  }
  const isProjectManager = await findProjectManager(currentUser.id, projectId);
  if (isProjectManager) {
    if (member.projectRole === PROJECT_ROLES.MANAGER) {
      throw new AppError("Forbidden", 403, ERROR_CODES.FORBIDDEN);
    }
    await deleteMembership(userId, projectId);
    return "Member removed successfully";
  }
  throw new AppError("Forbidden", 403, ERROR_CODES.FORBIDDEN);
}

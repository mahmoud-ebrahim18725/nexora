import { prisma } from "@/backend/lib/prisma";
import { requireAuth } from "@/backend/auth/require-auth";
import { ROLES, ERROR_CODES } from "@/backend/constants";
import { AppError } from "@/backend/errors/app-error";
import { findProjectById, findProjectMember } from "@/backend/repositories";
import { paginationArgs } from "@/backend/lib/pagination";
import type { PaginationInput } from "@/backend/validators";

export async function listMembers(
  projectId: number,
  pagination: PaginationInput,
) {
  const user = await requireAuth();
  const project = await findProjectById(projectId, user.companyId);
  if (!project) {
    throw new AppError("Project not found", 404, ERROR_CODES.NOT_FOUND);
  }
  const member = await findProjectMember(user.id, project.id);
  if (!member && user.role !== ROLES.OWNER) {
    throw new AppError("Forbidden", 403, ERROR_CODES.FORBIDDEN);
  }
  const where = {
    projectMembers: {
      some: {
        projectId: project.id,
      },
    },
  };
  const [members, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: {
        id: "asc",
      },
      ...paginationArgs(pagination),
      select: {
        id: true,
        name: true,
        email: true,
        projectMembers: {
          where: {
            projectId: project.id,
          },
          select: {
            projectRole: true,
          },
        },
      },
    }),
    prisma.user.count({
      where,
    }),
  ]);
  return {
    members: members.map((member) => {
      return {
        id: member.id,
        name: member.name,
        email: member.email,
        projectRole: member.projectMembers[0].projectRole,
      };
    }),
    pagination: { ...pagination, total },
  };
}

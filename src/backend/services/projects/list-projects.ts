import { prisma } from "@/backend/lib/prisma";
import { requireAuth } from "@/backend/auth/require-auth";
import { ROLES, ERROR_CODES } from "@/backend/constants";
import { AppError } from "@/backend/errors/app-error";
import { paginationArgs } from "@/backend/lib/pagination";
import type { PaginationInput } from "@/backend/validators";

function visibleProjects(user: { id: number; role: string; companyId: number }) {
  if (user.role === ROLES.OWNER) {
    return {
      companyId: user.companyId,
    };
  }
  if (user.role === ROLES.MEMBER || user.role === ROLES.ADMIN) {
    return {
      projectMembers: {
        some: {
          userId: user.id,
        },
      },
    };
  }
  throw new AppError("Forbidden", 403, ERROR_CODES.FORBIDDEN);
}

export async function listProjects(pagination: PaginationInput) {
  const user = await requireAuth();
  const where = visibleProjects(user);
  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where,
      orderBy: {
        id: "desc",
      },
      ...paginationArgs(pagination),
      select: {
        id: true,
        name: true,
        status: true,
      },
    }),
    prisma.project.count({
      where,
    }),
  ]);
  return { projects, pagination: { ...pagination, total } };
}

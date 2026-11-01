import { prisma } from "@/backend/lib/prisma";
import { requireAuth } from "@/backend/auth";
import { AppError } from "@/backend/errors/app-error";
import { ERROR_CODES, ROLES } from "@/backend/constants";
import {
  findTask,
  findProjectById,
  findProjectMember,
} from "@/backend/repositories";
import { paginationArgs } from "@/backend/lib/pagination";
import type { PaginationInput } from "@/backend/validators";

export async function listComments(
  taskId: number,
  projectId: number,
  pagination: PaginationInput,
) {
  const currentUser = await requireAuth();
  const project = await findProjectById(projectId, currentUser.companyId);
  if (!project) {
    throw new AppError("Project not found", 404, ERROR_CODES.NOT_FOUND);
  }
  const task = await findTask(projectId, taskId);
  if (!task) {
    throw new AppError("Task not found", 404, ERROR_CODES.NOT_FOUND);
  }
  const isProjectMember = await findProjectMember(currentUser.id, project.id);
  if (!isProjectMember && currentUser.role !== ROLES.OWNER) {
    throw new AppError(
      "You are not a member of this project",
      403,
      ERROR_CODES.FORBIDDEN,
    );
  }
  const where = {
    taskId: taskId,
  };
  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where,
      orderBy: {
        id: "asc",
      },
      ...paginationArgs(pagination),
      select: {
        id: true,
        content: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
    prisma.comment.count({
      where,
    }),
  ]);
  return { comments, pagination: { ...pagination, total } };
}

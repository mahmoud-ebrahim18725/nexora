import { prisma } from "@/backend/lib/prisma";
import { requireAuth } from "@/backend/auth";
import { AppError } from "@/backend/errors/app-error";
import { startOfToday } from "@/backend/lib/date";
import {
  ERROR_CODES,
  ROLES,
  TaskStatus,
  TaskPriority,
} from "@/backend/constants";
import {
  findProjectById,
  findTask,
  findProjectManager,
  findProjectMember,
} from "@/backend/repositories";

export async function updateTask(
  projectId: number,
  taskId: number,
  data: {
    title?: string;
    description?: string | null;
    priority?: TaskPriority;
    assignedTo?: number | null;
    dueDate?: Date | null;
    status?: TaskStatus;
  },
) {
  if (Object.keys(data).length === 0) {
    throw new AppError("No data provided", 400, ERROR_CODES.BAD_REQUEST);
  }
  const currentUser = await requireAuth();
  const project = await findProjectById(projectId, currentUser.companyId);
  if (!project) {
    throw new AppError("Project not found", 404, ERROR_CODES.NOT_FOUND);
  }
  const task = await findTask(projectId, taskId);
  if (!task) {
    throw new AppError("Task not found", 404, ERROR_CODES.NOT_FOUND);
  }

  const isManager = await findProjectManager(currentUser.id, projectId);
  if (currentUser.role !== ROLES.OWNER && !isManager) {
    const isMember = await findProjectMember(currentUser.id, projectId);
    const onlyStatus = Object.keys(data).every((field) => field === "status");
    if (!isMember || task.assignedTo !== currentUser.id || !onlyStatus) {
      throw new AppError(
        "You can't update this task",
        403,
        ERROR_CODES.FORBIDDEN,
      );
    }
  }
  if (data.assignedTo) {
    const projectMember = await findProjectMember(data.assignedTo, projectId);
    if (!projectMember) {
      throw new AppError("User not found", 404, ERROR_CODES.NOT_FOUND);
    }
  }
  if (data.dueDate && data.dueDate < startOfToday()) {
    throw new AppError(
      "Due date cannot be in the past",
      400,
      ERROR_CODES.BAD_REQUEST,
    );
  }
  const updatedTask = await prisma.task.update({
    where: {
      id: taskId,
    },
    data,
  });
  return {
    id: updatedTask.id,
    title: updatedTask.title,
    description: updatedTask.description,
    priority: updatedTask.priority,
    assignedTo: updatedTask.assignedTo,
    dueDate: updatedTask.dueDate,
    status: updatedTask.status,
  };
}

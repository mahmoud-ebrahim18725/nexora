import { z } from "zod";
import { TASK_PRIORITY, TASK_STATUS } from "@/backend/constants";
import {
  MAX_TEXT_LENGTH,
  MAX_TITLE_LENGTH,
  bodyId,
  idParam,
} from "./common";

const dueDateField = z
  .union([z.iso.date(), z.iso.datetime({ offset: true })])
  .pipe(z.coerce.date());

export const createTaskSchema = z.object({
  projectId: idParam,
  title: z.string().trim().min(1).max(MAX_TITLE_LENGTH),
  description: z.string().trim().min(1).max(MAX_TEXT_LENGTH).optional(),
  priority: z.enum(Object.values(TASK_PRIORITY)),
  assignedTo: bodyId.optional(),
  dueDate: dueDateField.optional(),
});

export const getTaskSchema = z.object({
  projectId: idParam,
  taskId: idParam,
});

export const updateTaskSchema = z.object({
  title: z.string().trim().min(1).max(MAX_TITLE_LENGTH).optional(),
  description: z.string().trim().min(1).max(MAX_TEXT_LENGTH).nullable().optional(),
  priority: z.enum(Object.values(TASK_PRIORITY)).optional(),
  assignedTo: bodyId.nullable().optional(),
  dueDate: dueDateField.nullable().optional(),
  status: z.enum(Object.values(TASK_STATUS)).optional(),
});

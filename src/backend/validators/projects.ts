import { z } from "zod";
import { PROJECT_ROLES, PROJECT_STATUS } from "@/backend/constants";
import {
  MAX_NAME_LENGTH,
  MAX_TEXT_LENGTH,
  bodyId,
  idParam,
} from "./common";

export const createProjectSchema = z.object({
  name: z.string().trim().min(1).max(MAX_NAME_LENGTH),
  description: z.string().trim().max(MAX_TEXT_LENGTH).optional(),
});

export const projectFiltersSchema = z.object({
  status: z.enum(Object.values(PROJECT_STATUS)).optional(),
});

export const projectIdSchema = z.object({
  id: idParam,
});

export const addMemberSchema = z.object({
  projectId: idParam,
  userId: bodyId,
  role: z.enum(Object.values(PROJECT_ROLES)).optional(),
});

export const changeProjectMemberRoleSchema = z.object({
  projectId: idParam,
  userId: bodyId,
  role: z.enum(Object.values(PROJECT_ROLES)),
});

export const removeMemberSchema = z.object({
  projectId: idParam,
  userId: bodyId,
});

export const updateProjectSchema = z.object({
  name: z.string().trim().min(1).max(MAX_NAME_LENGTH).optional(),
  description: z.string().trim().min(1).max(MAX_TEXT_LENGTH).nullable().optional(),
  status: z.enum(Object.values(PROJECT_STATUS)).optional(),
});

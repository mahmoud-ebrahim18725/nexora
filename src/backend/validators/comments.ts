import { z } from "zod";
import { MAX_TEXT_LENGTH, idParam } from "./common";

export const createCommentSchema = z.object({
  content: z.string().trim().min(1).max(MAX_TEXT_LENGTH),
});

export const updateCommentSchema = z.object({
  content: z.string().trim().min(1).max(MAX_TEXT_LENGTH),
});

export const commentIdSchema = z.object({
  projectId: idParam,
  taskId: idParam,
  commentId: idParam,
});

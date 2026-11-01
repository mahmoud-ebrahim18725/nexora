import {
  validate,
  getPagination,
  createCommentSchema,
  getTaskSchema,
} from "@/backend/validators";
import { createComment, listComments } from "@/backend/services/comments";
import { successResponse } from "@/backend/lib/response";
import { readJsonBody } from "@/backend/lib/request";
import { handleError } from "@/backend/errors/error-handler";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; taskId: string }> },
) {
  try {
    const { id, taskId } = await params;
    const body = await readJsonBody(request);
    const idSchema = validate(getTaskSchema, { projectId: id, taskId: taskId });
    const result = validate(createCommentSchema, body);
    const comment = await createComment({ ...result, ...idSchema });
    return successResponse({ data: { comment }, statusCode: 201 });
  } catch (error) {
    return handleError(error);
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; taskId: string }> },
) {
  try {
    const { id, taskId } = await params;
    const idSchema = validate(getTaskSchema, { projectId: id, taskId: taskId });
    const data = await listComments(
      idSchema.taskId,
      idSchema.projectId,
      getPagination(request),
    );
    return successResponse({ data });
  } catch (error) {
    return handleError(error);
  }
}

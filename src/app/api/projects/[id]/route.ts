import {
  validate,
  projectIdSchema,
  updateProjectSchema,
} from "@/backend/validators";
import {
  getProject,
  updateProject,
  deleteProject,
} from "@/backend/services/projects";
import { successResponse } from "@/backend/lib/response";
import { readJsonBody } from "@/backend/lib/request";
import { handleError } from "@/backend/errors/error-handler";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const result = validate(projectIdSchema, { id });
    const project = await getProject(result.id);
    return successResponse({ data: { project } });
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const idSchema = validate(projectIdSchema, { id });
    const result = validate(updateProjectSchema, await readJsonBody(request));
    const project = await updateProject(idSchema.id, result);
    return successResponse({ data: { project } });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const result = validate(projectIdSchema, { id });
    const message = await deleteProject(result.id);
    return successResponse({ data: { message } });
  } catch (error) {
    return handleError(error);
  }
}

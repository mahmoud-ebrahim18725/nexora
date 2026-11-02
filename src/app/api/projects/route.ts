import {
  validate,
  getPagination,
  createProjectSchema,
  projectFiltersSchema,
} from "@/backend/validators";
import { createProject, listProjects } from "@/backend/services/projects";
import { successResponse } from "@/backend/lib/response";
import { readJsonBody } from "@/backend/lib/request";
import { handleError } from "@/backend/errors/error-handler";

export async function POST(request: Request) {
  try {
    const body = await readJsonBody(request);
    const result = validate(createProjectSchema, body);
    const { project, managerMembership } = await createProject(result);
    return successResponse({
      data: { project, managerMembership },
      statusCode: 201,
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams;
    const { status } = validate(
      projectFiltersSchema,
      Object.fromEntries(params),
    );
    const data = await listProjects(getPagination(request), status);
    return successResponse({ data });
  } catch (error) {
    return handleError(error);
  }
}

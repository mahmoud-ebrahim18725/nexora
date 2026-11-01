import { getPagination } from "@/backend/validators";
import { listMembers } from "@/backend/services/team/list-members";
import { successResponse } from "@/backend/lib/response";
import { handleError } from "@/backend/errors/error-handler";

export async function GET(request: Request) {
  try {
    const data = await listMembers(getPagination(request));
    return successResponse({ data });
  } catch (error) {
    return handleError(error);
  }
}

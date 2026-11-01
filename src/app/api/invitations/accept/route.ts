import { validate, acceptInvitationSchema } from "@/backend/validators";
import { acceptInvitation } from "@/backend/services/invitations/accept-invitation";
import { successResponse } from "@/backend/lib/response";
import { readJsonBody } from "@/backend/lib/request";
import { handleError } from "@/backend/errors/error-handler";

export async function POST(request: Request) {
  try {
    const body = await readJsonBody(request);
    const result = validate(acceptInvitationSchema, body);
    const { user } = await acceptInvitation(result);
    return successResponse({ data: { user }, statusCode: 201 });
  } catch (error) {
    return handleError(error);
  }
}

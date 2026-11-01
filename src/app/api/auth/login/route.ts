import { validate, loginSchema } from "@/backend/validators";
import { login } from "@/backend/services/auth/login";
import { successResponse } from "@/backend/lib/response";
import { readJsonBody } from "@/backend/lib/request";
import { handleError } from "@/backend/errors/error-handler";

export async function POST(request: Request) {
  try {
    const body = await readJsonBody(request);
    const result = validate(loginSchema, body);
    await login(result);
    return successResponse({ data: { message: "Login successful" } });
  } catch (error) {
    return handleError(error);
  }
}

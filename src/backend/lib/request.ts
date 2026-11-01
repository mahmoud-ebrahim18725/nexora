import { AppError } from "@/backend/errors/app-error";
import { ERROR_CODES } from "@/backend/constants/error-codes";

export async function readJsonBody(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new AppError("Invalid JSON body", 400, ERROR_CODES.BAD_REQUEST);
  }
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    throw new AppError("Invalid JSON body", 400, ERROR_CODES.BAD_REQUEST);
  }
  return body as Record<string, unknown>;
}

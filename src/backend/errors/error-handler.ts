import { ERROR_CODES } from "@/backend/constants/error-codes";
import { AppError } from "@/backend/errors/app-error";
import { errorResponse } from "@/backend/lib/response";
import { Prisma } from "@/generated/prisma/client";

export function handleError(error: unknown) {
  if (error instanceof AppError) {
    return errorResponse({
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
      statusCode: error.statusCode,
    });
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return errorResponse({
        error: {
          code: ERROR_CODES.CONFLICT,
          message: "Resource already exists",
        },
        statusCode: 409,
      });
    }
    if (error.code === "P2025") {
      return errorResponse({
        error: {
          code: ERROR_CODES.NOT_FOUND,
          message: "Resource not found",
        },
        statusCode: 404,
      });
    }
  }
  console.error(error);
  return errorResponse({
    error: {
      code: ERROR_CODES.INTERNAL_ERROR,
      message: "Something went wrong",
    },
    statusCode: 500,
  });
}

import { describe, expect, it, vi } from "vitest";
import { handleError } from "@/backend/errors/error-handler";
import { readJsonBody } from "@/backend/lib/request";
import { AppError } from "@/backend/errors/app-error";
import { Prisma } from "@/generated/prisma/client";

function prismaError(code: string) {
  return new Prisma.PrismaClientKnownRequestError("failed", {
    code,
    clientVersion: "test",
  });
}

function jsonRequest(body: string) {
  return new Request("http://localhost/api", { method: "POST", body });
}

describe("handleError", () => {
  it("maps a unique constraint error to 409", async () => {
    const response = handleError(prismaError("P2002"));
    expect(response.status).toBe(409);
    expect((await response.json()).error.code).toBe("CONFLICT");
  });

  it("maps a missing record error to 404", () => {
    expect(handleError(prismaError("P2025")).status).toBe(404);
  });

  it("keeps unknown errors as 500", () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(handleError(new Error("boom")).status).toBe(500);
    log.mockRestore();
  });
});

describe("readJsonBody", () => {
  it("returns the parsed object", async () => {
    await expect(readJsonBody(jsonRequest('{"a":1}'))).resolves.toEqual({ a: 1 });
  });

  it.each(["{oops", "null", "[]", "1"])("rejects %s with 400", async (body) => {
    const error = await readJsonBody(jsonRequest(body)).catch((e) => e);
    expect(error).toBeInstanceOf(AppError);
    expect(error.statusCode).toBe(400);
  });
});

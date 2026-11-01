import { headers } from "next/headers";
import { prisma } from "@/backend/lib/prisma";
import { AppError } from "@/backend/errors/app-error";
import { ERROR_CODES, type RateLimitRule } from "@/backend/constants";

export async function getClientIp() {
  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get("x-forwarded-for");
  return (
    forwardedFor?.split(",")[0].trim() ||
    requestHeaders.get("x-real-ip") ||
    "unknown"
  );
}

export async function enforceRateLimit(key: string, rule: RateLimitRule) {
  const now = new Date();
  const resetAt = new Date(now.getTime() + rule.windowMs);
  const [row] = await prisma.$queryRaw<{ count: number }[]>`
    INSERT INTO "RateLimit" ("key", "count", "resetAt")
    VALUES (${key}, 1, ${resetAt}::timestamp)
    ON CONFLICT ("key") DO UPDATE SET
      "count" = CASE
        WHEN "RateLimit"."resetAt" <= ${now}::timestamp THEN 1
        ELSE "RateLimit"."count" + 1
      END,
      "resetAt" = CASE
        WHEN "RateLimit"."resetAt" <= ${now}::timestamp THEN EXCLUDED."resetAt"
        ELSE "RateLimit"."resetAt"
      END
    RETURNING "count"
  `;
  if (row.count > rule.limit) {
    throw new AppError(
      "Too many requests, please try again later",
      429,
      ERROR_CODES.TOO_MANY_REQUESTS,
    );
  }
}

export async function deleteExpiredRateLimits() {
  return prisma.rateLimit.deleteMany({
    where: {
      resetAt: {
        lt: new Date(),
      },
    },
  });
}

import { findUserByEmail } from "@/backend/repositories/user-repository";
import { LoginInput } from "@/backend/validators";
import { AppError } from "@/backend/errors/app-error";
import { ERROR_CODES, RATE_LIMITS } from "@/backend/constants";
import {
  verifyPassword,
  createSession,
  setSessionCookie,
  deleteExpiredSessions,
} from "@/backend/auth";
import {
  enforceRateLimit,
  getClientIp,
  deleteExpiredRateLimits,
} from "@/backend/lib/rate-limit";

export async function login(input: LoginInput) {
  const ip = await getClientIp();
  await enforceRateLimit(`login:ip:${ip}`, RATE_LIMITS.LOGIN_IP);
  await enforceRateLimit(`login:email:${input.email}`, RATE_LIMITS.LOGIN_EMAIL);
  const user = await findUserByEmail(input.email);
  if (!user) {
    throw new AppError(
      "Invalid email or password",
      401,
      ERROR_CODES.UNAUTHORIZED,
    );
  }
  const isPasswordValid = await verifyPassword(
    input.password,
    user.passwordHash,
  );
  if (!isPasswordValid) {
    throw new AppError(
      "Invalid email or password",
      401,
      ERROR_CODES.UNAUTHORIZED,
    );
  }
  const session = await createSession(user.id);
  await setSessionCookie(session.id);
  await Promise.all([deleteExpiredSessions(), deleteExpiredRateLimits()]);
}

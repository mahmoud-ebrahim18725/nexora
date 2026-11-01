const MINUTE = 1000 * 60;

export const RATE_LIMITS = {
  LOGIN_IP: { limit: 50, windowMs: 15 * MINUTE },
  LOGIN_EMAIL: { limit: 10, windowMs: 15 * MINUTE },
  REGISTER_IP: { limit: 10, windowMs: 60 * MINUTE },
  ACCEPT_INVITATION_IP: { limit: 20, windowMs: 15 * MINUTE },
  ACCEPT_INVITATION_ID: { limit: 10, windowMs: 15 * MINUTE },
} as const;

export type RateLimitRule = { limit: number; windowMs: number };

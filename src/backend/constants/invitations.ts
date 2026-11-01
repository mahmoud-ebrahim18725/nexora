export const INVITATION_STATUS = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
} as const;

export type InvitationStatus =
  (typeof INVITATION_STATUS)[keyof typeof INVITATION_STATUS];

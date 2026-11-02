import type { ProjectStatus, Role, TaskPriority, TaskStatus } from "../types";

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "To do",
  in_progress: "In progress",
  completed: "Completed",
};

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  planning: "Planning",
  active: "Active",
  completed: "Completed",
  archived: "Archived",
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export const ROLE_LABELS: Record<Role, string> = {
  owner: "Owner",
  admin: "Admin",
  member: "Member",
};

export function countLabel(count: number, noun: string) {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}

export function initials(name: string) {
  const words = name.trim().split(/\s+/);
  return words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

// Due dates are stored as UTC days, so they are read back in UTC.
export function formatDate(value: string) {
  const date = new Date(value);
  const sameYear = date.getUTCFullYear() === new Date().getUTCFullYear();
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: sameYear ? undefined : "numeric",
    timeZone: "UTC",
  });
}

export function toDateInput(value: string | null) {
  return value ? value.slice(0, 10) : "";
}

export function isOverdue(value: string | null, status: TaskStatus) {
  if (!value || status === "completed") {
    return false;
  }
  return value.slice(0, 10) < new Date().toISOString().slice(0, 10);
}

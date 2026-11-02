import { PRIORITY_LABELS, PROJECT_STATUS_LABELS, ROLE_LABELS } from "../../lib/format";
import type { ProjectStatus, Role, TaskPriority } from "../../types";

type Tone = "neutral" | "blue" | "dark" | "amber" | "orange" | "accent";

const TONES: Record<Tone, string> = {
  neutral: "bg-[#eef0f3] text-[#444c59]",
  blue: "bg-accent-soft text-accent-text",
  dark: "bg-ink text-white",
  amber: "bg-warning-soft text-warning",
  orange: "bg-danger-soft text-danger",
  accent: "bg-accent text-white",
};

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: Tone;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-[13px] font-medium ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}

const PROJECT_TONES: Record<ProjectStatus, Tone> = {
  planning: "neutral",
  active: "blue",
  completed: "dark",
  archived: "amber",
};

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <Badge tone={PROJECT_TONES[status]}>{PROJECT_STATUS_LABELS[status]}</Badge>
  );
}

const PRIORITY_TONES: Record<TaskPriority, Tone> = {
  low: "neutral",
  medium: "amber",
  high: "orange",
};

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return <Badge tone={PRIORITY_TONES[priority]}>{PRIORITY_LABELS[priority]}</Badge>;
}

const ROLE_TONES: Record<Role, Tone> = {
  owner: "accent",
  admin: "blue",
  member: "neutral",
};

export function RoleBadge({ role }: { role: Role }) {
  return <Badge tone={ROLE_TONES[role]}>{ROLE_LABELS[role]}</Badge>;
}

"use client";

import Link from "next/link";
import { useCurrentUser } from "../../context/current-user";
import {
  countLabel,
  PROJECT_STATUS_LABELS,
  TASK_STATUS_LABELS,
} from "../../lib/format";
import { useResource } from "../../lib/use-resource";
import { getDashboard } from "../../services/dashboard-services";
import type { ProjectStatus, TaskStatus } from "../../types";
import { ProjectStatusBadge } from "../ui/badge";
import { buttonClass } from "../ui/button";
import { PageHeader } from "../ui/page-header";
import { EmptyState, ErrorState, LoadingState } from "../ui/states";

const TASK_BAR: { status: TaskStatus; color: string }[] = [
  { status: "todo", color: "bg-line-strong" },
  { status: "in_progress", color: "bg-accent" },
  { status: "completed", color: "bg-ink" },
];

const PROJECT_STATUSES = Object.keys(PROJECT_STATUS_LABELS) as ProjectStatus[];

function Stat({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-xl p-4 md:p-5 ${highlight ? "bg-ink" : "border border-line bg-white"}`}>
      <p className={`text-sm ${highlight ? "text-on-ink" : "text-muted"}`}>{label}</p>
      <p className={`mt-1 font-mono text-3xl leading-tight md:text-4xl ${highlight ? "text-[#ffb08a]" : ""}`}>
        {value}
      </p>
    </div>
  );
}

export function DashboardView() {
  const user = useCurrentUser();
  const { data, error, reload } = useResource(getDashboard);
  const canCreate = user.role !== "member";

  if (error) {
    return <ErrorState message={error.message} onRetry={reload} />;
  }
  if (!data) {
    return <LoadingState />;
  }

  const { projects, tasks } = data;
  const maxProjects = Math.max(1, ...Object.values(projects.byStatus));

  return (
    <>
      <PageHeader eyebrow={user.companyName} title="Dashboard">
        {canCreate && (
          <Link href="/projects?new=1" className={buttonClass()}>
            New project
          </Link>
        )}
      </PageHeader>

      <section aria-label="Totals" className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Projects" value={projects.total} />
        <Stat label="Tasks" value={tasks.total} />
        <Stat label="Completed tasks" value={tasks.byStatus.completed ?? 0} />
        <Stat label="Overdue tasks" value={tasks.overdue} highlight />
      </section>

      <section className="flex flex-col gap-4 rounded-xl border border-line bg-white p-5 md:p-6">
        <h2 className="text-lg font-semibold">Tasks by status</h2>
        {tasks.total === 0 ? (
          <p className="text-muted">No tasks yet.</p>
        ) : (
          <>
            <div className="flex h-4 gap-1" aria-hidden="true">
              {TASK_BAR.map(({ status, color }) => (
                <div
                  key={status}
                  className={`rounded ${color}`}
                  style={{ flexGrow: tasks.byStatus[status] ?? 0, flexBasis: 0 }}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
              {TASK_BAR.map(({ status, color }) => (
                <span key={status} className="flex items-center gap-2">
                  <span className={`size-2.5 rounded-[3px] ${color}`} />
                  {TASK_STATUS_LABELS[status]}
                  <strong className="font-mono font-medium">
                    {tasks.byStatus[status] ?? 0}
                  </strong>
                </span>
              ))}
            </div>
          </>
        )}
      </section>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-4">
        <section className="rounded-xl border border-line bg-white p-5 md:p-6">
          <div className="mb-2 flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold">Recent projects</h2>
            <Link href="/projects" className="flex min-h-11 items-center text-sm font-semibold underline">
              View all
            </Link>
          </div>
          {projects.recent.length === 0 ? (
            <EmptyState title="No projects yet." />
          ) : (
            projects.recent.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="flex min-h-[60px] items-center justify-between gap-4 border-t border-line"
              >
                <span className="min-w-0">
                  <span className="block truncate font-semibold">{project.name}</span>
                  <span className="block text-[13px] text-muted">
                    {project.projectRole
                      ? `You are a ${project.projectRole}`
                      : countLabel(project.tasksCount ?? 0, "task")}
                  </span>
                </span>
                <ProjectStatusBadge status={project.status} />
              </Link>
            ))
          )}
        </section>

        <section className="rounded-xl border border-line bg-white p-5 md:p-6">
          <h2 className="mb-4 text-lg font-semibold">Projects by status</h2>
          <div className="flex flex-col gap-3.5">
            {PROJECT_STATUSES.map((status) => {
              const count = projects.byStatus[status] ?? 0;
              return (
                <div key={status} className="grid grid-cols-[96px_minmax(0,1fr)_28px] items-center gap-3 text-sm">
                  <span>{PROJECT_STATUS_LABELS[status]}</span>
                  <span className="flex h-2 rounded bg-[#eef0f3]">
                    <span
                      className="rounded bg-ink"
                      style={{ width: `${(count / maxProjects) * 100}%` }}
                    />
                  </span>
                  <span className="text-right font-mono">{count}</span>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}

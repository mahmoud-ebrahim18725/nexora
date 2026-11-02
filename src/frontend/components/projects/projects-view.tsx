"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { useCurrentUser } from "../../context/current-user";
import { countLabel, PROJECT_STATUS_LABELS } from "../../lib/format";
import { useResource } from "../../lib/use-resource";
import { listProjects } from "../../services/project-services";
import type { Project, ProjectStatus } from "../../types";
import { ProjectStatusBadge } from "../ui/badge";
import { Button } from "../ui/button";
import { PageHeader } from "../ui/page-header";
import { PaginationControls } from "../ui/pagination-controls";
import { EmptyState, ErrorState, LoadingState } from "../ui/states";
import { ProjectFormModal } from "./project-form-modal";

const STATUSES = Object.keys(PROJECT_STATUS_LABELS) as ProjectStatus[];

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="flex flex-col gap-3 rounded-xl border border-line bg-white p-5 transition-colors hover:border-line-strong"
    >
      <span className="flex items-start justify-between gap-3">
        <span className="min-w-0 text-[17px] leading-snug font-semibold break-words">
          {project.name}
        </span>
        <ProjectStatusBadge status={project.status} />
      </span>
      <span className="line-clamp-2 text-sm text-muted">
        {project.description ?? "No description"}
      </span>
      <span className="mt-auto flex gap-5 border-t border-line pt-3 text-[13px] text-muted">
        <span>{countLabel(project.tasksCount, "task")}</span>
        <span>{countLabel(project.membersCount, "member")}</span>
      </span>
    </Link>
  );
}

export function ProjectsView({ openNew }: { openNew: boolean }) {
  const user = useCurrentUser();
  const canCreate = user.role !== "member";
  const [status, setStatus] = useState<ProjectStatus | undefined>();
  const [page, setPage] = useState(1);
  const [creating, setCreating] = useState(openNew && canCreate);

  const load = useCallback(() => listProjects(page, status), [page, status]);
  const { data, error, loading, reload } = useResource(load);

  function filter(next?: ProjectStatus) {
    setStatus(next);
    setPage(1);
  }

  const filters: { label: string; value?: ProjectStatus }[] = [
    { label: "All" },
    ...STATUSES.map((value) => ({ label: PROJECT_STATUS_LABELS[value], value })),
  ];

  return (
    <>
      <PageHeader
        eyebrow={data ? countLabel(data.pagination.total, "project") : "Your workspace"}
        title="Projects"
      >
        {canCreate && <Button onClick={() => setCreating(true)}>New project</Button>}
      </PageHeader>

      <div role="group" aria-label="Filter by status" className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0">
        {filters.map(({ label, value }) => {
          const active = value === status;
          return (
            <button
              key={label}
              type="button"
              aria-pressed={active}
              onClick={() => filter(value)}
              className={`min-h-11 shrink-0 rounded-lg border px-4 font-medium ${
                active
                  ? "border-ink bg-ink text-white"
                  : "border-line-strong bg-white hover:bg-ground"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {error ? (
        <ErrorState message={error.message} onRetry={reload} />
      ) : !data ? (
        <LoadingState />
      ) : data.projects.length === 0 ? (
        <EmptyState
          title={status ? "No projects with this status yet." : "No projects yet."}
        >
          {canCreate && !status && (
            <Button onClick={() => setCreating(true)}>Create your first project</Button>
          )}
        </EmptyState>
      ) : (
        <div
          aria-busy={loading}
          className={`grid grid-cols-[repeat(auto-fill,minmax(min(300px,100%),1fr))] gap-4 ${loading ? "opacity-60" : ""}`}
        >
          {data.projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {data && <PaginationControls pagination={data.pagination} onChange={setPage} />}

      {creating && (
        <ProjectFormModal
          onClose={() => setCreating(false)}
          onSaved={reload}
        />
      )}
    </>
  );
}

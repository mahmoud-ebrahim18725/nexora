"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDashboard } from "@/frontend/services/dashboard-services";
import type { Dashboard as DashboardData } from "@/frontend/types/dashboard";

function formatLabel(value: string) {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function StatusOverview({
  title,
  total,
  statuses,
}: {
  title: string;
  total: number;
  statuses: Record<string, number>;
}) {
  const entries = Object.entries(statuses);
  const statusTotal = entries.reduce((sum, [, count]) => sum + count, 0);

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          <p className="mt-1 text-sm text-gray-500">Status breakdown</p>
        </div>
        <p className="text-right">
          <span className="block text-2xl font-semibold tabular-nums text-gray-900">
            {total}
          </span>
          <span className="text-xs text-gray-500">Total</span>
        </p>
      </div>
      {entries.length > 0 ? (
        <ul className="space-y-4">
          {entries.map(([status, count]) => {
            const percentage =
              statusTotal > 0 ? (count / statusTotal) * 100 : 0;
            return (
              <li key={status}>
                <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                  <span className="truncate text-gray-600">
                    {formatLabel(status)}
                  </span>
                  <span className="shrink-0 font-medium tabular-nums text-gray-900">
                    {count}
                  </span>
                </div>
                <div
                  aria-hidden="true"
                  className="h-1.5 overflow-hidden rounded-full bg-gray-100"
                >
                  <div
                    className="h-full rounded-full bg-indigo-600"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="rounded-md bg-gray-50 px-3 py-4 text-sm text-gray-500">
          No status data available.
        </p>
      )}
    </section>
  );
}

function OverviewCard({
  label,
  value,
  detail,
  isEmphasized = false,
}: {
  label: string;
  value: number;
  detail: string;
  isEmphasized?: boolean;
}) {
  return (
    <article className="rounded-lg border border-gray-200 bg-white p-5 sm:p-6">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p
        className={`mt-3 text-3xl font-semibold tabular-nums ${isEmphasized ? "text-indigo-700" : "text-gray-900"}`}
      >
        {value}
      </p>
      <p className="mt-1 text-xs text-gray-500">{detail}</p>
    </article>
  );
}

export default function Dashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isCurrent = true;

    getDashboard()
      .then((data) => {
        if (isCurrent) {
          setDashboard(data);
          setError(false);
        }
      })
      .catch(() => {
        if (isCurrent) setError(true);
      });

    return () => {
      isCurrent = false;
    };
  }, [retryCount]);

  if (error) {
    return (
      <div
        className="rounded-lg border border-red-200 bg-red-50 px-5 py-4"
        role="alert"
      >
        <p className="text-sm font-medium text-red-800">
          We couldn&apos;t load your dashboard.
        </p>
        <button
          type="button"
          onClick={() => {
            setDashboard(null);
            setError(false);
            setRetryCount((count) => count + 1);
          }}
          className="mt-2 rounded text-sm font-medium text-red-800 underline decoration-red-300 underline-offset-2 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div
        className="space-y-6"
        aria-label="Loading dashboard"
        aria-busy="true"
      >
        <div className="space-y-2">
          <div className="h-7 w-48 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-72 max-w-full animate-pulse rounded bg-gray-200" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-lg bg-white ring-1 ring-gray-200"
            />
          ))}
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="h-64 animate-pulse rounded-lg bg-white ring-1 ring-gray-200"
            />
          ))}
        </div>
        <span className="sr-only">Loading dashboard data</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section aria-labelledby="dashboard-welcome">
        <h2
          id="dashboard-welcome"
          className="text-2xl font-semibold tracking-tight text-gray-900"
        >
          Welcome back
        </h2>
        <p className="mt-1.5 text-sm text-gray-500">
          Here&apos;s what&apos;s happening across your workspace.
        </p>
      </section>

      <section aria-label="Workspace overview">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <OverviewCard
            label="Total Projects"
            value={dashboard.projects.total}
            detail="Across your workspace"
          />
          <OverviewCard
            label="Total Tasks"
            value={dashboard.tasks.total}
            detail="Across all projects"
          />
          <OverviewCard
            label="Overdue Tasks"
            value={dashboard.tasks.overdue}
            detail="Tasks past their due date"
            isEmphasized={dashboard.tasks.overdue > 0}
          />
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <StatusOverview
          title="Projects Overview"
          total={dashboard.projects.total}
          statuses={dashboard.projects.byStatus}
        />
        <StatusOverview
          title="Tasks Overview"
          total={dashboard.tasks.total}
          statuses={dashboard.tasks.byStatus}
        />
      </div>

      <section
        className="rounded-lg border border-gray-200 bg-white"
        aria-labelledby="recent-projects-title"
      >
        <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-5 py-4 sm:px-6">
          <div>
            <h2
              id="recent-projects-title"
              className="text-base font-semibold text-gray-900"
            >
              Recent Projects
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Your latest workspace projects
            </p>
          </div>
          <Link
            href="/projects"
            className="shrink-0 rounded-md px-2 py-1 text-sm font-medium text-indigo-600 transition hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            View all
          </Link>
        </div>
        {dashboard.projects.recent.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {dashboard.projects.recent.map((project) => (
              <li key={project.id}>
                <Link
                  href={`/projects/${project.id}`}
                  className="flex flex-col gap-3 px-5 py-4 transition hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                >
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-medium text-gray-900">
                      {project.name}
                    </h3>

                    <span className="mt-1.5 inline-flex rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
                      {formatLabel(project.status)}
                    </span>
                  </div>

                  <p className="shrink-0 text-sm text-gray-500">
                    {"projectRole" in project
                      ? formatLabel(project.projectRole)
                      : `${project.tasksCount} ${
                          project.tasksCount === 1 ? "task" : "tasks"
                        }`}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-5 py-6 text-sm text-gray-500 sm:px-6">
            No recent projects to show.
          </p>
        )}
      </section>
    </div>
  );
}

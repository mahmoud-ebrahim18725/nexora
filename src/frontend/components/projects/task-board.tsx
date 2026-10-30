"use client";

import { useState } from "react";
import Avatar from "@/frontend/components/ui/avatar";
import Badge from "@/frontend/components/ui/badge";
import Button from "@/frontend/components/ui/button";
import { formatDate, isOverdue } from "@/frontend/lib/format";
import type { ProjectMember } from "@/frontend/types/project";
import type { Task, TaskStatus } from "@/frontend/types/task";

const columns: { status: TaskStatus; label: string; accent: string }[] = [
  { status: "todo", label: "To do", accent: "bg-gray-400" },
  { status: "in_progress", label: "In progress", accent: "bg-sky-500" },
  { status: "completed", label: "Completed", accent: "bg-emerald-500" },
];

function TaskCard({
  task,
  assignee,
  onOpen,
}: {
  task: Task;
  assignee?: ProjectMember;
  onOpen: () => void;
}) {
  const overdue = isOverdue(task.dueDate, task.status);
  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full rounded-lg border border-gray-200 bg-white p-3.5 text-left shadow-sm shadow-gray-900/[0.02] transition hover:border-gray-300 hover:shadow-md hover:shadow-gray-900/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      <div className="flex items-start justify-between gap-2">
        <h4
          className={`text-sm font-medium leading-5 ${task.status === "completed" ? "text-gray-500 line-through decoration-gray-300" : "text-gray-900"}`}
        >
          {task.title}
        </h4>
        <Badge value={task.priority} />
      </div>
      {task.description && (
        <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-gray-500">
          {task.description}
        </p>
      )}
      <div className="mt-3 flex items-center justify-between gap-2">
        {task.dueDate ? (
          <span
            className={`inline-flex items-center gap-1 text-xs ${overdue ? "font-medium text-red-600" : "text-gray-500"}`}
          >
            <svg
              aria-hidden="true"
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <rect x="4" y="5" width="16" height="15" rx="2" />
              <path strokeLinecap="round" d="M8 3v4M16 3v4M4 10h16" />
            </svg>
            {overdue && "Overdue · "}
            {formatDate(task.dueDate)}
          </span>
        ) : (
          <span className="text-xs text-gray-400">No due date</span>
        )}
        {assignee ? (
          <Avatar name={assignee.name} id={assignee.id} size="sm" />
        ) : (
          <span
            title="Unassigned"
            className="h-6 w-6 rounded-full border border-dashed border-gray-300"
          />
        )}
      </div>
    </button>
  );
}

export default function TaskBoard({
  tasks,
  members,
  currentUserId,
  canCreate,
  onCreate,
  onOpenTask,
}: {
  tasks: Task[];
  members: ProjectMember[];
  currentUserId: number;
  canCreate: boolean;
  onCreate: () => void;
  onOpenTask: (task: Task) => void;
}) {
  const [onlyMine, setOnlyMine] = useState(false);
  const membersById = new Map(members.map((member) => [member.id, member]));
  const visibleTasks = onlyMine
    ? tasks.filter((task) => task.assignedTo === currentUserId)
    : tasks;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={onlyMine}
            onChange={(event) => setOnlyMine(event.target.checked)}
            className="h-4 w-4 rounded border-gray-300 accent-indigo-600"
          />
          Only my tasks
        </label>
        {canCreate && (
          <Button size="sm" onClick={onCreate}>
            <svg
              aria-hidden="true"
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <path strokeLinecap="round" d="M12 5v14M5 12h14" />
            </svg>
            Add task
          </Button>
        )}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {columns.map((column) => {
          const columnTasks = visibleTasks.filter(
            (task) => task.status === column.status,
          );
          return (
            <section
              key={column.status}
              aria-label={column.label}
              className="flex flex-col rounded-xl bg-gray-100/70 p-3 ring-1 ring-gray-200/70"
            >
              <header className="mb-3 flex items-center gap-2 px-1">
                <span
                  aria-hidden="true"
                  className={`h-2 w-2 rounded-full ${column.accent}`}
                />
                <h3 className="text-sm font-semibold text-gray-700">
                  {column.label}
                </h3>
                <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-xs font-medium tabular-nums text-gray-500 ring-1 ring-gray-200">
                  {columnTasks.length}
                </span>
              </header>
              {columnTasks.length > 0 ? (
                <ul className="space-y-2.5">
                  {columnTasks.map((task) => (
                    <li key={task.id}>
                      <TaskCard
                        task={task}
                        assignee={
                          task.assignedTo
                            ? membersById.get(task.assignedTo)
                            : undefined
                        }
                        onOpen={() => onOpenTask(task)}
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="rounded-lg border border-dashed border-gray-300 px-3 py-6 text-center text-xs text-gray-400">
                  No tasks
                </p>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

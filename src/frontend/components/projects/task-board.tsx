"use client";

import { useState } from "react";
import { formatDate, isOverdue, TASK_STATUS_LABELS } from "../../lib/format";
import type { ProjectMember, Task, TaskStatus } from "../../types";
import { Avatar } from "../ui/avatar";
import { PriorityBadge } from "../ui/badge";

const COLUMNS = Object.keys(TASK_STATUS_LABELS) as TaskStatus[];

function TaskCard({
  task,
  assignee,
  selected,
  onOpen,
}: {
  task: Task;
  assignee?: ProjectMember;
  selected: boolean;
  onOpen: () => void;
}) {
  const overdue = isOverdue(task.dueDate, task.status);
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-pressed={selected}
      className={`flex w-full flex-col gap-3 rounded-[10px] border-2 bg-white p-3.5 text-left transition-colors ${
        selected ? "border-ink" : "border-transparent hover:border-line-strong"
      }`}
    >
      <span className="leading-snug font-semibold break-words">{task.title}</span>
      <span className="flex min-h-7 flex-wrap items-center gap-2">
        <PriorityBadge priority={task.priority} />
        {task.dueDate && (
          <span className={`font-mono text-xs ${overdue ? "text-danger" : "text-muted"}`}>
            {overdue && "Overdue · "}
            {formatDate(task.dueDate)}
          </span>
        )}
        <span className="ml-auto">
          {assignee ? (
            <Avatar name={assignee.name} size="sm" />
          ) : (
            <span
              className="flex size-7 items-center justify-center rounded-full border border-dashed border-line-strong text-xs text-muted"
              title="Unassigned"
            >
              –
            </span>
          )}
        </span>
      </span>
    </button>
  );
}

export function TaskBoard({
  tasks,
  members,
  currentUserId,
  openTaskId,
  onOpen,
}: {
  tasks: Task[];
  members: ProjectMember[];
  currentUserId: number;
  openTaskId: number | null;
  onOpen: (id: number) => void;
}) {
  const [activeStatus, setActiveStatus] = useState<TaskStatus>(
    () => COLUMNS.find((status) => tasks.some((task) => task.status === status)) ?? "todo",
  );
  const [onlyMine, setOnlyMine] = useState(false);
  const visible = onlyMine
    ? tasks.filter((task) => task.assignedTo === currentUserId)
    : tasks;
  const columns = COLUMNS.map((status) => ({
    status,
    tasks: visible.filter((task) => task.status === status),
  }));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <button
          type="button"
          aria-pressed={onlyMine}
          onClick={() => setOnlyMine((value) => !value)}
          className={`min-h-11 rounded-lg border px-4 text-sm font-medium ${
            onlyMine
              ? "border-ink bg-ink text-white"
              : "border-line-strong bg-white hover:bg-ground"
          }`}
        >
          My tasks
        </button>
      </div>

      <div role="group" aria-label="Task status" className="grid grid-cols-3 gap-1 rounded-[10px] bg-column p-1 md:hidden">
        {columns.map(({ status, tasks: list }) => (
          <button
            key={status}
            type="button"
            aria-pressed={status === activeStatus}
            onClick={() => setActiveStatus(status)}
            className={`flex min-h-11 items-center justify-center gap-1.5 rounded-[7px] px-1 text-[13px] font-semibold ${
              status === activeStatus ? "bg-white" : "text-muted"
            }`}
          >
            {TASK_STATUS_LABELS[status]}
            <span className="font-mono font-normal">{list.length}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:min-h-[420px] md:grid-cols-3">
        {columns.map(({ status, tasks: list }) => (
          <section
            key={status}
            aria-label={TASK_STATUS_LABELS[status]}
            className={`flex-col gap-2.5 rounded-xl bg-column p-3 md:flex ${
              status === activeStatus ? "flex" : "hidden"
            }`}
          >
            <h2 className="items-center justify-between px-1.5 py-1 text-sm font-semibold max-md:hidden md:flex">
              {TASK_STATUS_LABELS[status]}
              <span className="font-mono font-normal text-muted">{list.length}</span>
            </h2>
            {list.length === 0 && (
              <p className="px-1.5 py-6 text-center text-sm text-muted">No tasks here</p>
            )}
            {list.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                assignee={members.find((member) => member.id === task.assignedTo)}
                selected={task.id === openTaskId}
                onOpen={() => onOpen(task.id)}
              />
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}

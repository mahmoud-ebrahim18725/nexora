"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useCurrentUser } from "../../context/current-user";
import { useResource } from "../../lib/use-resource";
import { useSubmit } from "../../lib/use-submit";
import {
  addProjectMember,
  changeProjectMemberRole,
  removeProjectMember,
} from "../../services/project-services";
import { listAllTeam } from "../../services/team-services";
import type { ProjectMember, ProjectRole } from "../../types";
import { Avatar } from "../ui/avatar";
import { Button } from "../ui/button";
import { ConfirmDialog } from "../ui/confirm-dialog";
import { FormError, SelectField } from "../ui/field";
import { Modal } from "../ui/modal";

function AddMemberSection({
  projectId,
  members,
  isOwner,
  onAdded,
  onCancel,
}: {
  projectId: number;
  members: ProjectMember[];
  isOwner: boolean;
  onAdded: () => void;
  onCancel: () => void;
}) {
  const user = useCurrentUser();
  const { pending, error, run } = useSubmit();
  const team = useResource(listAllTeam);
  const candidates = (team.data ?? []).filter(
    (person) => !members.some((member) => member.id === person.id),
  );

  async function add(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const done = await run(() =>
      addProjectMember(projectId, {
        userId: Number(form.get("userId")),
        role: (form.get("role") as ProjectRole | null) ?? "member",
      }),
    );
    if (done) {
      onAdded();
    }
  }

  if (team.error) {
    return (
      <p className="rounded-lg bg-ground p-4 text-sm text-muted">
        Ask an owner or admin to add new members to this project.
      </p>
    );
  }
  if (team.loading && !team.data) {
    return <p className="text-sm text-muted">Loading your team…</p>;
  }
  if (candidates.length === 0) {
    return (
      <div className="flex flex-col gap-3 rounded-lg bg-ground p-4 text-sm text-muted">
        <p>Everyone in your team is already in this project.</p>
        {user.role !== "member" && (
          <Link href="/team" className="font-semibold text-accent underline">
            Invite someone new from Team
          </Link>
        )}
      </div>
    );
  }
  return (
    <form onSubmit={add} className="flex flex-col gap-3 rounded-lg bg-ground p-4">
      <FormError message={error?.message} />
      <SelectField label="Team member" name="userId" data-autofocus required>
        {candidates.map((person) => (
          <option key={person.id} value={person.id}>
            {person.name}
          </option>
        ))}
      </SelectField>
      {isOwner && (
        <SelectField label="Project role" name="role" defaultValue="member">
          <option value="member">Member</option>
          <option value="manager">Manager</option>
        </SelectField>
      )}
      <span className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={pending}>
          Add to project
        </Button>
      </span>
    </form>
  );
}

export function ProjectMembersModal({
  projectId,
  members,
  canManage,
  startAdding,
  onChanged,
  onClose,
}: {
  projectId: number;
  members: ProjectMember[];
  canManage: boolean;
  startAdding: boolean;
  onChanged: () => void;
  onClose: () => void;
}) {
  const user = useCurrentUser();
  const isOwner = user.role === "owner";
  const { pending, error, run } = useSubmit();
  const [adding, setAdding] = useState(startAdding && canManage);
  const [removing, setRemoving] = useState<ProjectMember | null>(null);

  async function changeRole(userId: number, role: ProjectRole) {
    if (await run(() => changeProjectMemberRole(projectId, { userId, role }))) {
      onChanged();
    }
  }

  return (
    <Modal title="Project members" onClose={onClose}>
      <FormError message={error?.message} />

      {adding ? (
        <AddMemberSection
          projectId={projectId}
          members={members}
          isOwner={isOwner}
          onAdded={() => {
            setAdding(false);
            onChanged();
          }}
          onCancel={() => setAdding(false)}
        />
      ) : (
        canManage && (
          <Button variant="secondary" onClick={() => setAdding(true)}>
            Add member
          </Button>
        )
      )}

      <ul className="flex flex-col">
        {members.map((member) => (
          <li
            key={member.id}
            className="flex flex-wrap items-center gap-3 border-b border-line py-2.5 last:border-b-0"
          >
            <Avatar name={member.name} />
            <span className="min-w-0 flex-1 max-md:basis-[calc(100%-3rem)]">
              <span className="block truncate font-semibold">{member.name}</span>
              <span className="block truncate text-[13px] text-muted">{member.email}</span>
            </span>
            {isOwner ? (
              <select
                aria-label={`Role for ${member.name}`}
                value={member.projectRole}
                disabled={pending}
                onChange={(event) =>
                  changeRole(member.id, event.target.value as ProjectRole)
                }
                className="min-h-11 rounded-lg border border-line-strong bg-white px-2 text-base max-md:ml-12 md:text-sm"
              >
                <option value="manager">Manager</option>
                <option value="member">Member</option>
              </select>
            ) : (
              <span className="text-sm capitalize text-muted max-md:ml-12">{member.projectRole}</span>
            )}
            {canManage && (isOwner || member.projectRole === "member") && (
              <Button
                variant="ghost"
                className="text-danger"
                aria-label={`Remove ${member.name}`}
                onClick={() => setRemoving(member)}
              >
                Remove
              </Button>
            )}
          </li>
        ))}
      </ul>

      {removing && (
        <ConfirmDialog
          title="Remove member"
          message={`Remove ${removing.name} from this project? Their tasks will become unassigned.`}
          confirmLabel="Remove"
          onConfirm={async () => {
            await removeProjectMember(projectId, removing.id);
            onChanged();
          }}
          onClose={() => setRemoving(null)}
        />
      )}
    </Modal>
  );
}

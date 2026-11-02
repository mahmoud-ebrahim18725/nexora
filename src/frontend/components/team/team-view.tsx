"use client";

import { useCallback, useState } from "react";
import { useCurrentUser } from "../../context/current-user";
import { countLabel } from "../../lib/format";
import { useResource } from "../../lib/use-resource";
import { useSubmit } from "../../lib/use-submit";
import {
  changeTeamRole,
  listTeam,
  removeTeamMember,
} from "../../services/team-services";
import type { TeamMember } from "../../types";
import { Avatar } from "../ui/avatar";
import { RoleBadge } from "../ui/badge";
import { Button } from "../ui/button";
import { ConfirmDialog } from "../ui/confirm-dialog";
import { FormError } from "../ui/field";
import { PageHeader } from "../ui/page-header";
import { PaginationControls } from "../ui/pagination-controls";
import { ErrorState, LoadingState } from "../ui/states";
import { InvitePanel } from "./invite-panel";

export function TeamView() {
  const user = useCurrentUser();
  const [page, setPage] = useState(1);
  const [inviting, setInviting] = useState(false);
  const [removing, setRemoving] = useState<TeamMember | null>(null);
  const { pending, error: roleError, run } = useSubmit();

  const load = useCallback(() => listTeam(page), [page]);
  const { data, error, reload } = useResource(load);

  function canRemove(member: TeamMember) {
    if (member.role === "owner" || member.id === user.id) {
      return false;
    }
    return user.role === "owner" || member.role === "member";
  }

  async function changeRole(member: TeamMember, role: "admin" | "member") {
    if (await run(() => changeTeamRole(member.id, role))) {
      reload();
    }
  }

  function roleControl(member: TeamMember) {
    if (user.role !== "owner" || member.role === "owner") {
      return <RoleBadge role={member.role} />;
    }
    return (
      <select
        aria-label={`Role for ${member.name}`}
        value={member.role}
        disabled={pending}
        onChange={(event) =>
          changeRole(member, event.target.value as "admin" | "member")
        }
        className="min-h-11 rounded-lg border border-line-strong bg-white px-2 text-base md:text-sm"
      >
        <option value="admin">Admin</option>
        <option value="member">Member</option>
      </select>
    );
  }

  function removeButton(member: TeamMember) {
    if (!canRemove(member)) {
      return null;
    }
    return (
      <Button
        variant="ghost"
        className="text-danger"
        aria-label={`Remove ${member.name}`}
        onClick={() => setRemoving(member)}
      >
        Remove
      </Button>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow={data ? countLabel(data.pagination.total, "member") : user.companyName}
        title="Team"
      >
        <Button onClick={() => setInviting(true)}>Invite member</Button>
      </PageHeader>

      {inviting && <InvitePanel onClose={() => setInviting(false)} />}
      <FormError message={roleError?.message} />

      {error ? (
        <ErrorState message={error.message} onRetry={reload} />
      ) : !data ? (
        <LoadingState />
      ) : (
        <>
          <ul aria-label="Members" className="flex flex-col gap-3 md:hidden">
            {data.members.map((member) => (
              <li key={member.id} className="flex flex-col gap-3 rounded-xl border border-line bg-white p-4">
                <span className="flex items-center gap-3">
                  <Avatar name={member.name} />
                  <span className="min-w-0">
                    <span className="block truncate font-semibold">{member.name}</span>
                    <span className="block truncate text-sm text-muted">{member.email}</span>
                  </span>
                </span>
                <span className="flex items-center justify-between gap-3">
                  {roleControl(member)}
                  {removeButton(member)}
                </span>
              </li>
            ))}
          </ul>

          <section aria-label="Members" className="overflow-x-auto rounded-xl border border-line bg-white max-md:hidden">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="text-[13px] text-muted">
                  <th scope="col" className="px-5 py-3.5 font-medium">Name</th>
                  <th scope="col" className="px-5 py-3.5 font-medium">Email</th>
                  <th scope="col" className="px-5 py-3.5 font-medium">Role</th>
                  <th scope="col" className="px-5 py-3.5">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.members.map((member) => (
                  <tr key={member.id} className="border-t border-line">
                    <td className="px-5 py-3">
                      <span className="flex items-center gap-3 font-semibold">
                        <Avatar name={member.name} />
                        {member.name}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-muted">{member.email}</td>
                    <td className="px-5 py-3">{roleControl(member)}</td>
                    <td className="px-5 py-3 text-right">{removeButton(member)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}

      {data && <PaginationControls pagination={data.pagination} onChange={setPage} />}

      {removing && (
        <ConfirmDialog
          title="Remove member"
          message={`Remove ${removing.name} from ${user.companyName}? This deletes their account.`}
          confirmLabel="Remove"
          onConfirm={async () => {
            await removeTeamMember(removing.id);
            reload();
          }}
          onClose={() => setRemoving(null)}
        />
      )}
    </>
  );
}

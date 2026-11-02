"use client";

import { useState, type FormEvent } from "react";
import { useCurrentUser } from "../../context/current-user";
import { useSubmit } from "../../lib/use-submit";
import { createInvitation } from "../../services/team-services";
import { Button } from "../ui/button";
import { FormError, SelectField, TextField } from "../ui/field";

export function InvitePanel({ onClose }: { onClose: () => void }) {
  const user = useCurrentUser();
  const { pending, error, run } = useSubmit();
  const [link, setLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await run(async () => {
      const { invitation } = await createInvitation({
        email: String(form.get("email")),
        role: form.get("role") as "admin" | "member",
      });
      const params = new URLSearchParams({
        id: String(invitation.id),
        token: invitation.token,
      });
      setLink(`${window.location.origin}/invite?${params}`);
    });
  }

  async function copy() {
    if (link) {
      await navigator.clipboard.writeText(link);
      setCopied(true);
    }
  }

  if (link) {
    return (
      <section aria-label="Invite link" className="flex flex-col gap-3 rounded-xl bg-ink p-5 text-white md:p-6">
        <h2 className="text-lg font-semibold">Invite link created</h2>
        <p className="text-sm text-[#c5cad4]">
          Copy this link and send it to the new member. It works once and expires in 7 days.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <code className="min-w-0 flex-[1_1_280px] rounded-lg bg-ink-line p-3 font-mono text-[13px] break-all">
            {link}
          </code>
          <Button onClick={copy}>{copied ? "Copied" : "Copy link"}</Button>
          <Button variant="ghost" className="hover:bg-ink-soft" onClick={onClose}>
            Done
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Invite member" className="flex flex-col gap-4 rounded-xl border border-line bg-white p-5 md:p-6">
      <h2 className="text-lg font-semibold">Invite a new member</h2>
      <FormError message={error?.message} />
      <form onSubmit={submit} className="flex flex-wrap items-end gap-3">
        <div className="min-w-0 flex-[1_1_260px]">
          <TextField
            label="Email"
            name="email"
            type="email"
            placeholder="name@company.com"
            required
          />
        </div>
        <div className="flex-[1_1_160px] md:flex-[0_1_180px]">
          <SelectField label="Role" name="role" defaultValue="member">
            <option value="member">Member</option>
            {user.role === "owner" && <option value="admin">Admin</option>}
          </SelectField>
        </div>
        <Button type="submit" variant="dark" loading={pending}>
          Create invite link
        </Button>
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
      </form>
    </section>
  );
}

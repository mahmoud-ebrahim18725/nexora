"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useSubmit } from "../../lib/use-submit";
import { acceptInvitation } from "../../services/auth-services";
import { Button } from "../ui/button";
import { FormError, TextField } from "../ui/field";
import { PasswordField } from "../ui/password-field";

export function AcceptInviteForm({ id, token }: { id: string; token: string }) {
  const router = useRouter();
  const { pending, error, run } = useSubmit();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const done = await run(() =>
      acceptInvitation({
        id,
        token,
        name: String(form.get("name")),
        password: String(form.get("password")),
      }),
    );
    if (done) {
      router.replace("/dashboard");
      router.refresh();
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <FormError message={error?.message} />
      <TextField label="Your name" name="name" autoComplete="name" maxLength={100} required />
      <PasswordField
        label="Password"
        name="password"
        autoComplete="new-password"
        minLength={8}
        maxLength={128}
        required
      />
      <Button type="submit" loading={pending}>
        Join workspace
      </Button>
    </form>
  );
}

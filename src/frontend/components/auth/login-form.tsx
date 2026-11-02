"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useSubmit } from "../../lib/use-submit";
import { login } from "../../services/auth-services";
import { Button } from "../ui/button";
import { FormError, TextField } from "../ui/field";
import { PasswordField } from "../ui/password-field";

export function LoginForm() {
  const router = useRouter();
  const { pending, error, run } = useSubmit();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const done = await run(() =>
      login({
        email: String(form.get("email")),
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
      <TextField label="Email" name="email" type="email" autoComplete="email" required />
      <PasswordField
        label="Password"
        name="password"
        autoComplete="current-password"
        minLength={8}
        required
      />
      <Button type="submit" loading={pending}>
        Sign in
      </Button>
    </form>
  );
}

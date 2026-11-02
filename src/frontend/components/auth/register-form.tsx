"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useSubmit } from "../../lib/use-submit";
import { register } from "../../services/auth-services";
import { Button } from "../ui/button";
import { FormError, TextField } from "../ui/field";
import { PasswordField } from "../ui/password-field";

export function RegisterForm() {
  const router = useRouter();
  const { pending, error, run } = useSubmit();
  const details = error?.details;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const done = await run(() =>
      register({
        companyName: String(form.get("companyName")),
        name: String(form.get("name")),
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
      {!details && <FormError message={error?.message} />}
      <TextField
        label="Company name"
        name="companyName"
        autoComplete="organization"
        maxLength={100}
        error={details?.companyName}
        required
      />
      <TextField
        label="Your name"
        name="name"
        autoComplete="name"
        maxLength={100}
        error={details?.name}
        required
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        error={details?.email}
        required
      />
      <PasswordField
        label="Password"
        name="password"
        autoComplete="new-password"
        minLength={8}
        maxLength={128}
        error={details?.password}
        required
      />
      <Button type="submit" loading={pending}>
        Create workspace
      </Button>
    </form>
  );
}

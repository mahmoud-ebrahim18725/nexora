import Link from "next/link";
import { AcceptInviteForm } from "@/frontend/components/auth/accept-invite-form";

export default async function InvitePage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; token?: string }>;
}) {
  const { id, token } = await searchParams;
  if (!id || !token) {
    return (
      <>
        <h1 className="text-3xl font-bold tracking-tight">Invalid invite link</h1>
        <p className="text-muted">
          Ask your admin for a new link, or{" "}
          <Link href="/login" className="font-semibold underline">
            sign in
          </Link>
          .
        </p>
      </>
    );
  }
  return (
    <>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Join your team</h1>
        <p className="mt-1 text-muted">Add your name and choose a password.</p>
      </div>
      <AcceptInviteForm id={id} token={token} />
    </>
  );
}

import AuthLayout from "@/frontend/components/auth/auth-layout";
import AcceptInviteForm from "@/frontend/components/auth/accept-invite-form";

export default async function Invite({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; token?: string }>;
}) {
  const { id, token } = await searchParams;
  const invitationId = Number(id);
  return (
    <AuthLayout
      headline={
        <>
          Your team is
          <br />
          already here.
        </>
      }
      tagline="Accept your invitation to see the projects and tasks your teammates are working on."
    >
      <AcceptInviteForm
        id={
          Number.isInteger(invitationId) && invitationId > 0
            ? invitationId
            : null
        }
        token={typeof token === "string" && token.length > 0 ? token : null}
      />
    </AuthLayout>
  );
}

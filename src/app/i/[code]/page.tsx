import SiteContent from "@/components/SiteContent";
import { getGuestByToken } from "@/lib/guests";

// Personal invite link. Resolves the short code to a guest and renders the
// site with the RSVP form greeting them by name.
export default async function InvitePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const guest = await getGuestByToken(code);
  return (
    <SiteContent guestName={guest?.name} guestCode={guest?.token} />
  );
}

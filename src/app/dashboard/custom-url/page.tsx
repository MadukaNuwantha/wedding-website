import { listGuests } from "@/lib/guests";
import GuestManager from "../guest-manager";

export default async function CustomUrlPage() {
  const guests = await listGuests();

  return (
    <div>
      <header className="mb-8 border-b border-line pb-6">
        <p className="eyebrow">Personal Invites</p>
        <h1 className="mt-1 font-serif text-3xl font-light text-navy">
          Custom URL
        </h1>
        <p className="mt-2 font-sans text-sm text-ink/60">
          Add guests and share each one their personal invite link. Opening it
          greets the guest by name in the RSVP form.
        </p>
      </header>

      <GuestManager guests={guests} />
    </div>
  );
}

import { listGuests } from "@/lib/guests";
import { getTemplates, getCardConfigs } from "@/lib/settings";
import InvitationStudio from "./invitation-studio";

export default async function InvitationsPage() {
  const [guests, templates, cardConfigs] = await Promise.all([
    listGuests(),
    getTemplates(),
    getCardConfigs(),
  ]);

  return (
    <div>
      <header className="mb-8 border-b border-line pb-6">
        <p className="eyebrow">Personalised Cards</p>
        <h1 className="mt-1 font-serif text-3xl font-light text-navy">
          Invitation Create
        </h1>
        <p className="mt-2 font-sans text-sm text-ink/60">
          Each guest&apos;s name is placed on the card&apos;s dotted line.
          Fine-tune the placement once (saved in this browser), then download
          the wedding &amp; reception cards per guest.
        </p>
      </header>

      <InvitationStudio
        guests={guests}
        templates={templates}
        cardConfigs={cardConfigs}
      />
    </div>
  );
}

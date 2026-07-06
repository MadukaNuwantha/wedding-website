export default function InvitationsPage() {
  return (
    <div>
      <header className="mb-8 border-b border-line pb-6">
        <p className="eyebrow">Personalised Cards</p>
        <h1 className="mt-1 font-serif text-3xl font-light text-navy">
          Invitation Create
        </h1>
        <p className="mt-2 font-sans text-sm text-ink/60">
          Generate each guest&apos;s wedding &amp; reception invitation cards
          with their name, ready to download and send.
        </p>
      </header>

      <div className="card rounded-2xl p-10 text-center sm:p-14">
        <span className="inline-block rounded-full bg-tint px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-silver-deep">
          Coming soon
        </span>
        <h2 className="mt-5 font-serif text-2xl font-light text-navy">
          Personalised invitation cards
        </h2>
        <p className="mx-auto mt-3 max-w-md font-sans text-sm text-ink/55">
          This will take the two base card images and render each guest&apos;s
          name onto them, with a download for every guest.
        </p>
      </div>
    </div>
  );
}

import { listRsvps, rsvpStats, rsvpTracking } from "@/lib/rsvps";
import RsvpTracker from "./rsvp-tracker";

function formatDate(ms: number): string {
  return new Date(ms).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function RsvpsPage() {
  const [rsvps, stats, tracking] = await Promise.all([
    listRsvps(),
    rsvpStats(),
    rsvpTracking(),
  ]);

  const summary = [
    { label: "Responses", value: stats.total },
    { label: "Attending", value: stats.attending },
    { label: "Declined", value: stats.declined },
    { label: "Guests coming", value: stats.headcount },
  ];

  return (
    <div>
      <header className="mb-8 border-b border-line pb-6">
        <p className="eyebrow">Responses</p>
        <h1 className="mt-1 font-serif text-3xl font-light text-navy">
          RSVP List
        </h1>
        <p className="mt-2 font-sans text-sm text-ink/60">
          Everyone who has responded to the invitation.
        </p>
      </header>

      {/* Summary */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {summary.map((s) => (
          <div key={s.label} className="card rounded-2xl p-4 text-center">
            <p className="font-serif text-3xl font-light text-navy">
              {s.value}
            </p>
            <p className="mt-1 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-silver-deep">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* RSVP follow-up: who you've sent the link to, and who has replied */}
      <section className="mb-10">
        <h2 className="mb-1 font-serif text-xl font-light text-navy">
          RSVP follow-up
        </h2>
        <p className="mb-4 font-sans text-sm text-ink/55">
          Track responses from the guests you sent the RSVP link to.
        </p>
        {tracking.length === 0 ? (
          <p className="card rounded-2xl p-6 text-center font-sans text-sm text-ink/50">
            No RSVP links marked as sent yet. Send RSVP links from{" "}
            <span className="font-semibold text-navy">Invitation Create</span>{" "}
            (or tick “Sent”) and they&apos;ll appear here.
          </p>
        ) : (
          <RsvpTracker items={tracking} />
        )}
      </section>

      {/* All responses (with details) */}
      <h2 className="mb-4 font-serif text-xl font-light text-navy">
        All responses
      </h2>
      {rsvps.length === 0 ? (
        <div className="card rounded-2xl p-10 text-center sm:p-14">
          <h3 className="font-serif text-2xl font-light text-navy">
            No RSVPs yet
          </h3>
          <p className="mx-auto mt-3 max-w-md font-sans text-sm text-ink/55">
            Responses submitted through the invitation form will appear here.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {rsvps.map((r) => (
            <li key={r.id} className="card rounded-2xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-serif text-lg text-navy">
                    {r.name ?? (
                      <span className="text-ink/40">No invite link</span>
                    )}
                  </p>
                  <p className="mt-0.5 font-sans text-xs text-ink/45">
                    {formatDate(r.createdAt)}
                    {r.attending === "yes" && r.party > 0
                      ? ` · ${r.party} ${r.party === 1 ? "guest" : "guests"}`
                      : ""}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 font-sans text-xs font-semibold uppercase tracking-[0.12em] ${
                    r.attending === "yes"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {r.attending === "yes" ? "Attending" : "Declined"}
                </span>
              </div>
              {r.message && (
                <p className="mt-3 border-t border-line pt-3 font-serif text-sm text-ink/70">
                  “{r.message}”
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

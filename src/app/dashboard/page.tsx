import Link from "next/link";
import { countGuests } from "@/lib/guests";
import { rsvpStats } from "@/lib/rsvps";

type Stat = {
  label: string;
  value: string | number;
  hint: string;
  href: string;
  cta: string;
};

export default async function DashboardOverview() {
  const [guestCount, rsvp] = await Promise.all([countGuests(), rsvpStats()]);

  const stats: Stat[] = [
    {
      label: "Guests",
      value: guestCount,
      hint: "Personalised invite links ready to share",
      href: "/dashboard/custom-url",
      cta: "Manage guests",
    },
    {
      label: "RSVPs Received",
      value: rsvp.total,
      hint:
        rsvp.total > 0
          ? `${rsvp.attending} attending · ${rsvp.headcount} guests coming`
          : "Responses will appear here once collected",
      href: "/dashboard/rsvps",
      cta: "View RSVPs",
    },
    {
      label: "Invitation Cards",
      value: guestCount,
      hint: "Download each guest's personalised cards",
      href: "/dashboard/invitations",
      cta: "Create cards",
    },
  ];

  return (
    <div>
      <header className="border-b border-line pb-6">
        <p className="eyebrow">Overview</p>
        <h1 className="mt-1 font-serif text-3xl font-light text-navy">
          Dashboard
        </h1>
        <p className="mt-2 font-sans text-sm text-ink/60">
          A snapshot of everything across the site.
        </p>
      </header>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="card flex flex-col rounded-2xl p-6"
          >
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-silver-deep">
              {s.label}
            </p>
            <p className="mt-2 font-serif text-4xl font-light text-navy">
              {s.value}
            </p>
            <p className="mt-2 flex-1 font-sans text-sm text-ink/55">
              {s.hint}
            </p>
            <Link
              href={s.href}
              className="mt-4 inline-flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-navy hover:text-navy-600"
            >
              {s.cta}
              <span aria-hidden>&rarr;</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

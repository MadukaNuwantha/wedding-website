import Link from "next/link";
import { countGuests } from "@/lib/guests";
import { rsvpStats, respondedGuestCount } from "@/lib/rsvps";

// Chart colours (validated for CVD + contrast on a light surface).
const COL = {
  responded: "#14294b", // navy
  awaiting: "#cdd6e2", // silver-light track
  attending: "#2f6fb0", // blue
  declined: "#b0741f", // bronze
};

function pct(n: number, d: number): number {
  return d > 0 ? Math.round((n / d) * 100) : 0;
}

type Seg = { value: number; color: string };

function Donut({
  segments,
  centerValue,
  centerLabel,
}: {
  segments: Seg[];
  centerValue: string;
  centerLabel: string;
}) {
  const size = 150;
  const stroke = 18;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const gap = 2; // 2px surface gap between segments
  const total = segments.reduce((s, x) => s + x.value, 0);
  let offset = 0;

  return (
    <div className="relative mx-auto w-[150px]">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full">
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--color-line)"
            strokeWidth={stroke}
          />
          {total > 0 &&
            segments.map((seg, i) => {
              if (seg.value <= 0) return null;
              const len = (seg.value / total) * c;
              const dash = Math.max(len - gap, 0.001);
              const el = (
                <circle
                  key={i}
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={stroke}
                  strokeDasharray={`${dash} ${c - dash}`}
                  strokeDashoffset={-offset}
                />
              );
              offset += len;
              return el;
            })}
        </g>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-serif text-3xl font-light text-navy">
          {centerValue}
        </span>
        <span className="mt-0.5 font-sans text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-ink/45">
          {centerLabel}
        </span>
      </div>
    </div>
  );
}

function Legend({
  items,
}: {
  items: { color: string; label: string; value: number }[];
}) {
  return (
    <ul className="mt-5 space-y-2">
      {items.map((it) => (
        <li
          key={it.label}
          className="flex items-center gap-2.5 font-sans text-sm"
        >
          <span
            className="h-3 w-3 shrink-0 rounded-[3px]"
            style={{ backgroundColor: it.color }}
          />
          <span className="text-ink/70">{it.label}</span>
          <span className="ml-auto font-semibold text-navy">{it.value}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function DashboardOverview() {
  const [guests, rsvp, responded] = await Promise.all([
    countGuests(),
    rsvpStats(),
    respondedGuestCount(),
  ]);

  const respondedClamped = Math.min(responded, guests);
  const awaiting = Math.max(guests - respondedClamped, 0);
  const responseRate = pct(respondedClamped, guests);
  const awaitingPct = pct(awaiting, guests);
  const attendingPct = pct(rsvp.attending, rsvp.total);
  const declinedPct = pct(rsvp.declined, rsvp.total);

  const tiles = [
    {
      label: "Total Guests",
      value: guests,
      hint: `${guests} invite ${guests === 1 ? "link" : "links"}`,
      href: "/dashboard/custom-url",
    },
    {
      label: "Responses Received",
      value: rsvp.total,
      hint: `${responseRate}% of guests replied`,
      href: "/dashboard/rsvps",
    },
    {
      label: "Awaiting Reply",
      value: awaiting,
      hint: `${awaitingPct}% of guests`,
      href: "/dashboard/custom-url",
    },
    {
      label: "Attending",
      value: rsvp.attending,
      hint: rsvp.total ? `${attendingPct}% of responses` : "—",
      href: "/dashboard/rsvps",
    },
    {
      label: "Not Attending",
      value: rsvp.declined,
      hint: rsvp.total ? `${declinedPct}% of responses` : "—",
      href: "/dashboard/rsvps",
    },
    {
      label: "Total Attendees",
      value: rsvp.headcount,
      hint: "Incl. accompanying guests",
      href: "/dashboard/rsvps",
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
          A snapshot of your guest list and responses.
        </p>
      </header>

      {/* Stat tiles */}
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
        {tiles.map((t) => (
          <Link
            key={t.label}
            href={t.href}
            className="card card-hover rounded-2xl p-5"
          >
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-silver-deep">
              {t.label}
            </p>
            <p className="mt-2 font-serif text-4xl font-light text-navy">
              {t.value}
            </p>
            <p className="mt-1 font-sans text-xs text-ink/50">{t.hint}</p>
          </Link>
        ))}
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div className="card rounded-2xl p-6">
          <h2 className="font-serif text-xl font-light text-navy">
            Response rate
          </h2>
          <p className="mt-1 font-sans text-sm text-ink/50">
            How many guests have replied
          </p>
          <div className="mt-6">
            <Donut
              segments={[
                { value: respondedClamped, color: COL.responded },
                { value: awaiting, color: COL.awaiting },
              ]}
              centerValue={`${responseRate}%`}
              centerLabel="replied"
            />
            <Legend
              items={[
                {
                  color: COL.responded,
                  label: "Replied",
                  value: respondedClamped,
                },
                { color: COL.awaiting, label: "Awaiting", value: awaiting },
              ]}
            />
          </div>
        </div>

        <div className="card rounded-2xl p-6">
          <h2 className="font-serif text-xl font-light text-navy">
            Attendance
          </h2>
          <p className="mt-1 font-sans text-sm text-ink/50">
            Of those who responded
          </p>
          <div className="mt-6">
            <Donut
              segments={[
                { value: rsvp.attending, color: COL.attending },
                { value: rsvp.declined, color: COL.declined },
              ]}
              centerValue={String(rsvp.attending)}
              centerLabel="attending"
            />
            <Legend
              items={[
                {
                  color: COL.attending,
                  label: "Attending",
                  value: rsvp.attending,
                },
                {
                  color: COL.declined,
                  label: "Not Attending",
                  value: rsvp.declined,
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

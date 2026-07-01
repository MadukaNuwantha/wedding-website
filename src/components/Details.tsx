import Divider from "./Divider";
import Reveal from "./Reveal";

type EventCard = {
  eyebrow: string;
  title: string;
  time: string;
  venue: string;
  address: string;
  mapUrl: string;
};

const EVENTS: EventCard[] = [
  {
    eyebrow: "The Ceremony",
    title: "Holy Matrimony",
    time: "9:00 AM",
    venue: "Church of the Immaculate Heart of Mary",
    address: "Haldanduwana, Toppuwa – Madampe Rd, Dankotuwa 61130",
    mapUrl: "https://maps.app.goo.gl/7g3y2JshVFx1CGDP6",
  },
  {
    eyebrow: "The Reception",
    title: "Celebration of Marriage",
    time: "11:00 AM",
    venue: "Moon Light Hotel",
    address: "Marawila – Nattandiya Rd, Nattandiya",
    mapUrl: "https://maps.app.goo.gl/RhQCXTHVcJWoYiXo6",
  },
];

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 shrink-0">
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export default function Details() {
  return (
    <section id="details" className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-28">
      <div className="relative mx-auto max-w-5xl">
        <Reveal className="text-center">
          <p className="eyebrow">When &amp; Where</p>
          <h2 className="mt-4 font-serif text-4xl font-light text-navy sm:text-5xl">
            The Details
          </h2>
          <Divider className="mt-6" />

          {/* Elegant date treatment: SATURDAY  ·  AUGUST | 01 | 2026 */}
          <div className="mt-8 flex flex-col items-center text-navy">
            <div className="flex items-center gap-3 text-silver-deep">
              <span className="silver-rule w-8" />
              <span className="font-sans text-xs uppercase tracking-[0.32em]">
                Saturday
              </span>
              <span className="silver-rule w-8" />
            </div>
            <div className="mt-4 flex items-center gap-4 sm:gap-6">
              <span className="font-sans text-sm uppercase tracking-[0.28em] text-silver-deep sm:text-base">
                August
              </span>
              <span className="h-10 w-px bg-silver-light sm:h-12" />
              <span className="font-serif text-5xl font-light leading-none sm:text-6xl">
                01
              </span>
              <span className="h-10 w-px bg-silver-light sm:h-12" />
              <span className="font-sans text-sm uppercase tracking-[0.28em] text-silver-deep sm:text-base">
                2026
              </span>
            </div>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-7 md:grid-cols-2">
          {EVENTS.map((ev, i) => (
            <Reveal as="div" key={ev.title} delay={i * 130}>
              <article className="card card-hover flex h-full flex-col rounded-3xl p-8 text-center sm:p-11">
                <p className="eyebrow">{ev.eyebrow}</p>
                <h3 className="mt-3 font-script text-5xl text-navy">{ev.title}</h3>

                <div className="mt-6 flex items-center justify-center gap-2 font-sans text-sm font-medium uppercase tracking-[0.2em] text-navy-600">
                  <span className="text-silver">
                    <ClockIcon />
                  </span>
                  {ev.time}
                </div>

                <div className="my-7 flex justify-center">
                  <span className="silver-rule w-24" />
                </div>

                <p className="font-serif text-2xl text-navy">{ev.venue}</p>
                <p className="mx-auto mt-3 flex max-w-xs items-start justify-center gap-2 font-serif text-base text-ink/65">
                  <span className="mt-1 text-silver">
                    <PinIcon />
                  </span>
                  <span>{ev.address}</span>
                </p>

                <div className="mt-auto pt-8">
                  <a
                    href={ev.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-navy px-7 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-navy transition-all duration-300 hover:bg-navy hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
                  >
                    Get Directions
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

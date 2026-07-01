// Ceremony 9:00 AM (03:30 UTC) → event ends 4:00 PM (10:30 UTC), 1 Aug 2026.
const TITLE = "Maduka & Marine — Wedding";
const LOCATION = "Church of the Immaculate Heart of Mary, Haldanduwana";
const DETAILS =
  "Ceremony 9:00 AM — Church of the Immaculate Heart of Mary, Haldanduwana. Reception 11:00 AM — Moon Light Hotel, Nattandiya.";

const gcalUrl =
  "https://calendar.google.com/calendar/render?action=TEMPLATE" +
  `&text=${encodeURIComponent(TITLE)}` +
  "&dates=20260801T033000Z/20260801T103000Z" +
  `&details=${encodeURIComponent(DETAILS)}` +
  `&location=${encodeURIComponent(LOCATION)}`;

const ics = [
  "BEGIN:VCALENDAR",
  "VERSION:2.0",
  "PRODID:-//MadukaMarine//Wedding//EN",
  "CALSCALE:GREGORIAN",
  "BEGIN:VEVENT",
  "UID:maduka-marine-2026@wedding",
  "DTSTAMP:20260101T000000Z",
  "DTSTART:20260801T033000Z",
  "DTEND:20260801T103000Z",
  `SUMMARY:${TITLE}`,
  `LOCATION:${LOCATION}`,
  `DESCRIPTION:${DETAILS}`,
  "END:VEVENT",
  "END:VCALENDAR",
].join("\r\n");

const icsHref = `data:text/calendar;charset=utf8,${encodeURIComponent(ics)}`;

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
      <rect x="3.5" y="5" width="17" height="16" rx="2" />
      <path d="M3.5 9h17M8 3v4M16 3v4" strokeLinecap="round" />
    </svg>
  );
}

/**
 * "Add to Calendar" pill with a native <details> dropdown (no client JS),
 * offering Google Calendar and a downloadable .ics for Apple/Outlook.
 */
export default function AddToCalendar() {
  return (
    <details className="group relative">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-navy px-8 py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-navy transition-all duration-300 hover:bg-navy hover:text-ivory [&::-webkit-details-marker]:hidden">
        <CalendarIcon />
        Add to Calendar
      </summary>
      <div className="absolute left-1/2 z-20 mt-2 w-60 -translate-x-1/2 overflow-hidden rounded-xl border border-line bg-white text-left shadow-[0_24px_60px_-24px_rgba(20,41,75,0.4)]">
        <a
          href={gcalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block px-5 py-3.5 font-serif text-base text-navy transition-colors hover:bg-cream"
        >
          Google Calendar
        </a>
        <a
          href={icsHref}
          download="maduka-marine-wedding.ics"
          className="block border-t border-line px-5 py-3.5 font-serif text-base text-navy transition-colors hover:bg-cream"
        >
          Apple / Outlook (.ics)
        </a>
      </div>
    </details>
  );
}

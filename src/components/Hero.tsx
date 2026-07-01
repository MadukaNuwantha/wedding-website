import AddToCalendar from "./AddToCalendar";
import ArchedPhoto from "./ArchedPhoto";
import Countdown from "./Countdown";
import Garland from "./Garland";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-ivory px-5 pb-24 pt-14 sm:px-8 sm:pt-16"
    >
      {/* Soft silver wash */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 opacity-60 [background:radial-gradient(60%_100%_at_50%_0%,rgba(205,214,226,0.5),transparent_70%)]" />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
        <Garland className="w-56 sm:w-72" />

        <p className="eyebrow mt-6">Save the Date</p>

        <h1 className="mt-4 font-script text-[3.4rem] leading-[1.02] text-navy sm:text-7xl md:text-8xl">
          Maduka <span className="text-silver">&amp;</span> Marine
        </h1>

        <div className="mt-4 flex items-center gap-4 text-silver">
          <span className="silver-rule w-10 sm:w-14" />
          <span className="font-script text-2xl text-silver-deep sm:text-3xl">
            You&rsquo;re Invited
          </span>
          <span className="silver-rule w-10 sm:w-14" />
        </div>

        <p className="mt-5 font-sans text-sm uppercase tracking-[0.3em] text-navy-600 sm:text-base">
          Saturday · 01 August 2026
        </p>

        <ArchedPhoto
          className="mt-10 aspect-[3/4] w-60 sm:w-72"
          label="Add your favourite photo"
        />

        <div className="mt-10">
          <Countdown />
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <AddToCalendar />
          <a
            href="#rsvp"
            className="inline-flex items-center gap-2 rounded-full bg-navy px-9 py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-ivory shadow-lg shadow-navy/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-navy-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
          >
            RSVP
          </a>
        </div>
      </div>
    </section>
  );
}

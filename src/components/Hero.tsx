import Image from "next/image";
import Countdown from "./Countdown";

export default function Hero() {
  return (
    <section id="home" className="relative min-h-dvh overflow-hidden">
      {/* Background photo */}
      <Image
        src="/couple.jpeg"
        alt="Maduka & Marine"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Legibility scrims — darker at top & bottom, faces stay clear in the middle */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-navy-deep/75 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-navy-deep/85 to-transparent" />

      <div className="relative z-10 flex min-h-dvh flex-col justify-between px-6 py-12 text-center text-white sm:py-16">
        {/* Top block */}
        <div className="flex flex-col items-center [text-shadow:0_2px_24px_rgba(8,21,39,0.55)]">
          <p className="font-sans text-xs font-medium uppercase tracking-[0.34em] text-white/85">
            Save the Date
          </p>
          <h1 className="mt-5 font-script text-[3.5rem] leading-[1.02] sm:text-7xl md:text-8xl">
            Maduka <span className="text-silver-light">&amp;</span> Marine
          </h1>
          <div className="mt-6 flex items-center gap-4">
            <span className="silver-rule w-12 sm:w-16" />
            <span className="font-script text-4xl text-white sm:text-5xl">
              You&rsquo;re Invited
            </span>
            <span className="silver-rule w-12 sm:w-16" />
          </div>
          <div className="mt-7 flex flex-col items-center">
            <div className="flex items-center gap-3">
              <span className="silver-rule w-8" />
              <span className="font-sans text-xs uppercase tracking-[0.32em] text-white/85 sm:text-sm">
                Saturday
              </span>
              <span className="silver-rule w-8" />
            </div>
            <div className="mt-4 flex items-center gap-4 sm:gap-6">
              <span className="font-sans text-sm uppercase tracking-[0.28em] text-white/85 sm:text-base">
                August
              </span>
              <span className="h-10 w-px bg-white/50 sm:h-12" />
              <span className="font-serif text-5xl font-light leading-none sm:text-6xl">
                01
              </span>
              <span className="h-10 w-px bg-white/50 sm:h-12" />
              <span className="font-sans text-sm uppercase tracking-[0.28em] text-white/85 sm:text-base">
                2026
              </span>
            </div>
          </div>
        </div>

        {/* Bottom block */}
        <div className="flex flex-col items-center gap-9">
          <Countdown />
          <a
            href="#rsvp"
            className="inline-flex min-w-[17rem] items-center justify-center gap-3 rounded-full bg-white px-16 py-5 font-sans text-sm font-semibold uppercase tracking-[0.3em] text-navy shadow-2xl shadow-black/40 ring-1 ring-white/60 transition-all duration-300 hover:-translate-y-1 hover:bg-ivory hover:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.6)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:min-w-[20rem] sm:text-base"
          >
            RSVP
            <span aria-hidden="true" className="text-silver-deep">&rarr;</span>
          </a>
        </div>
      </div>
    </section>
  );
}

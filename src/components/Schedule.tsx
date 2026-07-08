import Divider from "./Divider";
import Reveal from "./Reveal";

type Moment = { time: string; title: string; place: string };

const TIMELINE: Moment[] = [
  {
    time: "9:00 AM",
    title: "Church Ceremony",
    place: "Church of the Immaculate Heart of Mary, Haldanduwana",
  },
  {
    time: "11:00 AM",
    title: "Wedding Reception",
    place: "Moon Light Hotel, Nattandiya",
  },
  {
    time: "4:00 PM",
    title: "Conclusion",
    place: "Celebrations conclude",
  },
];

export default function Schedule() {
  return (
    <section id="schedule" className="relative overflow-hidden px-5 py-10 sm:px-8 sm:py-14">
      <div className="relative mx-auto max-w-3xl">
        <Reveal className="text-center">
          <p className="eyebrow">The Day</p>
          <h2 className="mt-4 font-serif text-4xl font-light text-navy sm:text-5xl">
            The Celebration Timeline
          </h2>
          <Divider className="mt-6" />
        </Reveal>

        <ol className="relative mx-auto mt-16 max-w-xl">
          {TIMELINE.map((m, i) => (
            <Reveal
              as="li"
              key={m.title}
              delay={i * 140}
              className={`relative mb-12 pl-10 last:mb-0 sm:mb-16 sm:w-1/2 sm:pl-0 ${
                i % 2 === 0
                  ? "sm:ml-auto sm:pl-14 sm:text-left"
                  : "sm:mr-auto sm:pr-14 sm:text-right"
              }`}
            >
              {/* Connector line to the next dot (skipped on the last item). */}
              {i < TIMELINE.length - 1 && (
                <span
                  className={`absolute left-[7px] top-2 h-[calc(100%+3rem)] w-px bg-silver-light sm:h-[calc(100%+4rem)] ${
                    i % 2 === 0 ? "sm:left-0" : "sm:left-auto sm:right-0"
                  }`}
                  aria-hidden="true"
                />
              )}

              {/* Node */}
              <span
                className={`absolute top-1.5 left-0 flex h-4 w-4 items-center justify-center rounded-full border border-silver bg-white shadow-[0_0_0_4px_rgba(244,247,251,1)] ${
                  i % 2 === 0 ? "sm:-left-2" : "sm:left-auto sm:-right-2"
                }`}
                aria-hidden="true"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-navy" />
              </span>

              <p className="font-sans text-sm font-semibold uppercase tracking-[0.22em] text-silver-deep">
                {m.time}
              </p>
              <h3 className="mt-1.5 font-serif text-2xl text-navy sm:text-3xl">
                {m.title}
              </h3>
              <p className="mt-1.5 font-serif text-base text-ink/60">{m.place}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

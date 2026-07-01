import Divider from "./Divider";
import FloralCorner from "./FloralCorner";
import Monogram from "./Monogram";
import Reveal from "./Reveal";

export default function Story() {
  return (
    <section id="story" className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-28">
      <FloralCorner corner="tl" className="text-silver opacity-40" />
      <FloralCorner corner="br" className="text-silver opacity-40" />
      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal>
          <p className="eyebrow">Our Story</p>
          <h2 className="mt-4 font-serif text-4xl font-light text-navy sm:text-5xl">
            We&rsquo;re getting{" "}
            <span className="italic text-silver-deep">married</span>
          </h2>
          <div className="mt-8 flex justify-center text-silver">
            <Monogram size={90} />
          </div>
        </Reveal>

        <Reveal delay={120}>
          {/* Placeholder text — replace with your own story any time. */}
          <p className="mt-10 font-serif text-xl leading-relaxed text-ink/80 sm:text-2xl">
            After years of shared laughter, quiet moments, and a love that has
            only grown deeper with time, Maduka and Marine are beginning their
            greatest adventure yet &mdash; a life together.
          </p>
          <p className="mt-5 font-serif text-lg leading-relaxed text-ink/65 sm:text-xl">
            We would be so grateful to have the people we love beside us as we say
            &ldquo;I do.&rdquo; Thank you for being part of our journey.
          </p>
        </Reveal>

        <Reveal delay={200}>
          <Divider className="mt-14" />
          <p className="mt-9 font-script text-5xl text-navy sm:text-6xl">
            With love, Maduka &amp; Marine
          </p>
        </Reveal>
      </div>
    </section>
  );
}

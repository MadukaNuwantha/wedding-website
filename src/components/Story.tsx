import Divider from "./Divider";
import Monogram from "./Monogram";
import Reveal from "./Reveal";

export default function Story() {
  return (
    <section id="story" className="relative overflow-hidden px-5 py-10 sm:px-8 sm:py-14">
      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal>
          <p className="eyebrow">Our Story</p>
          <h2 className="mt-4 font-serif text-4xl font-light text-navy sm:text-5xl">
            We&rsquo;re getting{" "}
            <span className="italic text-silver-deep">married</span>
          </h2>
          <div className="mt-8 flex justify-center text-navy">
            <Monogram size={104} />
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-10 space-y-5 font-serif text-lg leading-relaxed text-ink/75 sm:text-xl">
            <p>
              For years we walked the same halls, knowing of each other from a
              distance, yet somehow our paths never quite crossed. Two hearts in
              the same place, waiting for the right moment to find each other.
            </p>
            <p>
              Then, almost by chance, we started talking. And in that very first
              conversation, something felt like home. We understood each other
              completely, as if we had been waiting our whole lives for this
              exact moment.
            </p>
            <p>
              So we kept talking. One conversation became a thousand, late nights
              turned into sunrises, and somewhere along the way, without ever
              quite deciding to, we fell deeply in love. Every laugh, every quiet
              moment, every memory we made together only drew us closer, until we
              arrived at the most beautiful truth of all: we were meant to spend
              our lives together.
            </p>
            <p>
              Now, surrounded by the people who mean the most to us, we&rsquo;re
              ready to begin our greatest adventure yet. It would mean the world
              to have you beside us as we say &ldquo;I do.&rdquo; Thank you for
              being part of our story, and for celebrating this love with us.
            </p>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <Divider className="mt-14" />
          <p className="mt-9 font-script text-5xl leading-tight text-navy sm:text-6xl">
            With all our love
            <br />
            Maduka &amp; Marine
          </p>
        </Reveal>
      </div>
    </section>
  );
}

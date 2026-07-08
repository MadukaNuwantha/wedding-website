import Divider from "./Divider";
import Reveal from "./Reveal";

export default function Invitation() {
  return (
    <section
      id="invitation"
      className="relative overflow-hidden px-5 py-10 sm:px-8 sm:py-14"
    >
      <div className="relative mx-auto max-w-2xl text-center">
        <Reveal>
          {/* Scripture */}
          <p className="font-serif text-xl italic leading-relaxed text-navy sm:text-2xl">
            &ldquo;This is the day the Lord has made. Let us rejoice and be glad
            in it.&rdquo;
          </p>
          <p className="mt-3 font-sans text-xs uppercase tracking-[0.28em] text-silver-deep">
            Psalm 118:24
          </p>
        </Reveal>

        <Reveal delay={120}>
          <Divider className="mt-10" />
        </Reveal>

        <Reveal delay={160}>
          <div className="mt-10 space-y-5 font-serif text-lg leading-relaxed text-ink/85 sm:text-xl">
            <p>
              Mr. (Late) &amp; Mrs. Jayarathna
              <br />
              <span className="text-silver-deep">together with</span>
              <br />
              Mr. &amp; Mrs. Appuhamy
            </p>
            <p className="font-sans text-sm uppercase tracking-[0.2em] text-silver-deep">
              request the honour of your presence
            </p>
            <p>
              at the celebration of the Holy Sacrament of Marriage
              <br className="hidden sm:block" /> uniting their children
            </p>
          </div>
        </Reveal>

        <Reveal delay={220}>
          <p className="mt-9 font-script text-5xl text-navy sm:text-6xl">
            Maduka &amp; Marine
          </p>
        </Reveal>
      </div>
    </section>
  );
}

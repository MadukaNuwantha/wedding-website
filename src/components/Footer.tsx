import Garland from "./Garland";
import Monogram from "./Monogram";

export default function Footer() {
  return (
    <footer className="bg-cream px-5 py-20 text-center sm:px-8">
      <div className="mx-auto flex max-w-2xl flex-col items-center">
        <Garland className="w-56 sm:w-72" />

        <p className="mt-6 font-script text-6xl text-navy sm:text-7xl">
          Thank You
        </p>

        <p className="mt-5 max-w-md font-serif text-lg italic text-ink/70">
          With love and gratitude, we look forward to celebrating this moment
          with you.
        </p>

        <div className="mt-10 text-silver">
          <Monogram size={72} />
        </div>

        <p className="mt-6 font-script text-4xl text-navy sm:text-5xl">
          Maduka &amp; Marine
        </p>

        <div className="mt-5 flex items-center gap-4 text-silver">
          <span className="silver-rule w-10 sm:w-16" />
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-silver-deep">
            01 · 08 · 2026
          </span>
          <span className="silver-rule w-10 sm:w-16" />
        </div>
      </div>
    </footer>
  );
}

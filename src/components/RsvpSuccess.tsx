"use client";

import type { CSSProperties } from "react";

const CONFETTI = [
  { left: "8%", delay: "0s", dur: "2.6s", color: "var(--color-navy)", spin: "540deg" },
  { left: "18%", delay: "0.25s", dur: "3s", color: "#c8a96a", spin: "-480deg" },
  { left: "28%", delay: "0.5s", dur: "2.4s", color: "var(--color-silver)", spin: "360deg" },
  { left: "38%", delay: "0.1s", dur: "2.9s", color: "var(--color-navy-600)", spin: "-600deg" },
  { left: "48%", delay: "0.4s", dur: "2.5s", color: "#c8a96a", spin: "420deg" },
  { left: "58%", delay: "0.15s", dur: "3.1s", color: "var(--color-silver-light)", spin: "-360deg" },
  { left: "68%", delay: "0.5s", dur: "2.6s", color: "var(--color-navy)", spin: "600deg" },
  { left: "78%", delay: "0.3s", dur: "2.8s", color: "#c8a96a", spin: "-540deg" },
  { left: "88%", delay: "0.05s", dur: "2.5s", color: "var(--color-silver)", spin: "480deg" },
  { left: "13%", delay: "0.6s", dur: "3s", color: "var(--color-navy-600)", spin: "-420deg" },
  { left: "63%", delay: "0.7s", dur: "2.7s", color: "var(--color-silver-light)", spin: "360deg" },
  { left: "83%", delay: "0.55s", dur: "3.2s", color: "var(--color-navy)", spin: "-600deg" },
];

function Heart({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
      <path d="M12 21s-7.5-4.9-10-9.3C.3 8.4 1.8 5 5 5c2 0 3.2 1.2 4 2.3C9.8 6.2 11 5 13 5c3.2 0 4.7 3.4 3 6.7C19.5 16.1 12 21 12 21z" />
    </svg>
  );
}

function Coming({ guestName }: { guestName?: string }) {
  return (
    <div className="relative overflow-hidden py-10">
      {/* Confetti */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {CONFETTI.map((c, i) => (
          <span
            key={i}
            className="absolute top-0 block h-2.5 w-1.5 rounded-[1px]"
            style={
              {
                left: c.left,
                backgroundColor: c.color,
                "--spin": c.spin,
                animation: `confetti-fall ${c.dur} ease-in ${c.delay} infinite`,
              } as CSSProperties
            }
          />
        ))}
      </div>

      <div className="relative">
        <div
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-navy text-ivory"
          style={{ animation: "pop-in 0.5s cubic-bezier(0.2,0.8,0.2,1) both" }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-8 w-8">
            <path
              d="M5 13l4 4L19 7"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ strokeDasharray: 40, animation: "check-draw 0.5s ease 0.35s both" }}
            />
          </svg>
        </div>

        <h3
          className="mt-6 font-script text-5xl text-navy sm:text-6xl"
          style={{ animation: "rise-in 0.6s ease 0.2s both" }}
        >
          {guestName ? `See you there, ${guestName}!` : "Joyfully Accepted!"}
        </h3>
        <p
          className="mx-auto mt-3 flex max-w-sm items-center justify-center gap-1.5 font-serif text-lg text-ink/70"
          style={{ animation: "rise-in 0.6s ease 0.35s both" }}
        >
          We can&rsquo;t wait to celebrate with you
          <Heart className="inline h-4 w-4 text-[#c8a96a]" />
        </p>
      </div>
    </div>
  );
}

function NotComing({ guestName }: { guestName?: string }) {
  const floaters = [
    { left: "30%", delay: "0s" },
    { left: "50%", delay: "0.5s" },
    { left: "70%", delay: "1s" },
  ];
  return (
    <div className="relative overflow-hidden py-10">
      {/* Softly rising hearts */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {floaters.map((f, i) => (
          <Heart
            key={i}
            className="absolute bottom-6 h-4 w-4 text-silver-light"
            style={{ left: f.left, animation: `float-up-fade 3s ease-in ${f.delay} infinite` }}
          />
        ))}
      </div>

      <div className="relative">
        <div
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-tint"
          style={{ animation: "pop-in 0.5s cubic-bezier(0.2,0.8,0.2,1) both" }}
        >
          <Heart
            className="h-8 w-8 text-navy/70"
            style={{ animation: "heart-beat 1.8s ease-in-out 0.4s infinite" }}
          />
        </div>

        <h3
          className="mt-6 font-script text-5xl text-navy sm:text-6xl"
          style={{ animation: "rise-in 0.6s ease 0.2s both" }}
        >
          You&rsquo;ll be missed
        </h3>
        <p
          className="mx-auto mt-3 max-w-sm font-serif text-lg text-ink/70"
          style={{ animation: "rise-in 0.6s ease 0.35s both" }}
        >
          {guestName ? `Thank you, ${guestName}. ` : "Thank you for letting us know. "}
          We&rsquo;ll be thinking of you on our special day.
        </p>
      </div>
    </div>
  );
}

export default function RsvpSuccess({
  attending,
  guestName,
  onReset,
}: {
  attending: "yes" | "no";
  guestName?: string;
  onReset: () => void;
}) {
  return (
    <div className="text-center">
      {attending === "yes" ? (
        <Coming guestName={guestName} />
      ) : (
        <NotComing guestName={guestName} />
      )}
      <button
        type="button"
        onClick={onReset}
        className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-navy underline underline-offset-4 hover:text-navy-600"
      >
        Change response
      </button>
    </div>
  );
}

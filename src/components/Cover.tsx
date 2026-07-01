"use client";

import { useEffect, useState } from "react";
import Monogram from "./Monogram";

/**
 * Intro "card cover" shown on load. Tapping splits it open (gatefold)
 * to reveal the page beneath.
 */
export default function Cover() {
  const [opening, setOpening] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [done]);

  function open() {
    if (opening) return;
    setOpening(true);
    // Remove after the panel slide finishes (matches duration below).
    window.setTimeout(() => setDone(true), 1200);
  }

  if (done) return null;

  const panelEase = "ease-[cubic-bezier(0.7,0,0.25,1)]";

  return (
    <div
      className="fixed inset-0 z-[60] overflow-hidden"
      role="dialog"
      aria-label="Wedding invitation"
    >
      {/* Left panel */}
      <div
        className={`absolute inset-y-0 left-0 w-1/2 bg-gradient-to-b from-navy-deep to-navy transition-transform duration-[1100ms] ${panelEase} ${
          opening ? "-translate-x-full" : "translate-x-0"
        }`}
      />

      {/* Right panel */}
      <div
        className={`absolute inset-y-0 right-0 w-1/2 bg-gradient-to-b from-navy-deep to-navy transition-transform duration-[1100ms] ${panelEase} ${
          opening ? "translate-x-full" : "translate-x-0"
        }`}
      />

      {/* Center content — fades out as the card opens */}
      <button
        type="button"
        onClick={open}
        aria-label="Tap to open the invitation"
        className={`absolute inset-0 z-10 flex w-full cursor-pointer flex-col items-center justify-center px-6 text-center text-white transition-opacity duration-500 ${
          opening ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <span className="text-silver-light">
          <Monogram size={124} />
        </span>

        <p className="mt-8 font-sans text-xs uppercase tracking-[0.34em] text-silver-light">
          The Wedding of
        </p>
        <p className="mt-4 font-script text-6xl leading-none sm:text-7xl">
          Maduka &amp; Marine
        </p>

        <div className="mt-8 flex items-center gap-3 text-silver-light">
          <span className="silver-rule w-8" />
          <span className="font-sans text-[0.7rem] uppercase tracking-[0.3em]">
            01 · 08 · 2026
          </span>
          <span className="silver-rule w-8" />
        </div>

        <span className="mt-12 inline-flex animate-pulse items-center gap-2 rounded-full border border-white/45 px-7 py-3 font-sans text-xs font-semibold uppercase tracking-[0.24em] text-white">
          Tap to Open
        </span>
      </button>
    </div>
  );
}

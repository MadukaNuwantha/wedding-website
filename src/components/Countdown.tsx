"use client";

import { useEffect, useState } from "react";

// Ceremony start: Saturday, 1 August 2026, 09:00 (Sri Lanka time, UTC+5:30)
const TARGET = new Date("2026-08-01T09:00:00+05:30").getTime();

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

function getTimeLeft(): TimeLeft {
  const diff = Math.max(0, TARGET - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function Countdown() {
  // Start null to avoid a server/client hydration mismatch; fill in after mount.
  const [time, setTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTime(getTimeLeft());
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const units: Array<{ label: string; value: number }> = [
    { label: "Days", value: time?.days ?? 0 },
    { label: "Hours", value: time?.hours ?? 0 },
    { label: "Minutes", value: time?.minutes ?? 0 },
    { label: "Seconds", value: time?.seconds ?? 0 },
  ];

  return (
    <div className="flex items-stretch justify-center gap-3 sm:gap-4">
      {units.map((unit) => (
        <div
          key={unit.label}
          className="card flex min-w-[66px] flex-col items-center rounded-xl px-3 py-3 sm:min-w-[92px] sm:px-5 sm:py-4"
        >
          <span className="font-serif text-3xl font-light tabular-nums text-navy sm:text-5xl">
            {String(unit.value).padStart(2, "0")}
          </span>
          <span className="mt-1.5 font-sans text-[0.58rem] uppercase tracking-[0.24em] text-silver-deep sm:text-[0.68rem]">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}

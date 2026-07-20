"use client";

import { useState } from "react";
import type { RsvpTrack } from "@/lib/rsvps";

type Filter = "all" | "responded" | "awaiting";

function displayName(i: RsvpTrack): string {
  const t = (i.title ?? "").trim();
  return t ? `${t} ${i.name}` : i.name;
}

function badge(att: RsvpTrack["attending"]): { cls: string; text: string } {
  if (att === "yes") return { cls: "bg-green-50 text-green-700", text: "Attending" };
  if (att === "no") return { cls: "bg-red-50 text-red-700", text: "Not attending" };
  return { cls: "bg-amber-50 text-amber-700", text: "Awaiting" };
}

export default function RsvpTracker({ items }: { items: RsvpTrack[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const responded = items.filter((i) => i.attending !== null);
  const awaiting = items.filter((i) => i.attending === null);
  const attendingCount = items.filter((i) => i.attending === "yes").length;

  const shown =
    filter === "responded" ? responded : filter === "awaiting" ? awaiting : items;

  const tabs: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "All", count: items.length },
    { key: "responded", label: "Responded", count: responded.length },
    { key: "awaiting", label: "Awaiting", count: awaiting.length },
  ];

  return (
    <div>
      <p className="mb-4 font-sans text-sm text-ink/65">
        Sent the RSVP link to{" "}
        <span className="font-semibold text-navy">{items.length}</span>{" "}
        {items.length === 1 ? "guest" : "guests"} —{" "}
        <span className="font-semibold text-green-700">
          {responded.length} responded
        </span>{" "}
        ({attendingCount} attending),{" "}
        <span className="font-semibold text-amber-700">
          {awaiting.length} awaiting
        </span>
        .
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setFilter(t.key)}
            className={`rounded-full px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-[0.12em] transition-colors ${
              filter === t.key
                ? "bg-navy text-ivory"
                : "border border-line text-ink/60 hover:text-navy"
            }`}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="card rounded-2xl p-6 text-center font-sans text-sm text-ink/50">
          {filter === "awaiting"
            ? "Everyone you sent the RSVP link to has responded 🎉"
            : "No guests here."}
        </p>
      ) : (
        <ul className="space-y-2.5">
          {shown.map((i) => {
            const b = badge(i.attending);
            return (
              <li
                key={i.id}
                className="card flex items-center justify-between gap-3 rounded-2xl p-4"
              >
                <p className="min-w-0 truncate font-serif text-lg text-navy">
                  {displayName(i)}
                </p>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 font-sans text-xs font-semibold uppercase tracking-[0.12em] ${b.cls}`}
                >
                  {b.text}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

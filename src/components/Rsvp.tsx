"use client";

import { useActionState, useEffect, useState } from "react";
import { submitRsvp, type RsvpState } from "@/lib/rsvp-actions";
import Divider from "./Divider";
import Reveal from "./Reveal";
import RsvpSuccess from "./RsvpSuccess";

const inputBase =
  "w-full rounded-xl border border-line bg-cream/60 px-4 py-3 font-serif text-base text-ink outline-none transition-colors placeholder:text-silver-deep/60 focus:border-navy focus:bg-white focus:ring-2 focus:ring-navy/12";
const labelBase =
  "mb-1.5 block font-sans text-xs font-semibold uppercase tracking-[0.16em] text-navy-600";

export default function Rsvp({
  guestName,
  guestCode,
}: {
  guestName?: string;
  guestCode?: string;
}) {
  const [attending, setAttending] = useState<"yes" | "no" | "">("");
  const [submitted, setSubmitted] = useState(false);
  const [state, formAction, pending] = useActionState<RsvpState, FormData>(
    submitRsvp,
    undefined
  );

  useEffect(() => {
    if (state?.ok) setSubmitted(true);
  }, [state]);

  return (
    <section id="rsvp" className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-28">
      <div className="relative mx-auto max-w-xl">
        <Reveal className="text-center">
          <p className="eyebrow">Kindly Reply</p>
          <h2 className="mt-4 font-script text-6xl text-navy sm:text-7xl">RSVP</h2>
          <Divider className="mt-6" />
          {guestName && (
            <p className="mt-6 font-script text-4xl text-navy sm:text-5xl">
              Dear {guestName},
            </p>
          )}
          <p className="mx-auto mt-6 max-w-md font-serif text-lg text-ink/70">
            Your presence would mean the world to us. Kindly let us know if you
            will be joining the celebration.
          </p>
        </Reveal>

        <Reveal>
          <div className="card mt-12 rounded-3xl p-6 sm:p-10">
            {submitted ? (
              <RsvpSuccess
                attending={
                  state?.attending ?? (attending === "no" ? "no" : "yes")
                }
                guestName={guestName}
                onReset={() => setSubmitted(false)}
              />
            ) : (
              <form action={formAction} className="space-y-5">
                {guestCode && (
                  <input type="hidden" name="token" value={guestCode} />
                )}
                <fieldset>
                  <span className={labelBase}>Will you attend?</span>
                  <div className="grid grid-cols-2 gap-3">
                    {(
                      [
                        { value: "yes", label: "Joyfully Accepts" },
                        { value: "no", label: "Regretfully Declines" },
                      ] as const
                    ).map((opt) => (
                      <label
                        key={opt.value}
                        className={`flex cursor-pointer items-center justify-center rounded-xl border px-4 py-3 text-center font-sans text-xs font-semibold uppercase tracking-[0.14em] transition-all duration-300 ${
                          attending === opt.value
                            ? "border-navy bg-navy text-ivory"
                            : "border-line bg-cream/60 text-navy-600 hover:border-silver"
                        }`}
                      >
                        <input
                          type="radio"
                          name="attending"
                          value={opt.value}
                          checked={attending === opt.value}
                          onChange={() => setAttending(opt.value)}
                          className="sr-only"
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </fieldset>

                {/* Guest count only when attending */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    attending === "yes" ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <label htmlFor="guests" className={labelBase}>
                    Number of Guests
                  </label>
                  <select id="guests" name="guests" className={inputBase}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "guest" : "guests"}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className={labelBase}>
                    A Message for the Couple{" "}
                    <span className="font-normal normal-case tracking-normal text-silver-deep">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    placeholder="Your wishes for Maduka & Marine…"
                    className={`${inputBase} resize-none`}
                  />
                </div>

                {state?.error && (
                  <p
                    role="alert"
                    className="text-center font-sans text-sm text-red-700"
                  >
                    {state.error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={pending}
                  className="w-full rounded-full bg-navy px-8 py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-ivory shadow-lg shadow-navy/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-navy-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {pending ? "Sending…" : "Confirm Attendance"}
                </button>

                <p className="text-center font-sans text-[0.68rem] uppercase tracking-[0.16em] text-silver-deep">
                  Kindly reply by an earlier date once confirmed
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

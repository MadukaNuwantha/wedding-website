"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import {
  addGuestAction,
  deleteGuestAction,
  importGuestsAction,
  type AddGuestState,
  type ImportGuestsState,
} from "@/lib/guest-actions";
import type { Guest } from "@/lib/guests";

const inputBase =
  "w-full rounded-xl border border-line bg-white px-4 py-3 font-sans text-base text-ink outline-none transition-colors placeholder:text-silver-deep/60 focus:border-navy focus:ring-2 focus:ring-navy/12";

function inviteUrl(origin: string, token: string): string {
  return `${origin}/i/${token}`;
}

function CopyButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Fallback for older browsers / insecure contexts.
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-full bg-navy px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-ivory transition-colors hover:bg-navy-600"
    >
      {copied ? "Copied!" : "Copy Invite URL"}
    </button>
  );
}

export default function GuestManager({ guests }: { guests: Guest[] }) {
  const [state, action, pending] = useActionState<AddGuestState, FormData>(
    addGuestAction,
    undefined
  );
  const [importState, importAction, importing] = useActionState<
    ImportGuestsState,
    FormData
  >(importGuestsAction, undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const importRef = useRef<HTMLFormElement>(null);
  const [origin, setOrigin] = useState("");

  useEffect(() => setOrigin(window.location.origin), []);

  // Clear the input after a successful add.
  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  // Clear the file picker after a successful import.
  useEffect(() => {
    if (importState?.added) importRef.current?.reset();
  }, [importState]);

  return (
    <div className="space-y-8">
      {/* Add guest */}
      <div className="card rounded-2xl p-6 sm:p-8">
        <h2 className="font-serif text-xl font-light text-navy">Add a guest</h2>
        <form
          ref={formRef}
          action={action}
          className="mt-4 flex flex-col gap-3 sm:flex-row"
        >
          <input
            name="name"
            type="text"
            placeholder="Guest full name"
            autoComplete="off"
            required
            className={inputBase}
          />
          <button
            type="submit"
            disabled={pending}
            className="shrink-0 rounded-full bg-navy px-7 py-3 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-ivory transition-all hover:bg-navy-600 disabled:opacity-60"
          >
            {pending ? "Adding…" : "Add Guest"}
          </button>
        </form>
        {state?.error && (
          <p role="alert" className="mt-3 font-sans text-sm text-red-700">
            {state.error}
          </p>
        )}

        {/* CSV import */}
        <div className="mt-6 border-t border-line pt-6">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-sans text-sm font-semibold uppercase tracking-[0.14em] text-navy-600">
              Import from CSV
            </h3>
            <span className="font-sans text-xs text-ink/45">
              One name per line, or a “Name” column
            </span>
          </div>
          <form
            ref={importRef}
            action={importAction}
            className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <input
              type="file"
              name="file"
              accept=".csv,text/csv,text/plain"
              required
              className="w-full font-sans text-sm text-ink/70 file:mr-3 file:rounded-full file:border-0 file:bg-tint file:px-4 file:py-2 file:font-sans file:text-xs file:font-semibold file:uppercase file:tracking-[0.14em] file:text-navy hover:file:bg-silver-light/40"
            />
            <button
              type="submit"
              disabled={importing}
              className="shrink-0 rounded-full border border-navy px-6 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-navy transition-colors hover:bg-navy hover:text-ivory disabled:opacity-60"
            >
              {importing ? "Importing…" : "Import"}
            </button>
          </form>
          {importState?.error && (
            <p role="alert" className="mt-3 font-sans text-sm text-red-700">
              {importState.error}
            </p>
          )}
          {importState?.added ? (
            <p className="mt-3 font-sans text-sm text-green-700">
              Imported {importState.added}{" "}
              {importState.added === 1 ? "guest" : "guests"}.
            </p>
          ) : null}
        </div>
      </div>

      {/* Guest list */}
      <div>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-serif text-xl font-light text-navy">
            Guests
          </h2>
          <span className="font-sans text-sm text-ink/50">
            {guests.length} {guests.length === 1 ? "guest" : "guests"}
          </span>
        </div>

        {guests.length === 0 ? (
          <p className="card rounded-2xl p-8 text-center font-sans text-sm text-ink/50">
            No guests yet. Add your first guest above.
          </p>
        ) : (
          <ul className="space-y-3">
            {guests.map((g) => {
              const url = origin ? inviteUrl(origin, g.token) : "";
              return (
                <li
                  key={g.id}
                  className="card flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
                >
                  <div className="min-w-0">
                    <p className="truncate font-serif text-lg text-navy">
                      {g.name}
                    </p>
                    <p className="mt-0.5 truncate font-mono text-xs text-ink/45">
                      {url || `…/i/${g.token}`}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <CopyButton url={url} />
                    <form action={deleteGuestAction}>
                      <input type="hidden" name="id" value={g.id} />
                      <button
                        type="submit"
                        aria-label={`Remove ${g.name}`}
                        className="rounded-full border border-line px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-ink/60 transition-colors hover:border-red-300 hover:text-red-600"
                      >
                        Remove
                      </button>
                    </form>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

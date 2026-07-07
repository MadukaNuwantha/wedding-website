"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import {
  addGuestAction,
  deleteGuestAction,
  importGuestsAction,
  updateGuestTitleAction,
  updateGuestCategoryAction,
  bulkDeleteGuestsAction,
  bulkSetTitleAction,
  bulkSetCategoryAction,
  type AddGuestState,
  type ImportGuestsState,
} from "@/lib/guest-actions";
import type { Guest } from "@/lib/guests";
import type { Category } from "@/lib/categories";

const inputBase =
  "w-full rounded-xl border border-line bg-white px-4 py-3 font-sans text-base text-ink outline-none transition-colors placeholder:text-silver-deep/60 focus:border-navy focus:ring-2 focus:ring-navy/12";

const TITLES = ["", "Mr.", "Mrs.", "Ms.", "Miss", "Dr.", "Rev.", "Mr. & Mrs."];

const smallSelect =
  "shrink-0 rounded-lg border border-line bg-white px-2.5 py-1.5 font-sans text-sm text-ink outline-none focus:border-navy";

function inviteUrl(origin: string, token: string): string {
  return `${origin}/i/${token}`;
}

function CopyButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
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

function CategoryOptions({ categories }: { categories: Category[] }) {
  return (
    <>
      {categories.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name}
        </option>
      ))}
    </>
  );
}

export default function GuestManager({
  guests,
  categories,
}: {
  guests: Guest[];
  categories: Category[];
}) {
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
  const [query, setQuery] = useState("");
  const [catFilter, setCatFilter] = useState(""); // "", category id, or "none"

  const [titles, setTitles] = useState<Record<string, string>>(() =>
    Object.fromEntries(guests.map((g) => [g.id, g.title ?? ""]))
  );
  const [cats, setCats] = useState<Record<string, string>>(() =>
    Object.fromEntries(guests.map((g) => [g.id, g.categoryId ?? ""]))
  );
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkTitle, setBulkTitle] = useState("");
  const [bulkCategory, setBulkCategory] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => setOrigin(window.location.origin), []);
  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);
  useEffect(() => {
    if (importState?.added) importRef.current?.reset();
  }, [importState]);

  const effTitle = (g: Guest) => titles[g.id] ?? g.title ?? "";
  const effCat = (g: Guest) => cats[g.id] ?? g.categoryId ?? "";

  const q = query.trim().toLowerCase();
  const filtered = guests.filter((g) => {
    if (catFilter === "none" && effCat(g)) return false;
    if (catFilter && catFilter !== "none" && effCat(g) !== catFilter)
      return false;
    if (
      q &&
      !g.name.toLowerCase().includes(q) &&
      !g.token.toLowerCase().includes(q)
    )
      return false;
    return true;
  });
  const isFiltering = q !== "" || catFilter !== "";

  function setTitle(id: string, value: string) {
    setTitles((prev) => ({ ...prev, [id]: value }));
    startTransition(() => updateGuestTitleAction(id, value));
  }

  function setCat(id: string, value: string) {
    setCats((prev) => ({ ...prev, [id]: value }));
    startTransition(() => updateGuestCategoryAction(id, value));
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const allFilteredSelected =
    filtered.length > 0 && filtered.every((g) => selected.has(g.id));

  function toggleSelectAll() {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allFilteredSelected) filtered.forEach((g) => next.delete(g.id));
      else filtered.forEach((g) => next.add(g.id));
      return next;
    });
  }

  function applyBulkTitle() {
    const ids = [...selected];
    if (ids.length === 0) return;
    setTitles((prev) => {
      const next = { ...prev };
      ids.forEach((id) => (next[id] = bulkTitle));
      return next;
    });
    startTransition(() => bulkSetTitleAction(ids, bulkTitle));
  }

  function applyBulkCategory() {
    const ids = [...selected];
    if (ids.length === 0) return;
    setCats((prev) => {
      const next = { ...prev };
      ids.forEach((id) => (next[id] = bulkCategory));
      return next;
    });
    startTransition(() => bulkSetCategoryAction(ids, bulkCategory));
  }

  function deleteSelected() {
    const ids = [...selected];
    if (ids.length === 0) return;
    if (
      !window.confirm(
        `Delete ${ids.length} guest${ids.length === 1 ? "" : "s"}? This can't be undone.`
      )
    )
      return;
    setSelected(new Set());
    startTransition(() => bulkDeleteGuestsAction(ids));
  }

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
          <select
            name="category"
            aria-label="Category"
            defaultValue=""
            className="rounded-xl border border-line bg-white px-3 py-3 font-sans text-sm text-ink outline-none focus:border-navy sm:w-52"
          >
            <option value="">No category</option>
            <CategoryOptions categories={categories} />
          </select>
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
            <select
              name="category"
              aria-label="Category for imported guests"
              defaultValue=""
              className="rounded-xl border border-line bg-white px-3 py-2.5 font-sans text-sm text-ink outline-none focus:border-navy sm:w-52"
            >
              <option value="">No category</option>
              <CategoryOptions categories={categories} />
            </select>
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
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="font-serif text-xl font-light text-navy">Guests</h2>
          <span className="font-sans text-sm text-ink/50">
            {isFiltering
              ? `${filtered.length} of ${guests.length}`
              : guests.length}{" "}
            {guests.length === 1 ? "guest" : "guests"}
          </span>
        </div>

        {guests.length > 0 && (
          <div className="mb-4 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-silver-deep"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search guests by name…"
                aria-label="Search guests"
                className={`${inputBase} pl-11`}
              />
            </div>
            <select
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
              aria-label="Filter by category"
              className="rounded-xl border border-line bg-white px-4 py-3 font-sans text-sm text-ink outline-none focus:border-navy sm:w-56"
            >
              <option value="">All categories</option>
              <option value="none">Uncategorised</option>
              <CategoryOptions categories={categories} />
            </select>
          </div>
        )}

        {/* Select-all + bulk actions */}
        {filtered.length > 0 && (
          <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <label className="flex items-center gap-2 font-sans text-sm text-ink/60">
              <input
                type="checkbox"
                checked={allFilteredSelected}
                onChange={toggleSelectAll}
                className="h-4 w-4 accent-navy"
              />
              Select all{isFiltering ? " (filtered)" : ""}
            </label>

            {selected.size > 0 && (
              <div className="flex flex-wrap items-center gap-2 rounded-xl bg-tint px-3 py-2">
                <span className="font-sans text-sm font-semibold text-navy">
                  {selected.size} selected
                </span>
                <span className="h-4 w-px bg-silver-light" />
                <select
                  value={bulkTitle}
                  onChange={(e) => setBulkTitle(e.target.value)}
                  aria-label="Title to apply"
                  className={smallSelect}
                >
                  {TITLES.map((t) => (
                    <option key={t || "none"} value={t}>
                      {t || "— no title —"}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={applyBulkTitle}
                  disabled={isPending}
                  className="rounded-full bg-navy px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-ivory transition-colors hover:bg-navy-600 disabled:opacity-50"
                >
                  Apply title
                </button>
                <span className="h-4 w-px bg-silver-light" />
                <select
                  value={bulkCategory}
                  onChange={(e) => setBulkCategory(e.target.value)}
                  aria-label="Category to assign"
                  className={smallSelect}
                >
                  <option value="">— no category —</option>
                  <CategoryOptions categories={categories} />
                </select>
                <button
                  type="button"
                  onClick={applyBulkCategory}
                  disabled={isPending}
                  className="rounded-full bg-navy px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-ivory transition-colors hover:bg-navy-600 disabled:opacity-50"
                >
                  Assign category
                </button>
                <span className="h-4 w-px bg-silver-light" />
                <button
                  type="button"
                  onClick={deleteSelected}
                  disabled={isPending}
                  className="rounded-full border border-red-300 px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-red-600 transition-colors hover:bg-red-600 hover:text-white disabled:opacity-50"
                >
                  Delete selected
                </button>
                <button
                  type="button"
                  onClick={() => setSelected(new Set())}
                  className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-ink/45 underline underline-offset-4 hover:text-navy"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        )}

        {guests.length === 0 ? (
          <p className="card rounded-2xl p-8 text-center font-sans text-sm text-ink/50">
            No guests yet. Add your first guest above.
          </p>
        ) : filtered.length === 0 ? (
          <p className="card rounded-2xl p-8 text-center font-sans text-sm text-ink/50">
            No guests match the current filter.
          </p>
        ) : (
          <ul className="space-y-3">
            {filtered.map((g) => {
              const url = origin ? inviteUrl(origin, g.token) : "";
              return (
                <li
                  key={g.id}
                  className="card flex flex-col gap-3 rounded-2xl p-4 sm:p-5"
                >
                  <div className="flex items-start gap-3 sm:items-center">
                    <input
                      type="checkbox"
                      checked={selected.has(g.id)}
                      onChange={() => toggleSelect(g.id)}
                      aria-label={`Select ${g.name}`}
                      className="mt-1 h-4 w-4 shrink-0 accent-navy sm:mt-0"
                    />
                    <div className="min-w-0 flex-1">
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
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:pl-7">
                    <select
                      value={effTitle(g)}
                      onChange={(e) => setTitle(g.id, e.target.value)}
                      aria-label={`Title for ${g.name}`}
                      className={smallSelect}
                    >
                      {TITLES.map((t) => (
                        <option key={t || "none"} value={t}>
                          {t || "— title —"}
                        </option>
                      ))}
                    </select>
                    <select
                      value={effCat(g)}
                      onChange={(e) => setCat(g.id, e.target.value)}
                      aria-label={`Category for ${g.name}`}
                      className={smallSelect}
                    >
                      <option value="">— category —</option>
                      <CategoryOptions categories={categories} />
                    </select>
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

"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import {
  createCategoryAction,
  renameCategoryAction,
  deleteCategoryAction,
  type CategoryState,
} from "@/lib/category-actions";
import type { Category } from "@/lib/categories";

export default function CategoryManager({
  categories,
}: {
  categories: Category[];
}) {
  const [state, action, pending] = useActionState<CategoryState, FormData>(
    createCategoryAction,
    undefined
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [, startTransition] = useTransition();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  function startEdit(c: Category) {
    setEditingId(c.id);
    setEditValue(c.name);
  }

  function saveEdit(id: string) {
    const name = editValue.trim();
    setEditingId(null);
    if (name) startTransition(() => renameCategoryAction(id, name));
  }

  function remove(c: Category) {
    const msg =
      c.guestCount > 0
        ? `Delete “${c.name}”? Its ${c.guestCount} guest${
            c.guestCount === 1 ? "" : "s"
          } will become uncategorised (not deleted).`
        : `Delete “${c.name}”?`;
    if (!window.confirm(msg)) return;
    startTransition(() => deleteCategoryAction(c.id));
  }

  return (
    <div className="space-y-8">
      {/* Create */}
      <div className="card rounded-2xl p-6 sm:p-8">
        <h2 className="font-serif text-xl font-light text-navy">
          New category
        </h2>
        <form
          ref={formRef}
          action={action}
          className="mt-4 flex flex-col gap-3 sm:flex-row"
        >
          <input
            name="name"
            type="text"
            placeholder="e.g. Maduka – School"
            autoComplete="off"
            required
            className="w-full rounded-xl border border-line bg-white px-4 py-3 font-sans text-base text-ink outline-none focus:border-navy focus:ring-2 focus:ring-navy/12"
          />
          <button
            type="submit"
            disabled={pending}
            className="shrink-0 rounded-full bg-navy px-7 py-3 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-ivory transition-all hover:bg-navy-600 disabled:opacity-60"
          >
            {pending ? "Adding…" : "Add Category"}
          </button>
        </form>
        {state?.error && (
          <p role="alert" className="mt-3 font-sans text-sm text-red-700">
            {state.error}
          </p>
        )}
      </div>

      {/* List */}
      <div>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-serif text-xl font-light text-navy">
            Your categories
          </h2>
          <span className="font-sans text-sm text-ink/50">
            {categories.length}{" "}
            {categories.length === 1 ? "category" : "categories"}
          </span>
        </div>

        {categories.length === 0 ? (
          <p className="card rounded-2xl p-8 text-center font-sans text-sm text-ink/50">
            No categories yet. Add your first one above.
          </p>
        ) : (
          <ul className="space-y-3">
            {categories.map((c) => (
              <li
                key={c.id}
                className="card flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
              >
                {editingId === c.id ? (
                  <input
                    autoFocus
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit(c.id);
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    className="w-full rounded-lg border border-navy bg-white px-3 py-2 font-serif text-lg text-navy outline-none focus:ring-2 focus:ring-navy/12 sm:max-w-sm"
                  />
                ) : (
                  <div className="min-w-0">
                    <p className="truncate font-serif text-lg text-navy">
                      {c.name}
                    </p>
                    <p className="mt-0.5 font-sans text-xs text-ink/45">
                      {c.guestCount} {c.guestCount === 1 ? "guest" : "guests"}
                    </p>
                  </div>
                )}

                <div className="flex shrink-0 items-center gap-2">
                  {editingId === c.id ? (
                    <>
                      <button
                        type="button"
                        onClick={() => saveEdit(c.id)}
                        className="rounded-full bg-navy px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-ivory hover:bg-navy-600"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="rounded-full border border-line px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-ink/60 hover:text-navy"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => startEdit(c)}
                        className="rounded-full border border-navy px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-navy transition-colors hover:bg-navy hover:text-ivory"
                      >
                        Rename
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(c)}
                        className="rounded-full border border-line px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-ink/60 transition-colors hover:border-red-300 hover:text-red-600"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

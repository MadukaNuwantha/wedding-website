"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import {
  CARDS,
  cardMeta,
  type CardConfig,
  type CardFont,
  type CardKey,
} from "@/lib/card-config";
import { updateGuestTitleAction } from "@/lib/guest-actions";
import type { Guest } from "@/lib/guests";

const STORAGE_KEY = "wp_card_cfg_v1";

const TITLES = [
  "",
  "Mr.",
  "Mrs.",
  "Ms.",
  "Miss",
  "Dr.",
  "Rev.",
  "Mr. & Mrs.",
];

// Cache decoded base images so re-renders don't refetch.
const imageCache = new Map<string, Promise<HTMLImageElement>>();
function loadImage(src: string): Promise<HTMLImageElement> {
  let p = imageCache.get(src);
  if (!p) {
    p = new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
    imageCache.set(src, p);
  }
  return p;
}

function cssFamily(font: CardFont): string {
  const root = getComputedStyle(document.documentElement);
  const v = (
    font === "script"
      ? root.getPropertyValue("--font-great-vibes")
      : root.getPropertyValue("--font-cormorant")
  ).trim();
  const first = v.split(",")[0].trim();
  return first || (font === "script" ? "cursive" : "serif");
}

async function renderCard(
  canvas: HTMLCanvasElement,
  key: CardKey,
  name: string,
  cfg: CardConfig
) {
  const meta = cardMeta(key);
  const img = await loadImage(meta.src);
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0, w, h);

  const size = Math.round(cfg.size * w);
  const family = cssFamily(cfg.font);
  try {
    await document.fonts.load(`${size}px ${family}`);
  } catch {
    /* fall back to whatever is available */
  }

  ctx.fillStyle = cfg.color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `${size}px ${family}`;
  ctx.fillText(name.trim(), cfg.x * w, cfg.y * h, w * 0.74);
}

function slug(name: string): string {
  return (
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "guest"
  );
}

async function downloadCard(key: CardKey, name: string, cfg: CardConfig) {
  const canvas = document.createElement("canvas");
  await renderCard(canvas, key, name, cfg);
  const meta = cardMeta(key);
  await new Promise<void>((resolve) =>
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${slug(name)}-${meta.fileSuffix}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      }
      resolve();
    }, "image/png")
  );
}

function defaults(): Record<CardKey, CardConfig> {
  return {
    wedding: { ...cardMeta("wedding").default },
    reception: { ...cardMeta("reception").default },
  };
}

function sameCfg(a: CardConfig, b: CardConfig): boolean {
  return (
    a.x === b.x &&
    a.y === b.y &&
    a.size === b.size &&
    a.color === b.color &&
    a.font === b.font
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  display: string;
}) {
  return (
    <label className="block">
      <span className="flex items-center justify-between font-sans text-xs font-semibold uppercase tracking-[0.12em] text-navy-600">
        {label}
        <span className="font-normal normal-case tracking-normal text-ink/45">
          {display}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="mt-2 w-full accent-navy"
      />
    </label>
  );
}

export default function InvitationStudio({ guests }: { guests: Guest[] }) {
  const [draft, setDraft] = useState<Record<CardKey, CardConfig>>(defaults);
  const [locked, setLocked] = useState<Record<CardKey, CardConfig>>(defaults);
  const [active, setActive] = useState<CardKey>("wedding");
  const [sample, setSample] = useState(guests[0]?.name ?? "Guest Name");
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [titles, setTitles] = useState<Record<string, string>>(() =>
    Object.fromEntries(guests.map((g) => [g.id, g.title ?? ""]))
  );
  const [, startTransition] = useTransition();
  const previewRef = useRef<HTMLCanvasElement>(null);

  // Load the locked placement from the browser.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<Record<CardKey, CardConfig>>;
        const merged: Record<CardKey, CardConfig> = {
          wedding: { ...cardMeta("wedding").default, ...saved.wedding },
          reception: { ...cardMeta("reception").default, ...saved.reception },
        };
        setLocked(merged);
        setDraft(merged);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Persist the locked placement whenever it changes.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(locked));
    } catch {
      /* ignore */
    }
  }, [locked]);

  // Live preview follows the draft (what you're editing).
  useEffect(() => {
    const canvas = previewRef.current;
    if (canvas) {
      void renderCard(canvas, active, sample || "Guest Name", draft[active]);
    }
  }, [active, sample, draft]);

  const cfg = draft[active];
  const setCfg = (patch: Partial<CardConfig>) =>
    setDraft((prev) => ({ ...prev, [active]: { ...prev[active], ...patch } }));

  const dirty = !sameCfg(draft[active], locked[active]);
  const anyDirty = (["wedding", "reception"] as CardKey[]).some(
    (k) => !sameCfg(draft[k], locked[k])
  );

  const lockActive = () =>
    setLocked((prev) => ({ ...prev, [active]: draft[active] }));
  const revertActive = () =>
    setDraft((prev) => ({ ...prev, [active]: locked[active] }));

  const q = query.trim().toLowerCase();
  const filtered = q
    ? guests.filter((g) => g.name.toLowerCase().includes(q))
    : guests;

  function displayName(g: Guest): string {
    const t = (titles[g.id] ?? "").trim();
    return t ? `${t} ${g.name}` : g.name;
  }

  function setTitle(id: string, value: string) {
    setTitles((prev) => ({ ...prev, [id]: value }));
    startTransition(async () => {
      await updateGuestTitleAction(id, value);
    });
  }

  async function handleDownload(key: CardKey, g: Guest) {
    setBusy(`${g.id}:${key}`);
    try {
      await downloadCard(key, displayName(g), locked[key]);
    } finally {
      setBusy(null);
    }
  }

  async function handleBoth(g: Guest) {
    setBusy(`${g.id}:both`);
    try {
      await downloadCard("wedding", displayName(g), locked.wedding);
      await new Promise((r) => setTimeout(r, 400));
      await downloadCard("reception", displayName(g), locked.reception);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,380px)_1fr]">
      {/* Configurator */}
      <div className="space-y-4">
        <div className="flex gap-2">
          {CARDS.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setActive(c.key)}
              className={`flex-1 rounded-full px-4 py-2 font-sans text-xs font-semibold uppercase tracking-[0.14em] transition-colors ${
                active === c.key
                  ? "bg-navy text-ivory"
                  : "border border-line text-ink/60 hover:text-navy"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="card overflow-hidden rounded-2xl p-3">
          <canvas
            ref={previewRef}
            className="h-auto w-full rounded-lg"
            aria-label={`${active} card preview`}
          />
        </div>

        <div className="card space-y-4 rounded-2xl p-5">
          <label className="block">
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-navy-600">
              Preview name
            </span>
            <input
              type="text"
              value={sample}
              onChange={(e) => setSample(e.target.value)}
              className="mt-2 w-full rounded-lg border border-line bg-white px-3 py-2 font-sans text-sm text-ink outline-none focus:border-navy focus:ring-2 focus:ring-navy/12"
            />
          </label>

          <Slider
            label="Vertical"
            value={cfg.y}
            min={0.1}
            max={0.9}
            step={0.002}
            display={`${Math.round(cfg.y * 100)}%`}
            onChange={(v) => setCfg({ y: v })}
          />
          <Slider
            label="Horizontal"
            value={cfg.x}
            min={0.2}
            max={0.8}
            step={0.002}
            display={`${Math.round(cfg.x * 100)}%`}
            onChange={(v) => setCfg({ x: v })}
          />
          <Slider
            label="Size"
            value={cfg.size}
            min={0.025}
            max={0.09}
            step={0.001}
            display={`${(cfg.size * 100).toFixed(1)}`}
            onChange={(v) => setCfg({ size: v })}
          />

          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-2">
              {(["serif", "script"] as CardFont[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setCfg({ font: f })}
                  className={`rounded-full px-3 py-1.5 font-sans text-xs font-semibold capitalize tracking-wide transition-colors ${
                    cfg.font === f
                      ? "bg-navy text-ivory"
                      : "border border-line text-ink/60 hover:text-navy"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-navy-600">
              Colour
              <input
                type="color"
                value={cfg.color}
                onChange={(e) => setCfg({ color: e.target.value })}
                className="h-8 w-10 cursor-pointer rounded border border-line bg-white"
              />
            </label>
          </div>

          {/* Lock placement */}
          <div className="border-t border-line pt-4">
            <div className="flex items-center justify-between">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-sans text-xs font-semibold uppercase tracking-[0.1em] ${
                  dirty
                    ? "bg-amber-50 text-amber-700"
                    : "bg-green-50 text-green-700"
                }`}
              >
                {dirty ? "Unsaved changes" : "Placement locked ✓"}
              </span>
              {dirty && (
                <button
                  type="button"
                  onClick={revertActive}
                  className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-ink/50 underline underline-offset-4 hover:text-navy"
                >
                  Revert
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={lockActive}
              disabled={!dirty}
              className="mt-3 w-full rounded-full bg-navy px-6 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-ivory transition-colors hover:bg-navy-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Lock {active} placement
            </button>
            <button
              type="button"
              onClick={() =>
                setDraft((prev) => ({
                  ...prev,
                  [active]: { ...cardMeta(active).default },
                }))
              }
              className="mt-3 w-full font-sans text-xs font-semibold uppercase tracking-[0.14em] text-ink/50 underline underline-offset-4 hover:text-navy"
            >
              Reset {active} to default
            </button>
          </div>
        </div>
      </div>

      {/* Guest list */}
      <div>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-serif text-xl font-light text-navy">
            Download per guest
          </h2>
          <span className="font-sans text-sm text-ink/50">
            {guests.length} {guests.length === 1 ? "guest" : "guests"}
          </span>
        </div>

        {anyDirty && (
          <p className="mb-4 rounded-xl bg-amber-50 px-4 py-3 font-sans text-sm text-amber-800">
            Downloads use the <strong>locked</strong> placement. You have
            unsaved changes — lock them to include them.
          </p>
        )}

        {guests.length === 0 ? (
          <p className="card rounded-2xl p-8 text-center font-sans text-sm text-ink/55">
            No guests yet. Add guests in the{" "}
            <span className="font-semibold text-navy">Custom URL</span> tab
            first.
          </p>
        ) : (
          <>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search guests by name…"
              className="mb-4 w-full rounded-xl border border-line bg-white px-4 py-3 font-sans text-sm text-ink outline-none focus:border-navy focus:ring-2 focus:ring-navy/12"
            />
            <ul className="space-y-2.5">
              {filtered.map((g) => (
                <li
                  key={g.id}
                  className="card flex flex-col gap-3 rounded-2xl p-4"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <select
                      value={titles[g.id] ?? ""}
                      onChange={(e) => setTitle(g.id, e.target.value)}
                      aria-label={`Title for ${g.name}`}
                      className="shrink-0 rounded-lg border border-line bg-white px-2.5 py-1.5 font-sans text-sm text-ink outline-none focus:border-navy"
                    >
                      {TITLES.map((t) => (
                        <option key={t || "none"} value={t}>
                          {t || "— title —"}
                        </option>
                      ))}
                    </select>
                    <p className="min-w-0 flex-1 truncate font-serif text-lg text-navy">
                      {displayName(g)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleDownload("wedding", g)}
                      disabled={busy !== null}
                      className="rounded-full border border-navy px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-navy transition-colors hover:bg-navy hover:text-ivory disabled:opacity-50"
                    >
                      {busy === `${g.id}:wedding` ? "…" : "Wedding"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownload("reception", g)}
                      disabled={busy !== null}
                      className="rounded-full border border-navy px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-navy transition-colors hover:bg-navy hover:text-ivory disabled:opacity-50"
                    >
                      {busy === `${g.id}:reception` ? "…" : "Reception"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBoth(g)}
                      disabled={busy !== null}
                      className="rounded-full bg-navy px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-ivory transition-colors hover:bg-navy-600 disabled:opacity-50"
                    >
                      {busy === `${g.id}:both` ? "…" : "Both"}
                    </button>
                  </div>
                </li>
              ))}
              {filtered.length === 0 && (
                <li className="card rounded-2xl p-6 text-center font-sans text-sm text-ink/50">
                  No guests match “{query.trim()}”.
                </li>
              )}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

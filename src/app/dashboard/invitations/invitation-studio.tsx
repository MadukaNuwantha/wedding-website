"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import {
  CARDS,
  cardMeta,
  type CardConfig,
  type CardFont,
  type CardKey,
} from "@/lib/card-config";
import {
  saveTemplatesAction,
  saveCardConfigAction,
  type SaveTemplatesState,
} from "@/lib/settings-actions";
import type { CardConfigs, Templates } from "@/lib/settings";
import type { Guest } from "@/lib/guests";

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

function cloneConfigs(c: CardConfigs): Record<CardKey, CardConfig> {
  return { wedding: { ...c.wedding }, reception: { ...c.reception } };
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

const SEND_BTN =
  "rounded-full bg-[#128C7E] px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#0f7a6c] disabled:opacity-50";
const SEND_BTN_ALT =
  "rounded-full bg-amber-500 px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-amber-600 disabled:opacity-50";
const DL_BTN =
  "rounded-full border border-navy px-3.5 py-1.5 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-navy transition-colors hover:bg-navy hover:text-ivory disabled:opacity-50";

function WaIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.8c2.16 0 4.19.84 5.72 2.37a8.06 8.06 0 0 1 2.37 5.74c0 4.47-3.64 8.11-8.11 8.11a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.12.82.83-3.04-.19-.31a8.05 8.05 0 0 1-1.24-4.29c0-4.47 3.64-8.11 8.11-8.11Zm4.47 10.15c-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.52.06-.24-.12-1.03-.38-1.96-1.21-.72-.64-1.21-1.44-1.35-1.68-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.47-.4-.41-.55-.42h-.47c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.57.18 1.1.16 1.51.1.46-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  );
}

export default function InvitationStudio({
  guests,
  templates,
  cardConfigs,
}: {
  guests: Guest[];
  templates: Templates;
  cardConfigs: CardConfigs;
}) {
  // Placement comes from the database, so it's the same on every device.
  const [draft, setDraft] = useState(() => cloneConfigs(cardConfigs));
  const [locked, setLocked] = useState(() => cloneConfigs(cardConfigs));
  const [active, setActive] = useState<CardKey>("wedding");
  const [sample, setSample] = useState(guests[0]?.name ?? "Guest Name");
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [tpl, setTpl] = useState<Templates>(templates);
  const [saveState, saveAction, saving] = useActionState<
    SaveTemplatesState,
    FormData
  >(saveTemplatesAction, undefined);
  const [bothStep, setBothStep] = useState<Record<string, number>>({});
  const [savingPlacement, startPlacementSave] = useTransition();
  const previewRef = useRef<HTMLCanvasElement>(null);

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

  const lockActive = () => {
    const next = { ...locked, [active]: draft[active] };
    setLocked(next);
    startPlacementSave(async () => {
      await saveCardConfigAction(next);
    });
  };
  const revertActive = () =>
    setDraft((prev) => ({ ...prev, [active]: locked[active] }));

  const q = query.trim().toLowerCase();
  const filtered = q
    ? guests.filter((g) => g.name.toLowerCase().includes(q))
    : guests;

  function displayName(g: Guest): string {
    const t = (g.title ?? "").trim();
    return t ? `${t} ${g.name}` : g.name;
  }

  async function handleDownload(key: CardKey, g: Guest) {
    setBusy(`${g.id}:${key}`);
    try {
      await downloadCard(key, displayName(g), locked[key]);
    } finally {
      setBusy(null);
    }
  }

  function buildMessage(key: CardKey, g: Guest): string {
    return (tpl[key] ?? "").split("<name>").join(displayName(g));
  }

  async function renderBlob(key: CardKey, name: string): Promise<Blob | null> {
    const canvas = document.createElement("canvas");
    await renderCard(canvas, key, name, locked[key]);
    // JPEG so WhatsApp treats it as a photo (with caption), not a document.
    return await new Promise((res) => canvas.toBlob(res, "image/jpeg", 0.92));
  }

  // Share one card (image + text) to WhatsApp via the native share sheet.
  // Falls back to downloading the image + copying the text on unsupported
  // devices (e.g. desktop). Returns true if the share/fallback completed.
  async function shareOne(key: CardKey, g: Guest): Promise<boolean> {
    const name = displayName(g);
    const blob = await renderBlob(key, name);
    if (!blob) return false;

    const file = new File(
      [blob],
      `${slug(name)}-${cardMeta(key).fileSuffix}.jpg`,
      { type: "image/jpeg" }
    );
    const text = buildMessage(key, g);
    // Share the image + text together. The sender's own app may show them as
    // two rows, but the recipient receives it as one image with a caption.
    const data: ShareData = { files: [file], text };

    if (typeof navigator.canShare === "function" && navigator.canShare(data)) {
      try {
        await navigator.share(data);
        return true;
      } catch (err) {
        if ((err as Error).name === "AbortError") return false;
        // otherwise fall through to the fallback
      }
    }

    // Fallback: download the image and copy the text.
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* ignore */
    }
    alert(
      "Couldn't open the share sheet.\n\nThe card image was downloaded and the message copied — open WhatsApp, attach the image and paste the text."
    );
    return true;
  }

  async function handleSend(key: CardKey, g: Guest) {
    setBusy(`${g.id}:send-${key}`);
    try {
      await shareOne(key, g);
    } finally {
      setBusy(null);
    }
  }

  // "Both" sends two separate messages. WhatsApp/browsers require a fresh
  // user tap per share, so this is a two-step: tap once for the wedding,
  // then again for the reception.
  async function handleSendBoth(g: Guest) {
    const step = bothStep[g.id] ?? 0;
    setBusy(`${g.id}:send-both`);
    try {
      if (step === 0) {
        const ok = await shareOne("wedding", g);
        if (ok) setBothStep((p) => ({ ...p, [g.id]: 1 }));
      } else {
        const ok = await shareOne("reception", g);
        if (ok) setBothStep((p) => ({ ...p, [g.id]: 0 }));
      }
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-8">
      {/* Tooling: preview + controls side by side */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,400px)_1fr]">
        {/* Preview */}
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
        </div>

        {/* Controls */}
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
                {savingPlacement
                  ? "Saving…"
                  : dirty
                  ? "Unsaved changes"
                  : "Placement locked ✓"}
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
              disabled={!dirty || savingPlacement}
              className="mt-3 w-full rounded-full bg-navy px-6 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-ivory transition-colors hover:bg-navy-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Lock {active} placement (all devices)
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

      {/* Message templates */}
      <div className="card rounded-2xl p-5">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-serif text-xl font-light text-navy">
            Message templates
          </h2>
          <span className="font-sans text-xs text-ink/45">
            Use{" "}
            <code className="rounded bg-tint px-1 py-0.5 font-mono text-[0.72rem] text-navy">
              &lt;name&gt;
            </code>{" "}
            where the guest&apos;s name should appear
          </span>
        </div>
        <form action={saveAction} className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block font-sans text-xs font-semibold uppercase tracking-[0.12em] text-navy-600">
              Wedding
            </span>
            <textarea
              name="wedding"
              rows={8}
              value={tpl.wedding}
              onChange={(e) =>
                setTpl((p) => ({ ...p, wedding: e.target.value }))
              }
              className="w-full rounded-xl border border-line bg-white px-3 py-2 font-sans text-sm leading-relaxed text-ink outline-none focus:border-navy focus:ring-2 focus:ring-navy/12"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block font-sans text-xs font-semibold uppercase tracking-[0.12em] text-navy-600">
              Reception
            </span>
            <textarea
              name="reception"
              rows={8}
              value={tpl.reception}
              onChange={(e) =>
                setTpl((p) => ({ ...p, reception: e.target.value }))
              }
              className="w-full rounded-xl border border-line bg-white px-3 py-2 font-sans text-sm leading-relaxed text-ink outline-none focus:border-navy focus:ring-2 focus:ring-navy/12"
            />
          </label>
          <div className="flex items-center gap-3 md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-navy px-7 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-ivory transition-colors hover:bg-navy-600 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save templates"}
            </button>
            {saveState?.ok && (
              <span className="font-sans text-sm text-green-700">Saved ✓</span>
            )}
            {saveState?.error && (
              <span className="font-sans text-sm text-red-700">
                {saveState.error}
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Guest list */}
      <div>
        <div className="mb-1 flex items-baseline justify-between">
          <h2 className="font-serif text-xl font-light text-navy">
            Send &amp; download
          </h2>
          <span className="font-sans text-sm text-ink/50">
            {guests.length} {guests.length === 1 ? "guest" : "guests"}
          </span>
        </div>
        <p className="mb-3 font-sans text-xs text-ink/45">
          Sending opens WhatsApp with the card + message; pick the contact and
          send. It may look like two rows in your own app, but the recipient
          gets one image with a caption.
        </p>

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
                  <p className="truncate font-serif text-lg text-navy">
                    {displayName(g)}
                  </p>
                  <div className="flex flex-col gap-2.5 border-t border-line pt-3">
                    {/* Send via WhatsApp */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="mr-0.5 inline-flex items-center gap-1 font-sans text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-green-700">
                        <WaIcon /> Send
                      </span>
                      <button
                        type="button"
                        onClick={() => handleSend("wedding", g)}
                        disabled={busy !== null}
                        className={SEND_BTN}
                      >
                        {busy === `${g.id}:send-wedding` ? "…" : "Wedding"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSend("reception", g)}
                        disabled={busy !== null}
                        className={SEND_BTN}
                      >
                        {busy === `${g.id}:send-reception` ? "…" : "Reception"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSendBoth(g)}
                        disabled={busy !== null}
                        className={
                          (bothStep[g.id] ?? 0) === 1 ? SEND_BTN_ALT : SEND_BTN
                        }
                      >
                        {busy === `${g.id}:send-both`
                          ? "…"
                          : (bothStep[g.id] ?? 0) === 1
                          ? "Now: Reception (2/2)"
                          : "Both"}
                      </button>
                    </div>
                    {/* Download */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="mr-0.5 font-sans text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-ink/40">
                        Download
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDownload("wedding", g)}
                        disabled={busy !== null}
                        className={DL_BTN}
                      >
                        {busy === `${g.id}:wedding` ? "…" : "Wedding"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownload("reception", g)}
                        disabled={busy !== null}
                        className={DL_BTN}
                      >
                        {busy === `${g.id}:reception` ? "…" : "Reception"}
                      </button>
                    </div>
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

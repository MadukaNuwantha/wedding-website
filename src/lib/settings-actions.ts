"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { setSetting } from "@/lib/settings";
import { CARDS, type CardConfig, type CardKey } from "@/lib/card-config";

export type SaveTemplatesState = { ok?: boolean; error?: string } | undefined;

export async function saveTemplatesAction(
  _prev: SaveTemplatesState,
  formData: FormData
): Promise<SaveTemplatesState> {
  if (!(await getSession())) return { error: "Not authorized." };

  for (const key of ["wedding", "reception", "homecoming", "rsvp"] as const) {
    const value = String(formData.get(key) ?? "").slice(0, 5000);
    await setSetting(`template_${key}`, value);
  }

  revalidatePath("/dashboard/invitations");
  return { ok: true };
}

function sanitizeCfg(c: unknown): CardConfig {
  const o = (c ?? {}) as Record<string, unknown>;
  const num = (v: unknown, d: number) =>
    typeof v === "number" && Number.isFinite(v) ? v : d;
  const clamp = (v: number, lo: number, hi: number) =>
    Math.min(hi, Math.max(lo, v));
  return {
    x: clamp(num(o.x, 0.5), 0, 1),
    y: clamp(num(o.y, 0.3), 0, 1),
    size: clamp(num(o.size, 0.05), 0.01, 0.2),
    color: typeof o.color === "string" ? o.color.slice(0, 20) : "#22365d",
    font: o.font === "script" ? "script" : "serif",
  };
}

export async function saveCardConfigAction(
  config: Record<string, unknown>
): Promise<void> {
  if (!(await getSession())) return;

  const clean = {} as Record<CardKey, CardConfig>;
  for (const c of CARDS) {
    clean[c.key] = sanitizeCfg(config?.[c.key]);
  }
  await setSetting("card_config", JSON.stringify(clean));
  revalidatePath("/dashboard/invitations");
}

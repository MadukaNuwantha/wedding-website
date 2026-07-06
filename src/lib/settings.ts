import { db } from "./db";
import { cardMeta, type CardConfig, type CardKey } from "./card-config";

export type Templates = { wedding: string; reception: string };
export type CardConfigs = Record<CardKey, CardConfig>;

export const DEFAULT_TEMPLATES: Templates = {
  wedding: `Dear <name>,

With hearts full of joy, Maduka & Marine warmly invite you to witness their wedding.

📅 Saturday, 1st August 2026 — 9:00 AM
⛪ Church of the Immaculate Heart of Mary, Haldanduwana

Your presence would mean the world to us. 💙`,
  reception: `Dear <name>,

We would be honoured to have you join us for our wedding Reception.

📅 Saturday, 1st August 2026 — from 11:00 AM onwards
📍 Moon Light Hotel, Marawila

We can't wait to celebrate with you! 💙`,
};

export async function getSetting(key: string): Promise<string | null> {
  const client = await db();
  const rs = await client.execute({
    sql: "SELECT value FROM settings WHERE key = ? LIMIT 1",
    args: [key],
  });
  return rs.rows[0] ? String(rs.rows[0].value) : null;
}

export async function setSetting(key: string, value: string): Promise<void> {
  const client = await db();
  await client.execute({
    sql: "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
    args: [key, value],
  });
}

export async function getTemplates(): Promise<Templates> {
  const [wedding, reception] = await Promise.all([
    getSetting("template_wedding"),
    getSetting("template_reception"),
  ]);
  return {
    wedding: wedding ?? DEFAULT_TEMPLATES.wedding,
    reception: reception ?? DEFAULT_TEMPLATES.reception,
  };
}

export function defaultCardConfigs(): CardConfigs {
  return {
    wedding: { ...cardMeta("wedding").default },
    reception: { ...cardMeta("reception").default },
  };
}

/** Card name placement, shared across devices (unlike the old localStorage). */
export async function getCardConfigs(): Promise<CardConfigs> {
  const raw = await getSetting("card_config");
  const def = defaultCardConfigs();
  if (!raw) return def;
  try {
    const saved = JSON.parse(raw) as Partial<CardConfigs>;
    return {
      wedding: { ...def.wedding, ...saved.wedding },
      reception: { ...def.reception, ...saved.reception },
    };
  } catch {
    return def;
  }
}

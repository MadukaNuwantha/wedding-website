import crypto from "node:crypto";
import type { Row } from "@libsql/client";
import { db } from "./db";

export type Guest = {
  id: string;
  name: string;
  title: string | null;
  token: string;
  createdAt: number;
  categoryId: string | null;
  categoryName: string | null;
};

function rowToGuest(r: Row): Guest {
  return {
    id: String(r.id),
    name: String(r.name),
    title: r.title == null ? null : String(r.title),
    token: String(r.token),
    createdAt: Number(r.created_at),
    categoryId: r.category_id == null ? null : String(r.category_id),
    categoryName: r.category_name == null ? null : String(r.category_name),
  };
}

// Lowercase, unambiguous alphabet (no 0/o/1/l/i) for clean, readable codes.
const CODE_ALPHABET = "23456789abcdefghjkmnpqrstuvwxyz";
const CODE_LENGTH = 7;

/** Short, URL-safe, hard-to-guess code for a guest's personal link. */
function makeToken(): string {
  const bytes = crypto.randomBytes(CODE_LENGTH);
  let out = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    out += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  }
  return out;
}

export async function countGuests(): Promise<number> {
  const client = await db();
  const rs = await client.execute("SELECT COUNT(*) AS n FROM guests");
  return Number(rs.rows[0]?.n ?? 0);
}

export async function listGuests(): Promise<Guest[]> {
  const client = await db();
  const rs = await client.execute(`
    SELECT g.id, g.name, g.title, g.token, g.created_at, g.category_id,
      c.name AS category_name
    FROM guests g
    LEFT JOIN categories c ON c.id = g.category_id
    ORDER BY g.created_at DESC
  `);
  return rs.rows.map(rowToGuest);
}

export async function addGuest(
  name: string,
  categoryId: string | null = null
): Promise<Guest> {
  const client = await db();
  const clean = name.trim();

  // Retry on the (extremely unlikely) token collision.
  for (let attempt = 0; attempt < 5; attempt++) {
    const guest: Guest = {
      id: crypto.randomUUID(),
      name: clean,
      title: null,
      token: makeToken(),
      createdAt: Date.now(),
      categoryId,
      categoryName: null,
    };
    try {
      await client.execute({
        sql: "INSERT INTO guests (id, name, token, created_at, category_id) VALUES (?, ?, ?, ?, ?)",
        args: [guest.id, guest.name, guest.token, guest.createdAt, categoryId],
      });
      return guest;
    } catch (err) {
      const msg = String(err);
      if (attempt < 4 && msg.includes("UNIQUE")) continue;
      throw err;
    }
  }
  throw new Error("Could not generate a unique token");
}

/** Insert many guests at once (used by CSV import). Returns the count added. */
export async function addGuests(
  names: string[],
  categoryId: string | null = null
): Promise<number> {
  const client = await db();
  const clean = names.map((n) => n.trim()).filter(Boolean);
  if (clean.length === 0) return 0;

  const used = new Set<string>();
  const now = Date.now();
  const stmts = clean.map((name, i) => {
    let token = makeToken();
    while (used.has(token)) token = makeToken();
    used.add(token);
    return {
      sql: "INSERT INTO guests (id, name, token, created_at, category_id) VALUES (?, ?, ?, ?, ?)",
      // +i keeps the import order stable when sorting by created_at.
      args: [crypto.randomUUID(), name, token, now + i, categoryId],
    };
  });

  await client.batch(stmts, "write");
  return stmts.length;
}

export async function deleteGuest(id: string): Promise<void> {
  const client = await db();
  await client.execute({ sql: "DELETE FROM guests WHERE id = ?", args: [id] });
}

/** Public lookup used by the RSVP page to resolve a token to a guest name. */
export async function getGuestByToken(token: string): Promise<Guest | null> {
  if (!token) return null;
  const client = await db();
  const rs = await client.execute({
    sql: `SELECT g.id, g.name, g.title, g.token, g.created_at, g.category_id,
            c.name AS category_name
          FROM guests g
          LEFT JOIN categories c ON c.id = g.category_id
          WHERE g.token = ? LIMIT 1`,
    args: [token],
  });
  return rs.rows[0] ? rowToGuest(rs.rows[0]) : null;
}

export async function updateGuestCategory(
  id: string,
  categoryId: string | null
): Promise<void> {
  const client = await db();
  await client.execute({
    sql: "UPDATE guests SET category_id = ? WHERE id = ?",
    args: [categoryId, id],
  });
}

export async function setGuestsCategory(
  ids: string[],
  categoryId: string | null
): Promise<void> {
  if (ids.length === 0) return;
  const client = await db();
  const placeholders = ids.map(() => "?").join(",");
  await client.execute({
    sql: `UPDATE guests SET category_id = ? WHERE id IN (${placeholders})`,
    args: [categoryId, ...ids],
  });
}

export async function updateGuestTitle(
  id: string,
  title: string | null
): Promise<void> {
  const client = await db();
  await client.execute({
    sql: "UPDATE guests SET title = ? WHERE id = ?",
    args: [title, id],
  });
}

export async function deleteGuests(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  const client = await db();
  const placeholders = ids.map(() => "?").join(",");
  await client.execute({
    sql: `DELETE FROM guests WHERE id IN (${placeholders})`,
    args: ids,
  });
}

export async function setGuestsTitle(
  ids: string[],
  title: string | null
): Promise<void> {
  if (ids.length === 0) return;
  const client = await db();
  const placeholders = ids.map(() => "?").join(",");
  await client.execute({
    sql: `UPDATE guests SET title = ? WHERE id IN (${placeholders})`,
    args: [title, ...ids],
  });
}

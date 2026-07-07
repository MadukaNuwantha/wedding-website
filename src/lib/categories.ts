import crypto from "node:crypto";
import type { Row } from "@libsql/client";
import { db } from "./db";

export type Category = {
  id: string;
  name: string;
  createdAt: number;
  guestCount: number;
};

function rowToCategory(r: Row): Category {
  return {
    id: String(r.id),
    name: String(r.name),
    createdAt: Number(r.created_at),
    guestCount: Number(r.guest_count),
  };
}

export async function listCategories(): Promise<Category[]> {
  const client = await db();
  const rs = await client.execute(`
    SELECT c.id, c.name, c.created_at,
      (SELECT COUNT(*) FROM guests g WHERE g.category_id = c.id) AS guest_count
    FROM categories c
    ORDER BY c.name COLLATE NOCASE ASC
  `);
  return rs.rows.map(rowToCategory);
}

export async function createCategory(name: string): Promise<void> {
  const client = await db();
  await client.execute({
    sql: "INSERT INTO categories (id, name, created_at) VALUES (?, ?, ?)",
    args: [crypto.randomUUID(), name.trim(), Date.now()],
  });
}

export async function renameCategory(id: string, name: string): Promise<void> {
  const client = await db();
  await client.execute({
    sql: "UPDATE categories SET name = ? WHERE id = ?",
    args: [name.trim(), id],
  });
}

/** Delete a category and unassign its guests (guests are kept). */
export async function deleteCategory(id: string): Promise<void> {
  const client = await db();
  await client.batch(
    [
      { sql: "UPDATE guests SET category_id = NULL WHERE category_id = ?", args: [id] },
      { sql: "DELETE FROM categories WHERE id = ?", args: [id] },
    ],
    "write"
  );
}

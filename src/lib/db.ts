import { createClient, type Client } from "@libsql/client";

/**
 * libSQL client. In development it uses a local SQLite file; in production
 * it connects to Turso when TURSO_DATABASE_URL / TURSO_AUTH_TOKEN are set.
 * The same code path works for both.
 */

let _client: Client | null = null;
let _ready: Promise<void> | null = null;

function makeClient(): Client {
  const url = process.env.TURSO_DATABASE_URL ?? "file:local.db";
  const authToken = process.env.TURSO_AUTH_TOKEN;
  return createClient(authToken ? { url, authToken } : { url });
}

async function ensureSchema(client: Client): Promise<void> {
  await client.batch(
    [
      `CREATE TABLE IF NOT EXISTS guests (
        id         TEXT PRIMARY KEY,
        name       TEXT NOT NULL,
        title      TEXT,
        token      TEXT NOT NULL UNIQUE,
        created_at INTEGER NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS rsvps (
        id         TEXT PRIMARY KEY,
        token      TEXT,
        name       TEXT,
        attending  TEXT NOT NULL,
        party      INTEGER NOT NULL DEFAULT 0,
        message    TEXT,
        created_at INTEGER NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS settings (
        key   TEXT PRIMARY KEY,
        value TEXT NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS categories (
        id         TEXT PRIMARY KEY,
        name       TEXT NOT NULL,
        created_at INTEGER NOT NULL
      )`,
    ],
    "write"
  );

  // Migrations for columns added after the tables first shipped.
  for (const sql of [
    "ALTER TABLE guests ADD COLUMN title TEXT",
    "ALTER TABLE guests ADD COLUMN category_id TEXT",
    "ALTER TABLE guests ADD COLUMN sent_wedding INTEGER",
    "ALTER TABLE guests ADD COLUMN sent_reception INTEGER",
    "ALTER TABLE guests ADD COLUMN sent_rsvp INTEGER",
  ]) {
    try {
      await client.execute(sql);
    } catch {
      /* column already exists */
    }
  }
}

/** Get the shared client, ensuring the schema exists once per process. */
export async function db(): Promise<Client> {
  if (!_client) _client = makeClient();
  if (!_ready) _ready = ensureSchema(_client);
  await _ready;
  return _client;
}

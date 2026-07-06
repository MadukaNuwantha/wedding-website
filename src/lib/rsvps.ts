import crypto from "node:crypto";
import type { Row } from "@libsql/client";
import { db } from "./db";

export type Attendance = "yes" | "no";

export type Rsvp = {
  id: string;
  token: string | null;
  name: string | null;
  attending: Attendance;
  party: number;
  message: string | null;
  createdAt: number;
};

export type RsvpStats = {
  total: number;
  attending: number;
  declined: number;
  headcount: number; // total people coming (sum of party for attendees)
};

function rowToRsvp(r: Row): Rsvp {
  return {
    id: String(r.id),
    token: r.token === null ? null : String(r.token),
    name: r.name === null ? null : String(r.name),
    attending: String(r.attending) === "yes" ? "yes" : "no",
    party: Number(r.party),
    message: r.message === null ? null : String(r.message),
    createdAt: Number(r.created_at),
  };
}

export async function addRsvp(input: {
  token: string | null;
  name: string | null;
  attending: Attendance;
  party: number;
  message: string | null;
}): Promise<void> {
  const client = await db();
  await client.execute({
    sql: "INSERT INTO rsvps (id, token, name, attending, party, message, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    args: [
      crypto.randomUUID(),
      input.token,
      input.name,
      input.attending,
      input.party,
      input.message,
      Date.now(),
    ],
  });
}

export async function listRsvps(): Promise<Rsvp[]> {
  const client = await db();
  const rs = await client.execute(
    "SELECT id, token, name, attending, party, message, created_at FROM rsvps ORDER BY created_at DESC"
  );
  return rs.rows.map(rowToRsvp);
}

/** Distinct current guests who have at least one RSVP (for response rate). */
export async function respondedGuestCount(): Promise<number> {
  const client = await db();
  const rs = await client.execute(
    "SELECT COUNT(DISTINCT r.token) AS n FROM rsvps r JOIN guests g ON g.token = r.token"
  );
  return Number(rs.rows[0]?.n ?? 0);
}

export async function rsvpStats(): Promise<RsvpStats> {
  const client = await db();
  const rs = await client.execute(`
    SELECT
      COUNT(*) AS total,
      SUM(CASE WHEN attending = 'yes' THEN 1 ELSE 0 END) AS attending,
      SUM(CASE WHEN attending = 'no'  THEN 1 ELSE 0 END) AS declined,
      SUM(CASE WHEN attending = 'yes' THEN party ELSE 0 END) AS headcount
    FROM rsvps
  `);
  const r = rs.rows[0];
  return {
    total: Number(r?.total ?? 0),
    attending: Number(r?.attending ?? 0),
    declined: Number(r?.declined ?? 0),
    headcount: Number(r?.headcount ?? 0),
  };
}

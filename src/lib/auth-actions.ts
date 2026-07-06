"use server";

import crypto from "node:crypto";
import { redirect } from "next/navigation";
import { createSession, destroySession } from "@/lib/session";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "maduka";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "secret";

/** Constant-time string comparison to avoid leaking length/timing. */
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

export type LoginState = { error: string } | undefined;

export async function login(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const ok =
    safeEqual(username, ADMIN_USERNAME) && safeEqual(password, ADMIN_PASSWORD);

  if (!ok) {
    return { error: "Incorrect username or password." };
  }

  await createSession(username);
  redirect("/dashboard");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/dashboard");
}

"use server";

import { revalidatePath } from "next/cache";
import { addRsvp } from "@/lib/rsvps";
import { getGuestByToken } from "@/lib/guests";

export type RsvpState =
  | { ok?: boolean; error?: string; attending?: "yes" | "no" }
  | undefined;

export async function submitRsvp(
  _prev: RsvpState,
  formData: FormData
): Promise<RsvpState> {
  const attending = String(formData.get("attending") ?? "");
  if (attending !== "yes" && attending !== "no") {
    return { error: "Please let us know if you can attend." };
  }

  const token = String(formData.get("token") ?? "").trim() || null;
  const message =
    String(formData.get("message") ?? "")
      .trim()
      .slice(0, 1000) || null;

  let party = 0;
  if (attending === "yes") {
    const n = parseInt(String(formData.get("guests") ?? "1"), 10);
    party = Number.isFinite(n) && n >= 1 && n <= 20 ? n : 1;
  }

  // If the RSVP came from a personal invite link, resolve the guest name
  // authoritatively from the token.
  let name: string | null = null;
  if (token) {
    const guest = await getGuestByToken(token);
    name = guest?.name ?? null;
  }

  try {
    await addRsvp({ token, name, attending, party, message });
  } catch {
    return { error: "Something went wrong. Please try again." };
  }

  revalidatePath("/dashboard/rsvps");
  revalidatePath("/dashboard");
  return { ok: true, attending };
}

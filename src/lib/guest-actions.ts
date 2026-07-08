"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import {
  addGuest,
  addGuests,
  deleteGuest,
  deleteGuests,
  setGuestsTitle,
  setGuestsCategory,
  updateGuestTitle,
  updateGuestCategory,
  markSend,
  type SendKey,
} from "@/lib/guests";

export type AddGuestState = { error?: string; ok?: boolean } | undefined;

export async function addGuestAction(
  _prev: AddGuestState,
  formData: FormData
): Promise<AddGuestState> {
  if (!(await getSession())) return { error: "Not authorized." };

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Please enter a name." };
  if (name.length > 120) return { error: "That name is too long." };

  const category = String(formData.get("category") ?? "") || null;
  const title = String(formData.get("title") ?? "").trim().slice(0, 40) || null;
  await addGuest(name, category, title);
  revalidatePath("/dashboard/custom-url");
  return { ok: true };
}

/**
 * Parse guest names from CSV/plain text. Takes the first column of each line,
 * strips quotes, skips blanks and a leading header row like "Name".
 */
function parseNames(text: string): string[] {
  const names: string[] = [];
  text.split(/\r?\n/).forEach((line, i) => {
    if (!line.trim()) return;
    let field = line.split(",")[0].trim();
    field = field.replace(/^"(.*)"$/, "$1").trim();
    if (!field) return;
    if (i === 0 && /^(name|full name|guest|guest name)$/i.test(field)) return;
    if (field.length <= 120) names.push(field);
  });
  return names;
}

export type ImportGuestsState =
  | { error?: string; added?: number }
  | undefined;

export async function importGuestsAction(
  _prev: ImportGuestsState,
  formData: FormData
): Promise<ImportGuestsState> {
  if (!(await getSession())) return { error: "Not authorized." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Please choose a CSV file." };
  }

  const names = parseNames(await file.text()).slice(0, 1000);
  if (names.length === 0) return { error: "No names found in that file." };

  const category = String(formData.get("category") ?? "") || null;
  const added = await addGuests(names, category);
  revalidatePath("/dashboard/custom-url");
  return { added };
}

export async function deleteGuestAction(formData: FormData): Promise<void> {
  if (!(await getSession())) return;

  const id = String(formData.get("id") ?? "");
  if (id) {
    await deleteGuest(id);
    revalidatePath("/dashboard");
  }
}

export async function updateGuestTitleAction(
  id: string,
  title: string
): Promise<void> {
  if (!(await getSession())) return;
  if (!id) return;

  const clean = title.trim().slice(0, 40);
  await updateGuestTitle(id, clean || null);
  revalidatePath("/dashboard/invitations");
  revalidatePath("/dashboard/custom-url");
}

export async function bulkDeleteGuestsAction(ids: string[]): Promise<void> {
  if (!(await getSession())) return;

  const clean = (ids ?? []).filter(Boolean).slice(0, 2000);
  if (clean.length === 0) return;

  await deleteGuests(clean);
  revalidatePath("/dashboard/custom-url");
  revalidatePath("/dashboard");
}

export async function bulkSetTitleAction(
  ids: string[],
  title: string
): Promise<void> {
  if (!(await getSession())) return;

  const clean = (ids ?? []).filter(Boolean).slice(0, 2000);
  if (clean.length === 0) return;

  const t = title.trim().slice(0, 40);
  await setGuestsTitle(clean, t || null);
  revalidatePath("/dashboard/custom-url");
  revalidatePath("/dashboard/invitations");
}

export async function updateGuestCategoryAction(
  id: string,
  categoryId: string
): Promise<void> {
  if (!(await getSession())) return;
  if (!id) return;
  await updateGuestCategory(id, categoryId || null);
  revalidatePath("/dashboard/custom-url");
}

export async function bulkSetCategoryAction(
  ids: string[],
  categoryId: string
): Promise<void> {
  if (!(await getSession())) return;

  const clean = (ids ?? []).filter(Boolean).slice(0, 2000);
  if (clean.length === 0) return;

  await setGuestsCategory(clean, categoryId || null);
  revalidatePath("/dashboard/custom-url");
}

export async function markSendAction(
  guestId: string,
  type: SendKey,
  sent: boolean
): Promise<void> {
  if (!(await getSession())) return;
  if (!guestId) return;
  if (type !== "wedding" && type !== "reception" && type !== "rsvp") return;
  await markSend(guestId, type, sent);
  revalidatePath("/dashboard/invitations");
}

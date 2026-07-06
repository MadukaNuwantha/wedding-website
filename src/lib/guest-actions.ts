"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { addGuest, addGuests, deleteGuest } from "@/lib/guests";

export type AddGuestState = { error?: string; ok?: boolean } | undefined;

export async function addGuestAction(
  _prev: AddGuestState,
  formData: FormData
): Promise<AddGuestState> {
  if (!(await getSession())) return { error: "Not authorized." };

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Please enter a name." };
  if (name.length > 120) return { error: "That name is too long." };

  await addGuest(name);
  revalidatePath("/dashboard");
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

  const added = await addGuests(names);
  revalidatePath("/dashboard");
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

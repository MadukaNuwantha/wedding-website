"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { setSetting } from "@/lib/settings";

export type SaveTemplatesState = { ok?: boolean; error?: string } | undefined;

export async function saveTemplatesAction(
  _prev: SaveTemplatesState,
  formData: FormData
): Promise<SaveTemplatesState> {
  if (!(await getSession())) return { error: "Not authorized." };

  const wedding = String(formData.get("wedding") ?? "").slice(0, 5000);
  const reception = String(formData.get("reception") ?? "").slice(0, 5000);

  await setSetting("template_wedding", wedding);
  await setSetting("template_reception", reception);

  revalidatePath("/dashboard/invitations");
  return { ok: true };
}

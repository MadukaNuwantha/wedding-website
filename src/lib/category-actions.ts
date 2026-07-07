"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import {
  createCategory,
  renameCategory,
  deleteCategory,
} from "@/lib/categories";

export type CategoryState = { error?: string; ok?: boolean } | undefined;

function revalidate() {
  revalidatePath("/dashboard/categories");
  revalidatePath("/dashboard/custom-url");
}

export async function createCategoryAction(
  _prev: CategoryState,
  formData: FormData
): Promise<CategoryState> {
  if (!(await getSession())) return { error: "Not authorized." };

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Please enter a category name." };
  if (name.length > 80) return { error: "That name is too long." };

  await createCategory(name);
  revalidate();
  return { ok: true };
}

export async function renameCategoryAction(
  id: string,
  name: string
): Promise<void> {
  if (!(await getSession())) return;
  const clean = name.trim().slice(0, 80);
  if (!id || !clean) return;
  await renameCategory(id, clean);
  revalidate();
}

export async function deleteCategoryAction(id: string): Promise<void> {
  if (!(await getSession())) return;
  if (!id) return;
  await deleteCategory(id);
  revalidate();
}

import { listCategories } from "@/lib/categories";
import CategoryManager from "./category-manager";

export default async function CategoriesPage() {
  const categories = await listCategories();

  return (
    <div>
      <header className="mb-8 border-b border-line pb-6">
        <p className="eyebrow">Organise Guests</p>
        <h1 className="mt-1 font-serif text-3xl font-light text-navy">
          Categories
        </h1>
        <p className="mt-2 font-sans text-sm text-ink/60">
          Group guests (e.g. “Maduka – School”, “Marine – Office”). Assign a
          category when adding or importing guests in the Custom URL tab.
        </p>
      </header>

      <CategoryManager categories={categories} />
    </div>
  );
}

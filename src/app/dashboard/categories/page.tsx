import { getCategories } from "@/lib/actions/categories";
import CategoriesClient from "./CategoriesClient";

export default async function CategoriesPage() {
  const cats = await getCategories().catch(() => []);
  // Cast to avoid strict TS type mismatch between Firestore docs and app types
  const categories = (cats ?? []) as any[];
  return <CategoriesClient categories={categories} />;
}

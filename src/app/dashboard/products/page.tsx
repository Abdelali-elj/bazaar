import { getProducts } from "@/lib/actions/products";
import { getCategories } from "@/lib/actions/categories";
import ProductsClient from "./ProductsClient";

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts().catch(() => []),
    getCategories().catch(() => []),
  ]);

  return <ProductsClient products={(products ?? []) as any[]} categories={(categories ?? []) as any[]} />;
}

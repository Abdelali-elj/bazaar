import { getProducts } from "@/lib/actions/products";
import StockClient from "./StockClient";

export default async function StockPage() {
  const products = await getProducts().catch(() => []);

  return <StockClient products={products ?? []} />;
}

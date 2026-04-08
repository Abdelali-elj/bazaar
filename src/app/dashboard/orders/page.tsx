import { getOrders, updateOrderStatus } from "@/lib/actions/orders";
import OrdersClient from "./OrdersClient";

export default async function OrdersPage() {
  const orders = await getOrders().catch(() => []);
  return <OrdersClient orders={orders ?? []} />;
}

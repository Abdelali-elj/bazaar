import AnalyticsClient from "./AnalyticsClient";
import { getDashboardStats } from "@/lib/actions/orders";

export default async function AnalyticsPage() {
  const stats = await getDashboardStats().catch(() => ({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    recentOrders: [],
    salesData: [],
    categorySales: []
  }));

  return <AnalyticsClient stats={stats} />;
}

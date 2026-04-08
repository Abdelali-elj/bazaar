import { getUser } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import DashboardClientLayout from "@/app/dashboard/DashboardClientLayout";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  if (!user || !user.profile) {
    redirect("/auth/login");
  }

  const role = user.profile.role || 'customer';

  return (
    <DashboardClientLayout user={user} role={role}>
      {children}
    </DashboardClientLayout>
  );
}

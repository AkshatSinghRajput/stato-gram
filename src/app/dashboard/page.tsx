import Dashboard from "@/components/dashboard/Dashboard";
import { auth } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const user = await auth();
  if (!user?.getToken()) {
    return null;
  }
  return <Dashboard />;
}

import Dashboard from "@/components/dashboard/Dashboard";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await auth();
  if (!user) redirect("/sign-in");
  return <Dashboard />;
}

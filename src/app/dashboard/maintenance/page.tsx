import MaintenanceDashboard from "@/components/maintenance/MaintenanceDashboard";
import { getAllMaintenance } from "@/server/actions/maintenance/maintenance.actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function MaintenancePage() {
  const user = await auth();
  if (!user) {
    redirect("/sign-in");
  }
  if (!user?.orgId) {
    redirect("/dashboard");
  }

  const maintenances = await getAllMaintenance({ organization_id: user.orgId });

  if (!maintenances.success || !maintenances?.maintenance) {
    redirect("/dashboard");
  }

  return <MaintenanceDashboard maintenances={maintenances.maintenance} />;
}

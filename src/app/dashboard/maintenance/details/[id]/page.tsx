import MaintenanceDetails from "@/components/maintenance/MaintainanceDetails";
import { getActivityByActorID } from "@/server/actions/activity/activity.actions";
import { getMaintenanceById } from "@/server/actions/maintenance/maintenance.actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function MaintenanceDetailsPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { id } = params;
  const user = await auth();
  if (!user) {
    redirect("/sign-in");
  }
  if (!user?.orgId) {
    redirect("/dashboard");
  }

  const activityData = await getActivityByActorID({
    actor_id: id,
    organization_id: user.orgId,
  });

  if (!activityData.success || !activityData.data) {
    redirect("/dashboard/maintenance");
  }
  const maintenanceData = await getMaintenanceById({
    maintenance_id: id,
    organization_id: user.orgId,
  });

  if (!maintenanceData.success || !maintenanceData.maintenance) {
    redirect("/dashboard/maintenance");
  }

  return (
    <MaintenanceDetails
      activityData={activityData.data}
      maintenanceData={maintenanceData.maintenance}
    />
  );
}

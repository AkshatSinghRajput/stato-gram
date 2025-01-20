import CreateMaintenanceForm from "@/components/maintenance/CreateMaintenace";
import { getMaintenanceById } from "@/server/actions/maintenance/maintenance.actions";
import { getServicesForOrganization } from "@/server/actions/service/service.actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function UpdateMaintenancePage({
  params,
}: {
  params: { id: string };
}) {
  const user = await auth();
  const { id } = params;
  if (!user) {
    redirect("sign-in");
  }
  if (!user.orgId) {
    redirect("/dashboard");
  }
  const maintenance = await getMaintenanceById({
    maintenance_id: id,
    organization_id: user.orgId,
  });
  if (!maintenance.success || !maintenance.maintenance) {
    redirect("/dashboard/maintenance");
  }
  const services = await getServicesForOrganization(user.orgId);
  if (!services.success || !services.services) {
    redirect("/dashboard/maintenance");
  }
  return (
    <CreateMaintenanceForm
      services={services.services}
      maintenanceData={maintenance.maintenance}
    />
  );
}

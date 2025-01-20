import CreateIncidentForm from "@/components/incidents/CreateIncident";
import { getIncidentById } from "@/server/actions/incident/incident.actions";
import { getServicesForOrganization } from "@/server/actions/service/service.actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function EditIncidentPage({
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
  if (!user.orgId) {
    redirect("/dashboard");
  }

  const incidentData = await getIncidentById({
    incident_id: id,
    organization_id: user.orgId,
  });

  if (!incidentData.success || !incidentData.incident) {
    redirect("/dashboard/incidents");
  }

  const servicesData = await getServicesForOrganization(user.orgId);

  if (!servicesData.success || !servicesData.services) {
    redirect("/dashboard/incidents");
  }

  return (
    <CreateIncidentForm
      services={servicesData.services}
      incidentData={incidentData.incident}
    />
  );
}

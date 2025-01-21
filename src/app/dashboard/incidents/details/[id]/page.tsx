import IncidentDetails from "@/components/incidents/IncidentDetails";
import { getActivityByActorID } from "@/server/actions/activity/activity.actions";
import { getIncidentById } from "@/server/actions/incident/incident.actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function IncidentDetailsPage({
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
  const activity = await getActivityByActorID({
    actor_id: id,
    organization_id: user.orgId,
  });
  if (!activity.success || !activity.data) {
    redirect("/dashboard/incidents");
  }

  const incidentData = await getIncidentById({
    incident_id: id,
    organization_id: user.orgId,
  });
  if (!incidentData.success || !incidentData.incident) {
    redirect("/dashboard/incidents");
  }

  return (
    <IncidentDetails
      activityData={activity.data}
      incidentData={incidentData.incident}
    />
  );
}

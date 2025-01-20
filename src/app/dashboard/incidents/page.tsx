import IncidentDashboard from "@/components/incidents/IncidentDashboard";
import { getAllIncidents } from "@/server/actions/incident/incident.actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function IncidentPage() {
  const user = await auth();
  if (!user) {
    redirect("/sign-in");
  }
  if (!user.orgId) {
    redirect("/dashboard");
  }

  const incidents = await getAllIncidents({ organization_id: user.orgId });
  if (!incidents.success || !incidents?.incidents) {
    redirect("/dashboard");
  }
  return <IncidentDashboard incidents={incidents.incidents} />;
}

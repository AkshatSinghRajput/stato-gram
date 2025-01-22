import ServiceDetails from "@/components/service/ServiceDetails";
import { getActivityByActorID } from "@/server/actions/activity/activity.actions";
import { getServiceById } from "@/server/actions/service/service.actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ServiceDetailsPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const user = await auth();
  if (!user) {
    redirect("sign-in");
  }
  if (!user?.orgId) {
    redirect("/dashboard/services");
  }
  const serviceDetails = await getServiceById({
    service_id: params.id,
    organization_id: user.orgId,
  });
  if (!serviceDetails.success || !serviceDetails.service) {
    redirect("/dashboard/services");
  }
  const activities = await getActivityByActorID({
    actor_id: params.id,
    organization_id: user.orgId,
  });
  if (!activities.success || !activities.data) {
    redirect("/dashboard/services");
  }

  return (
    <ServiceDetails
      serviceData={serviceDetails.service}
      activityData={activities.data}
    />
  );
}
